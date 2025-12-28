'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto container px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Contact</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Contact Information
              </h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</p>
                  <a href="mailto:defzone.net@gmail.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    defzone.net@gmail.com
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</p>
                  <a href="tel:+84762559696" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    +84 762 559 696
                  </a>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Address</p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Thien Huong<br />
                    Hai Phong<br />
                    Vietnam
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Follow Us</p>
                  <div className="flex gap-3">
                    <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70 dark:hover:text-blue-400">
                      f
                    </a>
                    <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70 dark:hover:text-blue-400">
                      𝕏
                    </a>
                    <a href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/70 dark:hover:text-blue-400">
                      in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-900/50">
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-900/50">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      ✗ Oops! Something went wrong. Please try again later.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
