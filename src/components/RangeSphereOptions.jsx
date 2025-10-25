import { useSelector } from 'react-redux'
import { useFrame } from '@react-three/fiber'
import { selectOrigin } from '../features/origin/originSlice'
import { useMemo, useRef } from 'react'
import { getPosition } from '../utils/positions'
import { calculateMaxRange } from '../utils/range'

// Option 1: Glowing Torus Rings with smooth rotation animation
export function RangeSphereTorusRings() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return
    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Animate the rings - slow, mesmerizing rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.02
      ring1Ref.current.rotation.y += 0.01
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += 0.015
      ring2Ref.current.rotation.z += 0.01
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += 0.02
      ring3Ref.current.rotation.x += 0.008
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Three rotating torus rings with animation */}
      <mesh ref={ring1Ref} rotation={[Math.PI * 0.15, 0, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={ring2Ref} rotation={[0, Math.PI * 0.3, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#00ccff"
          emissive="#00ccff"
          emissiveIntensity={0.6}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh ref={ring3Ref} rotation={[0, 0, Math.PI * 0.2]}>
        <torusGeometry args={[maxRange, maxRange * 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#0099ff"
          emissive="#0099ff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

// Option 2: Pulsing Sphere with gradient - fixed to stay visible at all sizes
export function RangeSphereGradient() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const meshRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!meshRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      meshRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Gentle pulse effect - stays visible with minimum opacity
    meshRef.current.material.opacity = Math.sin(elapsedTime * 1.5) * 0.1 + 0.25
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[maxRange, 32, 32]} />
      <meshStandardMaterial
        color="#0088cc"
        emissive="#0044ff"
        emissiveIntensity={0.15}
        transparent
        opacity={0.15}
        wireframe={false}
        side={2}
      />
    </mesh>
  )
}

// Option 3: Grid lines sphere (cleaner wireframe)
export function RangeSphereCyberGrid() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const meshRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!meshRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      meshRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Subtle rotation
    meshRef.current.rotation.z += 0.0001
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[maxRange, 48, 48]} />
      <meshBasicMaterial
        color="#00ff00"
        wireframe={true}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </mesh>
  )
}

// Option 4: Orbiting particles
export function RangeSphereParticles() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  // Create particle points
  const particleCount = 80
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const theta = (i / particleCount) * Math.PI * 2
    const phi = Math.random() * Math.PI
    const r = maxRange

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={maxRange * 0.02} color="#00ffff" transparent opacity={0.8} />
      </points>
    </group>
  )
}

// Option 5: Wireframe with glow overlay
export function RangeSphereWireframeGlow() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[maxRange, 32, 32]} />
        <meshBasicMaterial color="#00ffff" wireframe opacity={0.3} transparent depthWrite={false} />
      </mesh>
      {/* Glow sphere */}
      <mesh scale={1.02}>
        <sphereGeometry args={[maxRange, 32, 32]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// Option 6: Star Trek Style - Grid with scanning effect
export function RangeSphereStarTrek() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()
  const scanLineRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Animated scanning line that sweeps across
    if (scanLineRef.current) {
      const scanSpeed = 0.3
      const scanPosition = ((elapsedTime * scanSpeed) % (Math.PI * 2)) - Math.PI
      scanLineRef.current.position.y = Math.sin(scanPosition) * maxRange
      scanLineRef.current.rotation.x = scanPosition

      // Pulse the scan line opacity
      const pulse = Math.sin(elapsedTime * 3) * 0.3 + 0.5
      scanLineRef.current.material.opacity = pulse * 0.6
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Main grid sphere - subtle wireframe */}
      <mesh>
        <sphereGeometry args={[maxRange, 32, 32]} />
        <meshBasicMaterial
          color="#4488ff"
          wireframe={true}
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Equator ring - brighter */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#6699ff"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Scanning ring that sweeps up and down */}
      <mesh ref={scanLineRef} rotation={[0, 0, 0]}>
        <torusGeometry args={[maxRange * 0.95, maxRange * 0.015, 8, 64]} />
        <meshBasicMaterial
          color="#88ccff"
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Subtle glow layer */}
      <mesh>
        <sphereGeometry args={[maxRange, 16, 16]} />
        <meshBasicMaterial
          color="#2266cc"
          transparent
          opacity={0.04}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  )
}

// Option 7: Hexagonal Shield Grid (like sci-fi force fields)
export function RangeSphereHexShield() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()
  const shieldRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Subtle pulsing and rotation
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.001
      const pulse = Math.sin(elapsedTime * 0.5) * 0.05 + 0.95
      shieldRef.current.scale.setScalar(pulse)
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      <group ref={shieldRef}>
        {/* Icosahedron gives hexagonal appearance */}
        <mesh>
          <icosahedronGeometry args={[maxRange, 2]} />
          <meshBasicMaterial
            color="#00ffaa"
            wireframe={true}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
        {/* Subtle fill */}
        <mesh>
          <icosahedronGeometry args={[maxRange, 1]} />
          <meshBasicMaterial
            color="#00ffaa"
            transparent
            opacity={0.05}
            depthWrite={false}
            side={2}
          />
        </mesh>
      </group>
    </group>
  )
}

