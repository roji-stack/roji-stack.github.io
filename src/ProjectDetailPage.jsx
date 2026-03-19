import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Tag, CalendarDays, Wrench, UserCheck,
  ChevronRight, Zap, ShieldCheck, FlaskConical,
  Cpu, Layers, BarChart3, CheckCircle2, Circle,
  Clock, FileCode2, Box, Activity, AlertTriangle,
  Database, TrendingUp, Microscope,
} from "lucide-react";

import { projectData } from './projectData';

// ─────────────────────────────────────────────────────────────
//  SVG placeholder visuals (stand-ins for real images/renders)
// ─────────────────────────────────────────────────────────────
function SchematicPlaceholder({ accent }) {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" style={{ fontFamily: "monospace" }}>
      <rect width="320" height="180" fill="#0d1117" />
      <line x1="60" y1="90" x2="260" y2="90" stroke="#1e2d3d" strokeWidth="1" />
      <line x1="160" y1="30" x2="160" y2="150" stroke="#1e2d3d" strokeWidth="1" />
      {[40,80,120,160,200,240,280].map((x,i)=>(
        <line key={i} x1={x} y1="20" x2={x} y2="160" stroke="#ffffff06" strokeWidth="0.5"/>
      ))}
      {[30,60,90,120,150].map((y,i)=>(
        <line key={i} x1="20" y1={y} x2="300" y2={y} stroke="#ffffff06" strokeWidth="0.5"/>
      ))}
      <circle cx="80" cy="110" r="18" fill="none" stroke={accent} strokeWidth="1.5" />
      <circle cx="240" cy="70" r="18" fill="none" stroke={accent} strokeWidth="1.5" />
      <line x1="80" y1="92" x2="120" y2="75" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <line x1="120" y1="75" x2="200" y2="85" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <line x1="200" y1="85" x2="240" y2="88" stroke={accent} strokeWidth="1.5" opacity="0.7" />
      <circle cx="120" cy="75" r="4" fill={accent} opacity="0.9" />
      <circle cx="200" cy="85" r="4" fill={accent} opacity="0.9" />
      <text x="72" y="140" fill={accent} fontSize="8" opacity="0.7">A</text>
      <text x="232" y="45" fill={accent} fontSize="8" opacity="0.7">B</text>
      <text x="112" y="68" fill="#94a3b8" fontSize="7" opacity="0.6">coupler</text>
      <text x="8" y="175" fill="#475569" fontSize="7">KINEMATIC SCHEMATIC — FOUR-BAR LINKAGE</text>
    </svg>
  );
}

function HeatmapPlaceholder({ accent }) {
  const colors = ["#1a0a00","#3d1a00","#7c2d00","#b45309","#d97706","#f59e0b","#fcd34d","#fef08a"];
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full">
      <rect width="320" height="180" fill="#0d1117" />
      {Array.from({length:24}).map((_,row)=>
        Array.from({length:40}).map((_,col)=>{
          const cx=col*8+4, cy=row*7.5+4;
          const dist=Math.sqrt((cx-160)**2+(cy-90)**2);
          const idx=Math.min(7,Math.floor((1-Math.min(1,dist/130))*8));
          return <rect key={`${row}-${col}`} x={cx-3.5} y={cy-3} width="7" height="6.5" fill={colors[idx]} opacity={0.85}/>;
        })
      )}
      <ellipse cx="160" cy="90" rx="22" ry="18" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" strokeDasharray="3 2"/>
      <line x1="160" y1="72" x2="220" y2="45" stroke="white" strokeWidth="0.8" opacity="0.5"/>
      <text x="222" y="43" fill="white" fontSize="7" opacity="0.8">Max σ = 186 MPa</text>
      <rect x="270" y="15" width="12" height="130" fill="url(#grad)"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          {colors.slice().reverse().map((c,i)=><stop key={i} offset={`${i/7*100}%`} stopColor={c}/>)}
        </linearGradient>
      </defs>
      <text x="264" y="12" fill="#94a3b8" fontSize="6">High</text>
      <text x="264" y="154" fill="#94a3b8" fontSize="6">Low</text>
      <text x="8" y="175" fill="#475569" fontSize="7">VON MISES STRESS — ANSYS MECHANICAL (MPa)</text>
    </svg>
  );
}

