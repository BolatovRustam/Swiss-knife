import clearDay from '@meteocons/svg/fill/clear-day.svg'
import clearNight from '@meteocons/svg/fill/clear-night.svg'
import partlyCloudyDay from '@meteocons/svg/fill/partly-cloudy-day.svg'
import partlyCloudyNight from '@meteocons/svg/fill/partly-cloudy-night.svg'
import cloudy from '@meteocons/svg/fill/cloudy.svg'
import overcast from '@meteocons/svg/fill/overcast.svg'
import drizzle from '@meteocons/svg/fill/drizzle.svg'
import rain from '@meteocons/svg/fill/rain.svg'
import thunderstorms from '@meteocons/svg/fill/thunderstorms.svg'
import snow from '@meteocons/svg/fill/snow.svg'
import fog from '@meteocons/svg/fill/fog.svg'

export const iconMap: Record<string, string> = {
    '01d': clearDay,        '01n': clearNight,
    '02d': partlyCloudyDay, '02n': partlyCloudyNight,
    '03d': cloudy,          '03n': cloudy,
    '04d': overcast,        '04n': overcast,
    '09d': drizzle,         '09n': drizzle,
    '10d': rain,            '10n': rain,
    '11d': thunderstorms,   '11n': thunderstorms,
    '13d': snow,            '13n': snow,
    '50d': fog,             '50n': fog,
}