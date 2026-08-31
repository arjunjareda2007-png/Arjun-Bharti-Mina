import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { slideInLeft, slideInRight, popIn, CINEMATIC_EASE } from '../../utils/motion';
import { hapticSuccess, hapticSelection, hapticError } from '../../utils/haptics';

export const ContactView: React.FC = () => {
  const { profile, submitContactMessage } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Clean phone / WhatsApp number dynamically from profile configuration
  const rawWhatsapp = profile.whatsappNumber || '';
  const digitsOnly = rawWhatsapp.replace(/[^0-9]/g, '');
  const formattedWhatsappNumber = digitsOnly.length === 10 ? `91${digitsOnly}` : digitsOnly;
  const whatsappUrl = formattedWhatsappNumber 
    ? `https://wa.me/${formattedWhatsappNumber}?text=${encodeURIComponent("Hi Arjun, I visited your website and wanted to connect!")}`
    : `https://wa.me/?text=${encodeURIComponent("Hi Arjun, I visited your website and wanted to connect!")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      hapticError();
      setError('Please fill in all required fields.');
      return;
    }

    await submitContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || 'General Inquiry',
      message: formData.message.trim()
    });

    hapticSuccess();
    setSubmitted(true);
    setError('');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div id="contact-view" className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={slideInLeft}
        className="space-y-2 text-center sm:text-left border-b border-neutral-200 dark:border-neutral-800 pb-6"
      >
        <span 
          className="text-xs font-mono uppercase tracking-wider font-semibold block"
          style={{ color: 'var(--color-accent-primary, #f59e0b)' }}
        >
          Get in Touch & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Let’s Connect
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl">
          For music production, rap features, studio bookings, engineering consulting, creative digital projects, or friendly hellos.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Contacts & Channels */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInLeft}
          className="md:col-span-5 space-y-6"
        >
          
          <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span 
                className="text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: 'var(--color-accent-primary, #f59e0b)' }}
              >
                Direct Access
              </span>
              <h2 className="text-xl font-bold font-display">Reach Out Directly</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-xl bg-neutral-800 flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-accent-primary, #f59e0b)' }}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Direct Email</span>
                  <a href={`mailto:${profile.email}`} className="font-semibold hover:text-amber-400 transition-colors selectable-email select-text">
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-800 text-emerald-400 flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Phone / WhatsApp</span>
                  <a href={`tel:${profile.whatsappNumber}`} className="font-semibold hover:text-emerald-400 transition-colors selectable-phone select-text">
                    {profile.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-neutral-800 text-purple-400 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Location Base</span>
                  <span className="font-semibold text-neutral-200">
                    Jaipur, Rajasthan, India
                  </span>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => hapticSelection()}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Directly on WhatsApp</span>
            </motion.a>
          </div>

          {/* Response SLA Note */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 flex items-center gap-3">
            <Clock 
              className="w-4 h-4 flex-shrink-0" 
              style={{ color: 'var(--color-accent-primary, #f59e0b)' }}
            />
            <span>Arjun typically responds to inquiries and collaboration notes within 24–48 hours.</span>
          </div>

        </motion.div>

        {/* Right Column: Contact Form */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideInRight}
          className="md:col-span-7"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
            
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                Send a Direct Message
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Fill out the form below. Your message is dispatched securely to Arjun's management desk.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-emerald-600 dark:text-emerald-400">Message Dispatched!</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-md mx-auto">
                  Thank you for reaching out. Your note has been securely logged into Arjun’s dashboard inbox.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    hapticSelection();
                    setSubmitted(false);
                  }}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline pt-2 cursor-pointer"
                >
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-500">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-500">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nyra Rajawat"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-neutral-500">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. nyra@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-neutral-500">Inquiry Purpose *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your inquiry purpose (e.g. Music Collaboration, Feature, Show Booking, Project...)"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-neutral-500">Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell Arjun about your proposal, project, or message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-amber-500 resize-none transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Arjun</span>
                </motion.button>
              </form>
            )}

          </div>
        </motion.div>

      </div>

    </div>
  );
};

