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
      <img onClick={() => navigate('/')} src="/logo.png" alt="ProfilIO" className="h-8 w-auto object-contain cursor-pointer" />
  );

  return (
    <footer className="bg-slate-50 border-t border-slate-200/60 font-sans">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        {/* Top row — brand + nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">
              Create professional, ATS-optimized resumes in minutes and land your dream job with ease.
            </p>
          </div>

          {/* Nav links — inline flat */}
          <nav className="flex flex-wrap gap-6 md:gap-10">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="text-sm text-slate-650 hover:text-primary transition-colors duration-300 font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-8 p-4 bg-slate-100/50 rounded-2xl border border-slate-200/40">
          <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed text-left font-light">
            <strong>Disclaimer:</strong> This ATS score is an estimated evaluation based on common ATS parsing, formatting, and keyword optimization practices. Actual scores may differ across employers and ATS platforms.
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-slate-200/60" />

        {/* Bottom row — copyright + legal */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ProfilIo. All rights reserved.</p>

          <div className="flex gap-6">
            {legalLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className="hover:text-primary transition-colors duration-300"
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