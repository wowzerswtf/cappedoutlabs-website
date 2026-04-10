"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VSLEmbed } from "@/components/VSLEmbed";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function ThankYouContent() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-3xl px-6 lg:px-8 py-32 text-center"
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
          Application received.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
        >
          We review every application within 24 hours. If we think there&apos;s
          a fit, you&apos;ll hear from us to schedule your discovery call.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 max-w-2xl mx-auto">
          <p className="text-sm font-medium text-text-primary mb-4">
            While you wait — watch this:
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
