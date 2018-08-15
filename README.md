# Fetch Redux Crud (Work In Progress)

A simple library tying together [redux-crud](https://github.com/Versent/redux-crud) and [redux-thunk](https://github.com/reduxjs/redux-thunk) to keep API code in your React/Redux apps DRY by. If you are using a RESTful api, you should be able to eliminate a lot of duplicated actions and reducers

This library extends the already excellent [redux-crud](https://github.com/Versent/redux-crud) library to generate CRUD actions and reducers and [redux-thunk](https://github.com/reduxjs/redux-thunk) to build async API fetch actions

# Features

- Full lifecycle of actions to manage resources in Redux Store
- Optimistic updates for create, update and destroy actions
- Metadata management (fetch state, error state, etc)
- Simple and customizable (reducers can be fine-grainly customized)

# Usage

## Actions

```javascript
// actions/users.js
import { fetch, create, update, destroy } from 'fetch-redux-crud'

// Fetch single record
export const fetchUser = () => fetch('users', { id: 99 }) // Makes API request to GET /users/99

// Create record
export const createUser = () => create('users', { name: 'The Dude' }) // Makes API request to POST /users/99

// Update record 
export const updateUser = () => update('users', { id: 99, name: 'Jeff Lebowski' }) // Makes API request to PATCH /users/98

// Destroy record
export const destroyUser = () => destroy('users', 99) // Makes API request to DELETE /users/99
```

## Reducers

```javascript
// reducers/users.js
import { reducersFor } from 'fetch-redux-crud'

export default reducersFor('users') // automatically handles all CRUD actions for users
```

## Selectors

```javascript
// selectors/users.js
import values from 'lodash/values'

// returns an array of all users, e.g. usage getUsers(state)
export const getUsers = (state) => values(state.users.items)

// returns users indexed by the user id, e.g. usage getUsersById(state)[1] <- gets user with id 1
export const getUsersById = (state) => state.users.items
```
Note: the `resourceName` passed in the `fetch`, `create`, `update` or `destory` should match the string passed to `reducersFor`.

# Install

```bash
yarn add fetch-redux-crud
```

or

```bash
npm install --save fetch-redux-crud
```

# Configuration

```javascript
// main.js
import { config } from 'fetch-redux-crud'

config.apiUrl = 'http://path.to.api.domain/api/v1'
config.redirectUrl = 'http://path.to.login/page'
```

# Custom REST Paths (Nested Paths)

Often we need to use nested paths, for example, `GET /countries/:id/users`, in these cases you can simply pass in a `path` like so:

```javascript
// actions/users.js

export const getUsersForCountry = (countryId) => fetch('users', { path: `/countries/${countryId}/users` })
```

# Removing root key in requests

Some API's are built such that requests and responses don't have a root JSON key. Of course, we account for that:

```javascript
// actions/users.js

export const createUser = (countryId) => create('users', { name: 'Jim Beam' }, { key: false })
```

Which will generate JSON request like `{ name: 'Jim Beam' }` and likewise understand a JSON response without a root key. This option works for all action types.

# Customizing Reducers

You can add additional reducers or modify the existing behavior of `fetch-redux-crud` reducers by using a switch statement like so:

```javascript
// reducers/users.js
import { actionTypesFor, reducersFor } from 'fetch-redux-crud'

const users = (state, action) => {
  const actionTypes = actionTypesFor('users')

  switch (action.type) {
  case actionTypes.fetchSuccess: // hook into the success action
    console.log('fetch users success', action.record)
    return reducersFor('users')(state, action)
  default: // handle rest of the actions
    return reducersFor('users')(state, action)
  }
}

export default jobs
```

# Redux Action Types

`fetch-redux-crud` automatically creates all the CRUD action types for interacting with your API, event handling optimistic updates for you. Below is a list of all the different actions we support:

- `actionTypesFor(resourceName).<action_type>`
     - `fetchStart` - a fetch has started
     - `fetchSuccess` - an api fetch has returned successfully from the server
     - `fetchFailed` - an api fetch request failed
     
     - `createStart` - a create request has started, optimistically create a record in the store with a temporary CID
     - `createSuccess` - an api create has returned successfully from the server, update optimistically created record with record from API response
     - `createFailed` - an api create request failed, rollback optimistically created record

     - `updateStart` - an update has started, optimistically update record in store
     - `updateSuccess` - an api update has returned successfully from the server, update record in store with any additional fields from API response
     - `updateFailed` - an api update request failed
     
     - `destroyStart` - a destroy has started, optimistically "destroy" record in store by setting "deleted" attribute to `true`
     - `destroySuccess` - an api destroy has returned successfully from the server, actually destroy record in store 
     - `destroyFailed` - an api destroy request failed, rollback "destroyed" record by setting "deleted" to `false`

For more information on actions see https://github.com/Versent/redux-crud/blob/master/docs/actions.md
For more information on reducers see https://github.com/Versent/redux-crud/blob/master/docs/reducers.md
     
# Internal Redux State Structure

```
{
  [resourceName]: {
    items: {
      [id]: [object]
    },
    meta: {
      // data about last fetch, errors, etc
    }
  }
}
```

# Related Projects

* [Resourceful Components](https://github.com/mattvague/resourceful-components)
* [redux-crud](https://github.com/Versent/redux-crud)
