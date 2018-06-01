import reduxCrud from 'redux-crud'
import humps from 'humps'
import omit from 'lodash/omit'

import request, { GET, POST, PUT, DELETE } from './request'
import { transformKeys, parseValidationErrors, requestBody } from './utilities'
import { wrapArray } from '../lib/utilities'

// Read action

// Stores pending fetch request promises so we can eliminate duplicate requests
let cachedFetchRequests = {}
const clearCachedFetchRequest = (path) => (json) => {
  cachedFetchRequests = omit(cachedFetchRequests, path)
  return json
}

const fetchSuccessRequest = (action) => ({
  ...action,
  records: wrapArray(action.records),
  receivedAt: new Date()
})

export const fetch = (resourceName, options = {}) => dispatch => {
  const actionCreators = reduxCrud.actionCreatorsFor(resourceName)
  const key = options.key || resourceName
  const path = options.path || humps.decamelize(resourceName)
  const reduxCrudOptions = options.replace ? { replace: options.replace } : undefined

  dispatch(actionCreators.fetchStart())

  if (!cachedFetchRequests[path]) {
    // Cache request promise and return it later for duplicate requests
    cachedFetchRequests[path] = request(path, { ...options, method: GET })
  }

  // Return cached fetch promise
  return cachedFetchRequests[path]
    .catch(e => {
      console.error(`fetching ${resourceName} failed`)
      dispatch(actionCreators.fetchError({ status: e.status, statusText: e.statusText, type: e.type }))
      throw e
    })
    .then((json) => dispatch(
      fetchSuccessRequest(actionCreators.fetchSuccess(transformKeys(json, key), reduxCrudOptions))
    ))
    .then(clearCachedFetchRequest(path))
}

// Create action

export const create = (resourceName, record, options = { persist: true }) => dispatch => {
  const actionCreators = reduxCrud.actionCreatorsFor(resourceName)
  const key = options.key || resourceName
  const { id, ...recordWithOutId } = record
  const body = requestBody(recordWithOutId, key)
  const path = options.path || humps.decamelize(resourceName)

  dispatch(actionCreators.createStart(record))

  if (options.persist === false) {
    dispatch(actionCreators.createSuccess(record, record.id))
    return Promise.resolve()
  }

  return request(path, { ...options, method: POST, body })
    .then(json => dispatch(actionCreators.createSuccess(transformKeys(json, key), id)))
    .catch(res => {
      if (res.status === 422) {
        return parseValidationErrors(res, errors => {
          dispatch(actionCreators.createError(errors, record))
          return Promise.reject(errors)
        })
      } else {
        console.error(`creating ${resourceName} failed:`, res)
        dispatch(actionCreators.createError(res, record))
        throw res
      }
    })
}

// Update action

export const update = (resourceName, record, options = { persist: true }) => dispatch => {
  const actionCreators = reduxCrud.actionCreatorsFor(resourceName)
  const key = options.key || resourceName
  const { id, ...recordWithOutId } = record
  const body = requestBody(recordWithOutId, key)
  const path = options.path || humps.decamelize(resourceName)

  dispatch(actionCreators.updateStart(record))

  if (options.persist === false) {
    dispatch(actionCreators.updateSuccess(record))
    return Promise.resolve()
  }

  return request(path, { ...options, method: PUT, body })
    .then(json => dispatch(actionCreators.updateSuccess(transformKeys(json, key), record.id)))
    .catch(res => {
      if (res.status === 422) {
        return parseValidationErrors(res, errors => {
          dispatch(actionCreators.updateError(errors, record))
          return Promise.reject(errors)
        })
      } else {
        console.error(`update ${resourceName} failed:`, res)
        dispatch(actionCreators.updateError(res, record))
        throw res
      }
    })
}

// Destroy action

export const destroy = (resourceName, record, options = { persist: true }) => dispatch => {
  const actionCreators = reduxCrud.actionCreatorsFor(resourceName)
  const path = options.path || humps.decamelize(resourceName)

  dispatch(actionCreators.deleteStart(record))

  if (options.persist === false) {
    dispatch(actionCreators.deleteSuccess(record))
    return Promise.resolve()
  }

  return request(path, { ...options, parseJson: false, method: DELETE })
    .then(() => dispatch(actionCreators.deleteSuccess(record)))
    .catch(e => {
      console.error(`deleting ${resourceName} failed:`, e)
      dispatch(actionCreators.deleteError(e, record))
      throw e
    })
}

// Exports

export const actionTypesFor = (resourceName) => reduxCrud.actionTypesFor(resourceName)
export const actionCreatorsFor = (resourceName) => reduxCrud.actionCreatorsFor(resourceName)
