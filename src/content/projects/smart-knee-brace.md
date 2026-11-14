---
title: MustangMotion Smart Knee Brace
date: 2025-09-01
endDate: 2026-03-14
ongoing: false
summary: Rehabilitation wearable that tracks muscle activation and gait to estimate ACL recovery progress against the patient's healthy leg.
role: Mechanical Team Member, WE-BMC
tags:
  - ESP32
  - C++
  - Onshape
  - SolidWorks
  - Ansys
  - 3D printing
  - biomedical
  - TNBC
cover: /src/assets/media/knee-brace-prototypes.jpg
coverAlt: Two wired knee brace prototypes on a table, with black printed frames and hinges, light-blue TPU cuffs, electronics enclosures and spare cuff pieces beside them.
gallery: []
links:
  - label: Final Report Submission
    url: /src/assets/media/TNBC 2025-26 Final Report Submission - WEBMC.pdf
featured: true
draft: false
overview: "A smart rehabilitation wearable that monitors muscle activation (EMG) and gait (IMU) and predicts a recovery timeline for ACL injuries, using the patient's healthy leg as the baseline. MustangMotion was our team's entry in the True North Biomedical Competition (TNBC), built with the Western Engineering Biomedical Engineering Club. I led the mechanical design: the polycentric hinge, the electronics enclosures and the cuff system."
problem: |-
  Rehabilitation is often a guessing game for patients. Without objective data it's hard to gauge progress and know when it's safe to return to normal activity, and that uncertainty can lead to overexertion or undertreatment, both of which slow recovery.

  The goal was a system that gives patients real-time feedback on their recovery and helps them make informed decisions about their rehabilitation.

  TODO: list the concrete requirements you designed to (range of motion, mass budget, battery life, sensor placement tolerances, competition constraints).
approach: |-
  ### CAD and physical interaction

  The mechanical architecture was developed in Onshape to integrate a dual-axis polycentric hinge with a custom electronics chassis. The model has dedicated modular enclosures for the microcontrollers and custom EMG PCBs, keeping the sensors aligned with the limb's longitudinal axis. A cuff system maintains constant electrode-to-skin contact for EMG placement through the full range of motion.

  ![Exploded isometric CAD view of the brace, showing the cuffs, polycentric hinges, fasteners and the electronics enclosure](/src/assets/media/knee-brace-iso.png "Polycentric hinge assembly: custom PLA-CF enclosures with integrated sensor mounts.")

  ### Materials

  A multi-material FDM architecture was used for structural integrity and signal reliability:

  | Part | Material | Why |
  |---|---|---|
  | Hinges, electronics enclosures | PLA-Carbon Fibre (PLA-CF) | High specific stiffness; shields the boards from deformation |
  | Modular cuffs | TPU 90A / 95A (printed via AMS) | Conforms to the leg to keep electrodes in contact |
  | Inner contact surfaces | Neoprene-silicone composite liner | High friction, biocompatible; stops the brace migrating during flexion |
build: |-
  ### Embedded firmware pipeline

  A distributed processing pipeline handles high-frequency IMU and EMG acquisition. Custom PCBs do the analog signal conditioning for muscle-activation tracking, and telemetry is sent over Bluetooth to a Python backend. A React frontend visualizes gait metrics and recovery progress.

  TODO: the previous site described the acquisition boards as Arduino Nanos in one place and an ESP32 in another (the resume says ESP32). Confirm which is used and fix this paragraph.

  ![Screen recording of the web dashboard in a live session, showing knee-angle readout, quadriceps and hamstring EMG envelopes, and calibration controls](/src/assets/media/knee-brace-gui.gif "Live telemetry dashboard: knee kinematics and muscle-activation tracking.")

  ### Timeline

  | Phase | Duration | Work |
  |---|---|---|
  | Problem definition & concept | 4 wks | Defined the recovery problem and mechatronic requirements; looked for gaps in existing products. |
  | Alpha prototype & electrical benchmarking | 6 wks | Rough 3D-printed housing for early sensor integration and basic EMG/IMU acquisition. |
  | Iterative design & market analysis | 10 wks | Refined the polycentric hinge and cuff ergonomics; mechanical and software updates. |
  | Competition documentation | 4 wks | Compiled findings, design decisions and system architecture for the mid-project report. |
  | Integration & final validation | 4 wks | Final hardware–software integration, enclosure refinements, pitch preparation. |
testing: |-
  ![A person wearing the brace on their leg bends and straightens the knee while a laptop on a chair shows the dashboard, whose knee-angle indicator moves with the leg](/src/assets/media/knee-brace-worn-test.mp4 "Worn test: the dashboard's knee-angle readout follows the leg as the knee bends and straightens.")

  | Metric | Result | Conditions |
  |---|---|---|
  | Load capacity | 1.2 kN | Simulated peak stance-phase loading |
  | Total system mass | < 850 g | Including integrated PCBs and battery |
  | Signal correlation | > 90 % | EMG activation vs. joint-angle mapping |
  | System latency | < 50 ms | End-to-end telemetry |

  TODO: add how MustangMotion placed at TNBC, if you want it here.

  TODO: describe how each number was measured: the Ansys load case and boundary conditions, the scale used for mass, how correlation and latency were computed. A plot or a screenshot of the FEA result would help here.
differently: "TODO: what you'd change in the next revision (mechanical, electrical or process)."
---
