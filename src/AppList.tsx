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
  margin: '20px 0 0'
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

const tableCellHeadingStyle = {
  color: '#323232',
  fontWeight: 600,
  padding: '20px 15px',
} as React.CSSProperties;

const tableCellStyle = {
  color: '#323232',
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

const tableHeaderTop = {
  borderBottom: '1px solid #aaa',
} as React.CSSProperties;

const topHeading = {
  color: '#333',
  fontSize: '20px',
  margin: '20px 0',
} as React.CSSProperties;

const tableHeaderBottom = {
  padding: '20px 0',
  overflow: 'hidden'
} as React.CSSProperties;

const topHeading2 = {
  color: '#333',
  float: 'left',
  fontSize: '16px',
  margin: '0',
} as React.CSSProperties;

const createButtonStyle = {
  float: 'right',
  backgroundColor: '#216dff',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#4380f4',
  },
  textTransform: 'capitalize',
} as React.CSSProperties;

const deleteIconStlye = {
  fontSize: 18,
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

const MainHeader = (props: any) => {
  return (
    <div>
      <header>
        <div style={tableHeaderTop}>
          <h1 style={topHeading}>Dashboard</h1>
        </div>
        <div style={tableHeaderBottom}>
          <h2 style={topHeading2}>All Apps</h2>
          <Button variant="contained" style={createButtonStyle}>+ Create</Button>
        </div>
      </header>
    </div>
  );
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
const dataList = [
  {
    id: 1,
    unique_name: 'fake-app',
    stack: 'gigalixir-18',
    size: 1.0,
    replicas: 1,
    region: 'v2018-us-central1',
    cloud: 'gcp'
  },
  {
    id: 2,
    unique_name: 'fake-app',
    stack: 'gigalixir-18',
    size: 1.0,
    replicas: 1,
    region: 'v2018-us-central1',
    cloud: 'gcp'
   }
];

const idsArr=[0,1];

// setting props properly here is hard because 1) there are a ton of props that react-admin injects for us
// and 2) any props defined here need to be specified below, but we would just be putting dummy values in
// the real values are injected by redux-form, react-admin, etc. need to find a better way to do this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MaybeEmptyDatagrid = (props: any) => {
    console.log('PROPSSS', props)
    const {total, data, ids, isLoading, push } = props;
    
    if (!isLoading && (ids && ids.length === 0 || total === 0)) {
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
      <div>
        <MainHeader />
        <table style={tableStyle}>
          <thead>
            <tr style={tableHeadRowStyle}>
              <th style={tableCellHeadingStyle} align="left">App Name</th>
              <th style={tableCellHeadingStyle}>Cloud</th>
              <th style={tableCellHeadingStyle}>Region</th>
              <th style={tableCellHeadingStyle}>Stack</th>
              <th style={tableCellHeadingStyle}>Size</th>
              <th style={tableCellHeadingStyle}>Replica</th>
              <th style={tableCellHeadingStyle}>&nbsp;</th>
            </tr>
          </thead>

          <tbody>
            {ids && ids.map( (index: number) => {
              const app: App = data[index]
              return (
              <tr
                key={index}
                style={tableRowStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaeaea')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
              >
                <td style={tableCellStyle}>{data[index].id}</td>
                <td style={tableCellStyle} align="center">{data[index].cloud}</td>
                <td style={tableCellStyle} align="center">{data[index].region}</td>
                <td style={tableCellStyle} align="center">{data[index].stack}</td>
                <td style={tableCellStyle} align="center">
                  <Badge badgeContent={data[index].size} color="primary"> </Badge>
                </td>
                <td style={tableCellStyle} align="center">
                  <Badge badgeContent={data[index].replicas} color="secondary"> </Badge>
                </td>
                <td style={tableCellStyle} align="right">
                  <Button size="small" style={deleteButtonStyle}>
                    <DeleteIcon style={deleteIconStlye} />Delete
                  </Button>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    )
}

// TODO: is it considered bad form to have a connected component inside a connected component?
// actually, is AppList even a connected component? does react-admin do that?
const ConnectedMaybeEmptyDatagrid = connect(null, {
  push: routerPush,
  data: [],
  ids: [],
})(MaybeEmptyDatagrid)

const AppList = (props: any) => {
  console.log('pppp', props)
  return (
    <List title="All apps" pagination={null} bulkActions={false} {...props}>
     <ConnectedMaybeEmptyDatagrid />
    </List>
  )
}

export default AppList
