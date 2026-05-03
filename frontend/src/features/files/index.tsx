import { Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchFiles } from '../../services/intranetApi'
import { formatDate } from '../../utils/formatters'

export default function FilesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: fetchFiles,
  })

  if (isLoading || !data) {
    return <Spinner label="Loading files" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Files"
        subtitle="Recent and shared documents surfaced through the intranet API."
      />
      <FeatureCard title="Recent files">
        <ul className="data-list">
          {data.map((file) => (
            <li key={file.id}>
              <strong>{file.name}</strong>
              <span>
                {file.location} · {file.type} · {formatDate(file.updatedAt)}
              </span>
            </li>
          ))}
        </ul>
      </FeatureCard>
    </div>
  )
}
