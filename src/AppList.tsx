import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import React from 'react'
import { Datagrid, NumberField, List, ShowButton, TextField } from 'react-admin'
// import { Link } from 'react-router-dom'

const cardStyle = {
  width: 300,
  minHeight: 300,
  margin: '0.5em',
  display: 'inline-block',
  verticalAlign: 'top'
}
interface Data {
  [id: string]: {
    replicas: number
    size: number
    cloud: string
    region: string
    stack: string
  }
}
const AppGrid = ({ ids, data }: { ids: string[]; data: Data }) => (
  <div style={{ margin: '1em' }}>
    {ids.map(id => (
      // <Link key={id} to={`/apps/${id}/show`}>
      <Card key={id} style={cardStyle}>
        <CardHeader title={<TextField record={data[id]} source="id" />} />
        <CardContent>
          <TextField record={data[id]} source="replicas" />
          <TextField record={data[id]} source="size" />
          <TextField record={data[id]} source="cloud" />
          <TextField record={data[id]} source="region" />
          <TextField record={data[id]} source="stack" />
        </CardContent>
        <CardActions style={{ textAlign: 'right' }}>
          <ShowButton resource="apps" basePath="/apps" record={data[id]} />
        </CardActions>
      </Card>
      // </Link>
    ))}
  </div>
)
AppGrid.defaultProps = {
  data: {},
  ids: []
}

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
interface ListProps {
  id: string
  basePath: string
  resource: string
}

const MaybeEmptyDatagrid = (props: any) => {
  const { push, total, ids, isLoading } = props
  if (!isLoading && (ids.length === 0 || total === 0)) {
    return (
      <div>
        No apps yet.
        <Button
          variant="raised"
          color="primary"
          onClick={() => {
            push('/apps/create')
          }}
        >
          Create App
        </Button>
      </div>
    )
  }
  return (
    <Datagrid rowClick="show" {...props}>
      <TextField source="id" />
      <NumberField source="size" />
      <NumberField source="replicas" />
      <TextField source="cloud" />
      <TextField source="region" />
      <TextField source="stack" />
    </Datagrid>
  )
}

// TODO: is it considered bad form to have a connected component inside a connected component?
// actually, is AppList even a connected component? does react-admin do that?
const ConnectedMaybeEmptyDatagrid = connect(
  null,
  {
    push
  }
)(MaybeEmptyDatagrid)

const AppList = (props: ListProps) => (
  <List title="All apps" pagination={null} bulkActions={false} {...props}>
    {/* <AppGrid /> */}
    <ConnectedMaybeEmptyDatagrid />
  </List>
)

export default AppList
