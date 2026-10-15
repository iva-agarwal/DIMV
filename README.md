# 🔴 MARTIAN ID // Dept. of Interplanetary Motor Vehicles

	⁠*"How old are you actually?"*  
	⁠A hyper-aesthetic 3D web experience that converts your Earth age into interplanetary years and mints an interactive holographic driver's permit for Mars Colony 01.

---

## ⚡ The Concept

Earth takes 365.25 days to complete an orbit around the Sun. Mars takes 686.98.  
That means:
•⁠  ⁠A 24-year-old on Earth is *12.7 years old on Mars* (legally a teenager again).
•⁠  ⁠A 30-year-old on Earth is *15.9*.
•⁠  ⁠A 60-year-old on Earth is *31.9*.

*MARTIAN ID* takes your birth date and mints a tactile, holographic 3D identity card rendered inside a full WebGL studio environment.

---

## ✨ Features

•⁠  ⁠*Cinematic 2-Phase UX:* Starts on an ultra-minimalist monolithic terminal, triggers a camera warp jump, and resolves into an interactive 3D spotlight.
•⁠  ⁠*Three.js Physical Card:* Modeled with accurate credit card aspect ratios, smoked acrylic polycarbonate transmission, bevels, and procedural dynamic canvas textures.
•⁠  ⁠*Dynamic Holographic Sheen:* Iridescent foil reflections that shift and catch specular light as you tilt the card with your cursor or mobile gyroscope.
•⁠  ⁠*Procedural Soundscape:* Zero heavy MP3 assets—audio feedback (clicks, hums, and deep-space transition whooshes) is synthesized natively via the Web Audio API.
•⁠  ⁠*9:16 Social Export Engine:* Generates an editorial 1080×1920 Instagram/TikTok story card with one click using offscreen canvas composite rendering.

---

## 🛠️ Tech Stack

•⁠  ⁠*Graphics:* [Three.js](https://threejs.org/) (WebGL / Custom Shaders / ⁠ MeshPhysicalMaterial ⁠)
•⁠  ⁠*Animation & Physics:* Lerped vector interpolation + Spring physics
•⁠  ⁠*Audio:* Web Audio API (Synthesized oscillators & noise nodes)
•⁠  ⁠*Styling:* Tailwind CSS + Vanilla CSS Grid/Flexbox
•⁠  ⁠*Export:* HTML5 Canvas API

---

## 🚀 Quickstart

Clone the repo and run it locally in seconds:

```bash
# Clone repository
git clone [https://github.com/your-username/martian-id.git](https://github.com/your-username/martian-id.git)

# Navigate into directory
cd martian-id

# Serve with any static server or Vite
npx serve .
# or
npm install && npm run dev