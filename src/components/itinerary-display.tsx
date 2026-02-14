'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, MapPin, DollarSign, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { Itinerary, Day, Activity as ActivityType } from '@/lib/itinerary-schema'

interface ItineraryDisplayProps {
  itinerary: Itinerary
  onActivityMove?: (activityId: string, fromDay: number, toDay: number) => void
}

export function ItineraryDisplay({ itinerary, onActivityMove }: ItineraryDisplayProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]))

  const toggleDayExpansion = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays)
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber)
    } else {
      newExpanded.add(dayNumber)
    }
    setExpandedDays(newExpanded)
  }

  const getActivityIcon = (type: ActivityType['type']) => {
    switch (type) {
      case 'adventure':
        return <Activity className="h-4 w-4 text-green-600" />
      case 'cultural':
        return <MapPin className="h-4 w-4 text-purple-600" />
      case 'transport':
        return <Calendar className="h-4 w-4 text-blue-600" />
      case 'accommodation':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'dining':
        return <DollarSign className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Itinerary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{itinerary.destination} Adventure</span>
            <Badge variant="secondary">
              {itinerary.difficulty_level}
            </Badge>
          </CardTitle>
          <CardDescription className="flex items-center gap-4 text-sm">
            <span>{itinerary.start_date} - {itinerary.end_date}</span>
            <span>•</span>
            <span>{itinerary.days.length} days</span>
            <span>•</span>
            <span>${itinerary.estimated_total_cost} / ${itinerary.total_budget}</span>
            <span>•</span>
            <span>{itinerary.group_size} travelers</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {itinerary.adventure_preferences.map((pref) => (
              <Badge key={pref} variant="outline">
                {pref}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      {itinerary.days.map((day) => (
        <Card key={day.day_number} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleDayExpansion(day.day_number)}
          >
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Day {day.day_number}: {day.theme}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>{day.date}</span>
                  <span>•</span>
                  <span>{day.activities.length} activities</span>
                  <span>•</span>
                  <span>${day.total_cost}</span>
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                {expandedDays.has(day.day_number) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedDays.has(day.day_number) && (
            <CardContent className="space-y-4">
              {/* Weather Forecast */}
              {day.weather_forecast && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Weather:</span>
                    <span>{day.weather_forecast.conditions}</span>
                    <span>•</span>
                    <span>{day.weather_forecast.temperature_min}°F - {day.weather_forecast.temperature_max}°F</span>
                    {day.weather_forecast.precipitation_chance > 0 && (
                      <span>• {day.weather_forecast.precipitation_chance}% rain</span>
                    )}
                  </div>
                </div>
              )}

              {/* Activities */}
              <div className="space-y-3">
                {day.activities.map((activity) => (
                  <div 
                    key={activity.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('activityId', activity.id)
                      e.dataTransfer.setData('fromDay', day.day_number.toString())
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getActivityIcon(activity.type)}
                          <h4 className="font-semibold">{activity.title}</h4>
                          <Badge variant="outline">{activity.type}</Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {activity.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(activity.start_time)} ({activity.duration_hours}h)
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${activity.cost}
                          </span>
                        </div>

                        {activity.gear_required && activity.gear_required.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-600">Gear Required: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activity.gear_required.map((gear) => (
                                <Badge key={gear} variant="secondary" className="text-xs">
                                  {gear}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {activity.api_references && (
                          <div className="mt-2 flex gap-2">
                            {activity.api_references.tourradar_id && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Book Tour
                              </Button>
                            )}
                            {activity.api_references.hostelworld_id && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Book Accommodation
                              </Button>
                            )}
                            {activity.api_references.fareharbor_id && (
                              <Button size="sm" variant="outline" className="text-xs">
                                Rent Gear
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      {activity.weather_dependent && (
                        <Badge variant="secondary" className="ml-2">
                          Weather Dependent
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Safety Notes */}
              {day.safety_notes && day.safety_notes.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-sm">Safety Notes:</span>
                  </div>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {day.safety_notes.map((note, index) => (
                      <li key={index}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Transportation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{itinerary.transportation.type}</p>
            <p className="text-sm">{itinerary.transportation.details}</p>
            <p className="font-medium mt-2">${itinerary.transportation.estimated_cost}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Accommodation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{itinerary.accommodation.type}</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {itinerary.accommodation.preferences.map((pref) => (
                <Badge key={pref} variant="outline" className="text-xs">
                  {pref}
                </Badge>
              ))}
            </div>
            <p className="font-medium">${itinerary.accommodation.estimated_nightly_cost}/night</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {itinerary.emergency_contacts.map((contact, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-gray-600">{contact.relationship}</p>
                  <p className="text-gray-600">{contact.phone}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