function PipelinePlaceholder({ accent }) {
  const tasks = ["IMU_TASK\n200 Hz","CLASSIFIER\n_TASK","BLE_GATT\n_TASK","HAPTIC\n_TASK"];
  const priorities = ["HIGH","HIGH","MED","LOW"];
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full" style={{fontFamily:"monospace"}}>
      <rect width="320" height="180" fill="#0d1117"/>
      {tasks.map((t,i)=>(
        <g key={i}>
          <rect x={20+i*75} y="40" width="65" height="80" rx="3" fill="#0f1923" stroke={accent} strokeWidth="1" opacity={i===0?1:0.5}/>
          <rect x={20+i*75} y="40" width="65" height="14" rx="3" fill={accent} opacity={i===0?0.25:0.1}/>
          <text x={52+i*75} y="51" fill={accent} fontSize="6.5" textAnchor="middle" opacity={i===0?1:0.6}>{priorities[i]}</text>
          {t.split("\n").map((line,li)=>(
            <text key={li} x={52+i*75} y={72+li*12} fill="#cbd5e1" fontSize="6.5" textAnchor="middle" opacity={i===0?1:0.6}>{line}</text>
          ))}
          {i<tasks.length-1&&<line x1={85+i*75} y1="80" x2={95+i*75} y2="80" stroke="#475569" strokeWidth="1" markerEnd="url(#arr)"/>}
        </g>
      ))}
      <defs>
        <marker id="arr" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="#475569"/>
        </marker>
      </defs>
      <rect x="20" y="135" width="280" height="16" rx="2" fill="#0f1923" stroke="#1e2d3d" strokeWidth="1"/>
      <rect x="20" y="135" width="210" height="16" rx="2" fill={accent} opacity="0.15"/>
      <text x="160" y="147" fill={accent} fontSize="7" textAnchor="middle">FreeRTOS Scheduler — Preemptive Priority</text>
      <text x="8" y="175" fill="#475569" fontSize="7">FIRMWARE TASK ARCHITECTURE — STM32F4</text>
    </svg>
  );
}

function WaveformPlaceholder({ accent }) {
  const w=320, h=180, mid=90, amp=30;
  const healthyPts = Array.from({length:200},(_,i)=>{
    const x=i/199*280+20;
    const y=mid+Math.sin(i*0.18)*amp*0.9+Math.sin(i*0.37)*amp*0.2;
    return `${x},${y}`;
  }).join(" ");
  const faultyPts = Array.from({length:200},(_,i)=>{
    const x=i/199*280+20;
    const spike=i>100&&i<130?Math.sin((i-100)*0.5)*amp*1.6:0;
    const y=mid+Math.sin(i*0.18)*amp*0.85+Math.sin(i*0.37)*amp*0.3+spike+(Math.random()-0.5)*4;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <rect width={w} height={h} fill="#0d1117"/>
      {[40,70,90,110,140].map(y=><line key={y} x1="20" y1={y} x2="300" y2={y} stroke="#ffffff06" strokeWidth="0.5"/>)}
      <polyline points={healthyPts} fill="none" stroke="#34d399" strokeWidth="1.2" opacity="0.7"/>
      <polyline points={faultyPts} fill="none" stroke={accent} strokeWidth="1.2" opacity="0.9"/>
      <rect x="130" y="48" width="40" height="78" fill="red" opacity="0.07"/>
      <text x="150" y="44" fill="red" fontSize="7" textAnchor="middle" opacity="0.8">anomaly</text>
      <text x="40" y="170" fill="#34d399" fontSize="7" opacity="0.8">── healthy</text>
      <text x="110" y="170" fill={accent} fontSize="7" opacity="0.8">── fault signature</text>
      <text x="8" y="178" fill="#475569" fontSize="6">10 kHz WAVEFORM CAPTURE — DC BUS (200 ms window)</text>
    </svg>
  );
}

function EnclosurePlaceholder({ accent }) {
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full">
      <rect width="320" height="180" fill="#0d1117"/>
      <rect x="60" y="25" width="200" height="130" rx="6" fill="#111827" stroke={accent} strokeWidth="1.5" opacity="0.9"/>
      <rect x="60" y="25" width="200" height="20" rx="6" fill={accent} opacity="0.15"/>
      <rect x="60" y="35" width="200" height="10" fill={accent} opacity="0.08"/>
      <line x1="60" y1="45" x2="260" y2="45" stroke={accent} strokeWidth="0.8" opacity="0.5"/>
      <rect x="80" y="60" width="50" height="70" rx="2" fill="#0a0f1a" stroke="#1e2d3d" strokeWidth="1"/>
      <rect x="145" y="60" width="80" height="70" rx="2" fill="#0a0f1a" stroke="#1e2d3d" strokeWidth="1"/>
      {[0,1,2,3].map(i=><circle key={i} cx={90+i*10} cy={95} r="3" fill={accent} opacity={0.6-i*0.1}/>)}
      <rect x="155" y="70" width="60" height="8" rx="1" fill={accent} opacity="0.2"/>
      <rect x="155" y="84" width="40" height="8" rx="1" fill="#475569" opacity="0.4"/>
      <rect x="155" y="98" width="50" height="8" rx="1" fill="#475569" opacity="0.4"/>
      <rect x="155" y="112" width="35" height="8" rx="1" fill="#475569" opacity="0.4"/>
      <rect x="65" y="150" width="190" height="4" rx="2" fill="#1e2d3d"/>
      <rect x="100" y="148" width="20" height="8" rx="1" fill="#0f1923" stroke="#1e2d3d" strokeWidth="1"/>
      <text x="8" y="178" fill="#475569" fontSize="7">SOLIDWORKS ENCLOSURE — IP54 DIN-RAIL (EXPLODED VIEW)</text>
    </svg>
  );
}

