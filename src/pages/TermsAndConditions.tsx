import { useEffect } from 'react';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 liquid-card md:p-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-4 border-b border-slate-100 pb-8 mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight">Terms and Conditions</h1>
            <p className="text-slate-500 font-medium">Last updated: June 20, 2026</p>
          </div>

          <div className="prose prose-slate prose-headings:font-display prose-headings:text-[#0F172A] prose-a:text-[#6D5DF6] max-w-none text-slate-600">
            <p>
              Welcome to ProfilIO. Please read these Terms and Conditions carefully before using our website and resume building application operated by ProfilIO.
            </p>

            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
            </p>

            <h3>2. User Accounts</h3>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password, whether your password is with our service or a third-party service.
            </p>

            <h3>3. Intellectual Property</h3>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive property of ProfilIO and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of ProfilIO.
            </p>
            <p>
              However, the resumes and documents you create using our tool belong entirely to you. We claim no ownership over your personal professional data or the exported PDF documents.
            </p>

            <h3>4. Acceptable Use</h3>
            <p>
              You agree not to use the service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the service in any way that could damage the site, the services, or the general business of ProfilIO.
            </p>

            <h3>5. Limitation of Liability</h3>
            <p>
              In no event shall ProfilIO, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>

            <h3>6. Changes to Terms</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h3>7. Contact Us</h3>
            <p>
              If you have any questions about these Terms, please contact us at legal@profilio.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
