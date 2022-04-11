const getMatchsOnDateRange = async (userId, maxMatchs, startDate, endDate) => {
  return fetch(`/user/history/${userId}/${maxMatchs}/${startDate}-${endDate}`)
    .then(res => res.json())
    .then(data => data)
}

// Month
const getMonthDates = async (userId, maxMatchs) => {
  return fetch(`/user/history/${userId}/${maxMatchs}/month`)
    .then(res => res.json())
    .then(data => data)
}

// Day
const getDayDates = async (userId, maxMatchs) => {
  return fetch(`/user/history/${userId}/${maxMatchs}/day`)
    .then(res => res.json())
    .then(data => data)
}

// Week
const getWeekDates = async (userId, maxMatchs) => {
  return fetch(`/user/history/${userId}/${maxMatchs}/week`)
    .then(res => res.json())
    .then(data => data)
}

const generateChart = async (dates, index, id) => {
  const ctx = document.getElementById(id).getContext('2d')
  const datesDatas = await getMatchsOnDateRange(
    dates.faceitId,
    dates.maxMatchs,
    dates.dates[index].startDate,
    dates.dates[index].endDate
  )

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: datesDatas.matchs.map(e => new Date(e.date).toLocaleDateString()).reverse(),
      datasets: [
        {
          label: 'HS%',
          data: datesDatas.matchs.map(e => e.c4).reverse(),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'K/D',
          data: datesDatas.matchs.map(e => e.c2).reverse(),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'MVPs',
          data: datesDatas.matchs.map(e => e.i9).reverse(),
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Kills',
          data: datesDatas.matchs.map(e => e.i6).reverse(),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Deaths',
          data: datesDatas.matchs.map(e => e.i8).reverse(),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Assists',
          data: datesDatas.matchs.map(e => e.i7).reverse(),
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          fill: true,
          hidden: true
        },
        {
          label: 'Elo',
          data: datesDatas.matchs.map(e => e.elo).reverse(),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: true
        }
      ]
    }
  })
}

// Generate select options
const generateSelectOptions = async (dates, id) => {
  const select = document.getElementById(id)
  dates.dates.forEach(e => {
    const option = document.createElement('option')
    option.value = e.index
    // switch for day, week, month
    switch (id) {
      case 'dailySelect':
        option.innerHTML = new Date(e.startDate).toDateString()
        break
      case 'weeklySelect':
        // Check if same month
        option.innerHTML = isSameMonth(new Date(e.startDate), new Date(e.endDate)) ?
          `${new Date(e.startDate).toLocaleString('en-US', { month: 'long' })} ${new Date(e.startDate).getDate()} - ${new Date(e.endDate).getDate()}, ${new Date(e.endDate).getFullYear()}` :
          isSameYear(new Date(e.startDate), new Date(e.endDate)) ?
            `${new Date(e.startDate).toLocaleString('en-US', { month: 'long', day: 'numeric' })} - ${new Date(e.endDate).toLocaleString('en-US', { month: 'long', day: 'numeric' })}, ${new Date(e.endDate).getFullYear()}` :
            `${new Date(e.startDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  - ${new Date(e.endDate).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
        break
      case 'monthlySelect':
        option.innerHTML = new Date(e.startDate).toLocaleString('en-US', { month: 'long', year: 'numeric' })
        break
    }

    select.add(option)
  })
}

const isSameMonth = (startDate, endDate) => startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
const isSameYear = (startDate, endDate) => startDate.getFullYear() === endDate.getFullYear()

