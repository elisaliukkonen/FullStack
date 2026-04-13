const { test, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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

  test('a new blog can be added', async () => {
    const blogsAtStart = await Blog.find({})

    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
