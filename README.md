# Rocinante Space Flight Calculator

A sophisticated web application for calculating space flight times using theoretical fusion drives (inspired by *The Expanse*), featuring accurate astronomical data, real orbital mechanics, and relativistic physics.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)

## Features

### Physics Engine
- **Realistic rocket equation** (Tsiolkovsky) with fusion drives
- **Special relativity** effects (time dilation, Lorentz factor)
- **Constant acceleration trajectories** with acceleration/coast/deceleration phases
- **Mass flow calculations** based on fuel consumption
- **Configurable efficiencies** for fusion and propulsive systems

### Astronomical Accuracy
- **Real orbital mechanics** using Keplerian elements from NASA JPL
- **Accurate planet positions** calculated for any date
- **30+ nearest star systems** with real positions from Hipparcos/Gaia catalogs
- **Proper motion** and spectral classification for stars

### Interactive Map
- **Progressive zoom** with 11 logarithmic levels (from ISS orbit to 15 light years)
- **Smart level-of-detail** rendering
- **Click-to-select** destinations
- **Range visualization** showing ship's maximum reach
- **Real-time orbital positions**

### User Interface
- **Collapsible panels** with persistent state
- **Responsive sliders** with debounced calculations
- **Real-time updates** as parameters change
- **Beautiful dark space theme**
- **Smooth animations and transitions**

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd rocinante

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port).

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

### Configuring Your Ship

1. **Ship Parameters**
   - Adjust dry mass (ship structure without fuel)
   - Set wet mass (ship with full fuel tanks)
   - Choose acceleration (typically 0.3g for Epstein drive)

2. **Engine Efficiencies**
   - Fusion efficiency: mass-to-energy conversion (0.4% for D-T fusion)
   - Propulsive efficiency: energy-to-thrust conversion (50% typical)

### Exploring the Solar System

1. Use **Zoom In/Out** buttons to navigate between scales
2. Click on **planets** to select destinations
3. View **travel times**, **fuel requirements**, and **relativistic effects**
4. The **green circle** shows your ship's maximum range without coasting

### Understanding the Results

**Performance Metrics:**
- Exhaust Velocity: Effective velocity of expelled propellant
- Max Velocity: Highest speed reached at journey midpoint
- Total Distance: Maximum range with current fuel load
- Earth Time vs Ship Time: Shows relativistic time dilation effects

**Journey Types:**
- **Direct**: Ship accelerates halfway, decelerates halfway (green indicators)
- **Coast**: Out of range; ship uses 50% fuel to accelerate, coasts, then 50% to decelerate (orange indicators)

## Architecture

### Feature Folders

The project uses feature-based organization instead of type-based:

```
src/
├── constants/              # Physical constants
├── voyage-calculation/     # Physics engine
│   ├── physics/           # Core physics calculations
│   └── hooks/             # Calculation hooks
├── celestial-map/         # Astronomy & visualization
│   ├── data/              # Solar system & star data
│   ├── hooks/             # Orbital mechanics, zoom, visibility
│   └── components/        # Map component
├── ship-configuration/    # Ship parameter controls
├── voyage-info/           # Results display
└── ui/                    # Reusable components
```

See [DESIGN.md](./DESIGN.md) for detailed architecture documentation.

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date manipulation

## Physics References

### Equations

**Rocket Equation (Tsiolkovsky):**
```
Δv = v_e * ln(m_wet / m_dry)
```

**Exhaust Velocity:**
```
v_e = c * sqrt(2 * η_fusion * η_propulsive)
```

**Lorentz Factor:**
```
γ = 1 / sqrt(1 - v²/c²)
```

**Time Dilation:**
```
t_proper = t_coordinate / γ
```

### Data Sources

- **Orbital Elements**: NASA JPL Horizons System
- **Star Catalog**: SIMBAD, Gaia, Hipparcos
- **Physics**: Einstein's Special Relativity, Tsiolkovsky's Rocket Equation

## Roadmap

### Planned Features

- [ ] Date picker for custom planet positions
- [ ] Velocity/mass/distance charts
- [ ] Travel times table for all destinations
- [ ] Mission planning with waypoints
- [ ] 3D visualization mode
- [ ] Export journey data
- [ ] Comparison of fusion reactions (D-T vs D-He³)
- [ ] Gravitational assists calculation
- [ ] Realistic star field background

## Contributing

This is an educational/entertainment project. Contributions are welcome!

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **The Expanse** series for inspiration on fusion drives
- **NASA JPL** for orbital element data
- **ESA Gaia/Hipparcos** missions for star catalog data
- Physics community for accessible documentation on relativity and rocketry

## Contact

For questions or suggestions, please open an issue on GitHub.

---

*"It reaches out... 113 times a second, it reaches out."* - The Expanse
