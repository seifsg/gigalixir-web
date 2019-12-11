import React from 'react'
import { Create, SelectInput, SimpleForm, TextInput } from 'react-admin'
import AppList from './AppList'
import { AppShow } from './AppShow'

export { AppList, AppShow }

const regionChoices = (
  cloud: string
): { defaultValue: string; choices: { id: string; name: string }[] } => {
  if (cloud === 'gcp') {
    return {
      defaultValue: 'v2018-us-central1',
      choices: [
        { id: 'v2018-us-central1', name: 'v2018-us-central1' },
        { id: 'europe-west1', name: 'europe-west1' }
      ]
    }
  }
  if (cloud === 'aws') {
    return {
      defaultValue: 'us-east-1',
      choices: [
        { id: 'us-east-1', name: 'us-east-1' },
        { id: 'us-west-2', name: 'us-west-2' }
      ]
    }
  }
  return { defaultValue: '', choices: [] }
}

interface CreateProps {
  title: string
  actions: React.ReactElement
  aside: React.ReactElement
}

export const AppCreate: React.FunctionComponent<CreateProps> = (
  props
): React.ReactElement => {
  const [cloud, setCloud] = React.useState('gcp')
  const regions = regionChoices(cloud)

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" label="App Name" />
        <SelectInput
          source="cloud"
          defaultValue="gcp"
          choices={[
            { id: 'gcp', name: 'Google Cloud Platform' },
            { id: 'aws', name: 'Amazon Web Services' }
          ]}
          onChange={(_event: React.FormEvent, key: string): void =>
            setCloud(key)}
        />
        {cloud !== '' && <SelectInput source="region" {...regions} />}
      </SimpleForm>
    </Create>
  )
}
