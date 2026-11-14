---
title: 3D Autonomous Drone Swarm Simulation
date: 2026-04-01
endDate: 2026-09-01
ongoing: false
summary: Three simulated quadcopters flying a V-formation in PyBullet, with hand-written cascaded PID control, potential-field collision avoidance and a ROS 2 node layout.
role: ""
tags: [Python, ROS 2, PyBullet, control systems]
cover: /src/assets/media/drone-swarm-v-formation-tracking.png
coverAlt: Four plots of a three-drone V-formation run, showing X, Y and altitude tracking over 15 seconds for the leader and two followers, plus the XY flight paths.
gallery: []
links:
  - label: Source on GitHub (FireSwarm)
    url: https://github.com/roji-stack/FireSwarm
featured: true
draft: false
overview: |
  FireSwarm is a multi-quadcopter simulation built on PyBullet and `gym-pybullet-drones`, using the Crazyflie 2.x (CF2X) model. Instead of the library's built-in controllers, every drone runs my own cascaded PID loops, from position down to individual motor RPMs. A leader flies a figure-eight while two followers hold a V-formation behind it, and an artificial potential field keeps them from colliding. The same control code is also split into a ROS 2 workspace with separate simulation, trajectory and control nodes.

  ![PyBullet simulation of three small quadcopters over a checkered floor, flying in formation and leaving thin coloured flight trails behind them](/src/assets/media/drone-swarm-sim.mp4 "The V-formation demo running in PyBullet (portfolio_showcase.py). Trails show each drone's path over the last 10 seconds.")
problem: |
  The goal was to model a multi-agent robotic system and validate motor-control logic in simulation before any hardware exists:

  - stable altitude hold and step response for a single drone, tuned analytically rather than by trial and error;
  - full 3D position control through attitude, so a drone can follow a moving setpoint;
  - several drones sharing airspace without colliding while holding a formation.

  TODO: add any other targets you set (formation spacing tolerance, maximum tracking error, number of agents you wanted to scale to).
approach: |
  ### Cascaded control

  Each drone runs two layers of PD control at 240 Hz (the integral gains are zero in the current version):

  | Loop | Input → output | Gains |
  |---|---|---|
  | Altitude (outer) | height error → thrust correction | $K_p = 1.2$ |
  | Position X/Y (outer) | position error → target pitch / roll, clipped to ±0.4 rad | $K_p = 0.2,\ K_d = 0.15$ |
  | Attitude (inner) | angle error → body torques ($\tau = J\,u$) | $K_p = 20,\ K_d = 5$ |

  The total thrust is the drone's weight as a feedforward term plus the altitude correction, divided by the tilt so that a banked drone doesn't lose height:

  $$
  T = \frac{mg + u_z}{\cos\phi\,\cos\theta}
  $$

  Thrust and torques are then split across the four motors with the standard quad-X mixing equations, and each motor force is converted to an RPM command using $F = k_F\,\omega^2$. The derivative term uses the measured velocity instead of differentiating the error, so a sudden setpoint change doesn't produce a derivative spike.

  ### Tuning the altitude loop

  With the weight cancelled by feedforward, the vertical dynamics reduce to a mass–spring–damper, $m\ddot z = K_p e - K_d \dot z$, so the damping ratio is

  $$
  \zeta = \frac{K_d}{2\sqrt{K_p\,m}}
  $$

  For the Crazyflie's $m = 0.027$ kg and $K_p = 1.2$, the starting value $K_d = 0.8$ gives $\zeta \approx 2.2$ (heavily overdamped). Critical damping needs $K_d = 2\sqrt{K_p m} = 0.36$.

  ![Altitude step response from 0.1 m to 2.0 m with Kp 1.2 and Kd 0.36, rising smoothly to the target in about one second with no overshoot](/src/assets/media/drone-altitude-step-response.png "Single-drone altitude step to 2.0 m with the critically damped gains (Kp = 1.2, Kd = 0.36): 0 % overshoot.")

  ### Formation and collision avoidance

  The leader follows a figure-eight, $x = 1.5\sin(0.8t)$, $y = 1.5\sin(1.6t)$, at 2 m altitude. Each follower's setpoint is a fixed offset of 0.8 m back and 0.8 m to one side of the leader's *measured* position, forming a V.

  Before the controllers run, each drone's XY setpoint is pushed away from any neighbour closer than $d_0 = 0.6$ m:

  $$
  \Delta\mathbf{p} = k_\text{rep}\left(\frac{1}{d} - \frac{1}{d_0}\right)\frac{1}{d^2}\,\hat{\mathbf{d}}, \qquad d < d_0,\quad k_\text{rep} = 0.5
  $$

  Distance is measured in the horizontal plane only, so drones sidestep each other instead of dodging up or down.
build: |
  - **Simulation:** `gym-pybullet-drones` `CtrlAviary` environment, PyBullet physics at 240 Hz, three CF2X drones spawned 1 m apart.
  - **Scripts:** `fly.py` (single-drone altitude step response), `fly_3d.py` (3D position control), `swarm.py` (independent altitude setpoints for three drones), `portfolio_showcase.py` (V-formation with collision avoidance and flight-trail rendering).
  - **ROS 2 workspace** (`ros2_swarm_ws`, package `swarm_sim`): a simulator node, a trajectory-planner node publishing the leader's path, and a control node running the PID loops for every drone, connected through topics.

  TODO: add a diagram of the ROS 2 nodes and topics.
testing: |
  **Single drone, altitude step to 2.0 m**, with the critically damped gains ($K_p = 1.2$, $K_d = 0.36$): 0 % overshoot, final altitude 2.00 m, settled in roughly 1.3 s (plot above).

  **Three-drone V-formation** over 15 s (the plots at the top of this page; solid lines are actual positions, dashed lines are targets):

  - **Altitude:** all three drones climb together and hold 2.0 m, settling in about 3–4 s. This run used the original $K_d = 0.8$, so it's the overdamped response, not the tuned one.
  - **X/Y tracking:** the drones follow the shape of their targets but lag behind them, and the followers overshoot on the lateral (Y) swings.
  - **Collision avoidance:** the brief spikes in the follower targets (around 6.5 s and 14.5 s) are the potential field pushing a setpoint away when two drones get within 0.6 m.

  TODO: confirm these readings of the plot, and add the tracking-error numbers if you computed them.
differently: |
  TODO: your own take. Possible starting points from the results above:

  - The swarm scripts still default to $K_d = 0.8$; the critically damped $K_d = 0.36$ was only applied in the single-drone tuning.
  - The position loops lag the moving setpoint. A velocity feedforward from the leader's trajectory, or a small integral term, could reduce that.
  - The repulsion modifies the setpoint in a single step, which shows up as spikes. Ramping it in, or adding it as a velocity term, could smooth it.
---
