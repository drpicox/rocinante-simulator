import { useSelector } from 'react-redux'
import { useFrame } from '@react-three/fiber'
import { selectOrigin } from '../features/origin/originSlice'
import { useMemo, useRef } from 'react'
import { getPosition } from '../utils/positions'
import { calculateMaxRange } from '../utils/range'

export function RangeSphere() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const meshRef = useRef()

  // Calculate max range based on ship parameters
  const maxRange = useMemo(() => {
    if (!origin?.name) return 0

    const rangeMeters = calculateMaxRange(
      ship.mass,
      ship.fuel,
      ship.efficiency,
      ship.acceleration
    )

    // Distance constants
    const AU = 149597870700 // meters in 1 AU
    const LY = 9.461e15 // meters in 1 light-year

    // Scene scales
    const sceneUnitsPerAU = 10    // Solar system scale: 1 AU => 10 units
    const sceneUnitsPerLY = 2000  // Star map scale: 1 LY => 2000 units

    // Convert range to AU/LY
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY

    // Visual size if we used pure AU or pure LY scales
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY

    // Linear ramp mapping:
    // - Up to 500 AU (5000 units): pure AU scale
    // - From 500 AU to 3.5 LY: linearly ramp from 5000 -> 7000 units
    // - Beyond 3.5 LY: pure LY scale

    const startUnits = 5000                 // corresponds to 500 AU
    const startLY = (500 * AU) / LY         // LY at 500 AU
    const endLY = 3.5

    if (sizeAU <= startUnits) {
      return sizeAU
    }

    if (rangeLY >= endLY) {
      return sizeLY
    }

    // Linear progress across the transition interval
    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))

    // Ramp strictly from 5000 -> 7000 units
    return 5000 + 2000 * t
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  // Update sphere position to follow origin
  useFrame(({ clock }) => {
    if (!meshRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)

    if (pos) {
      meshRef.current.position.set(pos[0], pos[1], pos[2])
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <mesh ref={meshRef}>
      {/* Just wireframe with low opacity and fewer segments */}
      <sphereGeometry args={[maxRange, 24, 24]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.06}
        wireframe={true}
        depthWrite={false}
      />
    </mesh>
  )
}

export default RangeSphere
