import {
  Button,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
  Text,
} from '@fluentui/react-components'
import {
  Dismiss24Regular,
  Navigation24Regular,
} from '@fluentui/react-icons'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNavigation } from '../hooks/useNavigation'

type SidebarNavProps = {
  open: boolean
  onToggle: () => void
}

export function SidebarNav({ open, onToggle }: SidebarNavProps) {
  const { principal } = useAuth()
  const { items, isLoading } = useNavigation()

  return (
    <InlineDrawer
      className="sidebar"
      open={open}
      position="start"
      separator
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              icon={open ? <Dismiss24Regular /> : <Navigation24Regular />}
              onClick={onToggle}
              aria-label="Toggle navigation"
            />
          }
        >
          365 Evergreen
        </DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className="sidebar__section">
          <Text weight="semibold">Signed in as</Text>
          <Text>{principal?.userDetails ?? 'Local user'}</Text>
        </div>
        <nav className="sidebar__nav" aria-label="Primary">
          {isLoading ? (
            <Text>Loading navigation…</Text>
          ) : (
            items.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                <span>{item.label}</span>
                <small>{item.description}</small>
              </NavLink>
            ))
          )}
        </nav>
      </DrawerBody>
    </InlineDrawer>
  )
}
