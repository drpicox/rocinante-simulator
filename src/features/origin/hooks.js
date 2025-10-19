// filepath: /Volumes/Projects/claude/rocinante-simulator/src/features/space/hooks.js
import { useDispatch, useSelector } from 'react-redux'
import { selectOrigin, setOrigin } from './originSlice.js'
import { isNameInName } from '../space/names.js'

// Determine if a given render-name should be treated as origin
export function isOriginForName(origin, name) {
  return isNameInName(origin?.name, name)
}

// React hook to get origin and compute isOrigin for a name
export function useIsOrigin(name) {
  const origin = useSelector(selectOrigin)
  return isOriginForName(origin, name)
}

// React hook returning a click handler that sets origin on Shift+Click and otherwise delegates
export function useOriginClick(name, kind, onClick) {
  const dispatch = useDispatch()
  return (e) => {
    e.stopPropagation()
    if (e.shiftKey) {
      // Normalize Sol proxy to Sun when used as origin
      const canonicalName = name === 'Sol (Our Sun)' ? 'Sun' : name
      dispatch(setOrigin({ name: canonicalName, kind }))
      return
    }
    onClick && onClick()
  }
}

