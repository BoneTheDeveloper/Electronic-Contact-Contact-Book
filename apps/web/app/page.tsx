'use client'

import { useEffect } from 'react'

export default function HomePage() {
  useEffect(() => {
    window.location.href = '/login'
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting to login...</p>
    </div>
  )
}
