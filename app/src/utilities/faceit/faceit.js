const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

require('dotenv').config()

const headerFaceit = {
  Authorization: `Bearer ${process.env.FACEIT_TOKEN}`
}

const fetchData = async (url, error) => fetch(url, {
  method: 'GET',
  headers: headerFaceit
})
  .then(res => {
    if (res.status == 200) return res.json()
    else throw error
  })
  .then(data => data)

module.exports = {
  fetchData
}