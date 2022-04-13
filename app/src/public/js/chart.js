const charts = new Map()

const getMatchesOnDateRange = async (userId, maxMatches, startDate, endDate) => {
  return fetch(`/user/history/${userId}/${maxMatches}/${startDate}-${endDate}`)
    .then(res => res.json())
    .then(data => data)
}

// Month
const getMonthDates = async (userId, maxMatches) => {
  return fetch(`/user/history/${userId}/${maxMatches}/month`)
    .then(res => res.json())
    .then(data => data)
}

// Day
const getDayDates = async (userId, maxMatches) => {
  return fetch(`/user/history/${userId}/${maxMatches}/day`)
    .then(res => res.json())
    .then(data => data)
}

// Week
const getWeekDates = async (userId, maxMatches) => {
  return fetch(`/user/history/${userId}/${maxMatches}/week`)
    .then(res => res.json())
    .then(data => data)
}

// Overall
const getOverallDates = async (userId, maxMatches) => {
  return fetch(`/user/history/${userId}/${maxMatches}/overall`)
    .then(res => res.json())
    .then(data => data)
}

// generateChart
const generateChart = async (dates, index, id, badgesContainerId) => {
  if (charts.has(id)) charts.get(id).destroy()
  const ctx = document.getElementById(id).getContext('2d')
  const datesDatas = await getMatchesOnDateRange(
    dates.faceitId,
    dates.maxMatches,
    dates.dates[index]?.startDate,
    dates.dates[index]?.endDate
  )

  if (badgesContainerId) generateStatsBadges(datesDatas, badgesContainerId)

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datesDatas.Matches.map(e => new Date(e.date).toLocaleDateString()).reverse(),
      datasets: [
        {
          label: 'HS%',
          data: datesDatas.Matches.map(e => e.c4).reverse(),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'K/D',
          data: datesDatas.Matches.map(e => e.c2).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'MVPs',
          data: datesDatas.Matches.map(e => e.i9).reverse(),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Kills',
          data: datesDatas.Matches.map(e => e.i6).reverse(),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Deaths',
          data: datesDatas.Matches.map(e => e.i8).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Assists',
          data: datesDatas.Matches.map(e => e.i7).reverse(),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Elo',
          data: datesDatas.Matches.map(e => e.elo).reverse(),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: true
        }
      ]
    }
  })

  charts.set(id, chart)
}

// Generate select options
const generateSelectOptions = async (dates, selectId, chartId, badgesContainerId) => {
  const select = document.getElementById(selectId)
  dates.dates.forEach((e, key) => {
    const option = document.createElement('option')
    option.value = key
    // switch for day, week, month
    switch (selectId) {
      case 'dailySelect':
        option.innerHTML = new Date(e.startDate).toDateString()
        break
      case 'weeklySelect':
        // Check if same month
        option.innerHTML = isSameMonth(new Date(e.startDate), new Date(e.endDate)) ?
          `${new Date(e.startDate).toLocaleString('en-US', { month: 'short' })} ${new Date(e.startDate).getDate()} - ${new Date(e.endDate).getDate()}, ${new Date(e.endDate).getFullYear()}` :
          isSameYear(new Date(e.startDate), new Date(e.endDate)) ?
            `${new Date(e.startDate).toLocaleString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(e.endDate).toLocaleString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(e.endDate).getFullYear()}` :
            `${new Date(e.startDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}  - ${new Date(e.endDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        break
      case 'monthlySelect':
        option.innerHTML = new Date(e.startDate).toLocaleString('en-US', { month: 'short', year: 'numeric' })
        break
    }
    if (key === 0) option.selected = true
    select.add(option)
  })

  select.addEventListener('change', (event) => {
    const index = event.target.value
    generateChart(dates, index, chartId, badgesContainerId)
  })
}

// Generate stats badges
const generateStatsBadges = async (dates, id) => {
  const badgesContainer = document.getElementById(id)
  const datesDatas = dates?.averageStats
  badgesContainer.innerHTML =
    `<div class="flex bg-gray-700 rounded-md text-white px-2 gap-x-2 h-min">
        <p>
          <span class="font-medium capitalize">Matches: </span>
          <span>${datesDatas?.Matches}</span>
        </p>
        <p>
          <span class="font-medium capitalize">Winrate: </span>
          <span>${datesDatas?.Winrate}</span>
        </p>
      </div>`

  Object.entries(datesDatas).forEach(value => {
    if (value[0] !== 'Winrate' && value[0] !== 'Matches')
      badgesContainer.innerHTML +=
        `<div class="flex bg-gray-700 rounded-md text-white px-2 gap-x-2 h-min">
          <p>
            <span class="font-medium capitalize">${value[0]}: </span>
            <span>${value[1]}</span>
          </p>
        </div>`
  })
}

const isSameMonth = (startDate, endDate) => startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
const isSameYear = (startDate, endDate) => startDate.getFullYear() === endDate.getFullYear()
