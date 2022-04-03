const Faceit = require('./faceit')

const getDatas = (playerId, region, country) => Faceit.fetchData(`https://open.faceit.com/data/v4/rankings/games/csgo/regions/${region}/players/${playerId}?limit=1${country ? `&country=${country}` : ''}`, 'Couldn\'t get the ladder')

module.exports = {
  getDatas,
}