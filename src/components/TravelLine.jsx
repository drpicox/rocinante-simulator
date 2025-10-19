// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/TravelLine.jsx
import { useSelector } from 'react-redux'
import { useFrame } from '@react-three/fiber'
import { selectOrigin } from '../features/origin/originSlice'
import { selectDestination } from '../features/destination/destinationSlice'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { getPosition } from '../utils/positions'

export function TravelLine() {
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const lineRef = useRef()

  // Check if we have both origin and destination
  const hasRoute = useMemo(() => {
    return origin?.name && destination
  }, [origin?.name, destination])

  // Create initial geometry with placeholder points (must be before conditional return)
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const positions = new Float32Array(6) // 2 points * 3 coords
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geom
  }, [])

  // Update line positions on every frame to track orbital motion
  useFrame(({ clock }) => {
    if (!hasRoute || !lineRef.current) return

    const elapsedTime = clock.getElapsedTime()
    const posA = getPosition(origin.name, elapsedTime)
    const posB = getPosition(destination, elapsedTime)

    if (!posA || !posB) return

    // Update the line geometry with new positions
    const positions = lineRef.current.geometry.attributes.position
    positions.setXYZ(0, posA[0], posA[1], posA[2])
    positions.setXYZ(1, posB[0], posB[1], posB[2])
    positions.needsUpdate = true
  })

  if (!hasRoute) return null

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#a78bfa"
        linewidth={2}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </line>
  )
}

export default TravelLine
