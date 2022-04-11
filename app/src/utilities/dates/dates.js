const Match = require('../faceit/match')

const getDates = async (playerId, maxMatch, getDay) => {
  const dates = new Map()
  await Match.getMatchElo(playerId, maxMatch)
    .then(m => m.forEach(e => {
      const { startDate, endDate } = getDay(e.date)
      if (!dates.has(startDate)) dates.set(startDate, { totalMatchs: 1, startDate: startDate, endDate: endDate })
      else dates.set(startDate, {
        totalMatchs: dates.get(startDate).totalMatchs + 1,
        startDate: startDate,
        endDate: endDate
      })
    }))

  return dates
}

const getDayDate = date => {
  date = new Date(date)
  date.setHours(0, 0, 0, 0)

  const endDate = new Date(date)
  endDate.setHours(+24)

  return { 
    startDate: date.getTime(),
    endDate: endDate.getTime()
  }
}

const getWeekDate = date => {
  const week = [6, 0, 1, 2, 3, 4, 5]

  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - week[date.getDay()])

  const endDate = new Date(date)
  endDate.setDate(endDate.getDate() + 7)

  return {
    startDate: date.getTime(),
    endDate: endDate.getTime()
  }
}

const getMonthDate = date => {
  date = new Date(date)
  date.setHours(0, 0, 0, 0)
  date.setDate(1)

  const endDate = new Date(date)
  endDate.setMonth(date.getMonth() + 1)
  endDate.setDate(0)

  return {
    startDate: date.getTime(),
    endDate: endDate.getTime()
  }
}

module.exports = {
  getDates,
  getDayDate,
  getWeekDate,
  getMonthDate
}