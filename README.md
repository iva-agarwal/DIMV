# Martian ID - Interplanetary Identity Card Generator

A futuristic web application that calculates your age across different planets in the solar system and generates a stunning holographic Martian ID card. Built with React, Vite, Three.js, and Tailwind CSS.

## Features

- **Planetary Age Calculator**: Calculate your age on Mercury, Venus, Earth, Mars, Jupiter, and Saturn based on your Earth birth date
- **3D Holographic ID Card**: Interactive 3D card with tilt effects, holographic sheen, and rotating seal
- **Instagram/TikTok Story Export**: Generate 9:16 HD story cards for social media sharing
- **Live Countdown Timer**: Real-time countdown to your next Martian birthday
- **4 Avatar Presets**: Choose from cyberpunk-styled avatar presets
- **Immersive Experience**: Cosmic particle background, hyperdrive warp transition, and ambient space music
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 19** - UI library
- **Vite 8** - Build tool and dev server
- **Three.js** - 3D graphics and particle effects
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icon library
- **Canvas Confetti** - Celebration effects
- **html-to-image** - Image export functionality

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage

1. **Enter Your Details**: Input your name and Earth date of birth
2. **Choose Avatar**: Select from 4 cyberpunk avatar presets
3. **Generate ID**: Click "TRANSMIT & MINT PASS" to generate your Martian ID
4. **Explore**: 
   - Hover/drag the card to see 3D tilt effects
   - Click to flip between front and back of the card
   - View planetary age calculations on the back
5. **Export Story**: Click the STORY button to generate a 9:16 Instagram/TikTok story card
6. **Edit Details**: Use the EDIT DETAILS button to update your information

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── CosmicBackground.jsx    # Three.js particle effects and warp animation
│   ├── MartianCard.jsx         # 3D holographic ID card component
│   ├── Phase1Intake.jsx        # Initial form for user input
│   ├── Phase2Dock.jsx          # Bottom dock controls
│   ├── StoryExportModal.jsx    # Story card export modal
│   ├── DarkDatePicker.jsx      # Custom date picker with portal dropdown
│   └── ...
├── utils/
│   ├── avatars.js              # Avatar preset data
│   ├── audio.js                # Sound effects
│   └── planetaryMath.js        # Planetary age calculations
├── App.jsx                     # Main application component
└── main.jsx                    # Entry point
```

## Planetary Age Calculations

The app calculates your age on each planet based on their orbital periods relative to Earth:

- Mercury: 0.24 Earth years
- Venus: 0.62 Earth years
- Earth: 1.00 Earth years
- Mars: 1.88 Earth years
- Jupiter: 11.86 Earth years
- Saturn: 29.46 Earth years

## License

MIT
