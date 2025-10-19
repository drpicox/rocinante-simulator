# Rocinante Simulator

A 3D space simulator built with React and Three.js that allows you to explore the solar system and nearby star systems with realistic relativistic rocket physics.

## 🚀 Live Demo

Visit the live application at: **https://drpicox.github.io/rocinante-simulator/**

## Features

- Interactive 3D visualization of the solar system and nearby star systems
- Realistic relativistic rocket physics calculations
- Travel time dilation effects (observer time vs ship time)
- Fuel consumption calculations
- Click on celestial bodies to view detailed information
- Visual range indicators and travel lines
- Configurable ship parameters (mass, fuel, acceleration, efficiency)

## Physics

The travel calculations are based on relativistic rocket physics from:
https://math.ucr.edu/home/baez/physics/Relativity/SR/Rocket/rocket.html

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Running locally

```bash
npm run dev
```

### Building for production

```bash
npm run build
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a new deployment.

## Technology Stack

- React
- Three.js / React Three Fiber
- Redux Toolkit
- Vite
- GitHub Pages

## License

MIT
