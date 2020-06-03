import { LocationChangeAction, LOCATION_CHANGE } from 'react-router-redux'
import { takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import ReactGA from 'react-ga'
import logger from './logger'

function trackPageview(action: LocationChangeAction) {
  ReactGA.initialize('UA-97210391-1')
  ReactGA.pageview(action.payload.pathname + action.payload.search)
  logger.debug(JSON.stringify(action))
}

export default function* analyticsSaga() {
  yield takeEvery((action: Action): boolean => {
    return action.type === LOCATION_CHANGE
  }, trackPageview)
}
