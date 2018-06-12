# Fetch Redux Crud (Work In Progress)

A simple library to keep your redux api code DRY. If you are using a RESTful api, you should be able to eliminate a lot of duplicated reducers. This extends the already excellent [redux-crud](https://github.com/Versent/redux-crud) library.

# Usage

```javascript
// actions/users.js
imporot { fetch } from 'fetch-redux-crud'

export const fetchUser = () => fetch('users') // goes to GET `${config.apiUrl}/users`
```

```javascript
// reducers/users.js
import { reducersFor } from 'fetch-redux-crud'

export default reducersFor('users') // automatically handles all actions for users
```

```javascript
// selectors/users.js
import values from 'lodash/values'

// returns an array of all users, e.g. usage getUsers(state)
export const getUsers = (state) => values(state.users.items)

// returns users indexed by the user id, e.g. usage getUsersById(state)[1] <- gets user with id 1
export const getUsersById = (state) => state.users.items
```
Note: the `resourceName` passed in the `fetch`, `create`, `update` or `destory` should match the string passed to `reducersFor`.

# install

```bash
yarn add fetch-redux-crud
```

or

```bash
npm install --save fetch-redux-crud
```

# Configure

```javascript
// main.js
import { configure } from 'fetch-redux-crud'

configure.apiUrl = 'http://path.to.api.domain/api/v1'
configure.loginUrl = 'http://path.to.login/page'
```

# Custom REST Paths (Nested Paths)

Often we need to use nested paths, for example, `GET /countries/:id/users`, in these cases you can simply pass in a `path` like so:

```javascript
// actions/users.js

export const getUsersForCountry = (countryId) => fetch('users', { path: `/countries/${countryId}/users` })
```

# Customizing Reducers

You can add additional reducers or modify the existing behavior of `fetch-redux-crud` reducers by using a switch statement like so:

```
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

`fetch-redux-crud` automatically creates all the CRUD action types for interacting with your API. It even does optimistic updates for you. Below is a list of all the different actions we support.

- `actionTypesFor(resourceName).<action_type>`
     - `fetchStart` - a fetch has started
     - `fetchSuccess` - an api fetch has returned successfully from the server
     - `fetchFailed` - an api fetch request failed
     
     - `createStart` - a create has started
     - `createSuccess` - an api create has returned successfully from the server
     - `createFailed` - an api create request failed

     - `updateStart` - an update has started
     - `updateSuccess` - an api update has returned successfully from the server
     - `updateFailed` - an api update request failed
     
     - `destroyStart` - a destroy has started
     - `destroySuccess` - an api destroy has returned successfully from the server
     - `destroyFailed` - an api destroy request failed
     
# Redux State Structure

TODO: document internal redux structure

# Related Projects

* [Resourceful Components](https://github.com/mattvague/resourceful-components)
* [redux-crud](https://github.com/Versent/redux-crud)
