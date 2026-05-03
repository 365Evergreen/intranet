import { Spinner, Text } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchNews } from '../../services/intranetApi'
import { formatDate } from '../../utils/formatters'

export default function NewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading || !data) {
    return <Spinner label="Loading news" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="News"
        subtitle="SharePoint-aligned news cards delivered through the API layer."
      />
      <div className="content-grid">
        {data.map((article) => (
          <FeatureCard
            key={article.id}
            title={article.title}
            description={`${article.category} · ${formatDate(article.publishedAt)}`}
          >
            <Text>{article.summary}</Text>
          </FeatureCard>
        ))}
      </div>
    </div>
  )
}
