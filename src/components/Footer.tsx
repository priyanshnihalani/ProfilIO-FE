import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Features", to: "#features" },
  { label: "Templates", to: "/templates" },
  { label: "Pricing", to: "/pricing" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-and-conditions" },
];

const Footer = () => {
  const navigate = useNavigate();

  const Logo = () => (
      <img onClick={() => navigate('/')} src="/logo.png" alt="ProfilIO" className="h-10 w-auto object-contain cursor-pointer" />
  );

  return (
    <footer className="bg-white border-t border-slate-200 font-sans mt-auto">
      <div className="max-w-screen-2xl mx-auto px-6 py-16">
        {/* Top row — brand + nav */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed">
              Create professional, ATS-optimized resumes in minutes and land your dream job with ease.
            </p>
          </div>

          {/* Nav links — inline flat */}
          <nav className="flex flex-wrap gap-8 md:gap-12 pt-2">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-base text-slate-600 hover:text-[#6B63E8] transition-colors duration-300 font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-left font-medium">
            <strong className="text-slate-700">Disclaimer:</strong> This ATS score is an estimated evaluation based on common ATS parsing, formatting, and keyword optimization practices. Actual scores may differ across employers and ATS platforms.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-slate-200/80" />

        {/* Bottom row — copyright + legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p className="font-medium">© {new Date().getFullYear()} ProfilIo. All rights reserved.</p>

          <div className="flex gap-8 font-medium">
            {legalLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="hover:text-[#6B63E8] transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;