function NvmDiagramPlaceholder({ accent }) {
  const steps=[{l:"ADC\nDetect",x:30},{l:"ISR\nFlag",x:95},{l:"RTOS\nQueue",x:160},{l:"NVM\nWrite",x:225},{l:"MQTT\nPublish",x:290}];
  return (
    <svg viewBox="0 0 340 180" className="w-full h-full" style={{fontFamily:"monospace"}}>
      <rect width="340" height="180" fill="#0d1117"/>
      {steps.map((s,i)=>(
        <g key={i}>
          <rect x={s.x-25} y="65" width="50" height="50" rx="4" fill="#0f1923" stroke={accent} strokeWidth={i===3?1.5:0.7} opacity={i===3?1:0.6}/>
          {s.l.split("\n").map((line,li)=>(
            <text key={li} x={s.x} y={84+li*13} fill={i===3?accent:"#94a3b8"} fontSize="7.5" textAnchor="middle">{line}</text>
          ))}
          {i<steps.length-1&&<>
            <line x1={s.x+25} y1="90" x2={steps[i+1].x-25} y2="90" stroke="#1e2d3d" strokeWidth="1.2"/>
            <polygon points={`${steps[i+1].x-25},87 ${steps[i+1].x-19},90 ${steps[i+1].x-25},93`} fill="#1e2d3d"/>
          </>}
          <text x={s.x} y="128" fill="#475569" fontSize="6" textAnchor="middle">{i===0?"<1µs":i===1?"<2µs":i===2?"<10µs":i===3?"<50µs":"async"}</text>
        </g>
      ))}
      <text x="200" y="35" fill={accent} fontSize="8" textAnchor="middle" opacity="0.9">← target: commit before power collapse →</text>
      <line x1="60" y1="40" x2="310" y2="40" stroke={accent} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2"/>
      <text x="8" y="175" fill="#475569" fontSize="7">NVM WRITE PIPELINE — LATENCY BUDGET (µs)</text>
    </svg>
  );
}

function VisualBlock({ type, accent, caption, content }) {
  const visuals = {
    schematic: <SchematicPlaceholder accent={accent} />,
    heatmap:   <HeatmapPlaceholder   accent={accent} />,
    pipeline:  <PipelinePlaceholder  accent={accent} />,
    waveform:  <WaveformPlaceholder  accent={accent} />,
    render:    <EnclosurePlaceholder accent={accent} />,
    diagram:   <NvmDiagramPlaceholder accent={accent} />,
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded-md overflow-hidden border border-slate-700/60" style={{ aspectRatio:"16/9", backgroundColor: "#0f172a" }}>
        {visuals[type] || (
          type === 'image' && content ? (
            <div className="absolute inset-0 flex items-center justify-center scanlines" style={{ background: `linear-gradient(135deg, ${accent}18 0%, #0f172a 55%)` }}>
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`circuit-img-${accent.replace('#', '')}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M10 10 H30 V30 H50" fill="none" stroke={accent} strokeWidth="0.5"/>
                    <circle cx="10" cy="10" r="1.5" fill={accent}/>
                    <circle cx="50" cy="30" r="1.5" fill={accent}/>
                    <path d="M0 50 H20 V40 H60" fill="none" stroke={accent} strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#circuit-img-${accent.replace('#', '')})`}/>
              </svg>
              <img src={content} alt={caption} className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl" style={{ filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.8))" }} />
            </div>
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600 text-sm">[Visual]</div>
          )
        )}
      </div>
      <p className="text-xs text-slate-500 font-mono leading-tight">{caption}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Icon resolver
