const EMOTION_MAP = {
  happy:     'Energía radiante',
  surprised: 'Energía radiante',
  neutral:   'Calma profunda',
  calm:      'Calma profunda',
  angry:     'Fuerza contenida',
  disgusted: 'Fuerza contenida',
  fearful:   'Sensibilidad activa',
  sad:       'Sensibilidad activa',
}

export function mapearEmocion(emocionTecnica) {
  if (!emocionTecnica) return null
  return EMOTION_MAP[emocionTecnica.toLowerCase()] || null
}
