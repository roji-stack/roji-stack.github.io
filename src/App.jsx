import { useState } from "react";
import ProjectDetailPage from "./ProjectDetailPage";

// ============================================================
//  ✏️  EDITABLE CONTENT — Update everything here.
//      To add a new project, just append a new object to
//      the PROJECTS array. No layout code needs to change.
// ============================================================

const META = {
  name: "Ryan Jin",
  tagline: "Mechatronics Engineering Student",
  seeking: "Actively seeking a 4-month co-op · Summer 2026",
  focus: [
    "Mechanical Design",
    "Embedded Systems",
    "Software Development",
  ],
  bio: "I build things that sense, think, and move. From biomedical wearables to off-grid power monitors, I bridge the gap between hardware constraints and software possibilities.",
  github: "https://github.com/roji-stack",
  linkedin: "https://www.linkedin.com/in/ryan-jin-45a900277/",
  resumeUrl: "/Ryan_Jin_Resume.pdf", // swap with your hosted PDF link
  emailUser: "ryan130210",
  emailDomain: "gmail.com",
};

const PROJECTS = [
  {
    id: "smart-knee-brace",
    title: "Smart Knee Brace",
    category: "Biomedical · Competition",
    year: "2026",
    description:
      "Led the physical design of a smart knee brace for a biomedical competition. Engineered custom leg brace hinges and sensor enclosures using SolidWorks/Onshape, utilizing 3D printing for rapid prototyping and mechanical testing.",
    tags: ["C++", "IMU Sensors", "SolidWorks", "3D Printing", "BLE"],
    accent: "#F59E0B",
    icon: "⚕",
  },

/*
  {
    id: 3,
    title: "Bridge Design Engineer",
    category: "Structural · Co-op Role",
    year: "2023",
    description:
      "Contributed to load-case analysis and structural drawings for three municipal bridge rehabilitation projects. Modelled cross-sections in CAD, ran FEA simulations, and coordinated deliverables with the civil team.",
    tags: ["FEA", "AutoCAD", "Onshape", "Technical Writing", "AASHTO"],
    accent: "#A78BFA",
    icon: "🌉",
  },
  */
  // ── Add new projects below this line ──────────────────────
  // {
  //   id: 4,
  //   title: "Your Next Project",
  //   category: "Category · Type",
  //   year: "2026",
  //   description: "Short description of what you built and why it matters.",
  //   tags: ["Tool", "Language", "Method"],
  //   accent: "#34D399",
  //   icon: "🔧",
  // },
];

const SKILLS = [
  {
    category: "Languages",
    items: ["C++", "Python", "MATLAB", "C", "Bash"],
  },
  {
    category: "Mechanical CAD",
    items: ["SolidWorks", "Onshape", "AutoCAD", "Fusion 360"],
  },
  {
    category: "Fabrication",
    items: ["3D Printing (FDM/SLA)", "Laser Cutting", "PCB Layout", "Soldering"],
  },
  {
    category: "Embedded & EE",
    items: ["STM32", "Arduino", "Raspberry Pi", "I²C / SPI / UART", "Oscilloscopes"],
  },
  {
    category: "Software & Tools",
    items: ["Git", "Linux", "FreeRTOS", "NumPy / SciPy", "VS Code"],
  },
  {
    category: "Engineering Methods",
    items: ["FEA", "Signal Processing", "Agile / Scrum", "Systems Design"],
  },
];

// ============================================================
//  LAYOUT — No need to edit below unless changing the design
// ============================================================

function NavDot({ label, target }) {
  return (
    <a
      href={target}
      className="text-xs font-mono text-slate-500 hover:text-amber-400 transition-colors tracking-widest uppercase"
    >
      {label}
    </a>
  );
}

function Tag({ label, color }) {
  return (
    <span
      className="text-xs font-mono px-2 py-0.5 rounded-sm border"
      style={{
        color: color || "#F59E0B",
        borderColor: (color || "#F59E0B") + "44",
        background: (color || "#F59E0B") + "11",
      }}
    >
      {label}
    </span>
  );
}

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-lg border border-slate-700 bg-slate-800/60 p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer group overflow-hidden"
      style={{
        boxShadow: hovered ? `0 0 32px ${project.accent}22` : "none",
        borderColor: hovered ? project.accent + "55" : undefined,
      }}
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 h-0.5 transition-all duration-500"
        style={{
          background: project.accent,
          width: hovered ? "100%" : "2.5rem",
        }}
      />

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-1">
            {project.category} · {project.year}
          </p>
          <h3 className="text-lg font-semibold text-slate-100 leading-snug">
            {project.icon} {project.title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 pt-2">
        {project.tags.map((t) => (
          <Tag key={t} label={t} color={project.accent} />
        ))}
      </div>
    </div>
  );
}

