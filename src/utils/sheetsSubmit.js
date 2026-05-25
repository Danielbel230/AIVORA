export async function submitLead(data) {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({
      nombre: data.nombre,
      whatsapp: data.whatsapp,
      emocion: data.emocion,
      perfil_olfativo: JSON.stringify(data.perfilOlfativo),
      nota_dominante: data.notaDominante,
      nombre_perfume: data.perfume?.nombre_perfume,
      codigo: data.perfume?.codigo,
      frase_identidad: data.perfume?.frase_identidad,
      fecha: new Date().toISOString(),
    })
  })
}
