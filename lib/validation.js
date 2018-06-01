import has from 'lodash/has'
import set from 'lodash/set'
import forIn from 'lodash/forIn'

export const transformValidationErrors = (errors) => {
  const transformedErrors = {}

  forIn(errors, (value, key) => {
    if (!has(transformedErrors, key)) {
      set(transformedErrors, key, value.join(', '))
    }
  })

  return transformedErrors
}
