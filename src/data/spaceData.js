// Solar System Planets (distances in AU, sizes relative)
export const planets = [
  { name: 'Mercury', distance: 0.39, size: 0.6, color: '#8c7853', moons: [] },
  { name: 'Venus', distance: 0.72, size: 1.2, color: '#ffc649', moons: [] },
  {
    name: 'Earth',
    distance: 1.0,
    size: 1.3,
    color: '#6b93d6',
    moons: [
      {
        name: 'Moon',
        distance: 0.00257, // AU (384,400 km)
        size: 0.1, // Relative to Earth
        color: '#c0c0c0',
        facts: 'Earth\'s only natural satellite. Causes tides and stabilizes Earth\'s axial tilt. Formed 4.5 billion years ago from a giant impact.'
      }
    ]
  },
  { name: 'Mars', distance: 1.52, size: 0.75, color: '#c1440e', moons: [] },
  { name: 'Jupiter', distance: 5.2, size: 11.2, color: '#d8ca9d', moons: [] },
  { name: 'Saturn', distance: 9.5, size: 9.4, color: '#fab27b', moons: [] },
  { name: 'Uranus', distance: 19.2, size: 4.0, color: '#4fd0e7', moons: [] },
  { name: 'Neptune', distance: 30.1, size: 3.9, color: '#4b70dd', moons: [] }
];

// Dwarf Planets (distances in AU, sizes relative - scaled up for visibility)
export const dwarfPlanets = [
  { name: 'Ceres', distance: 2.77, size: 0.9, color: '#b8b8b8', type: 'dwarf' },
  { name: 'Vesta', distance: 2.36, size: 0.7, color: '#a89968', type: 'dwarf' },
  { name: 'Pluto', distance: 39.5, size: 2.0, color: '#dcc7aa', type: 'dwarf' },
  { name: 'Haumea', distance: 43.3, size: 1.8, color: '#c0c0c0', type: 'dwarf' },
  { name: 'Makemake', distance: 45.8, size: 1.8, color: '#d4a373', type: 'dwarf' },
  { name: 'Eris', distance: 67.7, size: 2.0, color: '#e8e8e8', type: 'dwarf' }
];

