import { Menu, Transition } from '@headlessui/react'
import { User, Settings, Moon, Sun, LogOut } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useThemeStore } from '../../store/themeStore'
import { useNavigate } from 'react-router-dom'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </Menu.Button>
      
      <Transition
        enter="transition duration-200 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-150 ease-in"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <p className="font-semibold text-sm">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => navigate('/profile')}
                  className={`${
                    active ? 'bg-white/10' : ''
                  } w-full px-4 py-2 flex items-center space-x-2 text-sm transition-colors`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile & Settings</span>
                </button>
              )}
            </Menu.Item>
            
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={toggleTheme}
                  className={`${
                    active ? 'bg-white/10' : ''
                  } w-full px-4 py-2 flex items-center space-x-2 text-sm transition-colors`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}
            </Menu.Item>
            
            <div className="border-t border-white/10 my-1" />
            
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-white/10' : ''
                  } w-full px-4 py-2 flex items-center space-x-2 text-sm text-destructive transition-colors`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

