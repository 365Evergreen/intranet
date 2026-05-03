import { Button, Input, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchSearch } from '../../services/intranetApi'

export default function SearchPage() {
  const [query, setQuery] = useState('hybrid search')
  const [submittedQuery, setSubmittedQuery] = useState(query)
  const { data, isFetching } = useQuery({
    queryKey: ['search', submittedQuery],
    queryFn: () => fetchSearch(submittedQuery),
  })

  return (
    <div className="page-grid">
      <PageHeader
        title="Search"
        subtitle="A single search entry point for M365 and curated intranet content."
      />
      <FeatureCard
        title="Search the intranet"
        action={
          <Button appearance="primary" onClick={() => setSubmittedQuery(query)}>
            Search
          </Button>
        }
      >
        <Input
          aria-label="Search query"
          value={query}
          onChange={(_, data) => setQuery(data.value)}
        />
      </FeatureCard>
      {isFetching ? <Spinner label="Searching" /> : null}
      <FeatureCard title="Results">
        <ul className="data-list">
          {data?.map((result) => (
            <li key={result.id}>
              <strong>{result.title}</strong>
              <span>
                {result.kind} · {result.summary}
              </span>
            </li>
          ))}
        </ul>
      </FeatureCard>
    </div>
  )
}
