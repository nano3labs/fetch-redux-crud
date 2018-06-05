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
# Related Projects

[Resourceful Components](https://github.com/mattvague/resourceful-components)
[redux-crud](https://github.com/Versent/redux-crud)
