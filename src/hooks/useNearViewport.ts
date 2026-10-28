import { useEffect, useState, type RefObject } from 'react'

/**
 * Becomes true (and stays true) once the element comes within `rootMargin`
 * of the viewport. Used to start loading heavy content just before it is seen.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = '600px'): boolean {
  const [near, setNear] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || near) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, near])

  return near
}