function SkillGroup({ group }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-mono text-amber-400 tracking-widest uppercase border-b border-slate-700 pb-1 mb-1">
        {group.category}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.items.map((item) => (
          <span
            key={item}
            className="text-sm text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1 rounded-sm font-mono hover:border-amber-400/50 hover:text-amber-300 transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [activeProjectId, setActiveProjectId] = useState(null);

  if (activeProjectId) {
    return (
      <ProjectDetailPage 
        projectId={activeProjectId} 
        onBack={() => {
          setActiveProjectId(null);
          setTimeout(() => {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }, 50);
        }} 
        onNavigate={setActiveProjectId} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Space+Mono:wght@400;700&display=swap');
        html { scroll-behavior: smooth; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }
        .fade-up-5 { animation-delay: 0.7s; opacity: 0; }
        .grid-bg {
          background-image:
            linear-gradient(rgba(248,180,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,180,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <span className="font-mono text-sm text-amber-400 font-bold tracking-wider">
          {META.name.split(" ")[0].toUpperCase()}.{META.name.split(" ")[1][0]}
        </span>
        <div className="flex items-center gap-6">
          <NavDot label="Projects" target="#projects" />
          <NavDot label="Skills" target="#skills" />
          <NavDot label="Contact" target="#contact" />
          <a
            href={META.resumeUrl}
            className="font-mono text-xs px-4 py-1.5 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 transition-all duration-200 rounded-sm font-bold tracking-wider"
          >
            RÉSUMÉ ↗
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-32 pt-24 pb-16 grid-bg overflow-hidden"
      >
        <div
          className="absolute top-1/3 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-3xl">
            <h1 className="font-mono text-5xl md:text-7xl font-bold text-slate-100 leading-none mb-2 fade-up fade-up-2">
              {META.name}
            </h1>

            <h2 className="text-2xl md:text-3xl font-light text-slate-400 mb-6 fade-up fade-up-3">
              {META.tagline}
            </h2>

            <div className="flex flex-wrap gap-3 mb-8 fade-up fade-up-4">
              {META.focus.map((f) => (
                <span
                  key={f}
                  className="font-mono text-xs px-3 py-1 border border-amber-400/40 text-amber-300 rounded-sm tracking-wide"
                >
                  {f}
                </span>
              ))}
            </div>

            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-2xl mb-10 fade-up fade-up-5">
              {META.bio}
            </p>

            <div className="flex flex-wrap gap-4 fade-up fade-up-5">
              <a
                href="#projects"
                className="px-6 py-3 bg-amber-400 text-slate-900 font-semibold rounded-sm hover:bg-amber-300 transition-all text-sm"
              >
                View My Work ↓
              </a>
              <a
                href="#contact"
                className="px-6 py-3 border border-slate-600 text-slate-300 rounded-sm hover:border-slate-400 transition-all text-sm"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 justify-end items-center fade-up fade-up-3 mr-4 xl:mr-12">
            <div className="w-64 h-64 lg:w-80 lg:h-80 xl:w-[400px] xl:h-[400px] rounded-full overflow-hidden border border-slate-700/50 shadow-[0_0_60px_-15px_rgba(245,158,11,0.2)] relative group">
              <img 
                src="/profile.jpg" 
                alt={`${META.name} Profile`}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber-400/10 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <div className="w-px h-10 bg-slate-600 animate-pulse" />
          <span className="font-mono text-xs text-slate-600">scroll</span>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="px-6 md:px-20 lg:px-32 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-amber-400" />
            <p className="font-mono text-xs text-amber-400 tracking-widest uppercase">
              Projects & Experience
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 mb-3">
            What I've Built
          </h2>
          <p className="text-slate-500 mb-12 max-w-xl">
            Each project lives at the intersection of hardware constraints and software solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setActiveProjectId(p.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="px-6 md:px-20 lg:px-32 py-24 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-amber-400" />
            <p className="font-mono text-xs text-amber-400 tracking-widest uppercase">
              Skills Matrix
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-slate-100 mb-3">
            Tools & Technologies
          </h2>
          <p className="text-slate-500 mb-12 max-w-xl">
            A quick-scan overview of what I work with daily.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SKILLS.map((group) => (
              <SkillGroup key={group.category} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 md:px-20 lg:px-32 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-amber-400" />
            <p className="font-mono text-xs text-amber-400 tracking-widest uppercase">
              Contact
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-slate-100 leading-tight mb-4">
                Let's build<br />
                <span className="text-amber-400">something together.</span>
              </h2>
              <p className="text-slate-400 max-w-md">
                I'm available for Summer 2026 co-op starting May. Reach out — I'm quick to respond.
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `mailto:${META.emailUser}@${META.emailDomain}`;
                }}
                className="font-mono mt-4 inline-block text-sm text-amber-300 hover:text-amber-400 transition-colors underline underline-offset-4 cursor-pointer"
              >
                {META.emailUser}<span className="hidden">ignore-</span>@{META.emailDomain}
              </a>
            </div>

            <div className="flex flex-col gap-3 min-w-48">
              <a
                href={META.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 border border-slate-700 hover:border-slate-500 rounded-sm text-slate-300 hover:text-slate-100 transition-all text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
                <span className="ml-auto text-slate-600">↗</span>
              </a>

              <a
                href={META.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 border border-slate-700 hover:border-slate-500 rounded-sm text-slate-300 hover:text-slate-100 transition-all text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
                <span className="ml-auto text-slate-600">↗</span>
              </a>

              <a
                href={META.resumeUrl}
                className="flex items-center gap-3 px-5 py-3 bg-amber-400 hover:bg-amber-300 rounded-sm text-slate-900 font-semibold transition-all text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Résumé
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 px-6 md:px-20 lg:px-32 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-xs text-slate-600">
          © {new Date().getFullYear()} {META.name} · Mechatronics Engineering
        </span>
        <span className="font-mono text-xs text-slate-700">
          Built with React · Tailwind CSS
        </span>
      </footer>
    </div>
  );
}
