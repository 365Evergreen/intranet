import { Button, Text } from '@fluentui/react-components'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="empty-state">
      <Text as="h1" size={700} weight="bold">
        Page not found
      </Text>
      <Text>The route does not exist in the current intranet shell.</Text>
      <Link to="/">
        <Button appearance="primary">Return to dashboard</Button>
      </Link>
    </section>
  )
}
