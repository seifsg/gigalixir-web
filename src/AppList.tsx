import Card from '@material-ui/core/Card'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { push as routerPush } from 'react-router-redux'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import React from 'react'
import { Datagrid, NumberField, ShowButton, TextField } from 'react-admin'
import List from './List'
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


const styles = createStyles({
  container: {
    marginLeft: "15px"
  },
  title: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    paddingBottom: '20px',
  }
})

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
interface Props {
  id: string
  basePath: string
  resource: string
}

interface EnhancedProps extends WithStyles<typeof styles> {
}

// setting props properly here is hard because 1) there are a ton of props that react-admin injects for us
// and 2) any props defined here need to be specified below, but we would just be putting dummy values in
// the real values are injected by redux-form, react-admin, etc. need to find a better way to do this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MaybeEmptyDatagrid = (props: any) => {
  const { push, ...sanitizedProps } = props
  const { total, ids, isLoading } = sanitizedProps
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
    <Datagrid elevation={0} rowClick="show" {...sanitizedProps}>
      <TextField source="id" sortable={false}/>
      <NumberField source="size" sortable={false}/>
      <NumberField source="replicas" sortable={false}/>
      <TextField source="cloud" sortable={false}/>
      <TextField source="region" sortable={false}/>
      <TextField source="stack" sortable={false}/>
    </Datagrid>
  )
}

// TODO: is it considered bad form to have a connected component inside a connected component?
// actually, is AppList even a connected component? does react-admin do that?
const ConnectedMaybeEmptyDatagrid = connect(null, {
  push: routerPush
})(MaybeEmptyDatagrid)

const AppList = (props: Props & EnhancedProps) => {
    const { classes } = props
    return (
      <div className={classes.container}>
        <h3 className={classes.title}>My Apps</h3>
        <List exporter={false} title="My Apps" pagination={null} bulkActions={false} {...props}>
          {/* <AppGrid /> */}
          <ConnectedMaybeEmptyDatagrid />
        </List>
      </div>
    )
}

const EnhancedAppList = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
)(AppList)

export default EnhancedAppList
