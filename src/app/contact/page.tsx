"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
    setSending(false);
  };

  const inputClass =
    "w-full px-4 py-3 bg-card-bg border border-border rounded-lg text-foreground focus:outline-none focus:border-foreground/50 transition-colors placeholder:text-[#444]";

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Contact</h1>
      <p className="text-muted text-lg mb-10">
        Feel free to reach out for project inquiries or collaboration.
        <br />
        <span className="text-base">프로젝트 문의나 협업 제안은 아래로 연락해 주세요.</span>
      </p>

      {/* Email Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        <Link
          href="mailto:aksoft1@naver.com"
          className="flex items-center gap-4 p-5 bg-card-bg rounded-xl border border-border hover:border-foreground/20 transition-colors"
        >
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <div>
            <p className="text-xs text-muted">Primary</p>
            <p className="text-sm font-medium">aksoft1@naver.com</p>
          </div>
        </Link>
        <Link
          href="mailto:aksoft13@gmail.com"
          className="flex items-center gap-4 p-5 bg-card-bg rounded-xl border border-border hover:border-foreground/20 transition-colors"
        >
          <svg className="w-5 h-5 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <div>
            <p className="text-xs text-muted">Secondary</p>
            <p className="text-sm font-medium">aksoft13@gmail.com</p>
          </div>
        </Link>
      </div>

      {/* Contact Form */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

        {sent ? (
          <div className="text-center py-12 bg-card-bg rounded-xl border border-border">
            <p className="text-lg font-medium mb-2">Message Sent!</p>
            <p className="text-muted text-sm mb-4">Thank you for reaching out. I&apos;ll get back to you soon.</p>
            <button
              onClick={() => setSent(false)}
              className="px-5 py-2 text-sm border border-border rounded-lg hover:bg-border transition-colors"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Project inquiry, collaboration, etc."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1.5">Message</label>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                placeholder="Tell me about your project or idea..."
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-accent transition-colors disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
