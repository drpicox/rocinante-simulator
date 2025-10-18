import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState, forwardRef } from 'react'
import { Moon } from './Moon'

export const Planet = forwardRef(({ position, size, color, name, onClick, labelsVisible = true, moons = [] }, ref) => {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  return (
    <group position={position} ref={ref}>
      <Sphere
        args={[size * 0.2, 24, 24]}
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

      {/* Render moons belonging to this planet */}
      {moons.map((moon) => (
        <Moon
          key={moon.name}
          size={moon.size * 1.5}
          color={moon.color}
          name={moon.name}
          onClick={moon.onClick}
          labelsVisible={false}
          orbitRadius={moon.distance * 150}
          orbitSpeed={0.3}
          planetRef={ref}
        />
      ))}
    </group>
  )
})
