---
title: ESP32 E-Paper Power Monitor
date: 2025-01-01
endDate: 2025-04-01
ongoing: false
summary: ESP32 voltage logger for a first-year design project that plots a 0–12 V supply over time on a 1.5-inch e-paper display.
role: Firmware
tags: [ESP32, C++, Arduino, e-paper, SPI]
cover: ""
coverAlt: ""
gallery: []
links:
  - label: Source on GitHub
    url: https://github.com/roji-stack/power-monitor
featured: false
draft: true
overview: |
  TODO (draft: this project isn't on your resume, so it's hidden from the live site until you untick "Draft" in /admin). Check the dates and add the team context.

  A power monitor built for the "Power" winter project in ES1050 at Western (2024–25), shown at the project showcase on April 1, 2025. I wrote the firmware: an ESP32 reads a supply voltage through a resistor divider and draws a live voltage-versus-time graph on a 200 × 200 black-and-white e-paper display, with four buttons for navigation.
problem: |
  TODO: what the device had to measure and why (the project brief), and any constraints from the course.
approach: |
  - **Display:** 1.5-inch, 200 × 200 e-paper panel (SSD1681 controller) on the ESP32's SPI bus, driven with the GxEPD2 library. E-paper keeps the graph visible without power and only draws current when it refreshes.
  - **Measurement:** the input (up to 12 V) is scaled down by a resistor divider with a ratio of 71.831 / 1071.831 into an ESP32 ADC pin, then converted back:

  ```cpp
  float voltageRead() {
    int rawReading = analogRead(ADC_PIN);
    float measuredVoltage = (rawReading / 4095.0) * 3.3;  // 12-bit ADC, 3.3 V reference
    return measuredVoltage / DIVIDER_RATIO;               // undo the divider
  }
  ```

  - **Graph:** a "Volts vs. Time" plot with a 0–12 V axis and a 30-minute window. A new point is drawn every five minutes, timed with `millis()`.
  - **Input:** four push buttons (up, right, down, left) with 50 ms software debouncing.
build: |
  TODO: photos of the hardware and the display showing a graph, the wiring, and the enclosure if there was one.
testing: |
  TODO: how you checked the readings (e.g. against a multimeter), and what happened at the showcase.
differently: |
  These are the limitations I documented in the project README:

  - **Noise:** the divider has no filtering capacitor, so the measurement error grows with the input voltage.
  - **Timekeeping:** `millis()` overflows after about 50 days, so the firmware was only meant for runs of a few hours, like the showcase.
  - **Data storage:** readings are drawn but not saved. I started storing them in a 2D array but didn't finish it.
  - **Power:** it could use much less energy by dropping the CPU to 80 MHz, using deep sleep between samples, reading the buttons with interrupts instead of polling, and turning off Wi-Fi and Bluetooth.
---
