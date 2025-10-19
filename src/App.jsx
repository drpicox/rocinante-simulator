import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useDispatch } from 'react-redux'
import { setDestination } from './features/destination/destinationSlice'
import { stars } from './data/spaceData'
import { Star } from './components/Star'
import { SolarSystem } from './components/SolarSystem'
import { Starfield } from './components/Starfield'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import './App.css'
import DestinationPanel from './components/DestinationPanel.jsx'
import ShipPanel from './components/ShipPanel'


function App() {
  const dispatch = useDispatch()

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
        <SolarSystem onSelect={(name) => dispatch(setDestination(name))} />

        {/* Nearby Stars - appear when zoomed out */}
        {stars.map((star) => (
          <Star
            key={star.name}
            position={[star.x * 2000, star.y * 2000, star.z * 2000]}
            size={3}
            color={star.color}
            name={star.name}
            onClick={() => dispatch(setDestination(star.name))}
            labelsVisible={false}
            minVisibleDistance={0}
          />
        ))}

        {/* Postprocessing effects */}
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.025} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <DestinationPanel />
      <ShipPanel />
    </div>
  )
}

export default App
