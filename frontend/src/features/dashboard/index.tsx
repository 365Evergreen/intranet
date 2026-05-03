import { Badge, Caption1, Spinner, Text } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchDashboard } from '../../services/intranetApi'
import { formatDate } from '../../utils/formatters'

function formatStatusLabel(source: string, cacheLayer: string, cachedAt: string) {
  return `${source} · ${cacheLayer} · ${formatDate(cachedAt)}`
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 5 * 60 * 1000,
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
        <FeatureCard
          title="News preview"
          description={formatStatusLabel(
            data.contentStatus.news.source,
            data.contentStatus.news.cacheLayer,
            data.contentStatus.news.cachedAt,
          )}
        >
          <ul className="data-list">
            {data.news.map((article) => (
              <li key={article.id}>
                <strong>{article.title}</strong>
                <span>{article.summary}</span>
              </li>
            ))}
          </ul>
          {data.contentStatus.news.isStale ? (
            <Caption1>Refreshing in the background.</Caption1>
          ) : null}
        </FeatureCard>
        <FeatureCard
          title="Files preview"
          description={formatStatusLabel(
            data.contentStatus.files.source,
            data.contentStatus.files.cacheLayer,
            data.contentStatus.files.cachedAt,
          )}
        >
          <ul className="data-list">
            {data.files.map((file) => (
              <li key={file.id}>
                <strong>{file.name}</strong>
                <span>{file.location}</span>
              </li>
            ))}
          </ul>
          {data.contentStatus.files.isStale ? (
            <Caption1>Refreshing in the background.</Caption1>
          ) : null}
        </FeatureCard>
        <FeatureCard
          title="Search suggestions"
          description={formatStatusLabel(
            data.contentStatus.search.source,
            data.contentStatus.search.cacheLayer,
            data.contentStatus.search.cachedAt,
          )}
        >
          <ul className="data-list">
            {data.suggestions.map((result) => (
              <li key={result.id}>
                <strong>{result.title}</strong>
                <span>{result.summary}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>
    </div>
  )
}
