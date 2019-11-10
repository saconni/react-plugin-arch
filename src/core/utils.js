import { useEffect } from 'react'

export function useInit(fn) {
  // eslint-disable-next-line
  return useEffect(fn, [])
}