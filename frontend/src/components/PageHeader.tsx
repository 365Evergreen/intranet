import { Button, Text } from '@fluentui/react-components'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div>
        <Text as="h1" size={700} weight="bold">
          {title}
        </Text>
        <Text as="p">{subtitle}</Text>
      </div>
      {action ? <div className="page-header__action">{action}</div> : null}
    </header>
  )
}

export function ThemeToggleButton({
  isDark,
  onClick,
}: {
  isDark: boolean
  onClick: () => void
}) {
  return (
    <Button appearance="subtle" onClick={onClick}>
      {isDark ? 'Use light mode' : 'Use dark mode'}
    </Button>
  )
}
