// GHL API client for the Telegram notifier. Poll state lives in the location
// custom value `tg_notify_state` so no external database is needed.

const GHL_BASE = "https://services.leadconnectorhq.com";
const STATE_CUSTOM_VALUE_NAME = "tg_notify_state";

// Calendar endpoints require the older API version; everything else uses the
// 2021-07-28 version (same split as the rest of the site + booking scripts).
const VERSION_DEFAULT = "2021-07-28";
const VERSION_CALENDAR = "2021-04-15";

export interface GhlContact {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  tags?: string[];
  dateAdded?: string;
  timezone?: string | null;
  customFields?: { id: string; value: unknown }[];
}

export interface GhlAppointment {
  id: string;
  calendarId?: string;
  contactId?: string;
  title?: string;
  appointmentStatus?: string;
  status?: string;
  startTime?: string | number;
  endTime?: string | number;
  assignedUserId?: string;
  dateAdded?: string;
}

export interface NotifyState {
  // ISO timestamp of the newest lead already notified.
  lastLeadTs?: string;
  // Recently notified contact ids (overlap guard around lastLeadTs).
  seenLeadIds?: string[];
  // Appointment id -> last known [status, startTimeMs].
  appts?: Record<string, [string, number]>;
}

function locationId(): string {
  const id = process.env.GHL_LOCATION_ID;
  if (!id) throw new Error("GHL_LOCATION_ID is required");
  return id;
}

async function ghlRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  version: string = VERSION_DEFAULT
): Promise<T> {
  const key = process.env.GHL_API_KEY;
  if (!key) throw new Error("GHL_API_KEY is required");

  const res = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Version: version,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL ${method} ${path} failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T;
}

// --- Poll state (stored as a GHL location custom value) ---

async function findStateCustomValue(): Promise<{ id: string; value: string } | null> {
  const data = await ghlRequest<{
    customValues: { id: string; name: string; value: string }[];
  }>("GET", `/locations/${locationId()}/customValues`);
  const cv = data.customValues.find((v) => v.name === STATE_CUSTOM_VALUE_NAME);
  return cv ? { id: cv.id, value: cv.value } : null;
}

export async function loadState(): Promise<{ state: NotifyState | null; stateId: string | null }> {
  const cv = await findStateCustomValue();
  if (!cv) return { state: null, stateId: null };
  try {
    const parsed = JSON.parse(cv.value) as NotifyState;
    // A freshly created custom value holds "{}" — treat as uninitialized.
    const initialized = typeof parsed.lastLeadTs === "string";
    return { state: initialized ? parsed : null, stateId: cv.id };
  } catch {
    return { state: null, stateId: cv.id };
  }
}

export async function saveState(state: NotifyState, stateId: string | null): Promise<void> {
  const value = JSON.stringify(state);
  if (stateId) {
    await ghlRequest("PUT", `/locations/${locationId()}/customValues/${stateId}`, {
      name: STATE_CUSTOM_VALUE_NAME,
      value,
    });
  } else {
    await ghlRequest("POST", `/locations/${locationId()}/customValues`, {
      name: STATE_CUSTOM_VALUE_NAME,
      value,
    });
  }
}

// --- Leads ---

export async function fetchNewestContacts(limit = 50): Promise<GhlContact[]> {
  const data = await ghlRequest<{ contacts: GhlContact[] }>("POST", "/contacts/search", {
    locationId: locationId(),
    pageLimit: limit,
    sort: [{ field: "dateAdded", direction: "desc" }],
  });
  return data.contacts ?? [];
}

export async function fetchContact(id: string): Promise<GhlContact | null> {
  try {
    const data = await ghlRequest<{ contact: GhlContact }>("GET", `/contacts/${id}`);
    return data.contact ?? null;
  } catch {
    return null;
  }
}

// --- Calendars & appointments ---

export async function fetchCalendars(): Promise<{ id: string; name: string }[]> {
  const data = await ghlRequest<{ calendars: { id: string; name: string }[] }>(
    "GET",
    `/calendars/?locationId=${locationId()}`,
    undefined,
    VERSION_CALENDAR
  );
  return (data.calendars ?? []).map((c) => ({ id: c.id, name: c.name }));
}

export async function fetchCalendarEvents(
  calendarId: string,
  startMs: number,
  endMs: number
): Promise<GhlAppointment[]> {
  const params = new URLSearchParams({
    locationId: locationId(),
    calendarId,
    startTime: String(startMs),
    endTime: String(endMs),
  });
  const data = await ghlRequest<{ events: GhlAppointment[] }>(
    "GET",
    `/calendars/events?${params}`,
    undefined,
    VERSION_CALENDAR
  );
  return data.events ?? [];
}

export async function fetchUserName(userId: string): Promise<string | null> {
  try {
    const data = await ghlRequest<{ name?: string; firstName?: string; lastName?: string }>(
      "GET",
      `/users/${userId}`
    );
    return data.name || [data.firstName, data.lastName].filter(Boolean).join(" ") || null;
  } catch {
    return null;
  }
}

// --- Custom field id -> human name map ---

export async function fetchCustomFieldMap(): Promise<Map<string, string>> {
  const data = await ghlRequest<{ customFields: { id: string; name: string }[] }>(
    "GET",
    `/locations/${locationId()}/customFields`
  );
  return new Map((data.customFields ?? []).map((f) => [f.id, f.name]));
}
