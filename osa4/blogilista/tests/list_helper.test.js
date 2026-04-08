const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list is empty equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10
    }
  ]

  test('blog with most likes is returned', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})
