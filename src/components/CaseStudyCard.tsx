"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  title: string;
  result: string;
  tag: string;
  href: string;
  metric?: string;
  metricLabel?: string;
  beforeMetric?: string;
  afterMetric?: string;
  metricUnit?: string;
  variant?: "dark" | "light";
}

export function CaseStudyCard({
  title,
  result,
  tag,
  href,
  metric,
  metricLabel,
  beforeMetric,
  afterMetric,
  metricUnit,
  variant = "dark",
}: CaseStudyCardProps) {
  const isDark = variant === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link
        href={href}
        className={`block relative rounded-2xl overflow-hidden p-8 lg:p-10 transition-all group ${
          isDark
            ? "border border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
            : "border border-border bg-white hover:shadow-xl hover:shadow-electric/8"
        }`}
      >
        {/* Tag */}
        <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6 ${
          isDark
            ? "text-electric bg-electric/10 border border-electric/20"
            : "text-electric bg-electric/10"
        }`}>
          {tag}
        </span>

        {/* Before / After or Big Metric */}
        {beforeMetric && afterMetric ? (
          <div className="mb-6">
            <div className="flex items-end gap-3">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-white/40" : "text-text-secondary/60"}`}>Before</p>
                <p className={`text-2xl font-bold font-mono line-through decoration-2 ${isDark ? "text-white/30 decoration-white/20" : "text-text-secondary/40 decoration-text-secondary/30"}`}>
                  {beforeMetric}{metricUnit}
                </p>
              </div>
              <ArrowRight className={`h-5 w-5 mb-1.5 ${isDark ? "text-electric/60" : "text-electric/40"}`} />
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? "text-electric" : "text-electric"}`}>After</p>
                <p className={`text-4xl md:text-5xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-navy"}`}>
                  {afterMetric}<span className={`text-lg ${isDark ? "text-white/50" : "text-text-secondary"}`}>{metricUnit}</span>
                </p>
              </div>
            </div>
          </div>
        ) : metric ? (
          <div className="mb-6">
            <p className={`text-5xl md:text-6xl font-bold font-mono tracking-tight ${isDark ? "text-white" : "text-navy"}`}>
              {metric}
            </p>
            {metricLabel && (
              <p className={`mt-1 text-sm font-medium ${isDark ? "text-white/50" : "text-text-secondary"}`}>{metricLabel}</p>
            )}
          </div>
        ) : null}

        {/* Title */}
        <h3 className={`text-lg font-bold transition-colors ${
          isDark
            ? "text-white group-hover:text-electric"
            : "text-navy group-hover:text-electric"
        }`}>
          {title}
        </h3>

        {/* Result */}
        <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-white/50" : "text-text-secondary"}`}>
          {result}
        </p>

        {/* CTA */}
        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-electric">
          Read the full breakdown
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
        </div>

        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
          isDark
            ? "shadow-[inset_0_0_0_1px_rgba(37,99,235,0.3)]"
            : "shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]"
        }`} />
      </Link>
    </motion.div>
  );
}
