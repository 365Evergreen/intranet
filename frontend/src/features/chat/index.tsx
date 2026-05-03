import { Spinner, Text } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchChatToken, fetchGrounding } from '../../services/intranetApi'
import { formatDate } from '../../utils/formatters'

export default function ChatPage() {
  const tokenQuery = useQuery({
    queryKey: ['chat-token'],
    queryFn: fetchChatToken,
  })
  const groundingQuery = useQuery({
    queryKey: ['chat-grounding'],
    queryFn: fetchGrounding,
  })

  if (tokenQuery.isLoading || groundingQuery.isLoading) {
    return <Spinner label="Loading assistant" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Assistant"
        subtitle="Direct Line token brokering and grounding metadata for Copilot Studio."
      />
      <div className="content-grid">
        <FeatureCard title="Session token">
          <Text weight="semibold">Expires {formatDate(tokenQuery.data!.expiresAt)}</Text>
          <Text>{tokenQuery.data!.token}</Text>
        </FeatureCard>
        <FeatureCard title="Grounding context">
          <ul className="data-list">
            {groundingQuery.data!.sections.map((section) => (
              <li key={section.title}>
                <strong>{section.title}</strong>
                <span>{section.items.join(' · ')}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>
    </div>
  )
}
