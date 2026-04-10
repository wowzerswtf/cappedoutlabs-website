"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CTABanner } from "@/components/CTABanner";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { resourcePages } from "./data";

export function ResourcesIndexContent() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-4xl px-6 lg:px-8 pt-36 pb-20 lg:pt-44 lg:pb-28 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight"
          >
            Resources
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto"
          >
            Guides and breakdowns from production AI deployments. Real data, real
            systems, real results.
          </motion.p>
        </motion.div>
      </section>

      {/* ARTICLES */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-20">
          <div className="space-y-4">
            {resourcePages.map((page, i) => (
              <motion.div
                key={page.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/resources/${page.slug}`}
                  className="block rounded-2xl border border-border bg-white p-6 lg:p-8 hover:shadow-lg hover:shadow-electric/5 hover:border-electric/20 transition-all group glow-border"
                >
                  <h2 className="text-lg md:text-xl font-bold text-navy group-hover:text-electric transition-colors">
                    {page.title}
                  </h2>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    {page.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-electric">
                    Read more
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        headline="Ready to build this in your business?"
        body="We take on a limited number of clients each quarter."
      />
    </>
  );
}
