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
    winrate: getAverage(playerStats.wins, playerStats.games, 2, 100),
    games: playerStats.games,
    'K/D': getAverage(playerStats['K/D'], playerStats.games),
    'HS': getAverage(playerStats['HS'], playerStats.games) + '%',
    'MVPs': getAverage(playerStats['MVPs'], playerStats.games),
    'Kills': getAverage(playerStats['Kills'], playerStats.games),
    'Deaths': getAverage(playerStats['Deaths'], playerStats.games),
    'Assists': getAverage(playerStats['Assists'], playerStats.games),
  }
}

const getAverage = (q, d, fixe = 2, percent = 1) => { return ((q / d) * percent).toFixed(fixe) }

module.exports = {
  generatePlayerStats
}