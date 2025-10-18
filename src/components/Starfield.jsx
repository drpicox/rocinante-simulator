import { useRef, useMemo } from 'react'

export function Starfield({ count = 5000 }) {
  const points = useRef()

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Generate random points on a sphere surface (very far away)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 50000 // Very far away

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Slight color variation for stars
      const brightness = 0.8 + Math.random() * 0.2
      colors[i * 3] = brightness
      colors[i * 3 + 1] = brightness
      colors[i * 3 + 2] = brightness
    }

    return [positions, colors]
  }, [count])

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={50}
        sizeAttenuation={true}
        vertexColors
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  )
}
