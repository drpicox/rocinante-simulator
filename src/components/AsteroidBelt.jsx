import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Renders a dense asteroid belt as instanced rocks between inner and outer radii (in AU)
// Defaults to the main asteroid belt between Mars (~1.52 AU) and Jupiter (~5.2 AU)
// by placing rocks roughly from 2.2 AU to 3.3 AU.
export function AsteroidBelt({
  innerAU = 2.2,
  outerAU = 3.2,
  count = 1200,
  color = '#9e9e9e',
  sizeMin = 0.01,
  sizeMax = 0.03,
  verticalThickness = 0.6, // world units of +/- Y spread
  revolveSpeed = 0.05, // radians per second for belt rotation
  seed = 42,
}) {
  // Convert AU to scene units (planets in scene use distance * 10)
  const innerRadius = innerAU * 10
  const outerRadius = outerAU * 10

  const meshRef = useRef()
  const groupRef = useRef()

  // Precompute random values with a seeded RNG for stable layout across renders
  const rng = useMemo(() => {
    let s = seed >>> 0
    return () => {
      // xorshift32
      s ^= s << 13; s ^= s >>> 17; s ^= s << 5
      // Convert to [0,1)
      return ((s >>> 0) / 4294967296)
    }
  }, [seed])

  const instances = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      const t = rng() * Math.PI * 2 // angle
      // Bias radii slightly toward the middle using quadratic easing
      const u = rng() // 0..1
      const rLerp = (u * u + u) / 2 // ease-in-out-ish
      const radius = innerRadius + (outerRadius - innerRadius) * rLerp
      const y = (rng() - 0.5) * verticalThickness
      const scale = sizeMin + (sizeMax - sizeMin) * rng()
      const tiltX = (rng() - 0.5) * 0.6
      const tiltZ = (rng() - 0.5) * 0.6
      data.push({ t, radius, y, scale, tiltX, tiltZ })
    }
    return data
  }, [count, innerRadius, outerRadius, verticalThickness, sizeMin, sizeMax, rng])

  // Initialize instance matrices once
  useEffect(() => {
    if (!meshRef.current) return
    const dummy = new THREE.Object3D()

    for (let i = 0; i < instances.length; i++) {
      const { t, radius, y, scale, tiltX, tiltZ } = instances[i]
      const x = Math.cos(t) * radius
      const z = Math.sin(t) * radius

      dummy.position.set(x, y, z)
      dummy.rotation.set(tiltX, 0, tiltZ)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  }, [instances])

  // Rotate the entire belt slowly around Y
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += revolveSpeed * delta
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[null, null, count]} castShadow={false} receiveShadow={false}>
        {/* Low-poly rock-like shape */}
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
        />
      </instancedMesh>
    </group>
  )
}