// Option 8: Energy Waves (expanding ripples)
export function RangeSphereEnergyWaves() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()
  const wave1Ref = useRef()
  const wave2Ref = useRef()
  const wave3Ref = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Expanding waves that pulse outward
    const waveSpeed = 1.5
    if (wave1Ref.current) {
      const progress = (elapsedTime * waveSpeed) % 1
      const scale = 0.3 + progress * 0.7
      wave1Ref.current.scale.setScalar(scale)
      wave1Ref.current.material.opacity = (1 - progress) * 0.4
    }
    if (wave2Ref.current) {
      const progress = ((elapsedTime * waveSpeed) + 0.33) % 1
      const scale = 0.3 + progress * 0.7
      wave2Ref.current.scale.setScalar(scale)
      wave2Ref.current.material.opacity = (1 - progress) * 0.4
    }
    if (wave3Ref.current) {
      const progress = ((elapsedTime * waveSpeed) + 0.66) % 1
      const scale = 0.3 + progress * 0.7
      wave3Ref.current.scale.setScalar(scale)
      wave3Ref.current.material.opacity = (1 - progress) * 0.4
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Outer boundary */}
      <mesh>
        <sphereGeometry args={[maxRange, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          wireframe={true}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Three expanding wave spheres */}
      <mesh ref={wave1Ref}>
        <sphereGeometry args={[maxRange, 24, 24]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.4}
          depthWrite={false}
          side={2}
        />
      </mesh>
      <mesh ref={wave2Ref}>
        <sphereGeometry args={[maxRange, 24, 24]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.4}
          depthWrite={false}
          side={2}
        />
      </mesh>
      <mesh ref={wave3Ref}>
        <sphereGeometry args={[maxRange, 24, 24]} />
        <meshBasicMaterial
          color="#ffcc00"
          transparent
          opacity={0.4}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  )
}

// Option 9: Orbital Paths (camera-facing ring - always perpendicular to view)
export function RangeSphereOrbitalPaths() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()
  const ringRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock, camera }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }

    // Make the ring always face the camera (billboard effect)
    if (ringRef.current) {
      ringRef.current.lookAt(camera.position)
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Single ring that always faces the camera */}
      <mesh ref={ringRef}>
        <torusGeometry args={[maxRange, maxRange * 0.008, 16, 100]} />
        <meshBasicMaterial
          color="#00ddff"
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Subtle outer glow */}
      <mesh>
        <sphereGeometry args={[maxRange, 16, 16]} />
        <meshBasicMaterial
          color="#0088cc"
          transparent
          opacity={0.05}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  )
}

// Option 10: Minimal Rings (clean and simple)
export function RangeSphereMinimal() {
  const origin = useSelector(selectOrigin)
  const ship = useSelector((state) => state.ship)
  const groupRef = useRef()

  const maxRange = useMemo(() => {
    if (!origin?.name) return 0
    const rangeMeters = calculateMaxRange(ship.mass, ship.fuel, ship.efficiency, ship.acceleration)
    const AU = 149597870700
    const LY = 9.461e15
    const sceneUnitsPerAU = 10
    const sceneUnitsPerLY = 2000
    const rangeAU = rangeMeters / AU
    const rangeLY = rangeMeters / LY
    const sizeAU = rangeAU * sceneUnitsPerAU
    const sizeLY = rangeLY * sceneUnitsPerLY
    const startUnits = 1000
    const startLY = (100 * AU) / LY
    const endLY = 3.5

    if (sizeAU <= startUnits) return sizeAU
    if (rangeLY >= endLY) return sizeLY

    const tRaw = (rangeLY - startLY) / (endLY - startLY)
    const t = Math.min(1, Math.max(0, tRaw))
    const k = 3
    const denom = 1 - Math.exp(-k)
    const s = denom === 0 ? t : (1 - Math.exp(-k * t)) / denom
    return 1000 + 6000 * s
  }, [origin?.name, ship.mass, ship.fuel, ship.efficiency, ship.acceleration])

  useFrame(({ clock }) => {
    if (!groupRef.current || !origin?.name) return

    const elapsedTime = clock.getElapsedTime()
    const pos = getPosition(origin.name, elapsedTime)
    if (pos) {
      groupRef.current.position.set(pos[0], pos[1], pos[2])
    }
  })

  if (!origin?.name || maxRange <= 0 || !ship.showRange) return null

  return (
    <group ref={groupRef}>
      {/* Just three simple perpendicular rings - very clean */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.006, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.006, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[maxRange, maxRange * 0.006, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}
