import { config } from '../config'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

const redirectToLogin = () => { window.location = config.redirectUrl }

const handleErrors = (res) => {
  if (res.status === 403) { redirectToLogin() }
  if (!res.ok) { return Promise.reject(res, res.status) }
  return res
}

export default (path, options = {}) => {
  const { apiUrl } = config
  const defaults = {
    credentials: 'include',
    persist: true,
    parseJson: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  options = { ...defaults, ...options }

  if (!path) { throw new Error('No path specified') }

  return fetch(`${apiUrl}/${path}`, options)
    .then(handleErrors)
    .then(res => options.parseJson ? res.json() : res)
}
