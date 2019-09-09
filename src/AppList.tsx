import Card from '@material-ui/core/Card'
// import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import React from 'react'
import { List, TextField } from 'react-admin'
import { Link } from 'react-router-dom'

const cardStyle = {
  width: 300,
  minHeight: 300,
  margin: '0.5em',
  display: 'inline-block',
  verticalAlign: 'top',
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
      <Link key={id} to={`/apps/${id}/show`}>
        <Card style={cardStyle}>
          <CardHeader title={<TextField record={data[id]} source="id" />} />
          <CardContent>
            <TextField record={data[id]} source="replicas" />
            <TextField record={data[id]} source="size" />
            <TextField record={data[id]} source="cloud" />
            <TextField record={data[id]} source="region" />
            <TextField record={data[id]} source="stack" />
          </CardContent>
          {/* <CardActions style={{ textAlign: 'right' }}>
            <ShowButton resource="apps" basePath="/apps" record={data[id]} />
          </CardActions> */}
        </Card>
      </Link>
    ))}
  </div>
)
AppGrid.defaultProps = {
  data: {},
  ids: [],
}

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
interface ListProps {
  id: string
  basePath: string
  resource: string
}

const AppList = (props: ListProps) => (
  <List title="All apps" pagination={null} bulkActions={false} {...props}>
    <AppGrid />
  </List>
)

export default AppList
