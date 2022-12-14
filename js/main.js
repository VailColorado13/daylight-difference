

/////Event Listener for button click 
document.querySelector('#location').addEventListener('click', clickHandler)

 

let options = {
  method: 'GET',
  headers: { 'x-api-key': '1yz4ajqdQkffLCi+Mc7rSw==4p8tzPBBavrNR6bD' }
}

async function clickHandler() {

  let input = document.querySelector('input').value.toLowerCase().replace(/\s/g, '-')
  let cleanOutput = input.replace(/\-/g, ' ').split(' ').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join(' ').trim()

  console.log(input)

  //this await funtion grabs the coordinants of a city and stores them in the variable coords. This variable is then used in the next API call.
  let GeoUrl = `https://api.api-ninjas.com/v1/geocoding?city=${input}`


   const geoResponse =  await fetch(GeoUrl, options)
   const geoObject = await geoResponse.json()
   if (!geoObject[0]) {alert('It doesn\'t look like we have that city in our database.')}

   const coords =  [geoObject[0].latitude, geoObject[0].longitude]
 

 
//Now that we have the coords from the above API Call, we plug them into the next three API calls: 
  const daylightUrlToday = `https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=today`
 

  const daylightUrlTomorrow = `https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=tomorrow`

 
  const daylightUrlYesterday = `https://api.sunrise-sunset.org/json?lat=${coords[0]}&lng=${coords[1]}&date=yesterday`



  const DaylightToday = await fetch(daylightUrlToday)
  const DaylightTodayObject = await DaylightToday.json()

  const DaylightTomorrow = await fetch(daylightUrlTomorrow)
  const DaylightTomorrowObject = await DaylightTomorrow.json()

  const DaylightYesterday = await fetch(daylightUrlYesterday)
  const DaylightYesterdayObject = await DaylightYesterday.json()


  const yesterdayDaylight =  DaylightYesterdayObject.results.day_length.split(':')
  const todayDaylight = DaylightTodayObject.results.day_length.split(':')
  const tomorrowDaylight = DaylightTomorrowObject.results.day_length.split(':')


//this constructor takes the data from the above api calls and calculates the total daylight in seconds
  function TotalTime(day) {
    this.seconds = Number(day[0]*60*60) + Number(day[1]*60) + Number(day[2])
  } 

  yesterdayTotalDaylight = new TotalTime(yesterdayDaylight)
  todayTotalDaylight = new TotalTime(todayDaylight)
  tomorrowTotalDaylight = new TotalTime(tomorrowDaylight)




//This constructor takes the data from above and calculates the difference in daylight between today, tomorrow and yesterday

function TimeDifference(today, testDay) {
  this.todayLonger = today.seconds > testDay.seconds 
  this.minutesDiff = this.todayLonger === false ?  Math.abs(Math.floor((testDay.seconds - today.seconds) / 60)) : Math.abs(Math.floor((today.seconds - testDay.seconds) / 60))
  this.secondsDiff = Math.abs((today.seconds - testDay.seconds) % 60)
}



todayVSyesterday = new TimeDifference(todayTotalDaylight,yesterdayTotalDaylight)
todayVStomorrow = new TimeDifference(todayTotalDaylight,tomorrowTotalDaylight)

console.log(todayVStomorrow)


//remove the class .invisible from response area
document.querySelector('#responseSection').classList.remove("invisible")


//Now with the above calculations completed, we are ready to paint into the DOM to display the results in english: 
//This section handles the daylight difference between today and yesterday
if (!todayVSyesterday.todayLonger) {
  if (todayVSyesterday.minutesDiff === 0) {
    responseFieldYesterday.innerText = `In  ${cleanOutput}, today is ${todayVSyesterday.secondsDiff} seconds shorter than yesterday.`
  }

  else{
  responseFieldYesterday.innerText = ` In  ${cleanOutput}, today is ${todayVSyesterday.minutesDiff} ${todayVSyesterday.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVSyesterday.secondsDiff} seconds shorter than yesterday.`
   }
  
  }
else {
  if (todayVSyesterday.minutesDiff === 0) {
    responseFieldYesterday.innerText = `In  ${cleanOutput}, today is ${todayVSyesterday.secondsDiff} seconds longer than yesterday.`
  }
  else {
    responseFieldYesterday.innerText = `In  ${cleanOutput}, today is ${todayVSyesterday.minutesDiff} ${todayVSyesterday.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVSyesterday.secondsDiff} seconds longer than yesterday.`
  }
}



//This section handles the daylight difference between today and tomorrow
if (todayVStomorrow.todayLonger) {
  if (todayVStomorrow.minutesDiff === 0) {
    responseFieldTomorrow.innerText = `Tomorrow will be ${todayVStomorrow.secondsDiff} seconds shorter than today.`


  } else {
    responseFieldTomorrow.innerText =`Tomorrow will be ${todayVStomorrow.minutesDiff} ${todayVStomorrow.minutesDiff > 1 ? 'minutes' : 'minute'} and ${todayVStomorrow.secondsDiff} seconds shorter than today.`
  }

  } else {  
   if (todayVSyesterday.minutesDiff === 0) {
    responseFieldTomorrow.innerText = `Tomorrow will be ${todayVStomorrow.secondsDiff} seconds longer than today.`
  }
  else {
    responseFieldTomorrow.innerText =  `Tomorrow will be  ${todayVStomorrow.minutesDiff}  ${todayVStomorrow.minutesDiff >  1 ? 'minutes' : 'minute'} and ${todayVStomorrow.secondsDiff} seconds longer than yesterday.`
  }

}
}



