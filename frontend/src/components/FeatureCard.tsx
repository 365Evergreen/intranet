import { Card, CardHeader, Text } from '@fluentui/react-components'
import type { PropsWithChildren, ReactNode } from 'react'

type FeatureCardProps = PropsWithChildren<{
  title: string
  description?: string
  action?: ReactNode
}>

export function FeatureCard({
  title,
  description,
  action,
  children,
}: FeatureCardProps) {
  return (
    <Card className="feature-card">
      <div className="feature-card__header">
        <CardHeader
          header={<Text weight="semibold">{title}</Text>}
          description={description ? <Text>{description}</Text> : undefined}
        />
        {action ? <div>{action}</div> : null}
      </div>
      <div className="feature-card__body">{children}</div>
    </Card>
  )
}
