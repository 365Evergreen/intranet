import { Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchPeople } from '../../services/intranetApi'

export default function PeoplePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['people'],
    queryFn: fetchPeople,
  })

  if (isLoading || !data) {
    return <Spinner label="Loading people data" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="People"
        subtitle="Profile, reporting line, and presence-oriented information."
      />
      <div className="content-grid">
        <FeatureCard title={data.profile.name} description={data.profile.title}>
          <ul className="data-list">
            <li>
              <strong>Email</strong>
              <span>{data.profile.email}</span>
            </li>
            <li>
              <strong>Location</strong>
              <span>{data.profile.location}</span>
            </li>
            <li>
              <strong>Availability</strong>
              <span>{data.profile.availability}</span>
            </li>
          </ul>
        </FeatureCard>
        <FeatureCard title="Organisation">
          <ul className="data-list">
            {data.org.map((person) => (
              <li key={person.id}>
                <strong>{person.name}</strong>
                <span>
                  {person.title} · {person.relationship}
                </span>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>
    </div>
  )
}
