import { combineReducers } from 'redux'
import reduxCrud from 'redux-crud'

export const metaInitialState = {
  isFetching: false,
  didInvalidate: false,
  lastUpdatedAt: null,
  error: null
}

export const metaFor = (resourceName, options = {}) => {
  const actionTypes = reduxCrud.actionTypesFor(resourceName)

  return (state = metaInitialState, action) => {
    switch (action.type) {
      case actionTypes.fetchStart:
        return {
          ...state,
          didInvalidate: false,
          isFetching: true,
          error: null
        }
      case actionTypes.fetchSuccess:
        return {
          ...state,
          didInvalidate: false,
          isFetching: false,
          lastUpdatedAt: action.receivedAt,
          error: null
        }
      case actionTypes.fetchError:
        return {
          ...state,
          isFetching: false,
          error: action.error
        }
      default:
        return {
          ...state
        }
    }
  }
}

export const itemsFor = (resourceName, options = {}) => (state = {}, action) =>
  reduxCrud.Map.reducersFor(resourceName, options)(state, action)

export const reducersFor = (resourceName, options = {}) => combineReducers({
  items: itemsFor(resourceName, options),
  meta: metaFor(resourceName, options)
})

export const isFetching = (state) => state.meta.isFetching
export const lastUpdatedAt = (state) => state.meta.lastUpdatedAt
export const isFetchingInitial = (state) => state.meta.isFetching && !state.meta.lastUpdatedAt
