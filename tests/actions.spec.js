import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'

import { config } from '../src/config'
import {
  fetch,
  create,
  update,
  destroy,
  actionTypesFor
} from '../src'

const { apiUrl } = config
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
let actionTypes = actionTypesFor('photos')

describe('async api actions', () => {
  let store

  beforeEach(() => {
    store = mockStore()
  })

  afterEach(() => {
    fetchMock.restore()
  })

  const resultActions = (store) => store.getActions().map(a => {
    if (a.receivedAt) {
      return { ...a, receivedAt: !!a.receivedAt }
    } else {
      return a
    }
  })

  describe('#fetch', () => {
    it('makes GET request and dispatches actions', () => {
      fetchMock.get(`${apiUrl}/photos`, { photos: [{ id: 1, some_attr: 'yoooO123' }] })

      const expectedActions = [
        {
          type: actionTypes.fetchStart,
          data: undefined
        },
        {
          type: actionTypes.fetchSuccess,
          data: undefined,
          receivedAt: true,
          records: [{
            id: 1, someAttr: 'yoooO123'
          }]
        }
      ]

      return store.dispatch(fetch('photos'))
        .then(resp => {
          expect(resultActions(store)).toEqual(expectedActions)
          expect(resp.records).toEqual([{ id: 1, someAttr: 'yoooO123' }])
        })
    })

    it('makes only allows a single request for the same url at a time', () => {
      fetchMock.get(`${apiUrl}/photos`, { photos: [{ id: 1, some_attr: 'yoooO123' }] })

      const expectedActions = [
        {
          type: actionTypes.fetchStart,
          data: undefined
        },
        {
          type: actionTypes.fetchStart,
          data: undefined
        },
        {
          type: actionTypes.fetchSuccess,
          data: undefined,
          receivedAt: true,
          records: [{
            id: 1, someAttr: 'yoooO123'
          }]
        },
        {
          type: actionTypes.fetchSuccess,
          data: undefined,
          receivedAt: true,
          records: [{
            id: 1, someAttr: 'yoooO123'
          }]
        }
      ]

      store.dispatch(fetch('photos'))

      expect(fetchMock.calls(`${apiUrl}/photos`).length).toEqual(1)

      return store.dispatch(fetch('photos'))
        .then(() => expect(resultActions(store)).toEqual(expectedActions))
    })

    it("optionally doesn't look for a root JSON key", () => {
      fetchMock.get(`${apiUrl}/photos`, { id: 1, some_attr: 'yoooO123' })

      const expectedActions = [
        {
          type: actionTypes.fetchStart,
          data: undefined
        },
        {
          type: actionTypes.fetchSuccess,
          data: undefined,
          receivedAt: true,
          records: [{
            id: 1, someAttr: 'yoooO123'
          }]
        }
      ]

      return store.dispatch(fetch('photos', { key: false }))
        .then(() => expect(resultActions(store)).toEqual(expectedActions))
    })
  })

  describe('#create', () => {
    it('creates POST request and dispatches actions', () => {
      fetchMock.post(`${apiUrl}/photos`, { photo: { id: 1, some_attr: 'yoooO123' } })

      const expectedActions = [
        {
          type: actionTypes.createStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          cid: 1,
          type: actionTypes.createSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(create('photos', { id: 1, someAttr: 'yoooO123' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('optionally doesn\'t persist to API', () => {
      const expectedActions = [
        {
          type: actionTypes.createStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          cid: 1,
          type: actionTypes.createSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(create('photos', { id: 1, someAttr: 'yoooO123' }, { persist: false }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it("optionally doesn't include root key", () => {
      fetchMock.post(`${apiUrl}/photos`, { id: 1, some_attr: 'yoooO123' })

      const expectedActions = [
        {
          type: actionTypes.createStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          cid: 1,
          type: actionTypes.createSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      
      return store.dispatch(create('photos', { id: 1, someAttr: 'yoooO123' }, { key: false }))
        .then(() => {
          expect(JSON.parse(fetchMock.lastCall()[1].body)).toEqual({ some_attr: 'yoooO123' })
        })
    })

    it('rejects the promise with validation errors if a 422 is returned', () => {
      fetchMock.post(`${apiUrl}/photos`, {
        status: 422,
        body: {
          errors: {
            'photo.someAttr': ['is bs']
          }
        }
      })

      return store.dispatch(create('photos', { id: 1, someAttr: 'yoooO123' }))
        .catch((errors) => {
          expect(errors).toEqual({ photo: { someAttr: 'is bs' } })
        })
    })
  })

  describe('#update', () => {
    it('creates PUT request and dispatches actions', () => {
      fetchMock.put(`${apiUrl}/photos/1`, { photo: { id: 1, some_attr: 'yoooO123' } })

      const expectedActions = [
        {
          type: actionTypes.updateStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          type: actionTypes.updateSuccess,
          data: 1,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(update('photos', { id: 1, someAttr: 'yoooO123' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('optionally doesn\'t persist to API', () => {
      const expectedActions = [
        {
          type: actionTypes.updateStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          type: actionTypes.updateSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(update('photos', { id: 1, someAttr: 'yoooO123' }, { persist: false }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it("optionally doesn't include root key", () => {
      fetchMock.put(`${apiUrl}/photos/1`, { id: 1, some_attr: 'yoooO123' })

      const expectedActions = [
        {
          type: actionTypes.createStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          cid: 1,
          type: actionTypes.createSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(update('photos', { id: 1, someAttr: 'yoooO123' }, { key: false }))
        .then(() => {
          expect(JSON.parse(fetchMock.lastCall()[1].body)).toEqual({ some_attr: 'yoooO123' })
        })
    })

    it('rejects the promise with validation errors if a 422 is returned', () => {
      fetchMock.put(`${apiUrl}/photos/1`, {
        status: 422,
        body: {
          errors: {
            'photo.someAttr': ['is bs']
          }
        }
      })

      return store.dispatch(update('photos', { id: 1, someAttr: 'yoooO123' }))
        .catch((errors) => {
          expect(errors).toEqual({ photo: { someAttr: 'is bs' } })
        })
    })
  })

  describe('#destroy', () => {
    it('creates DELETE request and dispatches actions', () => {
      fetchMock.delete(`${apiUrl}/photos/1`, ' ')

      const expectedActions = [
        {
          type: actionTypes.deleteStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          type: actionTypes.deleteSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(destroy('photos', { id: 1, someAttr: 'yoooO123' }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('optionally doesn\'t persist to API', () => {
      fetchMock.delete(`${apiUrl}/photos`, {})

      const expectedActions = [
        {
          type: actionTypes.deleteStart,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        },
        {
          type: actionTypes.deleteSuccess,
          data: undefined,
          record: {
            id: 1, someAttr: 'yoooO123'
          }
        }
      ]

      return store.dispatch(destroy('photos', { id: 1, someAttr: 'yoooO123' }, { persist: false }))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })
  })

  it('makes decamelizes path names', () => {
    let actionTypes = actionTypesFor('somePhotos')
    fetchMock.get(`${apiUrl}/some_photos`, { somePhotos: [{ id: 1, some_attr: 'yoooO123' }] })

    const expectedActions = [
      {
        type: actionTypes.fetchStart,
        data: undefined
      },
      {
        type: actionTypes.fetchSuccess,
        data: undefined,
        receivedAt: true,
        records: [{
          id: 1, someAttr: 'yoooO123'
        }]
      }
    ]

    return store.dispatch(fetch('somePhotos'))
      .then(() => expect(resultActions(store)).toEqual(expectedActions))
  })

  it('optionally allows path configuration', () => {
    fetchMock.mock(`${apiUrl}/images`, { photos: [{ id: 1, some_attr: 'yoooO123' }] })

    const expectedActions = [
      {
        type: actionTypes.fetchStart,
        data: undefined
      },
      {
        type: actionTypes.fetchSuccess,
        data: undefined,
        receivedAt: true,
        records: [{
          id: 1, someAttr: 'yoooO123'
        }]
      }
    ]

    return store.dispatch(fetch('photos', { path: 'images' }))
      .then(() => expect(resultActions(store)).toEqual(expectedActions))
  })

  it('optionally allows JSON key configuration', () => {
    fetchMock.mock(`${apiUrl}/photos`, { photosBlarg: [{ id: 1, some_attr: 'yoooO123' }] })

    const expectedActions = [
      {
        type: actionTypes.fetchStart,
        data: undefined
      },
      {
        type: actionTypes.fetchSuccess,
        data: undefined,
        receivedAt: true,
        records: [{
          id: 1, someAttr: 'yoooO123'
        }]
      }
    ]

    return store.dispatch(fetch('photos', { key: 'photosBlarg' }))
      .then(() => expect(resultActions(store)).toEqual(expectedActions))
  })
})
