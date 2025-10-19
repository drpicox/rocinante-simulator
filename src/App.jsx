import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useSelector, useDispatch } from 'react-redux'
import { select, deselect } from './features/space/spaceSlice'
import { planets, stars } from './data/spaceData'
import { Star } from './components/Star'
import { SolarSystem } from './components/SolarSystem'
import { Starfield } from './components/Starfield'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import './App.css'


function App() {
  const selected = useSelector((state) => state.space.selected)
  const dispatch = useDispatch()

  const getDetails = (name) => {
    if (name === 'Sun' || name === 'Sol (Our Sun)') return {
      name: 'Sun',
      type: 'G-type Star',
      distance: '0 AU',
      description: 'Our home star! Contains 99.86% of the solar system\'s mass.',
      exoplanets: 8,
      motion: null
    }
    const planet = planets.find(p => p.name === name)
    if (planet) return {
      name: planet.name,
      type: 'Planet',
      distance: `${planet.distance} AU from Sun`,
      description: `A planet in our solar system.`
    }

    // Check if it's a moon
    for (const planet of planets) {
      const moon = planet.moons?.find(m => m.name === name)
      if (moon) return {
        name: moon.name,
        type: 'Natural Satellite',
        distance: `${moon.distance} AU from ${planet.name}`,
        description: moon.facts
      }
    }

    const star = stars.find(s => s.name === name)
    if (star) return {
      name: star.name,
      type: star.type,
      distance: `${star.distance} light years from Sun`,
      exoplanets: star.exoplanets,
      habitableZonePlanets: star.habitableZonePlanets,
      motion: star.motion,
      closestApproach: star.closestApproach,
      description: star.facts
    }
    return null
  }

  const details = selected ? getDetails(selected) : null

  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Canvas camera={{ position: [15, 8, 20], fov: 60, far: 200000, near: 0.1 }}>
        {/* Background starfield - custom component that stays far away */}
        <Starfield count={5000} />

        {/* Lights */}
        <ambientLight intensity={0.05} />
        <pointLight position={[0, 0, 0]} intensity={2} />

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={50000}
          target={[0, 0, 0]}
        />

        {/* Solar System - switches between detailed and simple view */}
        <SolarSystem onSelect={(name) => dispatch(select(name))} />

        {/* Nearby Stars - appear when zoomed out */}
        {stars.map((star) => (
          <Star
            key={star.name}
            position={[star.x * 2000, star.y * 2000, star.z * 2000]}
            size={3}
            color={star.color}
            name={star.name}
            onClick={() => dispatch(select(star.name))}
            labelsVisible={false}
            minVisibleDistance={0}
          />
        ))}

        {/* Postprocessing effects */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.025} mipmapBlur />
        </EffectComposer>
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
          maxWidth: '350px',
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
              aria-label="Close details"
            >×</button>
          </div>
          <p style={{ margin: '5px 0' }}><strong>Type:</strong> {details.type}</p>
          <p style={{ margin: '5px 0' }}><strong>Distance:</strong> {details.distance}</p>

          {details.exoplanets !== undefined && (
            <>
              <p style={{ margin: '5px 0' }}>
                <strong>Exoplanets:</strong> {details.exoplanets}
                {details.habitableZonePlanets > 0 && (
                  <span style={{ color: '#4caf50', marginLeft: '8px' }}>
                    🌍 {details.habitableZonePlanets} in habitable zone!
                  </span>
                )}
              </p>
              {details.motion && (
                <p style={{ margin: '5px 0' }}>
                  <strong>Motion:</strong>{' '}
                  <span style={{ color: details.motion === 'approaching' ? '#64b5f6' : '#ff8a65' }}>
                    {details.motion === 'approaching' ? '→ Approaching' : '← Receding'}
                  </span>
                </p>
              )}
              {details.closestApproach && details.closestApproach !== 'moving away' && (
                <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#ffeb3b' }}>
                  <strong>Closest approach:</strong> {details.closestApproach}
                </p>
              )}
            </>
          )}

          <p style={{ margin: '10px 0 0 0', lineHeight: '1.4' }}>{details.description}</p>
        </div>
      )}
    </div>
  )
}

export default App
