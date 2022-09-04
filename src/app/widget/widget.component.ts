import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  WeatherData:any;
  city:string | undefined;
  icon:any;
  API_KEY:any;
  aqilevels:any;
  ipdata:any;
  constructor() { }

  ngOnInit(): void {
    fetch("https://ipapi.co/json/")
    .then(response => response.json())
    .then(ip => {
      this.city = ip.city
      this.ipdata= ip
      this.getWeatherData()
    })
    .catch((error) => {
      console.log(error)
      this.city = 'Gampola'
      this.getWeatherData()
    })

    
    this.aqilevels = {1 : {status:'Good', color:'#00ff00'}, 
                      2 : {status:'Fair', color:'##eeff00'} , 
                      3 : {status:'Moderate', color:'#e5ff00'},
                      4 : {status:'Poor', color:'#ff9900'}, 
                      5 : {status:'Very Poor', color:'#ff0000'}}

    this.API_KEY = '01e13c44845c204c3b27218740b92b57'
    // 
    // OLD API key Still Working :  a7e2da7f89bd381b0d0bd7362a0be811
    this.icon = "50d"
    setInterval(() => {
      this.getWeatherData()
    }, 1000000);
    
    
  }

  inputCity(event:any){
    this.city =  event.target.value
    this.getWeatherData()
  }


  countryChanged(event:any){
    this.city =  event.target.value
    this.getWeatherData()
    
  }

  getWeatherData(){

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ this.city }&appid=${this.API_KEY}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      this.setWeatherData(data)
      this.getAirData(data.coord.lon, data.coord.lat)
    })
    .catch((error) => {
      alert("Check your city Name")
    })

  }

  getAirData(lon:string, lat:string){
    console.log('Get Air Data')
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`)
    .then(response => response.json())
    .then(data => { 
      this.setAirData(data) ;
      
    })
  }
  setAirData(data:any){
    
    this.WeatherData.Air = data
    
  }
  setWeatherData(data: JSON){
    this.WeatherData = data

    // Converting sunset time
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000)
    let sunriseTime = new Date(this.WeatherData.sys.sunrise * 1000)


    
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString()
    this.WeatherData.sunrise_time = sunriseTime.toLocaleTimeString()

    
    // Checking tha Day or Night

    let currentDate = new Date()

    this.WeatherData.current_time = this.calcTime(this.WeatherData.timezone) ;
    console.log()
    let remaing = this.WeatherData.sys.sunrise*1000 - currentDate.getTime()
    this.WeatherData.remaining = this.parseMillisecondsIntoReadableTime(new Date(remaing ))
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());

  
    this.icon = this.WeatherData.weather[0].icon
    this.WeatherData.description = this.WeatherData.weather[0].description
    // K to C
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime() && currentDate.getTime() > sunriseTime.getTime());
    this.WeatherData.temp_c = (this.WeatherData.main.temp - 273.15).toFixed(0)
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0)
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0)
    this.WeatherData.feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0)

    
  
  }

  calcTime( offset:any) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (1000*offset));

    // return time as a string
    return  nd.toLocaleTimeString();
}
   parseMillisecondsIntoReadableTime(milliseconds:any){
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    
   
    this.WeatherData.message = 'Pothee Thoongu Songy'
 
    return h + ':' + m + ':' + s;
  }
}
