"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VSLEmbed } from "@/components/VSLEmbed";
import { CalendarEmbed } from "@/components/CalendarEmbed";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function ThankYouContent() {
  const [lead, setLead] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cappedout_booking");
      if (raw) setLead(JSON.parse(raw));
    } catch {
      // no stored lead — the calendar just won't prefill
    }
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-2xl px-6 lg:px-8 py-28 text-center"
      >
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-3xl md:text-4xl font-bold text-navy"
        >
          Application received. Book your call.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
        >
          Pick a time below for your discovery call. We&apos;ll map your biggest
          bottleneck to a 90-day build plan.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 text-left">
          <CalendarEmbed
            id="thankyou"
            firstName={lead.firstName}
            lastName={lead.lastName}
            email={lead.email}
            phone={lead.phone}
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12">
          <p className="text-sm font-medium text-text-primary mb-4">
            While you wait, watch this:
          </p>
          <VSLEmbed src="https://player.vimeo.com/video/1180565378?title=0&byline=0&portrait=0" />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10">
          <Button
            asChild
            variant="outline"
            className="border-border text-text-primary hover:bg-surface rounded-xl px-6 h-10 text-sm font-semibold"
          >
            <Link href="/">&larr; Back to home</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
