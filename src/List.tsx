/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Children, cloneElement } from 'react'
import Card from '@material-ui/core/Card'
import classnames from 'classnames'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { ListController, getListControllerProps } from 'ra-core'
import {
  Title,
  defaultTheme,
  BulkDeleteButton,
  Pagination,
  BulkActionsToolbar,
  ListActions,
  ListToolbar
} from 'react-admin'
import logger from './logger'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultBulkActionButtons = (props: any) => <BulkDeleteButton {...props} />

export const styles = createStyles({
  root: {
    display: 'flex'
  },
  card: {
    position: 'relative',
    flex: '1 1 auto'
  },
  actions: {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignSelf: 'flex-start'
  },
  noResults: { padding: 20 }
})

const sanitizeRestProps = ({
  actions,
  basePath,
  bulkActions,
  changeListParams,
  children,
  classes,
  className,
  crudGetList,
  currentSort,
  data,
  defaultTitle,
  displayedFilters,
  exporter,
  filter,
  filterDefaultValues,
  filters,
  filterValues,
  hasCreate,
  hasEdit,
  hasList,
  hasShow,
  hideFilter,
  history,
  ids,
  loading,
  loaded,
  locale,
  location,
  match,
  onSelect,
  onToggleItem,
  onUnselectItems,
  options,
  page,
  pagination,
  params,
  permissions,
  perPage,
  push,
  query,
  refresh,
  resource,
  selectedIds,
  setFilters,
  setPage,
  setPerPage,
  setSelectedIds,
  setSort,
  showFilter,
  sort,
  theme,
  title,
  toggleItem,
  total,
  translate,
  version,
  ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => rest

export const ListView = withStyles(styles)(
  ({
    actions,
    aside,
    filter,
    filters,
    bulkActions,
    bulkActionButtons,
    pagination,
    children,
    className,
    classes,
    exporter,
    title,
    ...rest
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any) => {
    const { defaultTitle, version } = rest
    const controllerProps = getListControllerProps(rest)
    return (
      <div
        className={classnames('list-page', classes.root, className)}
        {...sanitizeRestProps(rest)}
      >
        <Title title={title} defaultTitle={defaultTitle} />
        <Card elevation={0} className={classes.card}>
          {bulkActions !== false &&
            bulkActionButtons !== false &&
            bulkActionButtons &&
            !bulkActions && (
              <BulkActionsToolbar {...controllerProps}>
                {bulkActionButtons}
              </BulkActionsToolbar>
            )}
          {(filters || actions) && (
            <ListToolbar
              filters={filters}
              {...controllerProps}
              actions={actions}
              bulkActions={bulkActions}
              exporter={exporter}
              permanentFilter={filter}
            />
          )}
          <div key={version}>
            {children &&
              cloneElement(Children.only(children), {
                ...controllerProps,
                hasBulkActions:
                  bulkActions !== false && bulkActionButtons !== false
              })}
            {pagination && cloneElement(pagination, controllerProps)}
          </div>
        </Card>
        {aside && cloneElement(aside, controllerProps)}
      </div>
    )
  }
)

ListView.defaultProps = {
  actions: <ListActions />,
  classes: {},
  bulkActionButtons: <DefaultBulkActionButtons />,
  pagination: <Pagination />
}

/**
 * List page component
 *
 * The <List> component renders the list layout (title, buttons, filters, pagination),
 * and fetches the list of records from the REST API.
 * It then delegates the rendering of the list of records to its child component.
 * Usually, it's a <Datagrid>, responsible for displaying a table with one row for each post.
 *
 * In Redux terms, <List> is a connected component, and <Datagrid> is a dumb component.
 *
 * Props:
 *   - title
 *   - perPage
 *   - sort
 *   - filter (the permanent filter to apply to the query)
 *   - actions
 *   - filters (a React Element used to display the filter form)
 *   - pagination
 *
 * @example
 *     const PostFilter = (props) => (
 *         <Filter {...props}>
 *             <TextInput label="Search" source="q" alwaysOn />
 *             <TextInput label="Title" source="title" />
 *         </Filter>
 *     );
 *     export const PostList = (props) => (
 *         <List {...props}
 *             title="List of posts"
 *             sort={{ field: 'published_at' }}
 *             filter={{ is_published: true }}
 *             filters={<PostFilter />}
 *         >
 *             <Datagrid>
 *                 <TextField source="id" />
 *                 <TextField source="title" />
 *                 <EditButton />
 *             </Datagrid>
 *         </List>
 *     );
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const List = (props: any) => (
  <ListController {...props}>
    {controllerProps => {
      logger.debug(JSON.stringify(controllerProps))
      return <ListView {...props} {...controllerProps} />
    }}
  </ListController>
)

// List.propTypes = {
//     // the props you can change
//     actions: PropTypes.element,
//     aside: PropTypes.node,
//     bulkActions: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
//     bulkActionButtons: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
//     children: PropTypes.node,
//     classes: PropTypes.object,
//     className: PropTypes.string,
//     filter: PropTypes.object,
//     filterDefaultValues: PropTypes.object,
//     filters: PropTypes.element,
//     pagination: PropTypes.element,
//     perPage: PropTypes.number.isRequired,
//     sort: PropTypes.shape({
//         field: PropTypes.string,
//         order: PropTypes.string,
//     }),
//     title: PropTypes.any,
//     // the props managed by react-admin
//     authProvider: PropTypes.func,
//     hasCreate: PropTypes.bool.isRequired,
//     hasEdit: PropTypes.bool.isRequired,
//     hasList: PropTypes.bool.isRequired,
//     hasShow: PropTypes.bool.isRequired,
//     location: PropTypes.object.isRequired,
//     match: PropTypes.object.isRequired,
//     path: PropTypes.string,
//     resource: PropTypes.string.isRequired,
//     theme: PropTypes.object.isRequired,
// };

List.defaultProps = {
  filter: {},
  perPage: 10,
  theme: defaultTheme
}

export default List
