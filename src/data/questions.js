import q1a from '../assets/images/q1_a.jpg'
import q1b from '../assets/images/q1_b.jpg'
import q2a from '../assets/images/q2_a.jpg'
import q2b from '../assets/images/q2_b.jpg'
import q3a from '../assets/images/q3_a.jpg'
import q3b from '../assets/images/q3_b.jpg'
import q4a from '../assets/images/q4_a.jpg'
import q4b from '../assets/images/q4_b.jpg'
import q5a from '../assets/images/q5_a.jpg'
import q5b from '../assets/images/q5_b.jpg'
import q6a from '../assets/images/q6_a.jpg'
import q6b from '../assets/images/q6_b.jpg'

export const questions = [
  {
    id: 1,
    tema: "Entorno natural",
    opciones: [
      { id: "A", imagen: q1a, olfativo: { madera: 2, musgo: 1 } },
      { id: "B", imagen: q1b, olfativo: { citrico: 2, sal: 1 } }
    ]
  },
  {
    id: 2,
    tema: "Sensación táctil",
    opciones: [
      { id: "A", imagen: q2a, olfativo: { oriental: 2, ambar: 1 } },
      { id: "B", imagen: q2b, olfativo: { floral: 2, verde: 1 } }
    ]
  },
  {
    id: 3,
    tema: "Hora del día",
    opciones: [
      { id: "A", imagen: q3a, olfativo: { almizcle: 2, oscuro: 1 } },
      { id: "B", imagen: q3b, olfativo: { madera: 1, calido: 2 } }
    ]
  },
  {
    id: 4,
    tema: "Estilo personal",
    opciones: [
      { id: "A", imagen: q4a, olfativo: { seco: 2, rigido: 1 } },
      { id: "B", imagen: q4b, olfativo: { fresco: 2, ligero: 1 } }
    ]
  },
  {
    id: 5,
    tema: "Ambiente social",
    opciones: [
      { id: "A", imagen: q5a, olfativo: { profundo: 2, introvertido: 1 } },
      { id: "B", imagen: q5b, olfativo: { especiado: 2, social: 1 } }
    ]
  },
  {
    id: 6,
    tema: "Objeto de deseo",
    opciones: [
      { id: "A", imagen: q6a, olfativo: { frio: 2, metalico: 1 } },
      { id: "B", imagen: q6b, olfativo: { papiro: 2, vanilla: 1 } }
    ]
  }
]
