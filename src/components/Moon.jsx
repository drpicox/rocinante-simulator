import { Sphere, Html, useCursor, Billboard } from '@react-three/drei'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrigin, setOrigin } from '../features/origin/originSlice'
import { AdditiveBlending, DoubleSide } from 'three'

export function Moon({ size, color, name, onClick, labelsVisible = false, orbitRadius, orbitSpeed, planetRef }) {
  const [hovered, setHovered] = useState(false)
  const moonRef = useRef()
  useCursor(hovered)
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const isOrigin = origin?.name === name

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

  const handleClick = (e) => {
    e.stopPropagation()
    if (e.shiftKey) {
      dispatch(setOrigin({ name, kind: 'moon' }))
      return
    }
    onClick && onClick()
  }

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
        <>
          {/* Soft glow sphere */}
          <mesh>
            <sphereGeometry args={[size * 1.5, 20, 20]} />
            <meshBasicMaterial
              color="#4caf50"
              transparent
              opacity={0.22}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
          {/* Camera-facing ring */}
          <Billboard>
            <mesh>
              <ringGeometry args={[size * 1.2, size * 1.7, 48]} />
              <meshBasicMaterial
                color="#4caf50"
                transparent
                opacity={0.6}
                side={DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </Billboard>
        </>
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

      {isOrigin && (
        <Html center style={{ pointerEvents: 'none' }}>
          <div style={{
            marginTop: 14,
            padding: '2px 6px',
            background: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            fontSize: 9,
            borderRadius: 4,
            whiteSpace: 'nowrap',
            boxShadow: '0 0 6px rgba(76,175,80,0.7)'
          }}>Origin</div>
        </Html>
      )}
    </group>
  )
}
