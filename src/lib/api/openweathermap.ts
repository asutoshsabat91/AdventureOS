import { BaseAPIClient, StandardAPIResponse, APIError } from './base-client'

export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temperature: number
    feels_like: number
    humidity: number
    wind_speed: number
    wind_direction: number
    visibility: number
    uv_index: number
    pressure: number
    conditions: string
    icon: string
  }
  forecast: Array<{
    date: string
    temperature_min: number
    temperature_max: number
    conditions: string
    icon: string
    precipitation_chance: number
    precipitation_mm: number
    humidity: number
    wind_speed: number
  }>
  alerts?: Array<{
    event: string
    start: string
    end: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
  }>
}

export interface AdventureWeatherMetrics {
  skiing_snowboarding: {
    snowfall_24h: number
    snow_depth: number
    temperature: number
    wind_speed: number
    visibility: number
    avalanche_risk: 'low' | 'moderate' | 'high' | 'extreme'
  }
  surfing: {
    wave_height: number
    wave_period: number
    wind_speed: number
    wind_direction: number
    tide_height: number
    water_temperature: number
  }
  climbing: {
    temperature: number
    wind_speed: number
    precipitation_chance: number
    visibility: number
    rock_temperature: number
  }
  skydiving_paragliding: {
    wind_speed: number
    wind_gusts: number
    visibility: number
    cloud_cover: number
    temperature: number
  }
  hiking_trekking: {
    temperature: number
    precipitation_chance: number
    humidity: number
    uv_index: number
    trail_conditions: 'dry' | 'wet' | 'muddy' | 'snowy'
  }
}

export class OpenWeatherMapAPI extends BaseAPIClient {
  constructor(apiKey: string) {
    super(
      'https://api.openweathermap.org/data/2.5',
      apiKey,
      { maxRequests: 60, windowMs: 60000 }, // 60 requests per minute
      'openweathermap'
    )
  }

