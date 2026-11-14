---
title: 3D Autonomous Drone Swarm Simulation
date: 2026-04-01
endDate: 2026-09-01
ongoing: false
summary: Multi-agent drone swarm in PyBullet and ROS 2 Humble with cascaded PID control and potential-field collision avoidance.
role: ""
tags: [Python, ROS 2, PyBullet, control systems]
cover: ""
coverAlt: ""
gallery: []
links: []
featured: true
draft: false
overview: |
  TODO (placeholder write-up): everything below except the first two paragraphs is scaffolding. Replace it in /admin.

  A 3D autonomous drone swarm simulation built with PyBullet and ROS 2 Humble to model multi-agent robotic systems and validate motor-control logic.

  Each drone uses cascading PID controllers, and artificial potential fields handle collision avoidance for motion planning.
problem: |
  TODO: what the simulation needed to show, number of agents, performance targets.
approach: |
  TODO: controller structure and how the potential field is combined with the PID setpoints.

  _Formatting examples (delete these):_ inline math like $u(t) = K_p e(t) + K_i \int_0^t e(\tau)\,d\tau + K_d \dot e(t)$, display math:

  $$
  \mathbf{F}_\text{rep} = \eta \left(\frac{1}{\rho} - \frac{1}{\rho_0}\right) \frac{1}{\rho^2} \nabla \rho, \quad \rho \le \rho_0
  $$

  and a code block:

  ```python
  def pid_step(err, state, kp, ki, kd, dt):
      state.integral += err * dt
      deriv = (err - state.prev) / dt
      state.prev = err
      return kp * err + ki * state.integral + kd * deriv
  ```
build: |
  TODO: ROS 2 node/topic layout, simulation setup.
testing: |
  TODO: plots of tracking error, collision counts, tuning results.
differently: |
  TODO
---
