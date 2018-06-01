// TOOD: need to figure out an interface to make configuration possible
const apiUrl = 'http://localhost:3001/api/v1'
const loginUrl = '/login'
// import { apiUrl, loginUrl } from '../../lib/urls'

export const GET = 'GET'
export const POST = 'POST'
export const PUT = 'PUT'
export const DELETE = 'DELETE'

const redirectToLogin = () => { window.location = loginUrl }

const handleErrors = (res) => {
  if (res.status === 403) { redirectToLogin() }
  if (!res.ok) { return Promise.reject(res, res.status) }
  return res
}

export default (path, options = {}) => {
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

  console.log('try to go to', `${apiUrl}/${path}`)

  return fetch(`${apiUrl}/${path}`, options)
    .then(handleErrors)
    .then(res => options.parseJson ? res.json() : res)
    .catch(reason => console.log('failed with', reason))
}
