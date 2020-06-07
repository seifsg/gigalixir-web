import { LocationChangeAction, LOCATION_CHANGE } from 'connected-react-router'
import { takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import ReactGA from 'react-ga'

function trackPageview(action: LocationChangeAction) {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-97210391-1')
    ReactGA.pageview(
      action.payload.location.pathname + action.payload.location.search
    )
  }
}

export default function* analyticsSaga() {
  yield takeEvery((action: Action): boolean => {
    return action.type === LOCATION_CHANGE
  }, trackPageview)
}
