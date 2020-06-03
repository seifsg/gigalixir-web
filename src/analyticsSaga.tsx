import { LocationChangeAction, LOCATION_CHANGE } from 'react-router-redux'
import { takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import ReactGA from 'react-ga'

function trackPageview(action: LocationChangeAction) {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-97210391-1')
    ReactGA.pageview(action.payload.pathname + action.payload.search)
  }
}

export default function* analyticsSaga() {
  yield takeEvery((action: Action): boolean => {
    return action.type === LOCATION_CHANGE
  }, trackPageview)
}
