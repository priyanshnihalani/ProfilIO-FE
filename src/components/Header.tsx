import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { RiMenuLine, RiArrowRightLine, RiCloseLine } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-10  max-w-screen-2xl mx-auto">

          {/* Logo */}
          <div
            className="flex items-center cursor-pointer shrink-0"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.png"
              alt="ProfilIO"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans font-medium text-sm text-slate-600">
            <a
              href="/#features"
              onClick={handleFeaturesClick}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </a>
            <NavLink
              to="/templates"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "hover:text-primary transition-colors"
              }
            >
              Templates
            </NavLink>
            <NavLink
              to="/cover-letter"
              className={({ isActive }) =>
                `flex items-center transition-colors ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
              }
            >
              Cover Letter
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white leading-none">PRO</span>
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                isActive ? "text-primary font-semibold" : "hover:text-primary transition-colors"
              }
            >
              Pricing
            </NavLink>
          </nav>

          {/* Desktop auth + mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop-only auth buttons */}
            {user ? (
              <>
                <div className="hidden sm:inline-flex">
                  <Button
                    variant="outline"
                    className="h-8.5 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
                    onClick={() => { logout(); navigate("/"); }}
                  >
                    Log out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:inline-flex text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer"
                >
                  Log in
                </button>
                {/* Desktop CTA */}
                <div className="hidden sm:inline-flex">
                  <Button
                    variant="purple"
                    className="h-8.5 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm shadow-sm"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                    <RiArrowRightLine className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
                {/* Mobile-only compact CTA */}
                <div className="inline-flex sm:hidden">
                  <Button
                    variant="purple"
                    className="h-7.5 px-3 text-xs shadow-sm"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileOpen ? (
                <RiCloseLine className="w-5 h-5" />
              ) : (
                <RiMenuLine className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer — rendered as portal-like full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-in drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(85vw,320px)] bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => { setMobileOpen(false); navigate("/"); }}
                >
                  <img
                    src="/logo.png"
                    alt="ProfilIO"
                    className="h-12 md:h-16 w-auto object-contain"
                  />
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RiCloseLine className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col px-3 py-3">
                <a
                  href="/#features"
                  onClick={handleFeaturesClick}
                  className="flex items-center px-3 py-3.5 rounded-xl text-base font-medium text-slate-700 hover:text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Features
                </a>
                <NavLink
                  to="/templates"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    }`
                  }
                >
                  Templates
                </NavLink>
                <NavLink
                  to="/cover-letter"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    }`
                  }
                >
                  Cover Letter
                </NavLink>
                <NavLink
                  to="/pricing"
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3.5 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    }`
                  }
                >
                  Pricing
                </NavLink>
              </nav>

              {/* Divider */}
              <div className="mx-5 border-t border-slate-100" />

              {/* Auth buttons */}
              <div className="flex flex-col gap-3 px-5 py-6 mt-auto">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setMobileOpen(false); navigate("/templates"); }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { logout(); setMobileOpen(false); navigate("/"); }}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => { setMobileOpen(false); navigate("/login"); }}
                    >
                      Log in
                    </Button>
                    <Button
                      variant="purple"
                      className="w-full"
                      onClick={() => { setMobileOpen(false); navigate("/signup"); }}
                    >
                      Get Started Free
                      <RiArrowRightLine className="w-4 h-4 ml-1.5" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
