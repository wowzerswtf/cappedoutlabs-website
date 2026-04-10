"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { ResourcePage } from "../data";

function RichParagraph({ text }: { text: string }) {
  const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
  if (parts.length === 1) return <>{text}</>;
  const elements: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) elements.push(parts[i]);
    if (i + 1 < parts.length) {
      elements.push(
        <Link key={i} href={parts[i + 2]} className="text-electric hover:text-electric-dark font-medium underline underline-offset-2">
          {parts[i + 1]}
        </Link>
      );
    }
  }
  return <>{elements}</>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function ArticleSchema({ page }: { page: ResourcePage }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.title,
    author: {
      "@type": "Person",
      name: "Waynard",
      worksFor: { "@type": "Organization", name: "Capped Out Labs" },
    },
    publisher: {
      "@type": "Organization",
      name: "Capped Out Labs",
      url: "https://cappedoutlabs.com",
    },
    datePublished: page.datePublished,
    dateModified: "2026-04-07",
    description: page.metaDescription,
    url: `https://cappedoutlabs.com/resources/${page.slug}`,
    mainEntityOfPage: `https://cappedoutlabs.com/resources/${page.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ResourceContent({ page }: { page: ResourcePage }) {
  return (
    <>
      <ArticleSchema page={page} />
      <FAQSchema faqs={page.faqs} />

      {/* HERO — question + answer capsule */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-3xl px-6 lg:px-8 pt-36 pb-16 lg:pt-44 lg:pb-20"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <Link
              href="/resources"
              className="text-xs font-semibold uppercase tracking-widest text-electric hover:text-electric-dark transition-colors"
            >
              Resources
            </Link>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy leading-tight"
          >
            {page.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-sm text-text-secondary"
          >
            By Waynard · {formatDate(page.datePublished)}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-primary leading-relaxed"
          >
            {page.answerCapsule}
          </motion.p>
        </motion.div>
      </section>

      {/* BODY — deep explanation */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-10"
          >
            {page.practiceHeading}
          </motion.h2>

          <div className="space-y-6">
            {page.body.map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="text-text-secondary leading-relaxed text-lg"
              >
                <RichParagraph text={paragraph} />
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 py-16 lg:py-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-navy mb-10"
          >
            Frequently asked questions
          </motion.h2>
          <FAQAccordion items={page.faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern" />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto max-w-4xl px-6 lg:px-8 py-24 text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-bold text-navy"
          >
            Ready to build this in your business?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-text-secondary text-lg"
          >
            We take on a limited number of clients each quarter.
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
    </>
  );
}
