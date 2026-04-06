"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";

interface CTABannerProps {
  headline?: string;
  body?: string;
}

export function CTABanner({
  headline = "Ready to stop buying strategies and start running systems?",
  body = "We take on a limited number of clients each quarter.",
}: CTABannerProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 dot-pattern" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative mx-auto max-w-4xl px-6 lg:px-8 py-28 text-center"
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
        >
          {headline}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mt-4 text-text-secondary text-lg"
        >
          {body}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          <Button
            asChild
            className="bg-navy hover:bg-navy-light text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-navy/20"
          >
            <Link href="/apply">
              Apply for a Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
