# Rocinante Space Flight Calculator - Design Document

## Overview

A sophisticated web application for calculating space flight times using theoretical fusion drives with constant acceleration, featuring accurate astronomical data, progressive zoom, and realistic physics.

## Architecture

### Feature-Folder Structure

The project uses feature folders instead of type folders for better modularity and cohesion:

```
src/
├── constants/              # Physical constants and defaults
│   └── physics.js
├── voyage-calculation/     # Physics engine and calculations
│   ├── physics/
│   │   ├── relativity.js        # Lorentz factors, time dilation
│   │   ├── rocket-equation.js   # Tsiolkovsky equation
│   │   └── trajectory.js        # Travel calculations
│   ├── hooks/
│   │   ├── useVoyageCalculation.js
│   │   └── useTravelTimes.js
│   └── index.js
├── celestial-map/          # Astronomy and map rendering
│   ├── data/
│   │   ├── solar-system.js      # Keplerian orbital elements
│   │   └── stars.js             # 30+ nearest stars with real positions
│   ├── hooks/
│   │   ├── usePlanetPositions.js
│   │   ├── useZoom.js
│   │   └── useVisibility.js
│   └── components/
│       └── CelestialMap.jsx
├── ship-configuration/     # Ship parameter controls
│   └── components/
│       └── ShipConfiguration.jsx
├── voyage-info/            # Results display
│   └── components/
│       └── VoyageInfo.jsx
└── ui/                     # Reusable UI components
    └── components/
        └── CollapsiblePanel.jsx
```

### Benefits of Feature Folders

1. **Cohesion**: Related code stays together
2. **Scalability**: Easy to add new features without affecting others
3. **Maintainability**: Clear boundaries between features
4. **Testability**: Each feature can be tested in isolation

## Physics Implementation

### Rocket Equation (Tsiolkovsky)

The fundamental equation for rocket propulsion:

```
Δv = v_e * ln(m_wet / m_dry)
```

Where:
- `v_e` = exhaust velocity (function of fusion and propulsive efficiency)
- `m_wet` = initial mass with full fuel
- `m_dry` = final mass (structure only)

### Exhaust Velocity Calculation

Based on fusion energy conversion:

```
v_e = c * sqrt(2 * η_fusion * η_propulsive)
```

Where:
- `c` = speed of light (299,792,458 m/s)
- `η_fusion` = mass-to-energy conversion efficiency (0.4% for D-T fusion)
- `η_propulsive` = energy-to-thrust efficiency (50% typical)

### Trajectory Calculation

**Direct Journey** (no coast phase):
```
t_accel = sqrt(d / (2 * a))
t_total = 2 * t_accel
v_max = a * t_accel
```

**Coast Journey** (exceeds max range):
```
t_accel = t_decel = t_max / 2
v_max = a * t_accel
d_coast = d_total - 2 * (0.5 * a * t_accel²)
t_coast = d_coast / v_max
```

### Special Relativity

**Lorentz Factor**:
```
γ = 1 / sqrt(1 - v²/c²)
```

**Time Dilation**:
```
t_proper = t_coordinate / γ
```

For varying velocity (constant acceleration), we use average gamma:
```
γ_avg = (1 + γ_max) / 2
```

## Astronomical Data

### Solar System

**Data Source**: NASA JPL Horizons System

Keplerian orbital elements at J2000.0 epoch:
- Semi-major axis (a)
- Eccentricity (e)
- Inclination (i)
- Mean longitude (L)
- Longitude of perihelion
- Longitude of ascending node
- Century rates for all elements

**Planet Position Calculation**:
1. Update elements for target date using century rates
2. Calculate mean anomaly
3. Solve Kepler's equation (Newton-Raphson) for eccentric anomaly
4. Calculate true anomaly
5. Transform to heliocentric 3D coordinates

### Star Catalog

**Data Sources**: SIMBAD, Gaia, Hipparcos

30+ nearest star systems with:
- Right ascension and declination (J2000.0)
- Distance in light years
- Proper motion
- Spectral type
- Apparent magnitude
- Real colors based on spectral classification

## Zoom System

### Progressive Zoom Levels

11 zoom levels with logarithmic scaling:

