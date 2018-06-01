import isArray from 'lodash/isArray'

export const wrapArray = (objectOrArray) =>
  isArray(objectOrArray) ? objectOrArray : [objectOrArray]
