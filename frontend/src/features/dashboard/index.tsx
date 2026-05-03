import { Badge, Spinner, Text } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchDashboard } from '../../services/intranetApi'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  if (isLoading || !data) {
    return <Spinner label="Loading dashboard" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Dashboard"
        subtitle="A personalised landing view with quick access to work, news, and search."
      />
      <div className="stats-grid">
        {data.highlights.map((highlight) => (
          <FeatureCard key={highlight.label} title={highlight.label}>
            <Text as="p" size={800} weight="bold">
              {highlight.value}
            </Text>
            <Badge appearance="outline">{highlight.trend}</Badge>
          </FeatureCard>
        ))}
      </div>
      <div className="content-grid">
        <FeatureCard title="Welcome">
          <Text>{data.welcome}</Text>
        </FeatureCard>
        <FeatureCard title="Quick links">
          <ul className="data-list">
            {data.quickLinks.map((link) => (
              <li key={link.id}>
                <strong>{link.label}</strong>
                <span>{link.description}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>
        <FeatureCard title="Updates">
          <ul className="data-list">
            {data.updates.map((update) => (
              <li key={update.id}>
                <strong>{update.title}</strong>
                <span>{update.summary}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>
    </div>
  )
}
