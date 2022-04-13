const Steam = require('../steam/steam')
const Player = require('../faceit/player')
const Ladder = require('../faceit/ladder')
const Match = require('../faceit/match')

const generatePlayerStats = playerHistory => {
  const playerStats = {
    wins: 0,
    games: 0,
    'K/D': 0,
    'HS': 0,
    'MVPs': 0,
    'Kills': 0,
    'Deaths': 0,
    'Assists': 0,
  }

  for (const e of playerHistory) {
    playerStats.games += 1
    playerStats['HS'] += parseFloat(e.c4)
    playerStats['K/D'] += parseFloat(e.c2)
    playerStats['MVPs'] += parseFloat(e.i9)
    playerStats['Kills'] += parseFloat(e.i6)
    playerStats['Deaths'] += parseFloat(e.i8)
    playerStats['Assists'] += parseFloat(e.i7)
    playerStats.wins += Math.max(...e.i18.split('/').map(Number)) === parseInt(e.c5)
  }

  return {
    Winrate: getAverage(playerStats.wins, playerStats.games, 2, 100) + '%',
    Matches: playerStats.games,
    'K/D': getAverage(playerStats['K/D'], playerStats.games),
    'HS': getAverage(playerStats['HS'], playerStats.games) + '%',
    'MVPs': getAverage(playerStats['MVPs'], playerStats.games),
    'Kills': getAverage(playerStats['Kills'], playerStats.games),
    'Deaths': getAverage(playerStats['Deaths'], playerStats.games),
    'Assists': getAverage(playerStats['Assists'], playerStats.games),
  }
}

const getUsersDatas = users => {
  return users.map(async e => {
    try {
      const maxMatch = 10
      const steamId = await Steam.getId(e)
      const steamDatas = await Steam.getDatas(steamId)
      const faceitId = await Player.getId(steamId)
      const playerDatas = await Player.getDatas(faceitId)
      const playerHistory = await Match.getMatchElo(faceitId, maxMatch)
      const playerStats = await Player.getStats(faceitId)
      const ladderRegion = await Ladder.getDatas(faceitId, playerDatas.games.csgo.region)
      const ladderCountry = await Ladder.getDatas(faceitId, playerDatas.games.csgo.region, playerDatas.country)

      const datas = {
        steamParam: e,
        steamId: steamId,
        steamDatas: steamDatas,
        playerDatas: playerDatas,
        playerStats: playerStats,
        lastStatsGame: generatePlayerStats(playerHistory),
        ladder: {
          region: ladderRegion,
          country: ladderCountry,
        }
      }
      return datas
    } catch (error) {
      console.log(error)
      return {
        steamParam: e,
        error: 'An error has occured'
      }
    }
  })
}

const getAverage = (q, d, fixe = 2, percent = 1) => { return ((q / d) * percent).toFixed(fixe) }

module.exports = {
  getUsersDatas,
  generatePlayerStats
}