// ─────────────────────────────────────────────────────────────
function BlockIcon({ name, className }) {
  const map = { box:<Box className={className}/>, layers:<Layers className={className}/>, fileCode:<FileCode2 className={className}/>, cpu:<Cpu className={className}/>, activity:<Activity className={className}/>, database:<Database className={className}/> };
  return map[name] || <Wrench className={className}/>;
}
function ResultIcon({ name, className }) {
  const map = { shield:<ShieldCheck className={className}/>, activity:<Activity className={className}/>, zap:<Zap className={className}/>, cpu:<Cpu className={className}/>, database:<Database className={className}/>, trending:<TrendingUp className={className}/>, box:<Box className={className}/> };
  return map[name] || <BarChart3 className={className}/>;
}

// ─────────────────────────────────────────────────────────────
//  Timeline Step Component
// ─────────────────────────────────────────────────────────────
function TimelineStep({ step, index, total, accent }) {
  const isDone     = step.status === "done";
  const isActive   = step.status === "active";
  const isUpcoming = step.status === "upcoming";
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 cursor-pointer group" onClick={() => setOpen(o => !o)}>
      {/* Track */}
      <div className="flex flex-col items-center gap-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 border"
          style={{
            background: isDone ? accent : isActive ? accent + "22" : "transparent",
            borderColor: isDone ? accent : isActive ? accent : "#334155",
            boxShadow: isActive ? `0 0 14px ${accent}55` : "none",
          }}
        >
          {isDone
            ? <CheckCircle2 size={14} color="#0f1923" strokeWidth={2.5} />
            : isActive
            ? <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: accent }} />
            : <Circle size={14} color="#334155" />}
        </div>
        {index < total - 1 && (
          <div className="w-px flex-1 min-h-6 mt-1" style={{ background: isDone ? accent + "55" : "#1e293b" }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-sm font-semibold transition-colors"
            style={{ color: isDone ? "#e2e8f0" : isActive ? accent : "#64748b" }}
          >
            {step.phase}
          </span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-sm"
            style={{
              color: isDone ? accent : isActive ? accent : "#475569",
              background: isDone ? accent + "15" : isActive ? accent + "15" : "#0f172a",
              border: `1px solid ${isDone ? accent + "33" : isActive ? accent + "44" : "#1e293b"}`,
            }}>
            {step.duration}
          </span>
          {isActive && (
            <span className="font-mono text-xs text-sky-400 animate-pulse">● ACTIVE</span>
          )}
        </div>
        <div
          className="mt-2 text-xs text-slate-500 leading-relaxed overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? "80px" : "0px", opacity: open ? 1 : 0 }}
        >
          {step.detail}
        </div>
        {!open && (
          <p className="mt-1 text-xs text-slate-600 group-hover:text-slate-500 transition-colors flex items-center gap-1">
            <ChevronRight size={10} /> tap to expand
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Animated counter
// ─────────────────────────────────────────────────────────────
function AnimatedMetric({ value }) {
  const [displayed, setDisplayed] = useState("—");
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setDisplayed(value); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{displayed}</span>;
}

// ─────────────────────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────────────────────
export default function ProjectDetailPage({ projectId, onBack, onNavigate }) {
  const projectIds = Object.keys(projectData);
  const activeId = projectId || "smart-knee-brace";
  const project = projectData[activeId];
  const accent = project.accentColor;

  // Scroll to top on project switch
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [activeId]);

  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#0f172a",
      }}
    >
      <style>{`
        
        :root { --accent: ${accent}; }
        
        html { scroll-behavior: smooth; }
        @keyframes fadeSlide {
          from { opacity:0; transform: translateY(16px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .page-enter { animation: fadeSlide 0.5s ease forwards; }
        .scanlines::before {
          content:'';
          position:absolute;
          inset:0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);
          pointer-events:none;
          z-index:1;
        }
        .glow-border { box-shadow: 0 0 0 1px ${accent}44, 0 0 24px ${accent}18; }
      `}</style>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-3 border-b border-slate-800/60"
        style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)" }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-amber-400 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Projects
        </button>

        {/* Project switcher — simulates dynamic routing */}
        <div className="flex items-center gap-1 rounded-md p-0.5" style={{ background: "#0e1520", border: "1px solid #1e293b" }}>
          {projectIds.map(id => (
            <button
              key={id}
              onClick={() => onNavigate && onNavigate(id)}
              className="font-mono text-xs px-3 py-1.5 rounded-sm transition-all duration-200 cursor-pointer"
              style={activeId === id
                ? { background: accent + "20", color: accent, border: `1px solid ${accent}44` }
                : { color: "#64748b", border: "1px solid transparent" }}
            >
              {id === "smart-knee-brace" ? "Knee Brace" : "Power Analyzer"}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-slate-600 hidden md:block">
          {project.status === "Completed"
            ? <span className="text-emerald-500">● COMPLETE</span>
            : <span style={{ color: accent }}>● IN PROGRESS</span>}
        </span>
      </nav>

      <div key={activeId} className="page-enter">

        {/* ── HERO HEADER ── */}
        <header
          className="relative overflow-hidden scanlines px-6 md:px-16 pt-14 pb-16"
          style={{ background: `linear-gradient(135deg, ${accent}18 0%, #0f172a 55%)` }}
        >
          {/* Decorative circuit lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M10 10 H30 V30 H50" fill="none" stroke={accent} strokeWidth="0.5"/>
                <circle cx="10" cy="10" r="1.5" fill={accent}/>
                <circle cx="50" cy="30" r="1.5" fill={accent}/>
                <path d="M0 50 H20 V40 H60" fill="none" stroke={accent} strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>

          <div className="relative z-10 max-w-5xl mx-auto">
            {/* Type tag + timeline */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className="font-mono text-xs px-3 py-1 rounded-sm flex items-center gap-1.5 font-medium"
                style={{ background: accent + "20", color: accent, border: `1px solid ${accent}44` }}
              >
                <Tag size={10} /> {project.type}
              </span>
              <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5">
                <CalendarDays size={11} /> {project.timeline}
              </span>
            </div>

            <h1 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tight mb-4"
              style={{ color: "#f1f5f9", textShadow: `0 0 60px ${accent}30` }}>
              {project.title}
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed font-light">
              {project.tagline}
            </p>
          </div>
        </header>

        {/* ── BODY: sidebar + content ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── SIDEBAR ── */}
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">

              {/* Tools Used */}
              <div className="rounded-lg p-5 border border-slate-800" style={{ background: "#0b1220" }}>
                <h3 className="font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
                  style={{ color: accent }}>
                  <Wrench size={12} /> Tools Used
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {project.sidebar.tools.map(t => (
                    <li key={t.name} className="flex items-center gap-2.5 text-sm text-slate-300">
                      <BlockIcon name={t.icon} className="w-3.5 h-3.5 shrink-0" style={{ color: accent, opacity: 0.7 }} />
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>

              {/* My Role */}
              <div className="rounded-lg p-5 border border-slate-800" style={{ background: "#0b1220" }}>
                <h3 className="font-mono text-xs tracking-widest uppercase mb-4 flex items-center gap-2"
                  style={{ color: accent }}>
                  <UserCheck size={12} /> My Role
                </h3>
                <ul className="flex flex-col gap-2">
                  {project.sidebar.roles.map(r => (
                    <li key={r} className="text-sm text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline summary */}
              <div className="rounded-lg p-5 border border-slate-800" style={{ background: "#0b1220" }}>
                <h3 className="font-mono text-xs tracking-widest uppercase mb-2 flex items-center gap-2"
                  style={{ color: accent }}>
                  <Clock size={12} /> Timeline
                </h3>
                <p className="font-mono text-xs text-slate-400">{project.timeline}</p>
                <div className="mt-3 w-full rounded-full h-1.5 bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                      width: project.status === "Completed" ? "100%" : "70%",
                    }}
                  />
                </div>
                <p className="font-mono text-xs mt-1.5" style={{ color: accent + "cc" }}>
                  {project.status === "Completed" ? "100% complete" : "~70% complete"}
                </p>
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="flex-1 min-w-0 flex flex-col gap-16">

              {/* CHALLENGE */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle size={16} style={{ color: accent }} />
                  <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>
                    The Challenge
                  </h2>
                </div>
                <h3 className="text-2xl font-semibold text-slate-100 mb-4">{project.challenge.headline}</h3>
                <div className="border-l-2 pl-5" style={{ borderColor: accent + "44" }}>
                  {project.challenge.body.split("\n\n").map((para, i) => (
                    <p key={i} className="text-slate-400 leading-relaxed mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </section>

              {/* SOLUTION & IMPLEMENTATION */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical size={16} style={{ color: accent }} />
                  <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>
                    Solution & Implementation
                  </h2>
                </div>
                <h3 className="text-2xl font-semibold text-slate-100 mb-8">{project.implementation.headline}</h3>

                <div className="flex flex-col gap-12">
                  {project.implementation.blocks.map((block, i) => (
                    <div
                      key={block.id}
                      className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-8`}
                    >
                      {/* Text */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: accent + "20" }}>
                            <BlockIcon name={block.icon} className="w-3.5 h-3.5" style={{ color: accent }} />
                          </div>
                          <h4 className="font-mono text-sm font-semibold text-slate-200">{block.label}</h4>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{block.description}</p>
                      </div>

                      {/* Visual */}
                      <div className="flex-1 min-w-0">
                        <VisualBlock accent={accent} {...block.visual} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* INTERACTIVE TIMELINE */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Microscope size={16} style={{ color: accent }} />
                  <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>
                    Project Timeline
                  </h2>
                </div>
                <h3 className="text-2xl font-semibold text-slate-100 mb-8">Development Phases</h3>

                <div className="pl-2">
                  {project.timelineSteps.map((step, i) => (
                    <TimelineStep
                      key={step.phase}
                      step={step}
                      index={i}
                      total={project.timelineSteps.length}
                      accent={accent}
                    />
                  ))}
                </div>
              </section>

              {/* RESULTS */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 size={16} style={{ color: accent }} />
                  <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>
                    Results & Impact
                  </h2>
                </div>
                <h3 className="text-2xl font-semibold text-slate-100 mb-8">By the Numbers</h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {project.results.map((r, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-5 border flex flex-col gap-2 transition-all duration-300 hover:scale-[1.02] group"
                      style={{
                        background: "#0b1220",
                        borderColor: "#1e293b",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = r.color + "55";
                        e.currentTarget.style.boxShadow = `0 0 20px ${r.color}18`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#1e293b";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <ResultIcon
                        name={r.icon}
                        className="w-4 h-4 mb-1"
                        style={{ color: r.color }}
                      />
                      <div className="font-mono text-2xl md:text-3xl font-bold leading-none" style={{ color: r.color }}>
                        <AnimatedMetric value={r.metric} />
                      </div>
                      <div className="text-sm font-semibold text-slate-200">{r.label}</div>
                      <div className="font-mono text-xs text-slate-500">{r.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Terminal-style close */}
                <div className="mt-10 rounded-lg p-4 border border-slate-800 font-mono text-xs text-slate-600"
                  style={{ background: "#080e18" }}>
                  <span style={{ color: accent }}>$</span> project status --id {project.id} --verbose
                  <br />
                  <span className="text-slate-500">→ status: </span>
                  <span style={{ color: project.status === "Completed" ? "#34d399" : accent }}>
                    {project.status.toUpperCase()}
                  </span>
                  {"  "}
                  <span className="text-slate-500">timeline: </span>
                  <span className="text-slate-400">{project.timeline}</span>
                  {"  "}
                  <span className="text-slate-500">metrics: </span>
                  <span className="text-slate-400">{project.results.length} key results recorded</span>
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-slate-400 align-middle animate-pulse" />
                </div>
              </section>

            </main>
          </div>
        </div>

        {/* ── FOOTER NAV ── */}
        <div className="border-t border-slate-800 px-6 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: "#080e18" }}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-sm border border-slate-700 text-slate-400 hover:border-amber-400/50 hover:text-amber-400 transition-all group cursor-pointer"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Projects
          </button>
          <span className="font-mono text-xs text-slate-700">
            {project.title} · {project.timeline}
          </span>
          {/* Jump to next */}
          <button
            onClick={() => onNavigate && onNavigate(projectIds.find(id => id !== activeId) || projectIds[0])}
            className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-sm border transition-all group cursor-pointer hover:bg-slate-800"
            style={{ borderColor: accent + "44", color: accent }}
          >
            Next Project
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}
