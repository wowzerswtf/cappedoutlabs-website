import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resourcePages, resourceSlugs } from "../data";
import { ResourceContent } from "./content";

export function generateStaticParams() {
  return resourceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = resourcePages.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    openGraph: {
      title: `${page.title} | Capped Out Labs`,
      description: page.metaDescription,
    },
  };
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = resourcePages.find((p) => p.slug === slug);
  if (!page) notFound();

  return <ResourceContent page={page} />;
}
