export const unitCategories = {
  Длина: [
    { label: "Километр (km)", value: "km", toBase: 1000 },
    { label: "Метр (m)", value: "m", toBase: 1 },
    { label: "Сантиметр (cm)", value: "cm", toBase: 0.01 },
    { label: "Миллиметр (mm)", value: "mm", toBase: 0.001 },
    { label: "Миля (mi)", value: "mi", toBase: 1609.34 },
    { label: "Фут (ft)", value: "ft", toBase: 0.3048 },
    { label: "Дюйм (in)", value: "in", toBase: 0.0254 },
  ],
  Масса: [
    { label: "Килограмм (kg)", value: "kg", toBase: 1 },
    { label: "Грамм (g)", value: "g", toBase: 0.001 },
    { label: "Миллиграмм (mg)", value: "mg", toBase: 0.000001 },
    { label: "Тонна (t)", value: "t", toBase: 1000 },
    { label: "Фунт (lb)", value: "lb", toBase: 0.453592 },
    { label: "Унция (oz)", value: "oz", toBase: 0.0283495 },
  ],
  Температура: [
    { label: "Цельсий (°C)", value: "c", toBase: 1 },
    { label: "Фаренгейт (°F)", value: "f", toBase: 1 },
    { label: "Кельвин (K)", value: "k", toBase: 1 },
  ],
  Объём: [
    { label: "Литр (L)", value: "l", toBase: 1 },
    { label: "Миллилитр (mL)", value: "ml", toBase: 0.001 },
    { label: "Кубометр (m³)", value: "m3", toBase: 1000 },
    { label: "Галлон (gal)", value: "gal", toBase: 3.78541 },
  ],
  Площадь: [
    { label: "Кв. метр (m²)", value: "m2", toBase: 1 },
    { label: "Кв. километр (km²)", value: "km2", toBase: 1_000_000 },
    { label: "Гектар (ha)", value: "ha", toBase: 10_000 },
    { label: "Кв. фут (ft²)", value: "ft2", toBase: 0.092903 },
  ],
  Скорость: [
    { label: "км/ч (km/h)", value: "kmh", toBase: 1 },
    { label: "м/с (m/s)", value: "ms", toBase: 3.6 },
    { label: "Миль/ч (mph)", value: "mph", toBase: 1.60934 },
    { label: "Узел (kn)", value: "kn", toBase: 1.852 },
  ],
  Давление: [
    { label: "Паскаль (Pa)", value: "pa", toBase: 1 },
    { label: "Килопаскаль (kPa)", value: "kpa", toBase: 1000 },
    { label: "Бар (bar)", value: "bar", toBase: 100_000 },
    { label: "Атм (atm)", value: "atm", toBase: 101_325 },
    { label: "мм рт.ст. (mmHg)", value: "mmhg", toBase: 133.322 },
  ],
  Время: [
    { label: "Секунда (s)", value: "s", toBase: 1 },
    { label: "Минута (min)", value: "min", toBase: 60 },
    { label: "Час (h)", value: "h", toBase: 3600 },
    { label: "День (d)", value: "d", toBase: 86_400 },
    { label: "Неделя (wk)", value: "wk", toBase: 604_800 },
  ],
} as const

export type CategoryName = keyof typeof unitCategories