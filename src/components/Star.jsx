import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState, useMemo } from 'react'
import { useThree } from '@react-three/fiber'

export function Star({ position, size = 0.05, color, name, onClick, labelsVisible = false, minVisibleDistance = 1000 }) {
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()
  useCursor(hovered)

  // Calculate if star should be visible based on camera distance from origin
  const isVisible = useMemo(() => {
    const cameraDistance = camera.position.length()
    return cameraDistance >= minVisibleDistance
  }, [camera.position, minVisibleDistance])

  // Scale the star based on camera distance for better visibility
  const scaledSize = useMemo(() => {
    const cameraDistance = camera.position.length()
    const scaleFactor = Math.max(1, cameraDistance / 1000)
    return size * scaleFactor
  }, [camera.position, size])

  if (!isVisible) return null

  return (
    <group position={position}>
      <Sphere
        args={[scaledSize, 16, 16]}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial color={color} />
      </Sphere>
      {(labelsVisible || hovered) && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '2px 6px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontSize: 12,
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}>{name}</div>
        </Html>
      )}
    </group>
  )
}
