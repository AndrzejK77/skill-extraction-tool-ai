import { NavLink, Outlet } from 'react-router-dom'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/extractions', label: 'Extractions' },
  { to: '/admin/system', label: 'System Status' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-gray-800 text-white h-14 flex items-center px-6 shadow">
        <span className="font-semibold text-lg">Skill Extractor — Admin</span>
        <NavLink to="/" className="ml-auto text-sm text-gray-300 hover:text-white transition-colors">
          ← Back to App
        </NavLink>
      </header>

      <div className="flex flex-1">
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col py-4">
          {sidebarLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
