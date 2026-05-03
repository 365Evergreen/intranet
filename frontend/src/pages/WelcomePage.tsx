import { Button, Card, Text } from '@fluentui/react-components'

export default function WelcomePage() {
  return (
    <Card className="welcome-card">
      <Text as="h1" size={800} weight="bold">
        Welcome to 365 Evergreen
      </Text>
      <Text>
        This starter establishes the SWA shell, role-aware navigation, and the
        first intranet feature modules.
      </Text>
      <Button as="a" href="/.auth/login/aad" appearance="primary">
        Sign in with Microsoft
      </Button>
    </Card>
  )
}