// 30 Closest Stars to the Sun (distances in light years, positions in 3D space)
// Using real astronomical data with exoplanets, proper motion, and interesting facts
export const stars = [
  {
    name: 'Proxima Centauri',
    distance: 4.24,
    x: 1.3, y: -0.8, z: -3.8,
    color: '#ff6b6b',
    type: 'Red Dwarf',
    exoplanets: 3,
    habitableZonePlanets: 1,
    motion: 'approaching',
    closestApproach: '3.2 ly in 26,700 years',
    facts: 'Proxima b is in the habitable zone! Also has Proxima c and d. Our closest stellar neighbor.'
  },
  {
    name: 'Alpha Centauri A',
    distance: 4.37,
    x: 1.2, y: -0.7, z: -4.0,
    color: '#fff3cd',
    type: 'G-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '3.0 ly in 28,000 years',
    facts: 'Similar to our Sun! Part of a triple star system. Target for interstellar missions like Breakthrough Starshot.'
  },
  {
    name: 'Alpha Centauri B',
    distance: 4.37,
    x: 1.3, y: -0.8, z: -4.0,
    color: '#ffd700',
    type: 'K-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '3.0 ly in 28,000 years',
    facts: 'Orbits Alpha Centauri A every 80 years. Slightly smaller and cooler than the Sun.'
  },
  {
    name: 'Barnard\'s Star',
    distance: 5.96,
    x: -1.8, y: 4.5, z: -3.0,
    color: '#ff8c42',
    type: 'Red Dwarf',
    exoplanets: 1,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '3.8 ly in 9,800 years',
    facts: 'Fastest proper motion of any star! Has Barnard b (super-Earth). Will be our closest star in 9,800 years.'
  },
  {
    name: 'Wolf 359',
    distance: 7.86,
    x: 5.2, y: 3.8, z: 4.2,
    color: '#ff4757',
    type: 'Red Dwarf',
    exoplanets: 2,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Frequently featured in sci-fi! Has two confirmed planets. One of the faintest stars visible.'
  },
  {
    name: 'Lalande 21185',
    distance: 8.29,
    x: -2.5, y: 6.8, z: 3.5,
    color: '#ff6348',
    type: 'Red Dwarf',
    exoplanets: 2,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '4.7 ly in 19,000 years',
    facts: 'High proper motion star. Has two super-Earth exoplanets discovered in 2019-2020.'
  },
  {
    name: 'Sirius A',
    distance: 8.58,
    x: -2.1, y: -6.5, z: -5.0,
    color: '#e3f2fd',
    type: 'A-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '7.8 ly in 64,000 years',
    facts: 'The brightest star in the night sky! 25 times more luminous than the Sun. Known since ancient times.'
  },
  {
    name: 'Sirius B',
    distance: 8.58,
    x: -2.0, y: -6.6, z: -5.0,
    color: '#bbdefb',
    type: 'White Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '7.8 ly in 64,000 years',
    facts: 'A stellar remnant! Earth-sized but incredibly dense. First white dwarf ever discovered (1862).'
  },
  {
    name: 'Luyten 726-8 A',
    distance: 8.73,
    x: 7.5, y: -3.2, z: 2.8,
    color: '#ff5252',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'A flare star! Can increase brightness by a factor of 75 in seconds. Part of a binary system.'
  },
  {
    name: 'Luyten 726-8 B',
    distance: 8.73,
    x: 7.6, y: -3.1, z: 2.9,
    color: '#ff6b6b',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Also known as UV Ceti. Famous for extreme stellar flares. Binary companion to Luyten 726-8 A.'
  },
  {
    name: 'Ross 154',
    distance: 9.69,
    x: -4.8, y: -6.2, z: 5.5,
    color: '#ff6b6b',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '6.4 ly in 157,000 years',
    facts: 'A flare star with variable brightness. Moves rapidly through space at 10.9 km/s relative to the Sun.'
  },
  {
    name: 'Ross 248',
    distance: 10.32,
    x: 8.2, y: 5.5, z: -3.0,
    color: '#ff5252',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '3.0 ly in 36,000 years',
    facts: 'Will become our closest star in 36,000 years! High proper motion. Also a flare star.'
  },
  {
    name: 'Epsilon Eridani',
    distance: 10.52,
    x: -3.5, y: -8.8, z: -4.2,
    color: '#ffd93d',
    type: 'K-type',
    exoplanets: 1,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Young star (440 million years old) with a debris disk! Has gas giant Epsilon Eridani b. Popular in sci-fi.'
  },
  {
    name: 'Lacaille 9352',
    distance: 10.74,
    x: -6.5, y: -7.2, z: 4.0,
    color: '#ff6348',
    type: 'Red Dwarf',
    exoplanets: 2,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '5.8 ly in 11,000 years',
    facts: 'Has two super-Earth planets discovered in 2020. High metallicity suggests more planets may exist.'
  },
  {
    name: 'Ross 128',
    distance: 10.94,
    x: 9.8, y: -4.5, z: 1.2,
    color: '#ff4757',
    type: 'Red Dwarf',
    exoplanets: 1,
    habitableZonePlanets: 1,
    motion: 'approaching',
    closestApproach: '6.1 ly in 71,000 years',
    facts: 'Ross 128 b is in the habitable zone! Temperate Earth-sized planet. Quiet star with few flares.'
  },
  {
    name: 'EZ Aquarii A',
    distance: 11.27,
    x: -8.5, y: 7.0, z: 3.5,
    color: '#ff5252',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Triple star system! All three are red dwarfs. Notable for strong stellar activity and flares.'
  },
  {
    name: '61 Cygni A',
    distance: 11.36,
    x: 7.2, y: 8.5, z: -2.0,
    color: '#ffbe76',
    type: 'K-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '9.0 ly in 20,000 years',
    facts: 'First star to have its distance measured (1838)! Binary system. Historical importance to astronomy.'
  },
  {
    name: '61 Cygni B',
    distance: 11.36,
    x: 7.3, y: 8.6, z: -2.1,
    color: '#ffa07a',
    type: 'K-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '9.0 ly in 20,000 years',
    facts: 'Companion to 61 Cygni A. They orbit every 659 years. Both stars are older than the Sun.'
  },
  {
    name: 'Procyon A',
    distance: 11.46,
    x: -10.2, y: -4.5, z: 2.8,
    color: '#fffacd',
    type: 'F-type',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '9.5 ly in 31,000 years',
    facts: '8th brightest star in the sky! 7 times more luminous than the Sun. Part of the Winter Triangle.'
  },
  {
    name: 'Procyon B',
    distance: 11.46,
    x: -10.3, y: -4.4, z: 2.9,
    color: '#e0e0e0',
    type: 'White Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '9.5 ly in 31,000 years',
    facts: 'Difficult to observe due to Procyon A\'s brightness. Completes orbit every 40.8 years.'
  },
  {
    name: 'Struve 2398 A',
    distance: 11.52,
    x: 9.5, y: -6.0, z: 3.2,
    color: '#ff6b6b',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Binary system discovered by Wilhelm Struve. Both components are red dwarfs orbiting every 295 years.'
  },
  {
    name: 'Groombridge 34 A',
    distance: 11.62,
    x: 8.8, y: 3.5, z: 6.8,
    color: '#ff5252',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '6.0 ly in 6,000 years',
    facts: 'Binary system with high proper motion. Will pass very close to the Sun in just 6,000 years!'
  },
  {
    name: 'Epsilon Ind',
    distance: 11.87,
    x: -5.2, y: -9.5, z: -4.5,
    color: '#ffbe76',
    type: 'K-type',
    exoplanets: 2,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '11.1 ly in 2,000 years',
    facts: 'Has two brown dwarf companions! One of the closest planetary systems. Visible to naked eye.'
  },
  {
    name: 'Tau Ceti',
    distance: 11.89,
    x: -4.8, y: -10.2, z: -3.0,
    color: '#fff9e6',
    type: 'G-type',
    exoplanets: 4,
    habitableZonePlanets: 2,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Two planets in habitable zone! Similar to Sun. Massive debris disk. Prime target for SETI searches.'
  },
  {
    name: 'YZ Ceti',
    distance: 12.13,
    x: -11.5, y: 3.8, z: 2.5,
    color: '#ff4757',
    type: 'Red Dwarf',
    exoplanets: 3,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '10.4 ly in 1,100 years',
    facts: 'Three rocky planets discovered in 2017! All orbit very close to their star. Flare star activity.'
  },
  {
    name: 'Luyten\'s Star',
    distance: 12.37,
    x: 10.8, y: -5.2, z: 3.5,
    color: '#ff6348',
    type: 'Red Dwarf',
    exoplanets: 2,
    habitableZonePlanets: 1,
    motion: 'approaching',
    closestApproach: '9.3 ly in 11,000 years',
    facts: 'Luyten b is potentially habitable! Third highest proper motion star. Ancient, metal-poor star.'
  },
  {
    name: 'Kapteyn\'s Star',
    distance: 12.78,
    x: -7.5, y: -9.8, z: 4.2,
    color: '#ff8c42',
    type: 'Red Subdwarf',
    exoplanets: 2,
    habitableZonePlanets: 1,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: '11.5 billion years old! Second-fastest proper motion. Kapteyn b may be habitable. Ancient halo star.'
  },
  {
    name: 'Lacaille 8760',
    distance: 12.87,
    x: -6.8, y: -10.5, z: 3.8,
    color: '#ffbe76',
    type: 'K-type',
    exoplanets: 1,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '5.7 ly in 15,000 years',
    facts: 'Has a super-Earth planet! Visible to naked eye from southern hemisphere. High proper motion.'
  },
  {
    name: 'Kruger 60 A',
    distance: 13.15,
    x: 11.2, y: 6.5, z: -3.8,
    color: '#ff5252',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'approaching',
    closestApproach: '6.0 ly in 4,000 years',
    facts: 'Binary system with moderate flare activity. Will pass very close in just 4,000 years!'
  },
  {
    name: 'Ross 614 A',
    distance: 13.35,
    x: -8.2, y: 10.0, z: 4.5,
    color: '#ff6b6b',
    type: 'Red Dwarf',
    exoplanets: 0,
    habitableZonePlanets: 0,
    motion: 'receding',
    closestApproach: 'moving away',
    facts: 'Binary red dwarf system. Very close binary pair orbiting every 16.6 years. Variable star.'
  },
];
