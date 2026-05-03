import { Button, Field, Textarea } from '@fluentui/react-components'
import { useState } from 'react'
import { FeatureCard } from '../../components/FeatureCard'
import { PageHeader } from '../../components/PageHeader'
import { useNavigation } from '../../hooks/useNavigation'

export default function AdminPage() {
  const { items, saveItems } = useNavigation()
  const [draftOverride, setDraftOverride] = useState<string | null>(null)
  const draft = draftOverride ?? JSON.stringify(items, null, 2)

  return (
    <div className="page-grid">
      <PageHeader
        title="Admin"
        subtitle="Edit navigation configuration and publish it back to the API store."
      />
      <FeatureCard
        title="Navigation configuration"
        action={
          <Button
            appearance="primary"
            onClick={async () => {
              await saveItems(JSON.parse(draft))
              setDraftOverride(null)
            }}
          >
            Save
          </Button>
        }
      >
        <Field label="Navigation JSON">
          <Textarea
            resize="vertical"
            rows={18}
            value={draft}
            onChange={(_, data) => setDraftOverride(data.value)}
          />
        </Field>
      </FeatureCard>
    </div>
  )
}
