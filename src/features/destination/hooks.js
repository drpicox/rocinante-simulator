// filepath: /Volumes/Projects/claude/rocinante-simulator/src/features/destination/hooks.js
import { useSelector } from 'react-redux'
import { selectDestination } from './destinationSlice.js'
import { isNameInName } from '../space/names.js'

// Determine if a given render-name should be treated as destination
export function isDestinationForName(destinationName, name) {
  return isNameInName(destinationName, name)
}

// React hook to get destination and compute isDestination for a name
export function useIsDestination(name) {
  const destination = useSelector(selectDestination)
  return isDestinationForName(destination, name)
}

