import { Badge, Spinner } from '@fluentui/react-components'
import { useQuery } from '@tanstack/react-query'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { fetchTasks } from '../../services/intranetApi'
import { formatDate } from '../../utils/formatters'

export default function TasksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })

  if (isLoading || !data) {
    return <Spinner label="Loading tasks" />
  }

  return (
    <div className="page-grid">
      <PageHeader
        title="Tasks"
        subtitle="A consolidated view of Planner and To Do work items."
      />
      <FeatureCard title="Assigned work">
        <ul className="data-list">
          {data.map((task) => (
            <li key={task.id}>
              <strong>{task.title}</strong>
              <span>
                {task.source} · {task.priority} · Due {formatDate(task.dueDate)}
              </span>
              <Badge appearance="tint">{task.status}</Badge>
            </li>
          ))}
        </ul>
      </FeatureCard>
    </div>
  )
}
