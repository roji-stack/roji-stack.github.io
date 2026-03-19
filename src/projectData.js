export const projectData = {
  "smart-knee-brace": {
    id: "smart-knee-brace",
    title: "Smart Knee Brace",
    type: "Biomedical",
    typeColor: "#F59E0B",
    timeline: "Sep 2025 – March 2026",
    status: "Completed",
    tagline: "Smart rehabilitation wearable that monitors muscle activation and gait to provide predictive recovery timelines for ACL injuries based on healthy-leg data.",
    heroGradient: "from-amber-950/40 via-slate-900 to-slate-950",
    accentColor: "#F59E0B",
    accentDim: "rgba(245,158,11,0.12)",

    sidebar: {
      tools: [
        { name: "Onshape", icon: "box" },
        { name: "Ansys Mechanical", icon: "layers" },
        { name: "C++ / Arduino", icon: "fileCode" },
        { name: "ESP32", icon: "cpu" },
        { name: "Bluetooth LE", icon: "activity" },
        { name: "3D Printing (SLA)", icon: "box" },
      ],
      roles: ["Mechanical Team Member"],
    },

    challenge: {
      headline: "Quantifying Recovery",
      body: `Rehabilitation is often a guessing game for patients — a lack of objective data makes it difficult to gauge progress and know when it's safe to return to normal activities. This uncertainty can lead to overexertion or undertreatment, both of which can impede recovery. Our challenge was to design a system that could provide patients with real-time feedback on their recovery progress and help them make informed decisions about their rehabilitation.`,
    },

    implementation: {
      headline: "Integrated Electromechanical Sensing Suite",
      blocks: [
        {
          id: "cad",
          label: "CAD & Physical Interaction",
          icon: "box",
          description:
            "The mechanical architecture was developed in Onshape to integrate a dual-axis polycentric hinge with a custom-engineered electronics chassis. The CAD model features dedicated modular enclosures for Arduino Nano microcontrollers and custom EMG PCBs, ensuring sensor alignment with the limb’s longitudinal axis. The assembly utilizes a cuff system designed to maintain constant electrode-to-skin contact for EMG placement throughout the full range of motion.",
          visual: {
            type: "image",
            caption: "Polycentric hinge assembly — custom PLA-CF enclosures with integrated sensor mounts",
            content: "/iso_knee_brace.png",
          },
        },
        {
          id: "materials",
          label: "Material Optimization & Biocompatibility",
          icon: "layers",
          description:
            "To ensure structural integrity and signal reliability, a multi-material FDM architecture was implemented. Load-bearing hinges and electronics enclosures were printed in PLA-Carbon Fiber (PLA-CF) for high specific stiffness, shielding the internal microcontrollers and PCBs from mechanical deformation. The modular cuffs utilize TPU 90A/95A printed via AMS to provide a conformable interface that maintains electrode-to-skin contact. Internal contact surfaces are lined with a neoprene-silicone composite, providing a high-friction, biocompatible barrier that prevents brace migration during leg flexion.",
          visual: {
            type: "image",
            caption: "Von Mises stress map — peak stress localised at medial pivot boss",
            content: "/knee_brace_placeholder.jpg",
          },
        },
        {
          id: "firmware",
          label: "Embedded Firmware Pipeline",
          icon: "cpu",
          description:
            "A distributed processing pipeline utilizes Arduino Nano microcontrollers for high-frequency IMU and EMG data acquisition. Custom-designed PCBs handle analog signal conditioning for muscle activation tracking, with real-time telemetry transmitted via Bluetooth to a Python-driven backend. The system integrates a React-based frontend to visualize gait metrics and recovery progress, providing clinicians with an intuitive, data-driven rehabilitation interface.",
          visual: {
            type: "gif",
            caption: "Live telemetry dashboard: Knee kinematics and muscle activation tracking",
            content: "/GUI_Knee_Brace.gif",
          },
        },
      ],
    },

    timelineSteps: [
      { phase: "Problem Definition & Conceptualization", duration: "4 wks", status: "done", detail: "Brainstorming solutions for the recovery challenge, defining mechatronic requirements, and identifying market gaps." },
      { phase: "Alpha Prototyping & Electrical Benchmarking", duration: "6 wks", status: "done", detail: "Developing rudimentary 3D-printed housing to facilitate early sensor integration and basic software development (EMG/IMU acquisition)." },
      { phase: "Iterative Design & Market Analysis", duration: "10 wks", status: "done", detail: "Continuous refinement of the polycentric hinge and cuff ergonomics. Research-driven mechanical updates and software optimization." },
      { phase: "Competition Technical Documentation", duration: "4 wks", status: "done", detail: "Compiling research findings, design decisions, and system architecture for the mid-project milestone report (Dec/Jan)." },
      { phase: "Systems Integration & Final Validation", duration: "4 wks", status: "done", detail: "Final hardware-software handshakes, aesthetic tweaks to the PLA-CF enclosures, and preparation for the final pitch." },
    ],

    results: [
      { metric: "1.2kN", label: "Load Capacity", sub: "simulated peak stance-phase loading", icon: "shield", color: "#F59E0B" },
      { metric: "<850g", label: "Total System Mass", sub: "including integrated PCBs and battery", icon: "activity", color: "#34D399" },
      { metric: ">90%", label: "Signal Correlation", sub: "EMG activation vs. joint angle mapping", icon: "zap", color: "#60A5FA" },
      { metric: "<50ms", label: "System Latency", sub: "end-to-end data telemetry", icon: "cpu", color: "#C084FC" },
    ],
  },


};
