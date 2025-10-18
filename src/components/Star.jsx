import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export function Star({ position, size = 0.05, color, name, onClick, labelsVisible = false, minVisibleDistance = 1000 }) {
  const [hovered, setHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [scaledSize, setScaledSize] = useState(size)
  const { camera } = useThree()
  useCursor(hovered)

  // Update visibility and size on every frame based on camera distance
  useFrame(() => {
    const cameraDistance = camera.position.length()
    const shouldBeVisible = cameraDistance >= minVisibleDistance

    if (shouldBeVisible !== isVisible) {
      setIsVisible(shouldBeVisible)
    }

    // Scale stars much more aggressively so they're as big as the solar system when zoomed out
    const newScaledSize = size * Math.max(1, cameraDistance / 100)
    if (Math.abs(newScaledSize - scaledSize) > 0.1) {
      setScaledSize(newScaledSize)
    }
  })

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
