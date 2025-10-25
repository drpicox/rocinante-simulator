// Import all the beautiful visualization options
import {
  RangeSphereTorusRings,
  RangeSphereGradient,
  RangeSphereCyberGrid,
  RangeSphereParticles,
  RangeSphereWireframeGlow,
  RangeSphereStarTrek,
  RangeSphereHexShield,
  RangeSphereEnergyWaves,
  RangeSphereOrbitalPaths,
  RangeSphereMinimal
} from './RangeSphereOptions'

// Choose which visualization to use by changing this line:
// NEW OPTIONS:
//   - RangeSphereEnergyWaves (expanding orange energy ripples - dynamic!)
//   - RangeSphereHexShield (hexagonal force field grid - sci-fi!)
//   - RangeSphereOrbitalPaths (satellite orbit rings - elegant!)
//   - RangeSphereMinimal (simple white rings - clean!)
// PREVIOUS OPTIONS:
//   - RangeSphereStarTrek, RangeSphereTorusRings, RangeSphereGradient,
//   - RangeSphereCyberGrid, RangeSphereParticles, RangeSphereWireframeGlow
export const RangeSphere = RangeSphereOrbitalPaths

export default RangeSphere