  async getCurrentWeather(lat: number, lon: number): Promise<StandardAPIResponse<WeatherData>> {
    try {
      const weatherData = await this.makeRequest({
        method: 'GET',
        url: '/weather',
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      })

      const forecastData = await this.makeRequest({
        method: 'GET',
        url: '/forecast',
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      })

      const alertsData = await this.makeRequest({
        method: 'GET',
        url: '/onecall',
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHERMAP_API_KEY,
          exclude: 'minutely,hourly'
        }
      }).catch(() => null) // Alerts might not be available for all locations

      const standardizedData = this.standardizeWeatherData(weatherData, forecastData, alertsData)

      return {
        data: standardizedData,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch weather data: ${error.message}`,
        error.response?.status,
        error.code
      )
    }
  }

  async getAdventureWeatherMetrics(
    lat: number, 
    lon: number, 
    activityTypes: string[]
  ): Promise<StandardAPIResponse<AdventureWeatherMetrics>> {
    try {
      const weatherResponse = await this.getCurrentWeather(lat, lon)
      const weather = weatherResponse.data

      const metrics: AdventureWeatherMetrics = {
        skiing_snowboarding: await this.getSkiingMetrics(weather),
        surfing: await this.getSurfingMetrics(lat, lon, weather),
        climbing: await this.getClimbingMetrics(weather),
        skydiving_paragliding: await this.getAerialSportsMetrics(weather),
        hiking_trekking: await this.getHikingMetrics(weather)
      }

      return {
        data: metrics,
        success: true
      }
    } catch (error: any) {
      throw new APIError(
        `Failed to fetch adventure weather metrics: ${error.message}`,
        error.response?.status
      )
    }
  }

  private standardizeWeatherData(current: any, forecast: any, alerts: any): WeatherData {
    return {
      location: {
        name: current.name,
        country: current.sys.country,
        lat: current.coord.lat,
        lon: current.coord.lon
      },
      current: {
        temperature: Math.round(current.main.temp),
        feels_like: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        wind_speed: current.wind?.speed || 0,
        wind_direction: current.wind?.deg || 0,
        visibility: current.visibility ? current.visibility / 1000 : 10, // Convert to km
        uv_index: alerts?.current?.uvi || 0,
        pressure: current.main.pressure,
        conditions: current.weather[0].description,
        icon: current.weather[0].icon
      },
      forecast: forecast.list.slice(0, 5).map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        temperature_min: Math.round(item.main.temp_min),
        temperature_max: Math.round(item.main.temp_max),
        conditions: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation_chance: Math.round((item.pop || 0) * 100),
        precipitation_mm: item.rain?.['3h'] || item.snow?.['3h'] || 0,
        humidity: item.main.humidity,
        wind_speed: item.wind?.speed || 0
      })),
      alerts: alerts?.alerts?.map((alert: any) => ({
        event: alert.event,
        start: new Date(alert.start * 1000).toISOString(),
        end: new Date(alert.end * 1000).toISOString(),
        description: alert.description,
        severity: alert.severity
      }))
    }
  }

  private async getSkiingMetrics(weather: WeatherData): Promise<AdventureWeatherMetrics['skiing_snowboarding']> {
    // Mock avalanche risk calculation - in production, this would integrate with avalanche.org
    const avalancheRisk = this.calculateAvalancheRisk(weather)
    
    return {
      snowfall_24h: 0, // Would need historical data
      snow_depth: 0,   // Would need snow depth API
      temperature: weather.current.temperature,
      wind_speed: weather.current.wind_speed,
      visibility: weather.current.visibility,
      avalanche_risk: avalancheRisk
    }
  }

  private async getSurfingMetrics(lat: number, lon: number, weather: WeatherData): Promise<AdventureWeatherMetrics['surfing']> {
    // Mock surfing data - in production, integrate with marine weather API
    return {
      wave_height: Math.random() * 3 + 0.5, // 0.5-3.5m
      wave_period: Math.random() * 8 + 6,   // 6-14s
      wind_speed: weather.current.wind_speed,
      wind_direction: weather.current.wind_direction,
      tide_height: Math.random() * 2 + 0.5,  // 0.5-2.5m
      water_temperature: Math.random() * 10 + 15 // 15-25°C
    }
  }

  private async getClimbingMetrics(weather: WeatherData): Promise<AdventureWeatherMetrics['climbing']> {
    const rockTemp = weather.current.temperature + 5 // Rock absorbs more heat
    
    return {
      temperature: weather.current.temperature,
      wind_speed: weather.current.wind_speed,
      precipitation_chance: weather.forecast[0]?.precipitation_chance || 0,
      visibility: weather.current.visibility,
      rock_temperature: rockTemp
    }
  }

  private async getAerialSportsMetrics(weather: WeatherData): Promise<AdventureWeatherMetrics['skydiving_paragliding']> {
    return {
      wind_speed: weather.current.wind_speed,
      wind_gusts: weather.current.wind_speed * 1.3, // Estimate gusts
      visibility: weather.current.visibility,
      cloud_cover: Math.max(0, 100 - (weather.current.visibility * 10)), // Estimate cloud cover
      temperature: weather.current.temperature
    }
  }

  private async getHikingMetrics(weather: WeatherData): Promise<AdventureWeatherMetrics['hiking_trekking']> {
    const precipitationChance = weather.forecast[0]?.precipitation_chance || 0
    let trailConditions: 'dry' | 'wet' | 'muddy' | 'snowy' = 'dry'
    
    if (weather.current.temperature < 0) {
      trailConditions = 'snowy'
    } else if (precipitationChance > 70) {
      trailConditions = 'muddy'
    } else if (precipitationChance > 30) {
      trailConditions = 'wet'
    }

    return {
      temperature: weather.current.temperature,
      precipitation_chance: precipitationChance,
      humidity: weather.current.humidity,
      uv_index: weather.current.uv_index,
      trail_conditions: trailConditions
    }
  }

  private calculateAvalancheRisk(weather: WeatherData): 'low' | 'moderate' | 'high' | 'extreme' {
    // Simplified avalanche risk calculation
    const temp = weather.current.temperature
    const windSpeed = weather.current.wind_speed
    const precipChance = weather.forecast[0]?.precipitation_chance || 0

    if (temp < -10 && windSpeed > 30 && precipChance > 50) {
      return 'extreme'
    } else if (temp < -5 && windSpeed > 20 && precipChance > 30) {
      return 'high'
    } else if (temp < 0 && windSpeed > 15) {
      return 'moderate'
    } else {
      return 'low'
    }
  }
}

// Singleton instance
export const openWeatherMapAPI = new OpenWeatherMapAPI(process.env.OPENWEATHERMAP_API_KEY || 'mock-key')
