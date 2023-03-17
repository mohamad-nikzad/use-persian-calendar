import { useEffect, useRef } from 'react'

const useUpdateEffect = (fn: () => void, deps: any[] = []) => {
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
      return fn()
    }
    didMountRef.current = true
  }, deps)
}

export default useUpdateEffect
