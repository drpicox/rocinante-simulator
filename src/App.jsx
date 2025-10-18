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
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
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
      {details && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          background: 'rgba(0, 0, 0, 0.85)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '300px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>{details.name}</h3>
            <button
              onClick={() => dispatch(deselect())}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0 5px'
              }}
            >×</button>
          </div>
          <p style={{ margin: '5px 0' }}><strong>Type:</strong> {details.type}</p>
          <p style={{ margin: '5px 0' }}><strong>Distance:</strong> {details.distance}</p>
          <p style={{ margin: '10px 0 0 0' }}>{details.description}</p>
        </div>
      )}
    </div>
  )
}

export default App
