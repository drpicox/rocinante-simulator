// filepath: /Volumes/Projects/claude/rocinante-simulator/src/components/TravelLine.jsx
import { useSelector } from 'react-redux'
import { useFrame } from '@react-three/fiber'
import { selectOrigin } from '../features/origin/originSlice'
import { selectDestination } from '../features/destination/destinationSlice'
import { useMemo, useState, useEffect } from 'react'
import { Line } from '@react-three/drei'
import { getPosition } from '../utils/positions'

export function TravelLine() {
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const [points, setPoints] = useState([[0, 0, 0], [0, 0, 0]])

  // Check if we have both origin and destination
  const hasRoute = useMemo(() => {
    return origin?.name && destination
  }, [origin?.name, destination])

  // Reset points when route changes
  useEffect(() => {
    if (!hasRoute) {
      setPoints([[0, 0, 0], [0, 0, 0]])
    }
  }, [hasRoute])

  // Update line positions on every frame to track orbital motion
  useFrame(({ clock }) => {
    if (!hasRoute) return

    const elapsedTime = clock.getElapsedTime()
    const posA = getPosition(origin.name, elapsedTime)
    const posB = getPosition(destination, elapsedTime)

    if (!posA || !posB) return

    // Update points state - Line component will handle the geometry update
    setPoints([posA, posB])
  })

  if (!hasRoute) return null

  return (
    <Line
      points={points}
      color="#a78bfa"
      lineWidth={2}
      transparent
      opacity={0.6}
      depthWrite={false}
    />
  )
}

export default TravelLine
