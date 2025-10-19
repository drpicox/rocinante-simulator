import { Sphere, Html, useCursor } from '@react-three/drei'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import OriginIndicator from './OriginIndicator'
import { useIsOrigin, useOriginClick } from '../utils/origin'

export function Moon({ size, color, name, onClick, labelsVisible = false, orbitRadius, orbitSpeed, planetRef }) {
  const [hovered, setHovered] = useState(false)
  const moonRef = useRef()
  useCursor(hovered)

  const isOrigin = useIsOrigin(name)
  const handleClick = useOriginClick(name, 'moon', onClick)

  useFrame(({ clock }) => {
    if (moonRef.current && planetRef?.current) {
      const time = clock.getElapsedTime() * orbitSpeed
      const x = Math.cos(time) * orbitRadius
      const z = Math.sin(time) * orbitRadius

      // Position moon relative to the planet's position
      moonRef.current.position.x = planetRef.current.position.x + x
      moonRef.current.position.y = planetRef.current.position.y
      moonRef.current.position.z = planetRef.current.position.z + z
    }
  })

  return (
    <group ref={moonRef}>
      <Sphere
        args={[size, 16, 16]}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </Sphere>

      {isOrigin && (
        <OriginIndicator base={size} labelMarginTop={14} />
      )}

      {(labelsVisible || hovered) && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            padding: '2px 6px',
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            fontSize: 10,
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}>{name}</div>
        </Html>
      )}
    </group>
  )
}
