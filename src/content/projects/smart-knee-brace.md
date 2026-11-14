---
title: MustangMotion Smart Knee Brace
date: 2025-09-01
endDate: 2026-03-14
ongoing: false
summary: Wearable knee sleeve for TNBC 2025–26 that measures knee angle with two IMUs and quadriceps/hamstring activation with custom EMG boards, comparing the injured leg against the healthy one in a PC app.
role: Mechanical Team Member, WE-BMC
tags:
  - Arduino Nano 33 BLE
  - C++
  - EMG
  - BLE
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
overview: |-
  MustangMotion is the Western Engineering Biomedical Engineering Club's entry in the True North Biomedical Competition (TNBC) 2025–26: a "smart rehabilitation knee sleeve" for people recovering from ACL reconstruction. One sleeve on each leg measures knee angle with a pair of IMUs and muscle activation in the quadriceps and hamstrings with custom EMG boards, then streams everything over Bluetooth Low Energy to a PC app. The app shows the injured and healthy leg side by side and estimates how far the patient is from returning to sport.

  I was on the mechanical team and designed the polycentric hinge, the overall cuff shape and setup, as well as a portion of the electronic enclosures.
problem: |-
  Rehabilitation is often a guessing game for patients. Only about 55 % of athletes return to competitive sport after ACL reconstruction ([Ardern et al., 2014](https://doi.org/10.1136/bjsports-2013-093398)), and return-to-sport decisions still rest largely on subjective assessment. Without objective data it's hard to gauge progress and know when it's safe to return, and that uncertainty can lead to overexertion or undertreatment, both of which slow recovery.

  The competition brief framed this around one patient: a 21-year-old soccer player recovering from an ACL tear. The goal was a system that turns their recovery into something measurable: comparing the injured leg's strength, range of motion and activation patterns to the healthy leg, in real time and over the weeks of rehab. It supports physiotherapy rather than replacing it.

  ### Requirements

  | Requirement | Design response | How it's verified |
  |---|---|---|
  | Detect quadriceps and hamstring activation, proportional to force | 3-electrode EMG with an amplifier board per muscle group | Compare EMG signals while varying resistance on the muscle |
  | Measure knee range of motion, 0–180°, within ±3° | IMUs fixed above and below the knee | Compare IMU angle with a protractor |
  | Fit a thigh circumference of 24 ± 3 in | Adjustable strap and Velcro | Must hold firmly on printed thigh models from 21 to 27 in |
  | Real-time feedback from two sleeves on a PC, < 200 ms latency | Bluetooth Low Energy to a local app | Fully extend the knee and time the delay on screen |
  | Run for ≥ 1 h on battery (a physio session) | Two rechargeable 9 V, 1300 mAh batteries | Run with all sensors on until the app loses connection |
  | Patient data can't be intercepted | BLE with a specific service UUID | Sleeve must not be discoverable from a phone |
  | Total weight ≤ 5 lb | Carbon-fibre composite structure | Weigh the assembled device |
  | Skin contact biocompatible, smooth and sweat-resistant (ISO 10993) | Thin neoprene sheets | Slip test at 90° and a 1-hour water-absorption test |
  | Predict full-recovery date within 7 days (MAE) | Isolation Forest model | Compare predicted and actual dates on held-out cases |

  As a non-invasive monitoring device it would be a Health Canada Class I medical device, so the design was checked against the relevant standards, including IEC 60601-1 (electrical safety), ISO 10993 (biocompatibility) and ISO 14971 (risk management).
approach: |-
  The team used a two-phase prototyping process. **MK1** was a quick proof of concept: a two-piece TPU-printed cuff held on with Velcro, a sourced EMG module and an Arduino Nano 33 BLE Sense Rev2, to prove the sensing and attachment worked. **MK2** refined each subsystem: carbon-fibre PLA cuffs joined by a hinge, neoprene skin contact, a custom EMG board, and simpler IMU filtering.

  ### Mechanical

  Three housing concepts were compared: separate cuffs, a fabric sleeve with embedded electronics, and two cuffs connected by a hinge. The connected cuff scored highest (4.25 in the decision matrix) because the hinge holds the two IMUs at a fixed spacing, which keeps the measurements repeatable; separate cuffs could shift relative to each other. The fabric sleeve was the most comfortable and lightest option and was developed alongside the cuffs into MK2, but it fell short on manufacturability, and the printed design performed better.

  The structure was developed in Onshape: a hinge on each side of the knee, with dedicated enclosures for the microcontrollers and EMG boards that keep the sensors aligned with the limb.

  ![Exploded isometric CAD view of the brace, showing the cuffs, polycentric hinges, fasteners and the electronics enclosure](/src/assets/media/knee-brace-iso.png "Polycentric hinge assembly: custom PLA-CF enclosures with integrated sensor mounts.")

  In MK2 the cuffs were tapered to fit the calf better. FEA of the hinge under a worst-case cyclic load suggested machining it from aluminium instead of printing it in PLA. The electronics enclosure is PLA-CF, with brass heat-set inserts holding the PCB and a male–female feature mounting it to the cuff. A hollow TPU strap routes the wires internally and has button fasteners that give about 6 in of adjustment around the thigh; the lower cuff uses a Velcro strap.

  | Part | Material | Why |
  |---|---|---|
  | Cuffs, electronics enclosures | PLA-Carbon Fibre (PLA-CF) | High specific stiffness at low weight |
  | Thigh strap | TPU | Flexible, adjustable, and hollow for internal wiring |
  | Skin contact | Adhesive neoprene pads, with cut-outs for the EMG electrodes | Biocompatible, common in medical devices, cheap and available; scored highest (4.7) against a nylon composite |

  ### Muscle activation (EMG)

  The team compared EMG with force myography (FMG) and, after consulting Dr. Trejos at Western, chose EMG. The sourced EMG module was fast to integrate but its output was unstable and noisy, so the electrical team designed a custom board: an INA106 instrumentation amplifier followed by three TL072 op-amp stages for amplification, filtering and rectification. One board reads the quadriceps and one the hamstrings.

  ![Schematic of the EMG front end: an INA106 instrumentation amplifier followed by op-amp gain, filter and rectifier stages](/src/assets/media/knee-brace-emg-schematic.png "EMG board schematic: INA106 instrumentation amplifier, then TL072 stages for gain, filtering and rectification.")

  ![PCB layout of the EMG board, about 41 by 27 mm, with red top-layer traces](/src/assets/media/knee-brace-emg-pcb.png "EMG board layout (≈ 41 × 27 mm).")

  Each EMG board draws 16.5 mA and the Nano about 25 mA, so a sleeve draws 58 mA in total. On a 1300 mAh battery that's an estimated 22 hours, well past the one-hour requirement.

  ### Knee angle (IMU)

  Each cuff carries an Arduino Nano 33 BLE Sense Rev2, chosen for its size, built-in BLE and on-board IMU. The firmware uses 6-DoF Mahony sensor fusion (gyroscope and accelerometer only), leaving out the magnetometer because it added noise and overshoot. Knee angle is the difference in **pitch** between the upper and lower IMUs; in testing, pitch tracked the true angle better than roll. Zeroing the two sensors with the leg straight aligns their axes before a session.
build: |-
  ### Data flow

  The lower cuff's Nano (peripheral) sends its yaw, pitch and roll to the upper cuff's Nano (central) as BLE notifications. The central reads its own IMU, computes the knee angle, reads both EMG channels, and streams the combined data to the PC over BLE. On the PC, a FastAPI backend subscribes to the BLE characteristics and pushes updates to the frontend over a WebSocket.

  **Stack:** C++ (firmware), Python / FastAPI, React + Vite + TypeScript, Tailwind CSS, SQLite.

  ### The clinician's workflow

  The patient puts on both sleeves and powers them on with the legs straight, which calibrates and connects them. The clinician picks the patient and opens the *Live Session* screen: a 2D knee-angle view on the left, EMG activation for both muscle groups on the right, and controls to record the session.

  ![Screen recording of the web dashboard in a live session, showing knee-angle readout, quadriceps and hamstring EMG envelopes, and calibration controls](/src/assets/media/knee-brace-gui.gif "Live session screen: knee angle and quadriceps/hamstring EMG.")

  A *Recovery Outlook* screen then shows a 0–100 Recovery Index and an estimated time to 90 % symmetry between the legs. It comes from an Isolation Forest model trained on healthy movement data, which scores how far a session deviates from normal.

  ### Cost

  | Item | Qty | Cost (CAD) |
  |---|---|---|
  | Arduino Nano 33 BLE Sense Rev2 | 2 | $97.92 |
  | EMG PCB | 2 | $81.26 |
  | TPU filament | 600 g | $18.00 |
  | Rechargeable 9 V battery | 2 | $12.50 |
  | EMG cables / pads | 6 / 6 | $7.14 |
  | PLA filament | 250 g | $4.50 |
  | Velcro, neoprene pads | — | $4.00 |
  | **Total per device** | | **$225.31** |

  Both prototyping phases came in under the \$1,500 budget, with \$335.02 left over.
testing: |-
  ![A person wearing the brace on their leg bends and straightens the knee while a laptop on a chair shows the dashboard, whose knee-angle indicator moves with the leg](/src/assets/media/knee-brace-worn-test.mp4 "Worn test: the dashboard's knee-angle readout follows the leg as the knee bends and straightens.")

  ### Knee-angle accuracy

  The IMU angle was compared against a protractor while the joint was swept from 0° to 90° over one minute:

  ![Line chart comparing pitch, roll and protractor angles over a 0 to 90 degree sweep; pitch climbs steadily below the protractor line and meets it near 90 degrees, while roll stays flat, then overshoots above it](/src/assets/media/knee-brace-imu-angle-test.png "Pitch vs. roll vs. protractor, 0–90° sweep over one minute.")

  Pitch rose steadily with the protractor and ended near 90°, while roll stayed near zero for the first half and then overshot, which is why pitch was used for the knee angle. Through the middle of the sweep, pitch read noticeably below the protractor (by roughly 15–20° at the widest point), so the ±3° target wasn't met across the whole range in this test.

  ### EMG

  With constant flexion and relaxation, the custom EMG board showed clear activation and deactivation, while the sourced module's output was noisy and unstable (plots in Appendix I of the report).

  ### Risk analysis

  A DFMEA rated the design's risks. The highest risk priority number was 210 out of 1000. The top electrical risk was a wire coming loose inside the opaque enclosure (RPN 189), since it's hard to spot and exposes the 9 V system. The top mechanical risk was skin irritation or sweat at the neoprene and electrode contact.

  ### TNBC Placement

  MustangMotion secured 1st in the provincial standings, beating out Ontario universities such as McMaster, Toronto Metropolitan, and the University of Toronto, to name a few.

  We also placed 4th overall, behind the teams from Memorial University of Newfoundland, McGill, and the University of Manitoba, 1st, 2nd, and 3rd respectively.
differently: |-
  Starting points from the report:

  - The IMU pitch lagged the protractor mid-sweep; better calibration or fusion tuning could close the gap to the ±3° target.
  - The hinge FEA pointed to machining it in aluminium rather than printing it.
  - A loose wire inside the opaque enclosure was the top-rated risk; strain relief or a window to inspect the wiring would address it.
---
