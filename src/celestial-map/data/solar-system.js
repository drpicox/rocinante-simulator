/**
 * Solar System Data
 *
 * Contains accurate orbital elements and physical properties for planets
 * Data sourced from NASA JPL Horizons System
 *
 * Orbital elements are at epoch J2000.0 (January 1, 2000, 12:00 TT)
 */

/**
 * Keplerian Orbital Elements
 * @typedef {Object} OrbitalElements
 * @property {number} a - Semi-major axis (AU)
 * @property {number} e - Eccentricity
 * @property {number} i - Inclination (degrees)
 * @property {number} L - Mean longitude (degrees)
 * @property {number} longPeri - Longitude of perihelion (degrees)
 * @property {number} longNode - Longitude of ascending node (degrees)
 *
 * Century rates (change per century from J2000)
 * @property {number} aCy - Semi-major axis rate (AU/century)
 * @property {number} eCy - Eccentricity rate (/century)
 * @property {number} iCy - Inclination rate (degrees/century)
 * @property {number} LCy - Mean longitude rate (degrees/century)
 * @property {number} longPeriCy - Longitude of perihelion rate (degrees/century)
 * @property {number} longNodeCy - Longitude of ascending node rate (degrees/century)
 */

export const PLANETS = [
  {
    name: 'Mercury',
    color: '#8C7853',
    radius: 2439.7, // km
    orbitalElements: {
      a: 0.38709927,
      e: 0.20563593,
      i: 7.00497902,
      L: 252.25032350,
      longPeri: 77.45779628,
      longNode: 48.33076593,
      aCy: 0.00000037,
      eCy: 0.00001906,
      iCy: -0.00594749,
      LCy: 149472.67411175,
      longPeriCy: 0.16047689,
      longNodeCy: -0.12534081
    }
  },
  {
    name: 'Venus',
    color: '#FFC649',
    radius: 6051.8,
    orbitalElements: {
      a: 0.72333566,
      e: 0.00677672,
      i: 3.39467605,
      L: 181.97909950,
      longPeri: 131.60246718,
      longNode: 76.67984255,
      aCy: 0.00000390,
      eCy: -0.00004107,
      iCy: -0.00078890,
      LCy: 58517.81538729,
      longPeriCy: 0.00268329,
      longNodeCy: -0.27769418
    }
  },
  {
    name: 'Earth',
    color: '#4A9EFF',
    radius: 6371.0,
    orbitalElements: {
      a: 1.00000261,
      e: 0.01671123,
      i: -0.00001531,
      L: 100.46457166,
      longPeri: 102.93768193,
      longNode: 0.0,
      aCy: 0.00000562,
      eCy: -0.00004392,
      iCy: -0.01294668,
      LCy: 35999.37244981,
      longPeriCy: 0.32327364,
      longNodeCy: 0.0
    },
    moons: [
      {
        name: 'Moon',
        color: '#CCCCCC',
        radius: 1737.4,
        semiMajorAxis: 384400 / 149597870.7, // Convert km to AU
        orbitalPeriod: 27.321661 // days
      }
    ]
  },
  {
    name: 'Mars',
    color: '#E27B58',
    radius: 3389.5,
    orbitalElements: {
      a: 1.52371034,
      e: 0.09339410,
      i: 1.84969142,
      L: -4.55343205,
      longPeri: -23.94362959,
      longNode: 49.55953891,
      aCy: 0.00001847,
      eCy: 0.00007882,
      iCy: -0.00813131,
      LCy: 19140.30268499,
      longPeriCy: 0.44441088,
      longNodeCy: -0.29257343
    }
  },
  {
    name: 'Jupiter',
    color: '#C88B3A',
    radius: 69911,
    orbitalElements: {
      a: 5.20288700,
      e: 0.04838624,
      i: 1.30439695,
      L: 34.39644051,
      longPeri: 14.72847983,
      longNode: 100.47390909,
      aCy: -0.00011607,
      eCy: -0.00013253,
      iCy: -0.00183714,
      LCy: 3034.74612775,
      longPeriCy: 0.21252668,
      longNodeCy: 0.20469106
    }
  },
  {
    name: 'Saturn',
    color: '#FAD5A5',
    radius: 58232,
    orbitalElements: {
      a: 9.53667594,
      e: 0.05386179,
      i: 2.48599187,
      L: 49.95424423,
      longPeri: 92.59887831,
      longNode: 113.66242448,
      aCy: -0.00125060,
      eCy: -0.00050991,
      iCy: 0.00193609,
      LCy: 1222.49362201,
      longPeriCy: -0.41897216,
      longNodeCy: -0.28867794
    }
  },
  {
    name: 'Uranus',
    color: '#4FD0E7',
    radius: 25362,
    orbitalElements: {
      a: 19.18916464,
      e: 0.04725744,
      i: 0.77263783,
      L: 313.23810451,
      longPeri: 170.95427630,
      longNode: 74.01692503,
      aCy: -0.00196176,
      eCy: -0.00004397,
      iCy: -0.00242939,
      LCy: 428.48202785,
      longPeriCy: 0.40805281,
      longNodeCy: 0.04240589
    }
  },
  {
    name: 'Neptune',
    color: '#4166F5',
    radius: 24622,
    orbitalElements: {
      a: 30.06992276,
      e: 0.00859048,
      i: 1.77004347,
      L: -55.12002969,
      longPeri: 44.96476227,
      longNode: 131.78422574,
      aCy: 0.00026291,
      eCy: 0.00005105,
      iCy: 0.00035372,
      LCy: 218.45945325,
      longPeriCy: -0.32241464,
      longNodeCy: -0.00508664
    }
  }
]

