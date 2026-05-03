import { Outlet } from 'react-router-dom'

export function MinimalLayout() {
  return (
    <main className="minimal-layout">
      <Outlet />
    </main>
  )
}
