import { getDBConnection } from '../db/db.js'

export async function getGenres(req, res) {

  try {

    const db = await getDBConnection()

    const genreRows = await db.all('SELECT DISTINCT genre FROM products')
    const genres = genreRows.map(row => row.genre)
    res.json(genres)

  } catch (err) {

    res.status(500).json({error: 'Failed to fetch genres', details: err.message})

  }
}

export async function getProducts(req, res) {

  try {

    const db = await getDBConnection()

    let query = 'SELECT * FROM products'
    let params = []

    const { genre, search } = req.query

    if (genre) {
      query += ' WHERE genre = ?'
      params.push(genre)
    }

    if (search) {
      query = 'SELECT * FROM products WHERE genre LIKE ? OR title LIKE ? OR artist LIKE ?'
      const products = await db.all(query, [search.replace(search, `%${search}%`), search.replace(search, `%${search}%`), search.replace(search, `%${search}%`)])
      return res.json(products)
    }

    const products = await db.all(query, params)
    res.json(products)


  } catch (err) {

    res.status(500).json({error: 'Failed to fetch products', details: err.message})

  }

}