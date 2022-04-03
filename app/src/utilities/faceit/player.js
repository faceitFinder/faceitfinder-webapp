const Faceit = require('./faceit')

const getId = async (steamId) => (await Faceit.fetchData(`https://open.faceit.com/data/v4/players?game=csgo&game_player_id=${steamId}`, 'Faceit profile not found')).player_id

const getDatas = (playerId) => Faceit.fetchData(`https://open.faceit.com/data/v4/players/${playerId}`, 'Couldn\'t get faceit datas')

const getStats = (playerId) => Faceit.fetchData(`https://open.faceit.com/data/v4/players/${playerId}/stats/csgo`, 'Couldn\'t get faceit csgo stats')

module.exports = {
  getDatas,
  getId,
  getStats
}