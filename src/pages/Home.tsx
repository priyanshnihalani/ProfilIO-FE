import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Check,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  ShieldCheck,
  Plus,
  Cpu,
  FileText,
  Clock
} from "lucide-react";
import {
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiLinkedinBoxLine
} from "react-icons/ri";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import MinimalClean from '../templates/MinimalClean';
import ModernProfessional from '../templates/ModernProfessional';
import ElegantCompact from '../templates/ElegantCompact';
import TheMonolith from '../templates/TheMonolith';
import TheCurator from '../templates/TheCurator';
import { defaultResumeData } from '../types/resume';



// 3D Perspective Tilt Card Component
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-200, 200], [12, -12]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-12, 12]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY
      }}
      className={`relative cursor-grab active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  // State for interactive builder
  const [activeTab, setActiveTab] = useState("profile");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const [resumeData, setResumeData] = useState({
    name: "Priyansh Nihalani",
    title: "Full Stack Developer",
    email: "priyansh.nihalani@email.com",
    phone: "+91 1234567890",
    location: "Gujarat, India",
    linkedin: "linkedin.com/in/priyansh-nihalani",
    summary: "Passionate developer with 1+ years of experience building scalable web applications and delightful user experiences.",
    experience: [
      {
        role: "Software Engineer",
        company: "TechRover",
        years: "2025 — Present",
        desc: "Built and maintained scalable web applications using React, Node.js, and AWS. Led cross-functional teams."
      },
      {
        role: "Intern",
        company: "Avadh Web",
        years: "2025 Mar — 2025 May",
        desc: "Developed RESTful APIs and collaborated with cross-functional teams to deliver 10+ major features."
      }
    ],
    skills: ["React", "Node.js", "TypeScript", "Postgres"],
    education: {
      degree: "BCA",
      school: "Noble University",
      years: "2022 — 2025"
    }
  });

  // Skills tag manager input
  const [newSkill, setNewSkill] = useState("");
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()]
      });
      setNewSkill("");
      setShowAddSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(s => s !== skillToRemove)
    });
  };

  // State for Template Chooser
  const templates = [
    { id: "minimal", name: "Minimalist Classic", desc: "Clean and standard layout with modern typography", render: () => <MinimalClean data={defaultResumeData} /> },
    { id: "modern", name: "Modern Accent", desc: "Sleek look with a colored accent border", render: () => <ModernProfessional data={defaultResumeData} /> },
    { id: "executive", name: "Executive Prestige", desc: "Refined and structured layout with centered headers", render: () => <ElegantCompact data={defaultResumeData} /> },
    { id: "creative", name: "Creative Edge", desc: "Vibrant visual design for designers and builders", render: () => <TheMonolith data={defaultResumeData} /> },
    { id: "developer", name: "Tech Monolith", desc: "Two-column technical layout optimized for engineers", render: () => <TheCurator data={defaultResumeData} /> }
  ];
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [templateIndex, setTemplateIndex] = useState(0);

  // Rotate template index in carousel
  const nextTemplate = () => {
    setTemplateIndex((prev) => (prev + 1) % (templates.length - 2));
  };
  const prevTemplate = () => {
    setTemplateIndex((prev) => (prev - 1 + (templates.length - 2)) % (templates.length - 2));
  };



  // Scroll target for Workflow connected timeline
  const workflowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: workflowRef,
    offset: ["start center", "end center"]
  });
  const pathHeight = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const springPathHeight = useSpring(pathHeight, { stiffness: 100, damping: 15 });

  // Dialog State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <main className="pt-16 sm:pt-20 overflow-x-hidden bg-[#FAFAFC] text-[#0F172A] lg:h-screen lg:overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative liquid-section max-w-screen-2xl mx-auto overflow-hidden pb-10 sm:pb-16">
        {/* Soft SaaS backdrop gradient blur glows */}
        <div className="mobile-hide-decor absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[#6D5DF6]/8 rounded-full blur-[140px] -z-10 animate-pulse" />
        <div className="mobile-hide-decor absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B7CF8]/8 rounded-full blur-[120px] -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-10 text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6D5DF6]/8 text-[#6D5DF6] border border-[#6D5DF6]/12 w-fit shadow-xs"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest font-display">AI-Powered Resume Builder</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="liquid-heading-xl font-extrabold tracking-tight text-[#0F172A] font-display max-w-xl"
            >
              Build a Resume That Gets You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6D5DF6] via-[#8B7CF8] to-[#ec4899]">Hired.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-[#64748B] font-light max-w-lg leading-relaxed font-sans"
            >
              Create ATS-friendly resumes in minutes. Designed with the precision of Apple and the visual depth of Linear. No design skills needed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Button
                variant="purple"
                size="lg"
                className="group shadow-xl bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hover:shadow-[#6D5DF6]/20 transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => {
                  const element = document.getElementById("builder");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Create My Resume
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-[#f1f5f9] text-slate-700 hover:bg-[#FAFAFC] hover:border-slate-300 shadow-premium transition-all duration-300 transform hover:-translate-y-0.5"
                onClick={() => {
                  const element = document.getElementById("templates-section");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Templates
              </Button>
            </motion.div>

            {/* Hero Checklist Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-3 pt-8"
            >
              {["ATS Optimized", "Modern Templates", "Easy to Use", "Download PDF"].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/60 shadow-glass text-xs font-semibold text-[#0F172A]/70"
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-[#6D5DF6]/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#6D5DF6] stroke-[3]" />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Right: 3D Perspective Tilt Card Mockup */}
          <div className="lg:col-span-6 flex justify-center relative min-h-[320px] sm:min-h-[400px] lg:min-h-[500px] w-full">
            {/* Blown blur radial glow directly behind the card */}
            <div className="mobile-hide-decor absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px]bg-gradient-to-tr from-[#6D5DF6]/20 to-[#8B7CF8]/20 rounded-full blur-[80px] -z-10" />

            {/* Decorative Floating shapes with staggered breathing float animations */}
            {/* Blue/Purple sphere top left */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="mobile-hide-decor absolute left-4 top-8 w-14 h-14 bg-gradient-to-tr from-blue-400 to-[#6D5DF6] rounded-full blur-[1px] shadow-[0_20px_40px_rgba(109,93,246,0.15)] z-20"
            />
            {/* Violet 3D block with "T" bottom left */}
            <motion.div
              animate={{ y: [0, 18, 0], rotate: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="mobile-hide-decor absolute left-8 bottom-4 w-16 h-16 bg-gradient-to-br from-[#8B7CF8] to-[#6D5DF6] rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-purple-300/30 z-20"
            >
              <span className="text-white text-3xl font-black italic">T</span>
            </motion.div>
            
            {/* Status card floating on the right */}
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
              className="mobile-hide-decor absolute right-4 bottom-16 bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/60 shadow-premium flex items-center gap-3.5 z-20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                <Check className="w-5 h-5 text-emerald-500 stroke-[3]" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold">Status</div>
                <div className="text-xs font-extrabold text-[#0F172A]">Ready to download</div>
              </div>
            </motion.div>

            {/* 3D Pie Chart floating top-right */}
            <motion.div
              animate={{ y: [0, 10, 0], rotate: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut" }}
              className="mobile-hide-decor absolute -right-4 top-12 w-20 h-20 bg-gradient-to-br from-pink-400 to-[#ec4899] rounded-full flex items-center justify-center shadow-lg shadow-pink-300/30 z-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#8B7CF8] scale-x-50 origin-left rotate-45" />
              <div className="absolute inset-2 bg-[#FAFAFC] rounded-full" />
            </motion.div>

            {/* Elevated 3D Tilt Card */}
            <TiltCard className="w-full max-w-[440px] px-4 sm:px-0">
              <div className="bg-white rounded-[2.25rem] border border-[#f1f5f9] liquid-card shadow-premium flex flex-col space-y-5 text-slate-700 relative overflow-hidden transition-all duration-300">
                {/* Glass reflection shine overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />

                {/* Card Header (Avatar + Name) */}
                <div className="flex items-center gap-4.5 pb-5 border-b border-slate-100/65">
                  <Avatar className="w-16 h-16 border-2 border-[#6D5DF6]/20">
                    <AvatarImage src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" />
                    <AvatarFallback>PN</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight leading-tight">Priyansh Nihalani</h3>
                    <p className="text-xs font-semibold text-[#6D5DF6]">Full Stack Developer</p>
                  </div>
                </div>

                {/* Contact grid */}
                <div className="text-left space-y-1.5 text-[10px] text-[#64748B] font-semibold border-b border-slate-100/50 pb-4">
                  <div className="flex items-center gap-2"><RiMailLine className="w-3.5 h-3.5 text-[#8B7CF8]" /> priyansh.nihalani@email.com</div>
                  <div className="flex items-center gap-2"><RiMapPinLine className="w-3.5 h-3.5 text-[#8B7CF8]" /> Gujarat, India</div>
                  <div className="flex items-center gap-2"><RiLinkedinBoxLine className="w-3.5 h-3.5 text-[#8B7CF8]" /> linkedin.com/in/priyansh-nihalani</div>
                </div>

                {/* Summary */}
                <div className="text-left space-y-1">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#64748B] font-extrabold">Summary</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Passionate developer with 4+ years of experience building scalable web applications and high-fidelity interfaces.
                  </p>
                </div>

                {/* Experience */}
                <div className="text-left space-y-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#64748B] font-extrabold">Experience</h4>
                  <div className="border-l-2 border-[#6D5DF6]/35 pl-3.5 space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#0F172A] leading-none">
                      <span>Software Engineer</span>
                      <span className="text-[#64748B] font-medium">Present</span>
                    </div>
                    <div className="text-[10px] text-[#64748B] font-semibold">TechRover</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="text-left space-y-1.5">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#64748B] font-extrabold">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["React", "Node.js", "TypeScript", "Postgres"].map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-[#FAFAFC] border border-slate-200/60 text-slate-650 rounded-lg text-[9px] font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE BUILDER PREVIEW */}
      <section id="builder" className="liquid-section bg-white border-y border-slate-100 scroll-mt-10">
        <div className="max-w-screen-xl mx-auto space-y-10 md:space-y-20">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#6D5DF6] font-extrabold font-display">Live Product Demo</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] font-display">
              Build. Preview. Perfect.
            </h2>
            <p className="text-[#64748B] font-light leading-relaxed text-sm md:text-base">
              Experience the fast-loading, state-synchronized builder. Click any field to update the resume live.
            </p>
          </div>

          {/* Interactive Panel Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Control Panel (5/12 cols) */}
            <div className="lg:col-span-5 flex flex-col md:flex-row gap-6 bg-[#FAFAFC] rounded-[2rem] liquid-card border border-slate-200/30">
              
              {/* Tab Triggers — horizontal scroll on mobile */}
              <div className="flex md:flex-col gap-2 sm:gap-2.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0 -mx-1 px-1">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "experience", label: "Experience", icon: Briefcase },
                  { id: "education", label: "Education", icon: GraduationCap },
                  { id: "skills", label: "Skills", icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center md:flex-col justify-center gap-2 p-3 md:p-3.5 rounded-xl md:rounded-2xl text-xs font-bold font-sans transition-all cursor-pointer whitespace-nowrap md:w-12 md:h-12 shrink-0
                        ${isActive
                          ? "bg-[#6D5DF6] text-white shadow-lg shadow-[#6D5DF6]/20"
                          : "bg-white text-[#64748B] hover:text-[#0F172A] border border-slate-200/80 shadow-xs"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="md:hidden">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Form Content */}
              <div className="flex-1 space-y-6 text-left">
                <AnimatePresence mode="wait">
                  
                  {/* Tab: Profile */}
                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider font-display">Personal Profile</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Full Name</label>
                        <Input
                          value={resumeData.name}
                          onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Aarav Mehta"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Professional Title</label>
                        <Input
                          value={resumeData.title}
                          onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                          onFocus={() => setFocusedField("title")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Full Stack Developer"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Email</label>
                          <Input
                            value={resumeData.email}
                            onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Phone</label>
                          <Input
                            value={resumeData.phone}
                            onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                            onFocus={() => setFocusedField("phone")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Location</label>
                        <Input
                          value={resumeData.location}
                          onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                          onFocus={() => setFocusedField("location")}
                          onBlur={() => setFocusedField(null)}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Experience */}
                  {activeTab === "experience" && (
                    <motion.div
                      key="experience"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider font-display">Work History</h4>
                      
                      <div className="space-y-4 pb-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Company</label>
                          <Input
                            value={resumeData.experience[0].company}
                            onChange={(e) => {
                              const exp = [...resumeData.experience];
                              exp[0].company = e.target.value;
                              setResumeData({ ...resumeData, experience: exp });
                            }}
                            onFocus={() => setFocusedField("company")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Job Role</label>
                          <Input
                            value={resumeData.experience[0].role}
                            onChange={(e) => {
                              const exp = [...resumeData.experience];
                              exp[0].role = e.target.value;
                              setResumeData({ ...resumeData, experience: exp });
                            }}
                            onFocus={() => setFocusedField("role")}
                            onBlur={() => setFocusedField(null)}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Duration</label>
                            <Input
                              value={resumeData.experience[0].years}
                              onChange={(e) => {
                                const exp = [...resumeData.experience];
                                exp[0].years = e.target.value;
                                setResumeData({ ...resumeData, experience: exp });
                              }}
                              onFocus={() => setFocusedField("years")}
                              onBlur={() => setFocusedField(null)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Job Description</label>
                          <textarea
                            rows={3}
                            value={resumeData.experience[0].desc}
                            onChange={(e) => {
                              const exp = [...resumeData.experience];
                              exp[0].desc = e.target.value;
                              setResumeData({ ...resumeData, experience: exp });
                            }}
                            onFocus={() => setFocusedField("desc")}
                            onBlur={() => setFocusedField(null)}
                            className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D5DF6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Education */}
                  {activeTab === "education" && (
                    <motion.div
                      key="education"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider font-display">Academic Background</h4>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">University / School</label>
                        <Input
                          value={resumeData.education.school}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              education: { ...resumeData.education, school: e.target.value }
                            })
                          }
                          onFocus={() => setFocusedField("school")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Degree / Course</label>
                        <Input
                          value={resumeData.education.degree}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              education: { ...resumeData.education, degree: e.target.value }
                            })
                          }
                          onFocus={() => setFocusedField("degree")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Years Active</label>
                        <Input
                          value={resumeData.education.years}
                          onChange={(e) =>
                            setResumeData({
                              ...resumeData,
                              education: { ...resumeData.education, years: e.target.value }
                            })
                          }
                          onFocus={() => setFocusedField("eduYears")}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Tab: Skills */}
                  {activeTab === "skills" && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wider font-display">Core Competencies</h4>
                      
                      <div className="flex flex-wrap gap-2 py-2">
                        {resumeData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="purple"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full font-medium"
                          >
                            <span>{skill}</span>
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="w-4 h-4 rounded-full hover:bg-white/20 flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3 h-3 rotate-45 shrink-0 stroke-[3]" />
                            </button>
                          </Badge>
                        ))}
                      </div>

                      <div className="pt-2">
                        {!showAddSkillInput ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 bg-white hover:bg-slate-50 cursor-pointer"
                            onClick={() => setShowAddSkillInput(true)}
                          >
                            <Plus className="w-4 h-4" />
                            Add Skill
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Type skill name"
                              className="h-9"
                              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                            />
                            <Button size="sm" onClick={handleAddSkill}>
                              Add
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setNewSkill("");
                                setShowAddSkillInput(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>

            {/* Right Live Preview Panel (7/12 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Preview Header controls */}
              <div className="flex items-center justify-between px-3 py-2 bg-[#FAFAFC] border border-slate-200/80 rounded-2xl w-full">
                <span className="text-xs font-bold text-[#64748B] flex items-center gap-2.5 pl-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Preview
                </span>

                <div className="flex items-center gap-2">
                  <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogTrigger>
                      <Button variant="purple" size="sm" className="h-9.5 text-xs rounded-xl shadow-md bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hover:shadow-[#6D5DF6]/15">
                        <Download className="w-4 h-4" />
                        Export PDF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Download Resume</DialogTitle>
                        <DialogDescription>
                          Select format and download the generated resume.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3.5">
                            <FileText className="w-9 h-9 text-[#6D5DF6]" />
                            <div className="text-left">
                              <div className="text-sm font-bold text-[#0F172A]">PDF Document (.pdf)</div>
                              <div className="text-xs text-[#64748B]">High-resolution, ATS optimized</div>
                            </div>
                          </div>
                          <Badge variant="success">Standard</Badge>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
                        <Button variant="purple" onClick={() => setIsPreviewOpen(false)}>Download Now</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Resume Document Canvas with subtle shadows and border */}
              <div className="bg-[#f8fafc] border border-slate-200/60 liquid-card rounded-[2rem] min-h-[420px] md:min-h-[600px] flex justify-center shadow-inner relative overflow-hidden">
                
                {/* Resume Paper */}
                <div
                  className={`w-full max-w-[560px] bg-white shadow-premium p-5 sm:p-8 md:p-10 flex text-slate-700 text-left transition-all duration-500 relative rounded-md
                    ${selectedTemplate === "modern" ? "border-t-8 border-[#6D5DF6]" : ""}
                    ${selectedTemplate === "executive" ? "flex-col items-center text-center" : "flex-col"}
                  `}
                >
                  
                  {/* Layout: Normal/Minimal/Modern */}
                  {selectedTemplate !== "developer" ? (
                    <>
                      {/* Name / Title header */}
                      <div className={`w-full pb-6 border-b border-slate-100 space-y-2
                        ${selectedTemplate === "executive" ? "text-center" : ""}
                      `}>
                        <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] leading-none flex items-center justify-center md:justify-start gap-1">
                          {resumeData.name || "Full Name"}
                          {focusedField === "name" && <span className="w-1.5 h-6 bg-[#6D5DF6] animate-pulse inline-block" />}
                        </h2>
                        <p className="text-sm font-bold text-[#6D5DF6] flex items-center justify-center md:justify-start gap-1">
                          {resumeData.title || "Job Title"}
                          {focusedField === "title" && <span className="w-1.5 h-4.5 bg-[#6D5DF6] animate-pulse inline-block" />}
                        </p>
                        
                        {/* Contact details */}
                        <div className={`flex flex-wrap gap-x-4 gap-y-1.5 pt-3 text-[11px] text-[#64748B] font-semibold
                          ${selectedTemplate === "executive" ? "justify-center" : ""}
                        `}>
                          {resumeData.email && (
                            <span className="flex items-center gap-1.5">
                              <RiMailLine className="w-3.5 h-3.5 text-[#8B7CF8]" />
                              {resumeData.email}
                              {focusedField === "email" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            </span>
                          )}
                          {resumeData.phone && (
                            <span className="flex items-center gap-1.5">
                              <RiPhoneLine className="w-3.5 h-3.5 text-[#8B7CF8]" />
                              {resumeData.phone}
                              {focusedField === "phone" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            </span>
                          )}
                          {resumeData.location && (
                            <span className="flex items-center gap-1.5">
                              <RiMapPinLine className="w-3.5 h-3.5 text-[#8B7CF8]" />
                              {resumeData.location}
                              {focusedField === "location" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Summary */}
                      {resumeData.summary && (
                        <div className="py-6 border-b border-slate-100/50 space-y-2">
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#64748B]">Summary</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-light">{resumeData.summary}</p>
                        </div>
                      )}

                      {/* Experience */}
                      <div className="py-6 border-b border-slate-100/50 space-y-4">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#64748B]">Experience</h4>
                        <div className="space-y-5">
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="pl-4 border-l-2 border-[#6D5DF6]/20 space-y-1.5 relative">
                              <div className="flex justify-between text-xs font-bold text-[#0F172A] leading-none">
                                <span className="flex items-center gap-1">
                                  {exp.role}
                                  {idx === 0 && focusedField === "role" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                                </span>
                                <span className="text-[#64748B] font-medium flex items-center gap-1">
                                  {exp.years}
                                  {idx === 0 && focusedField === "years" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                                </span>
                              </div>
                              <div className="text-[10px] text-[#64748B] font-bold flex items-center gap-1">
                                {exp.company}
                                {idx === 0 && focusedField === "company" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                              </div>
                              <p className="text-[11px] text-slate-500 font-light leading-relaxed pt-0.5 flex items-center gap-1">
                                {exp.desc}
                                {idx === 0 && focusedField === "desc" && <span className="w-1.5 h-3.5 bg-[#6D5DF6] animate-pulse inline-block" />}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Grid for Skills & Education */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                        
                        {/* Skills column */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#64748B]">Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {resumeData.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-3 py-1 bg-[#FAFAFC] border border-slate-200/50 text-slate-650 rounded-lg text-[10px] font-semibold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Education column */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#64748B]">Education</h4>
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-[#0F172A] leading-tight flex items-center gap-1">
                              {resumeData.education.degree}
                              {focusedField === "degree" && <span className="w-1.5 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            </div>
                            <div className="text-[10px] text-[#64748B] font-bold flex items-center gap-1">
                              {resumeData.education.school}
                              {focusedField === "school" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                              · 
                              <span className="font-medium text-[#64748B]/80 flex items-center gap-1">
                                {resumeData.education.years}
                                {focusedField === "eduYears" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </>
                  ) : (
                    // Developer Layout (Split columns sidebar style)
                    <div className="flex gap-8 w-full h-full text-slate-700">
                      {/* Left narrow side */}
                      <div className="w-1/3 bg-slate-50/70 p-5 rounded-2xl border border-slate-100 flex flex-col gap-6 text-slate-650">
                        <div>
                          <h3 className="text-xl font-extrabold text-[#0F172A] leading-tight flex items-center gap-1">
                            {resumeData.name}
                            {focusedField === "name" && <span className="w-1.5 h-4.5 bg-[#6D5DF6] animate-pulse inline-block" />}
                          </h3>
                          <p className="text-[10px] font-bold text-[#6D5DF6] tracking-wide flex items-center gap-1">
                            {resumeData.title}
                            {focusedField === "title" && <span className="w-1 h-3.5 bg-[#6D5DF6] animate-pulse inline-block" />}
                          </p>
                        </div>
                        <div className="space-y-2.5 text-[9px] font-semibold text-[#64748B] break-words">
                          <div className="flex items-center gap-1.5">
                            <RiMailLine className="w-3.5 h-3.5 text-[#6D5DF6]" />
                            {resumeData.email}
                            {focusedField === "email" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <RiMapPinLine className="w-3.5 h-3.5 text-[#6D5DF6]" />
                            {resumeData.location}
                            {focusedField === "location" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <h4 className="text-[8px] uppercase tracking-wider font-bold text-[#64748B]">Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {resumeData.skills.map((skill) => (
                              <span key={skill} className="px-2 py-0.5 bg-white border border-slate-200/50 text-slate-650 rounded text-[9px] font-bold">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Right wider side */}
                      <div className="flex-grow flex flex-col gap-6 text-slate-700">
                        {resumeData.summary && (
                          <div className="space-y-1">
                            <h4 className="text-[9px] uppercase tracking-wider font-bold text-[#6D5DF6]">Profile</h4>
                            <p className="text-[10px] text-slate-500 font-light leading-relaxed">{resumeData.summary}</p>
                          </div>
                        )}
                        <div className="space-y-4">
                          <h4 className="text-[9px] uppercase tracking-wider font-bold text-[#6D5DF6]">Experience</h4>
                          {resumeData.experience.map((exp, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[10px] font-bold text-[#0F172A]">
                                <span className="flex items-center gap-1">
                                  {exp.role}
                                  {idx === 0 && focusedField === "role" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                                </span>
                                <span className="text-[#64748B] font-medium text-[8px] flex items-center gap-1">
                                  {exp.years}
                                  {idx === 0 && focusedField === "years" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                                </span>
                              </div>
                              <div className="text-[9px] text-[#64748B] font-bold flex items-center gap-1">
                                {exp.company}
                                {idx === 0 && focusedField === "company" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                              </div>
                              <p className="text-[9.5px] text-slate-500 font-light leading-normal flex items-center gap-1">
                                {exp.desc}
                                {idx === 0 && focusedField === "desc" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-[9px] uppercase tracking-wider font-bold text-[#6D5DF6]">Education</h4>
                          <div className="text-[10px] font-bold text-[#0F172A] flex items-center gap-1">
                            {resumeData.education.degree}
                            {focusedField === "degree" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                          </div>
                          <div className="text-[9px] text-[#64748B] font-bold flex items-center gap-1">
                            {resumeData.education.school}
                            {focusedField === "school" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            | 
                            <span className="font-medium flex items-center gap-1">
                              {resumeData.education.years}
                              {focusedField === "eduYears" && <span className="w-1 h-3 bg-[#6D5DF6] animate-pulse inline-block" />}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. TEMPLATES CAROUSEL */}
      <section id="templates-section" className="liquid-section bg-[#FAFAFC]">
        <div className="max-w-4xl mx-auto">
          
          {/* Template Chooser Carousel */}
          <div className="flex flex-col space-y-8 text-center items-center">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#6D5DF6] font-extrabold font-display font-display">Template Gallery</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#0F172A] font-display">
                Choose a Template
              </h2>
              <p className="text-[#64748B] font-light text-sm leading-relaxed">
                Pick a typography and layout design that highlights your unique career path. Selected template styles render live on the preview.
              </p>
            </div>

            {/* Template carousel grid — 1 card mobile, 2 tablet, 3 desktop */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 py-4">
                {templates.slice(templateIndex, templateIndex + 3).map((tpl) => {
                  const isActive = selectedTemplate === tpl.id;
                  return (
                    <motion.div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id)}
                      whileHover={{ y: -6 }}
                      className={`flex-1 bg-white rounded-[1.75rem] p-4 sm:p-5 border transition-all duration-300 cursor-pointer text-center space-y-4 relative
                        ${isActive
                          ? "border-[#6D5DF6] shadow-premium shadow-[#6D5DF6]/5 ring-1 ring-[#6D5DF6]"
                          : "border-slate-200/80 shadow-glass hover:border-slate-300 hover:shadow-premium"
                        }`}
                    >
                      {/* Scaled actual template */}
                      <div className="aspect-[3/4] rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between overflow-hidden relative pointer-events-none">
                        <div className="absolute top-0 left-0 w-[500%] h-[500%] origin-top-left scale-[0.2] pointer-events-none p-8 bg-white">
                          {tpl.render()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[#0F172A] leading-none">{tpl.name}</div>
                        <div className="text-[9px] text-[#64748B] leading-tight font-medium line-clamp-1">{tpl.desc}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Slider Arrows */}
              <div className="flex gap-3 justify-end pt-3">
                <button
                  onClick={prevTemplate}
                  className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-full cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={nextTemplate}
                  className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-full cursor-pointer text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>



        </div>
      </section>

      {/* 4. WHY CHOOSE PROFILIO - BENTO GRID LAYOUT */}
      <section id="features" className="liquid-section bg-white border-y border-slate-100">
        <div className="max-w-screen-xl mx-auto space-y-20">
          
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#6D5DF6] font-extrabold font-display">Features</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] font-display">
              Why Choose ProfilIo?
            </h2>
            <p className="text-[#64748B] font-light leading-relaxed text-sm md:text-base">
              Build polished, ATS-friendly resumes with guided scoring, truthful AI refinement, and clean PDF export.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            
            {/* Card 1: Wide (ATS Optimized) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="md:col-span-4 bg-[#FAFAFC] rounded-[2rem] liquid-card border border-slate-200/60 shadow-glass flex flex-col justify-between text-left min-h-[240px] md:min-h-[300px] hover:shadow-premium transition-all duration-300 relative overflow-hidden group"
            >
              {/* Radial glow background effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6D5DF6]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/8 flex items-center justify-center border border-blue-500/10 text-[#6D5DF6]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 font-bold">Live Score</Badge>
              </div>
              
              <div className="space-y-2.5 z-10">
                <h3 className="text-2xl font-bold text-[#0F172A] font-display">ATS Score & Guidance</h3>
                <p className="text-sm text-[#64748B] leading-relaxed font-light max-w-xl">
                  Review keyword coverage, format safety, section completeness, impact language, role alignment, and parsing risks before you export.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Muted height (AI Assistance) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="md:col-span-2 bg-[#FAFAFC] rounded-[2rem] liquid-card border border-slate-200/60 shadow-glass flex flex-col justify-between text-left min-h-[240px] md:min-h-[300px] hover:shadow-premium transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B7CF8]/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-[#8B7CF8]/8 flex items-center justify-center border border-[#8B7CF8]/10 text-[#8B7CF8]">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-2 z-10">
                <h3 className="text-xl font-bold text-[#0F172A] font-display">Truthful AI Assistance</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-light">
                  Improve summaries and bullets with professional phrasing while preserving your existing skills, jobs, projects, and evidence.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Muted height (Beautiful Templates) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="md:col-span-2 bg-[#FAFAFC] rounded-[2rem] liquid-card border border-slate-200/60 shadow-glass flex flex-col justify-between text-left min-h-[240px] md:min-h-[300px] hover:shadow-premium transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-2xl bg-pink-500/8 flex items-center justify-center border border-pink-500/10 text-[#ec4899]">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2 z-10">
                <h3 className="text-xl font-bold text-[#0F172A] font-display">Polished Layouts</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-light">
                  Choose from professional templates with live preview, responsive pagination, and layouts tuned for readable resume structure.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Wide (One-Click Export) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="md:col-span-4 bg-[#FAFAFC] rounded-[2rem] liquid-card border border-slate-200/60 shadow-glass flex flex-col justify-between text-left min-h-[240px] md:min-h-[300px] hover:shadow-premium transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/8 flex items-center justify-center border border-emerald-500/10 text-emerald-500">
                  <Download className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <Clock className="w-3.5 h-3.5" /> Instant Build
                </div>
              </div>
              
              <div className="space-y-2.5 z-10">
                <h3 className="text-2xl font-bold text-[#0F172A] font-display">One-Click PDF Export</h3>
                <p className="text-sm text-[#64748B] leading-relaxed font-light max-w-xl">
                  Generate a text-based, selectable PDF from the server-rendered resume preview, preserving margins and page layout for sharing.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 5. WORKFLOW SECTION (TIMELINE CONNECTED PATH) */}
      <section ref={workflowRef} className="liquid-section bg-slate-50/50 relative overflow-hidden">
        <div className="max-w-screen-xl mx-auto space-y-24">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#6D5DF6] font-extrabold font-display">Timeline</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] font-display">
              How It Works
            </h2>
            <p className="text-[#64748B] font-light leading-relaxed text-sm md:text-base">
              Create and refine your professional portfolio in four simple structured milestones.
            </p>
          </div>

          {/* Workflow Row + Responsive Scroll Timeline Line */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative pt-6">
            
            {/* Desktop Horizontal Line Backdrop */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-200/60 hidden md:block" />
            <motion.div
              className="absolute top-12 left-0 h-0.5 bg-gradient-to-r from-[#6D5DF6] to-[#8B7CF8] hidden md:block"
              style={{
                width: useTransform(springPathHeight, [0, 1], ["0%", "100%"])
              }}
            />

            {[
              {
                step: "01",
                title: "Personal Profile",
                desc: "Type details in a guided, clean input sidebar on the workspace editor."
              },
              {
                step: "02",
                title: "Curate Design",
                desc: "Select template configurations to format vertical structural grids."
              },
              {
                step: "03",
                title: "Score & Optimize",
                desc: "Review parsed ATS indices and edit blocks to target job keywords."
              },
              {
                step: "04",
                title: "Generate PDF",
                desc: "Download clean, vector-exact document files in one click."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 relative group"
              >
                {/* Step indicator circle with glow */}
                <div className="w-14 h-14 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-500 font-extrabold text-base shadow-glass transition-all duration-300 group-hover:border-[#6D5DF6] group-hover:text-[#6D5DF6] group-hover:shadow-[0_0_20px_rgba(109,93,246,0.25)] relative z-10">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] font-display pt-2">{step.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-light max-w-[240px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>



        </div>
      </section>



    </main>
  );
};

export default Home;
