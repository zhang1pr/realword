import { createMocks } from 'node-mocks-http'
import handler from '../../pages/api/users'

jest.mock('../../lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(async ({ data }) => ({ id: 1, email: data.email, username: data.username, bio: null, image: null }))
    }
  }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn(async () => 'hashed-password')
}))

describe('/api/users', () => {
  it('creates a new user and returns a token', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        user: {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password'
        }
      }
    })

    await handler(req, res)
    expect(res._getStatusCode()).toBe(201)
    const data = JSON.parse(res._getData() as string)
    expect(data.user.email).toBe('test@example.com')
    expect(data.user.username).toBe('testuser')
    expect(data.user.token).toBeTruthy()
  })
})
