import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { useSelector, useDispatch } from 'react-redux'
import { select, deselect } from './features/space/spaceSlice'
import { planets, stars } from './data/spaceData'
import { Planet } from './components/Planet'
import { Star } from './components/Star'
import './App.css'

function App() {
  const selected = useSelector((state) => state.space.selected)
  const dispatch = useDispatch()

  const getDetails = (name) => {
    if (name === 'Sun') return { name: 'Sun', type: 'Star', distance: '0 AU', description: 'The center of our solar system.' }
    const planet = planets.find(p => p.name === name)
    if (planet) return { name: planet.name, type: 'Planet', distance: `${planet.distance} AU from Sun`, description: `A planet in our solar system.` }
    const star = stars.find(s => s.name === name)
    if (star) return { name: star.name, type: 'Star', distance: `${star.distance} light years from Sun`, description: `A nearby star.` }
    return null
  }

  const details = selected ? getDetails(selected) : null

  return (
    <div style={{ height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={1} />
        <OrbitControls />

        {/* Sun */}
        <Sphere args={[0.5, 16, 16]} position={[0, 0, 0]} onClick={() => dispatch(select('Sun'))}>
          <meshStandardMaterial color="#ffdd44" />
        </Sphere>

        {/* Planets */}
        {planets.map((planet) => (
          <Planet
            key={planet.name}
            position={[planet.distance * 10, 0, 0]}
            size={planet.size}
            color={planet.color}
            name={planet.name}
            onClick={() => dispatch(select(planet.name))}
          />
        ))}

        {/* Stars */}
        {stars.map((star) => (
          <Star
            key={star.name}
            position={[star.x * 100, star.y * 100, star.z * 100]}
            color={star.color}
            name={star.name}
            onClick={() => dispatch(select(star.name))}
          />
        ))}
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
        <h1>Rocinante Simulator - Space Map</h1>
        <p>Use mouse to orbit, zoom, and pan. Click on objects for details.</p>
      </div>
      {details && (
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          maxWidth: '300px'
        }}>
          <h3>{details.name}</h3>
          <p><strong>Type:</strong> {details.type}</p>
          <p><strong>Distance:</strong> {details.distance}</p>
          <p>{details.description}</p>
          <button onClick={() => dispatch(deselect())}>Close</button>
        </div>
      )}
    </div>
  )
}

export default App
