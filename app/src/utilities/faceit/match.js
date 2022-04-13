const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))

const getMatchElo = (playerId, limit = 20) => fetch(`https://api.faceit.com/stats/api/v1/stats/time/users/${playerId}/games/csgo?size=${limit}`, {
  method: 'GET',
})
  .then(res => {
    if (res.status == 200) return res.json()
    else throw 'Couldn\'t get last Matches'
  })
  .then(data => data)

module.exports = {
  getMatchElo
}