const { test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('blog api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are blogs', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body.length > 0)
  })

  test('blog identifier is named id not _id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id !== undefined)
    assert(response.body[0]._id === undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})
