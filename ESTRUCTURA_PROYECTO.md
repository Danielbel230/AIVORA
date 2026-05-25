# AIVORA — Instrucciones para Claude Code

## Contexto
Estás construyendo "Espejo Olfativo Digital" para Aivora, una marca de perfumería de nicho.
Es una app web de 3 minutos que genera un perfume personalizado usando IA y detección facial.
Se usará en una exposición de ideas. Debe verse de lujo. Debe funcionar perfecto.

## Stack obligatorio
- React + Vite
- Tailwind CSS
- face-api.js (detección facial en el navegador, sin servidores)
- Google Gemini API (genera el perfume)
- Google Apps Script (guarda los leads en Google Sheets)
- Vercel para deploy (configurar vercel.json)

## Estructura de carpetas que debes crear

```
AIVORA/
├── public/
│   └── models/              ← Aquí van los modelos de face-api.js (ver nota abajo)
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── q1_a.jpg     ← Bosque oscuro con niebla
│   │       ├── q1_b.jpg     ← Playa al amanecer
│   │       ├── q2_a.jpg     ← Whisky y cuero
│   │       ├── q2_b.jpg     ← Flores y lluvia
│   │       ├── q3_a.jpg     ← Ciudad de noche
│   │       ├── q3_b.jpg     ← Campo dorado
│   │       ├── q4_a.jpg     ← Traje negro
│   │       ├── q4_b.jpg     ← Lino blanco
│   │       ├── q5_a.jpg     ← Habitación vacía
│   │       ├── q5_b.jpg     ← Mesa íntima
│   │       ├── q6_a.jpg     ← Reloj de acero
│   │       └── q6_b.jpg     ← Libro antiguo
│   ├── components/
│   │   ├── ScreenEntry.jsx       ← Pantalla 1: entrada y nombre
│   │   ├── ScreenFaceScan.jsx    ← Pantalla 2: escaneo facial
│   │   ├── ScreenTest.jsx        ← Pantalla 3: las 6 preguntas
│   │   ├── ScreenLoading.jsx     ← Pantalla 4: animación de carga IA
│   │   ├── ScreenResult.jsx      ← Pantalla 5: el perfume generado
│   │   └── ScreenCapture.jsx     ← Pantalla 6: formulario WhatsApp
│   ├── hooks/
│   │   ├── useFaceApi.js         ← Lógica de detección facial
│   │   └── useGemini.js          ← Lógica de llamada a la API de Gemini
│   ├── utils/
│   │   ├── olfactoryProfile.js   ← Calcula el perfil olfativo según respuestas
│   │   ├── emotionMapper.js      ← Traduce emoción técnica a lenguaje de marca
│   │   ├── geminiPrompt.js       ← Construye el prompt exacto para Gemini
│   │   └── sheetsSubmit.js       ← Envía el lead a Google Sheets
│   ├── data/
│   │   └── questions.js          ← Las 6 preguntas con sus imágenes y lógica olfativa
│   ├── App.jsx                   ← Maneja el flujo entre pantallas
│   ├── main.jsx
│   └── index.css                 ← Tailwind + fuentes + variables globales
├── .env.local                    ← Variables de entorno (nunca subir a Git)
├── .gitignore
├── vercel.json
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Orden de construcción

Construye en este orden exacto. No saltes pasos.

1. Configurar Vite + React + Tailwind
2. Configurar fuentes (Playfair Display y Inter desde Google Fonts)
3. Crear el sistema de navegación entre pantallas en App.jsx
4. Crear questions.js con la data de las 6 preguntas
5. Crear olfactoryProfile.js con la lógica de puntuación
6. Crear emotionMapper.js
7. Crear geminiPrompt.js
8. Crear useGemini.js
9. Crear sheetsSubmit.js
10. Crear useFaceApi.js
11. Construir ScreenEntry.jsx
12. Construir ScreenFaceScan.jsx
13. Construir ScreenTest.jsx
14. Construir ScreenLoading.jsx
15. Construir ScreenResult.jsx
16. Construir ScreenCapture.jsx
17. Configurar vercel.json
18. Probar flujo completo

## Diseño — reglas que no se negocian

- Fondo: negro absoluto (#0A0A0A) en toda la app
- Acento: dorado (#C9A84C) para botones, líneas y elementos destacados
- Texto principal: blanco (#FFFFFF)
- Texto secundario: gris (#AAAAAA)
- Tipografía títulos: Playfair Display (serif)
- Tipografía interfaz: Inter (sans-serif)
- Transiciones: mínimo 400ms, siempre suaves
- Sin menús de navegación
- Sin botón de volver atrás
- La app es lineal. Una sola dirección.

## Pantalla 2 — Escaneo facial (instrucciones específicas)

Usar face-api.js con estos modelos:
- tinyFaceDetector
- faceExpressionNet

Los modelos deben estar en /public/models/
Descargar desde: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Flujo de la pantalla:
1. Pedir permiso de cámara
2. Si se rechaza o hay error: saltar automáticamente a Pantalla 3
3. Si se acepta: mostrar video en vivo con círculo dorado animado encima
4. Analizar durante 5 segundos
5. Tomar la emoción con mayor probabilidad
6. Mapear con emotionMapper.js a lenguaje de marca
7. Guardar en estado global y continuar

## Pantalla 4 — Loading (instrucciones específicas)

- Duración mínima: 10 segundos aunque Gemini responda antes
- Partículas doradas flotando (CSS puro, sin librerías extra)
- Frases que rotan cada 2.5 segundos:
  1. "Fusionando tu energía con tu instinto..."
  2. "Calibrando notas de fondo..."
  3. "Sincronizando tu firma biométrica..."
  4. "Tu esencia está tomando forma..."

## Data de las 6 preguntas (questions.js)

```javascript
export const questions = [
  {
    id: 1,
    tema: "Entorno natural",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q1_a.jpg", olfativo: { madera: 2, musgo: 1 } },
      { id: "B", imagen: "/src/assets/images/q1_b.jpg", olfativo: { citrico: 2, sal: 1 } }
    ]
  },
  {
    id: 2,
    tema: "Sensación táctil",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q2_a.jpg", olfativo: { oriental: 2, ambar: 1 } },
      { id: "B", imagen: "/src/assets/images/q2_b.jpg", olfativo: { floral: 2, verde: 1 } }
    ]
  },
  {
    id: 3,
    tema: "Hora del día",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q3_a.jpg", olfativo: { almizcle: 2, oscuro: 1 } },
      { id: "B", imagen: "/src/assets/images/q3_b.jpg", olfativo: { madera: 1, calido: 2 } }
    ]
  },
  {
    id: 4,
    tema: "Estilo personal",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q4_a.jpg", olfativo: { seco: 2, rigido: 1 } },
      { id: "B", imagen: "/src/assets/images/q4_b.jpg", olfativo: { fresco: 2, ligero: 1 } }
    ]
  },
  {
    id: 5,
    tema: "Ambiente social",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q5_a.jpg", olfativo: { profundo: 2, introvertido: 1 } },
      { id: "B", imagen: "/src/assets/images/q5_b.jpg", olfativo: { especiado: 2, social: 1 } }
    ]
  },
  {
    id: 6,
    tema: "Objeto de deseo",
    opciones: [
      { id: "A", imagen: "/src/assets/images/q6_a.jpg", olfativo: { frio: 2, metalico: 1 } },
      { id: "B", imagen: "/src/assets/images/q6_b.jpg", olfativo: { papiro: 2, vanilla: 1 } }
    ]
  }
];
```

## Lógica del modificador de emoción (olfactoryProfile.js)

Después de calcular el perfil base con las respuestas, aplicar este modificador:

- "Energía radiante" (felicidad/sorpresa): multiplicar x1.3 las notas: citrico, floral, verde, ligero
- "Calma profunda" (neutralidad/calma): multiplicar x1.3 las notas: madera, ambar, profundo, oscuro
- "Fuerza contenida" (tensión/enojo): multiplicar x1.3 las notas: seco, rigido, metalico, frio
- "Sensibilidad activa" (tristeza/miedo): multiplicar x1.3 las notas: floral, vanilla, calido, ligero
- Si no hay emoción detectada: no aplicar modificador

## El prompt de Gemini (geminiPrompt.js)

```javascript
export function buildPrompt(nombre, emocion, respuestas, perfil) {
  const notaDominante = Object.entries(perfil)
    .sort((a, b) => b[1] - a[1])[0][0];
  const notaSecundaria = Object.entries(perfil)
    .sort((a, b) => b[1] - a[1])[1][0];

  return `Eres el algoritmo maestro de perfumería de lujo AIVORA.
Recibes datos biométricos y olfativos de un cliente.

DATOS DEL CLIENTE:
- Nombre: ${nombre}
- Energía detectada: ${emocion || "no detectada"}
- Respuestas del test: ${respuestas.join(", ")}
- Perfil olfativo: ${JSON.stringify(perfil)}
- Nota dominante: ${notaDominante}
- Nota secundaria: ${notaSecundaria}

REGLAS OBLIGATORIAS:
1. Usa la nota dominante Y la energía como base del nombre y la frase.
2. La frase de identidad debe usar adjetivos específicos de esta combinación exacta.
3. PROHIBIDO usar frases genéricas como "eres único" o "eres especial".
4. Las notas deben ser ingredientes de perfumería de nicho reales y premium.
5. Responde ÚNICAMENTE con JSON válido. Sin texto antes ni después. Sin markdown.

FORMATO DE RESPUESTA:
{
  "nombre_perfume": "variante elegante con el nombre del usuario en latín o francés",
  "codigo": "AIV-[3 letras mayúsculas de la nota dominante]-[3 números]",
  "firma_biometrica": "energía en lenguaje de marca elegante",
  "nota_salida": "ingrediente premium real",
  "nota_corazon": "ingrediente premium real",
  "nota_fondo": "ingrediente premium real",
  "frase_identidad": "frase contundente y específica, máximo 12 palabras"
}`;
}
```

## sheetsSubmit.js

```javascript
export async function submitLead(data) {
  const url = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  try {
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(data)
    });
  } catch (error) {
    console.error("Error enviando lead:", error);
  }
}
```

Los datos a enviar:
- nombre
- whatsapp
- emocion
- perfil_olfativo (stringify del objeto)
- nota_dominante
- nombre_perfume
- codigo
- frase_identidad
- fecha (new Date().toISOString())

## Variables de entorno necesarias

Ver archivo .env.local en la raíz del proyecto.
Nunca subir .env.local a Git. Ya está en .gitignore.

## Nota sobre los modelos de face-api.js

Descargar estos archivos y ponerlos en /public/models/:
- tiny_face_detector_model-weights_manifest.json
- tiny_face_detector_model-shard1
- face_expression_model-weights_manifest.json
- face_expression_model-shard1

URL de descarga: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

## Comando para arrancar

```bash
npm install
npm run dev
```

## Checklist antes de la expo

- [ ] .env.local tiene las dos claves reales
- [ ] Las 12 imágenes están en src/assets/images/ con los nombres exactos
- [ ] Los modelos de face-api.js están en public/models/
- [ ] El escaneo facial funciona con la cámara
- [ ] Gemini devuelve JSON válido en todas las pruebas
- [ ] Google Sheets recibe los datos correctamente
- [ ] Probar con al menos 10 combinaciones distintas de respuestas
- [ ] Probar en móvil y tablet
- [ ] Tener datos móviles de respaldo para el día del evento
