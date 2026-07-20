import { useEffect } from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] font-display tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 font-medium">Last updated: June 20, 2026</p>
          </div>

          <div className="prose prose-slate prose-headings:font-display prose-headings:text-[#0F172A] prose-a:text-[#6D5DF6] max-w-none text-slate-600">
            <p>
              At ProfilIO, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our resume building application.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us when you register for an account, create a resume, or communicate with us. This includes:
            </p>
            <ul>
              <li><strong>Personal Data:</strong> Name, email address, phone number, and any professional information you include in your resume.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our application, such as features used and time spent on the platform.</li>
            </ul>

            <h3>2. How We Use Your Information</h3>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our application.</li>
              <li>Improve, personalize, and expand our services.</li>
              <li>Understand and analyze how you use our application to enhance user experience.</li>
              <li>Communicate with you regarding updates, support, and promotional offers.</li>
            </ul>

            <h3>3. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet is 100% secure.
            </p>

            <h3>4. Third-Party Services</h3>
            <p>
              We may employ third-party companies and individuals due to the following reasons:
            </p>
            <ul>
              <li>To facilitate our Service;</li>
              <li>To provide the Service on our behalf;</li>
              <li>To perform Service-related services; or</li>
              <li>To assist us in analyzing how our Service is used.</li>
            </ul>

            <h3>5. Changes to This Privacy Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h3>6. Contact Us</h3>
            <p>
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@profilio.com.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
