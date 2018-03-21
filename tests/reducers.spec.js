import { reducersFor, actionTypesFor, metaInitialState } from '../../../src/lib/api'

describe('#reducersFor', () => {
  const reducer = reducersFor('myFunResource')
  const types = actionTypesFor('myFunResource')

  it('should handle initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      meta: metaInitialState,
      items: {}
    })
  })

  it('should handle fetchStart state', () => {
    const stateBefore = {
      meta: metaInitialState,
      items: {}
    }

    const stateAfter = {
      meta: {
        isFetching: true,
        didInvalidate: false,
        lastUpdatedAt: null,
        error: null
      },
      items: {}
    }

    expect(reducer(stateBefore, { type: types.fetchStart })).to.eql(stateAfter)
  })

  it('should handle fetchSuccess state', () => {
    const date = Date.now()
    const stateBefore = {
      meta: {
        isFetching: true,
        didInvalidate: false,
        lastUpdatedAt: null,
        error: null
      },
      items: {
        1: { id: 1, blah: 'blerg' }
      }
    }
    const stateAfter = {
      meta: {
        ...metaInitialState,
        lastUpdatedAt: date
      },
      items: {
        1: { id: 1, blah: 'blerg' },
        2: { id: 2, blah: 'blarg' }
      }
    }

    expect(reducer(stateBefore, {
      type: types.fetchSuccess,
      records: [
        { id: 2, blah: 'blarg' }
      ],
      receivedAt: date
    })).to.eql(stateAfter)
  })
})