// Dwarf planets and other interesting objects
export const DWARF_PLANETS = [
  {
    name: 'Pluto',
    color: '#A0826D',
    radius: 1188.3,
    orbitalElements: {
      a: 39.48211675,
      e: 0.24882730,
      i: 17.14001206,
      L: 238.92903833,
      longPeri: 224.06891629,
      longNode: 110.30393684,
      aCy: -0.00031596,
      eCy: 0.00005170,
      iCy: 0.00004818,
      LCy: 145.20780515,
      longPeriCy: -0.04062942,
      longNodeCy: -0.01183482
    }
  }
]

// Near-Earth objects and destinations
export const DESTINATIONS = [
  {
    name: 'ISS',
    type: 'station',
    distanceAU: 400 / 149597870.7, // 400 km altitude
    color: '#FFFFFF',
    description: 'International Space Station'
  },
  {
    name: 'Moon',
    type: 'moon',
    distanceAU: 384400 / 149597870700, // 384,400 km from Earth
    color: '#CCCCCC',
    description: 'Earth\'s Moon'
  },
  {
    name: 'L1',
    type: 'lagrange',
    distanceAU: 1500000 / 149597870700, // ~1.5 million km from Earth
    color: '#FFD700',
    description: 'Earth-Sun L1 Lagrange Point'
  },
  {
    name: 'L2',
    type: 'lagrange',
    distanceAU: 1500000 / 149597870700,
    color: '#FFD700',
    description: 'Earth-Sun L2 Lagrange Point'
  }
]

// Asteroid belt representative distance
export const ASTEROID_BELT = {
  name: 'Asteroid Belt',
  innerEdge: 2.2, // AU
  outerEdge: 3.2, // AU
  mainBelt: 2.7,  // AU (average)
  color: '#888888'
}

// Kuiper Belt and Oort Cloud
export const OUTER_OBJECTS = [
  {
    name: 'Kuiper Belt (inner)',
    distanceAU: 30,
    color: '#666666',
    description: 'Inner edge of Kuiper Belt'
  },
  {
    name: 'Kuiper Belt (outer)',
    distanceAU: 50,
    color: '#555555',
    description: 'Outer edge of Kuiper Belt'
  },
  {
    name: 'Oort Cloud (inner)',
    distanceAU: 2000,
    color: '#444444',
    description: 'Inner boundary of Oort Cloud'
  },
  {
    name: 'Oort Cloud (outer)',
    distanceAU: 100000,
    color: '#333333',
    description: 'Outer boundary of Oort Cloud'
  }
]
