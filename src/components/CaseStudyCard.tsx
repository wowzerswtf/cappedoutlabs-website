"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CaseStudyCardProps {
  title: string;
  result: string;
  tag: string;
  href: string;
}

export function CaseStudyCard({ title, result, tag, href }: CaseStudyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link
        href={href}
        className="block rounded-xl border border-white/10 bg-white/5 p-6 lg:p-8 hover:bg-white/10 transition-all group"
      >
        <span className="inline-block text-xs font-semibold text-electric bg-electric/10 px-3 py-1 rounded-full mb-4">
          {tag}
        </span>
        <h3 className="text-lg font-bold text-white group-hover:text-electric transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{result}</p>
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-electric">
          View case study
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
