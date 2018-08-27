import { config } from '../src/config'
import request from '../src/api/request'

describe('api path should be configurable', () => {
  beforeEach(() => {
    fetch.resetMocks()
  })

  it('should make a request to the given api path', () => {
    fetch.mockResponseOnce(JSON.stringify({ data: '12345' }))
    config.apiUrl = 'http://custom.domain/api'

    request('posts')

    expect(fetch.mock.calls[0][0]).toEqual('http://custom.domain/api/posts')
  })
})
