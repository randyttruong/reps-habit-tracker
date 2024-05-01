const sqlite = require('sqlite3')
console.log("hello");

let db = new sqlite.Database('test.db', (err) => {
  if (err) {
    console.error('Error connecting to the database', err.message)
  } else {
    console.log('Connected to the database')
  }

  setupDatabase()
})

function setupDatabase() {
  return new Promise((resolve, reject) => {
    const initQuery = `CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY, habitName TEXT, numReps INTEGER)`
    db.run(initQuery, (err) => {
      if (err) {
        console.error('Error creating table', err.message)
        reject(err)
        return
      } else {
        console.log('Table created or table already exists')
        resolve()
      }
    })
  })
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err, rows) => {
      if (err) {
        reject(err)
        return
      } else {
        resolve(rows)
      }
    })
  })
}

function getAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err)
        return
      } else {
        resolve(rows)
      }
    })
  })
}

export { setupDatabase, runQuery, getAll }
