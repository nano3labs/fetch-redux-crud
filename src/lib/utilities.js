import isArray from 'lodash/isArray'
import { singular } from 'pluralize'
import humps from 'humps'
import { transformValidationErrors } from '../lib/validation'

export const wrapArray = (objectOrArray) =>
  isArray(objectOrArray) ? objectOrArray : [objectOrArray]

export const transformKeys = (json = {}, key) => {
  const items = key ? (json[key] || json[singular(key)]) : json
  return humps.camelizeKeys(items)
}

export const parseValidationErrors = (res, handler) =>
  res.json()
    .then(json => transformValidationErrors(transformKeys(json, 'errors')))
    .then(handler)

export const requestBody = (record = {}, key) =>
  JSON.stringify(humps.decamelizeKeys(
    key ? { [singular(key)]: record } : record,
    { split: /(?=[A-Z0-9])/ }
  ))