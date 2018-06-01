import { singular } from 'pluralize'
import humps from 'humps'
import { transformValidationErrors } from '../lib/validation'

export const transformKeys = (json, key) => {
  const items = json[key] || json[singular(key)]
  return humps.camelizeKeys(items)
}

export const parseValidationErrors = (res, handler) =>
  res.json()
    .then(json => transformValidationErrors(transformKeys(json, 'errors')))
    .then(handler)

export const requestBody = (record, key) =>
  JSON.stringify(humps.decamelizeKeys({ [singular(key)]: record }, { split: /(?=[A-Z0-9])/ }))
