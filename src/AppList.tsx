import Card from '@material-ui/core/Card'
import { connect } from 'react-redux'
import { push as routerPush } from 'react-router-redux'
import Button from '@material-ui/core/Button'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';
import React from 'react'
import { List, ShowButton, TextField } from 'react-admin'
// import { Link } from 'react-router-dom'

const cardStyle = {
  width: 300,
  minHeight: 300,
  margin: '0.5em',
  display: 'inline-block',
  verticalAlign: 'top'
}

const tableStyle = {
  borderCollapse: 'collapse',
  width: '100%',
  minWidth: '650px',
  margin: '40px 0 0'
} as React.CSSProperties;

const tableHeadRowStyle = {
  borderBottom: '1px solid #ddd',
} as React.CSSProperties;

const tableRowStyle = {
  borderBottom: '1px solid #ddd',
  '&:hover': {
    backgroundColor: '#eaeaea',
  }
} as React.CSSProperties;

const tableCellStyle = {
  padding: '20px 15px',
} as React.CSSProperties;

const deleteButtonStyle = {
  color: '#888',
  fontSize: '12px',
  textTransform: 'none',
  backgroundColor: '#ddd',
  borderRadius: '10px',
  padding: '2px 8px'
} as React.CSSProperties;

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

interface DataNew {
  [id: string]: {
    replicas: number
    size: number
    cloud: string
    region: string
    stack: string
    unique_name: string
  }
}
// setting props properly here is hard because 1) there are a ton of props that react-admin injects for us
// and 2) any props defined here need to be specified below, but we would just be putting dummy values in
// the real values are injected by redux-form, react-admin, etc. need to find a better way to do this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MaybeEmptyDatagrid = (props: any) => {
  const {total, data, ids, isLoading, push } = props;
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
    <table style={tableStyle}>
      <thead>
        <tr style={tableHeadRowStyle}>
          <th style={tableCellStyle} align="left">App Name</th>
          <th style={tableCellStyle}>Cloud</th>
          <th style={tableCellStyle}>Region</th>
          <th style={tableCellStyle}>Stack</th>
          <th style={tableCellStyle}>Size</th>
          <th style={tableCellStyle}>Replica</th>
          <th style={tableCellStyle}>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {ids.map( (dataObj: DataNew, index: number) => (
          <tr key={index} style={tableRowStyle}>
            <td style={tableCellStyle}>{data[index+1].unique_name}</td>
            <td style={tableCellStyle} align="center">{data[index+1].cloud}</td>
            <td style={tableCellStyle} align="center">{data[index+1].region}</td>
            <td style={tableCellStyle} align="center">{data[index+1].stack}</td>
            <td style={tableCellStyle} align="center">
              <Badge badgeContent={data[index+1].size} color="primary"> </Badge>
            </td>
            <td style={tableCellStyle} align="center">
              <Badge badgeContent={data[index+1].replicas} color="secondary"> </Badge>
            </td>
            <td style={tableCellStyle} align="right">
              <Button size="small" style={deleteButtonStyle}>
                <DeleteIcon style={{ fontSize: 18 }} />Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// TODO: is it considered bad form to have a connected component inside a connected component?
// actually, is AppList even a connected component? does react-admin do that?
const ConnectedMaybeEmptyDatagrid = connect(null, {
  push: routerPush,
  data: [],
  ids: [],
})(MaybeEmptyDatagrid)

const AppList = (props: ListProps) => (
  <List title="All apps" pagination={null} bulkActions={false} {...props}>
    {/* <AppGrid /> */}
    <ConnectedMaybeEmptyDatagrid />
  </List>
)

export default AppList
