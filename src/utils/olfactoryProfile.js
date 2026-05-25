export function calcularPerfil(respuestas, emocionMarca) {
  const perfil = {}

  for (const opcion of respuestas) {
    for (const [nota, valor] of Object.entries(opcion.olfativo)) {
      perfil[nota] = (perfil[nota] || 0) + valor
    }
  }

  if (!emocionMarca) return perfil

  const modificadores = {
    'Energía radiante':   ['citrico', 'floral', 'verde', 'ligero'],
    'Calma profunda':     ['madera', 'ambar', 'profundo', 'oscuro'],
    'Fuerza contenida':   ['seco', 'rigido', 'metalico', 'frio'],
    'Sensibilidad activa':['floral', 'vanilla', 'calido', 'ligero'],
  }

  const notasAmplifcar = modificadores[emocionMarca] || []

  for (const nota of notasAmplifcar) {
    if (perfil[nota]) {
      perfil[nota] = Math.round(perfil[nota] * 1.3 * 10) / 10
    }
  }

  return perfil
}