1. **ISS Orbit** (0.000001 AU scale) - Up to 150,000 km
2. **Earth-Moon** (0.00001 AU) - 450,000 km
3. **Near Earth** (0.0001 AU) - Lagrange points
4. **Inner Solar System** (0.012 AU) - Earth to Mars
5. **Mid Solar System** (0.08 AU) - Out to Jupiter
6. **Outer Solar System** (0.25 AU) - Neptune/Pluto
7. **Kuiper Belt** (1.5 AU) - 100 AU
8. **Inner Oort Cloud** (20 AU) - 5,000 AU
9. **Outer Oort Cloud** (600 AU) - 150,000 AU
10. **Nearby Stars** (3000 AU) - ~8 light years
11. **Local Neighborhood** (10000 AU) - ~15 light years

### Level of Detail (LOD) System

Objects rendered based on zoom level:
- **Very close**: ISS, satellites
- **Close**: Moon, Lagrange points
- **Inner**: Inner planets, Mars
- **Mid**: Outer planets
- **Outer**: Dwarf planets, Kuiper belt
- **Very far**: Oort cloud
- **Stellar**: Nearby stars

Smart label rendering:
- Planets: Always labeled when visible
- Moons: Only when zoomed to inner solar system
- Stars: Only when < 20 visible
- Adaptive font sizes based on zoom

## UI/UX Design

### Collapsible Panels

All major sections are collapsible:
- Ship Parameters
- Engine Efficiencies
- Performance Metrics
- Relativistic Effects
- Celestial Map

State persisted in localStorage for user convenience.

### Debounced Updates

Ship parameter sliders update UI immediately but debounce calculations (300ms) to prevent performance issues during dragging.

### Color Scheme

Dark space theme:
- Background: Gradient from slate-900 via blue-900 to slate-800
- Panels: slate-800/900 with gradients
- Accents: Cyan/blue for interactive elements
- Status colors:
  - Green: Within range
  - Orange/Red: Requires coast phase
  - Blue: Selected destination
  - Purple: Relativistic effects

## Future Enhancements

### Priority 1
- [ ] Date picker for planet positions
- [ ] Trajectory charts (velocity, mass, distance over time)
- [ ] Journey details panel for selected destination
- [ ] Travel times table for all visible destinations

### Priority 2
- [ ] 3D visualization mode
- [ ] Multiple ship presets
- [ ] Mission planning with waypoints
- [ ] Fuel optimization suggestions
- [ ] Comparison of different fusion reactions (D-T, D-He³, etc.)

### Priority 3
- [ ] Export journey data (CSV, JSON)
- [ ] Share link with configuration
- [ ] Animation of planet movements
- [ ] Realistic star field background (Milky Way)
- [ ] Gravitational assists calculation

## Performance Considerations

### Optimizations

1. **useMemo** for expensive calculations (orbital mechanics, trajectories)
2. **Debouncing** for slider inputs
3. **LOD system** limits number of rendered objects
4. **SVG rendering** for crisp visuals without canvas overhead
5. **LocalStorage** for persistent UI state (collapsible panels)

### Bottlenecks

- Orbital mechanics calculations (O(n) per planet per frame)
- SVG rendering with many objects (> 50 elements)
- Real-time trajectory data generation (100+ points)

## Testing Strategy

### Unit Tests (Recommended)

- Physics calculations (relativity, rocket equation)
- Orbital mechanics (Kepler solver)
- Coordinate transformations
- Zoom level calculations

### Integration Tests

- Voyage calculation hook
- Planet position updates with date changes
- Zoom and visibility interaction

### E2E Tests

- User workflow: configure ship → select destination → view results
- Zoom in/out across all levels
- Panel collapse/expand

## Technologies

- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Date Handling**: date-fns 3.0
- **Charts**: Recharts 2.10 (for future chart components)

## References

### Physics
- Tsiolkovsky, K. (1903). "The Exploration of Cosmic Space by Means of Reaction Devices"
- Einstein, A. (1905). "On the Electrodynamics of Moving Bodies"
- Eddington, A.S. (1920). "Space, Time and Gravitation"

### Astronomy
- NASA JPL Horizons System: https://ssd.jpl.nasa.gov/horizons/
- SIMBAD Astronomical Database: http://simbad.u-strasbg.fr/
- ESA Gaia Mission: https://www.cosmos.esa.int/gaia
- Hipparcos Catalogue: https://www.cosmos.esa.int/web/hipparcos

### Orbital Mechanics
- Murray, C.D. & Dermott, S.F. (1999). "Solar System Dynamics"
- Vallado, D.A. (2013). "Fundamentals of Astrodynamics and Applications"

## License

This is an educational/entertainment project exploring realistic space flight physics.
