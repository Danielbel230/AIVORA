# AIVORA — Upgrade: Experiencia WOW
# Instrucciones para Claude Code
# Ejecutar después de que el flujo base funciona correctamente

---

## RESUMEN DE CAMBIOS

Cinco mejoras en este orden exacto. No saltar ninguna.

1. Prompt mejorado — descripciones sensoriales cinematográficas
2. Revelación dramática — elemento por elemento con timing
3. Frasco vectorial — SVG dinámico con color según notas dominantes
4. Tarjeta descargable — PNG para Instagram stories usando html2canvas
5. Sonido ambiental — audio según perfil olfativo con Howler.js

---

## CAMBIO 1 — PROMPT MEJORADO (geminiPrompt.js)

Reemplaza la función buildPrompt completa por esta:

```javascript
export function buildPrompt(nombre, emocion, respuestas, perfil) {
  const sorted = Object.entries(perfil).sort((a, b) => b[1] - a[1]);
  const notaDominante = sorted[0][0];
  const notaSecundaria = sorted[1][0];

  return `Eres el maestro perfumero de lujo AIVORA. Tu lenguaje es el de un sommelier de alto nivel: evocador, sensorial, cinematográfico. Nunca usas lenguaje técnico seco.

DATOS DEL CLIENTE:
- Nombre: ${nombre}
- Energía biométrica detectada: ${emocion || "no detectada"}
- Respuestas del test: ${respuestas.join(", ")}
- Perfil olfativo: ${JSON.stringify(perfil)}
- Nota dominante: ${notaDominante}
- Nota secundaria: ${notaSecundaria}

REGLAS OBLIGATORIAS:
1. nombre_perfume: el nombre del usuario integrado con elegancia en latín, francés o italiano. Máximo 3 palabras. Ejemplos: "Noctis Andrés", "L'Essence de Laura", "Via Oscura Marco".
2. codigo: formato exacto AIV-[3 letras mayúsculas de nota dominante]-[3 números aleatorios].
3. firma_biometrica: la energía detectada en lenguaje de marca poético. Máximo 3 palabras. Ejemplos: "Calma que manda", "Fuego sereno", "Claridad salvaje".
4. apertura: describe la nota de salida como si fuera el primer sorbo de un vino excepcional. Una sola frase. Máximo 20 palabras. Debe evocar un momento, un lugar, una sensación física. Usa el ingrediente real de perfumería de nicho.
5. corazon: describe la nota de corazón como lo que queda 30 minutos después en la piel. Una sola frase. Máximo 20 palabras. Sensorial y específico.
6. huella: describe la nota de fondo como el rastro que deja horas después. Lo que la gente recuerda. Una sola frase. Máximo 20 palabras.
7. nota_salida: solo el nombre del ingrediente premium. Ejemplo: "Bergamota de Calabria".
8. nota_corazon: solo el nombre del ingrediente premium. Ejemplo: "Madera de Sándalo de Mysore".
9. nota_fondo: solo el nombre del ingrediente premium. Ejemplo: "Ámbar Gris de Madagascar".
10. frase_identidad: una frase que describa a quien usa este perfume. Contundente. Sin clichés. Sin "eres único". Máximo 10 palabras. Que provoque que la persona la fotografíe.
11. color_hex: un color hexadecimal que represente visualmente este perfume. Debe ser oscuro y elegante, nunca brillante. Basado en las notas dominantes. Ejemplos: maderas="#8B5E3C", cítricos="#4A7C59", florales="#7C4A6B", oriental="#8B6914", marino="#2C5F6E".
12. categoria_sonido: una sola palabra que indica el ambiente sonoro. Opciones exactas: "bosque", "marino", "floral", "urbano", "desierto".

PROHIBIDO:
- Frases genéricas como "eres especial", "fragancia única para ti", "perfume exclusivo".
- Adjetivos vacíos como "lujoso", "elegante", "sofisticado" sin contexto sensorial.
- Ingredientes inventados. Solo ingredientes reales de perfumería de nicho.

Responde ÚNICAMENTE con JSON válido. Sin texto antes ni después. Sin markdown. Sin bloques de código.

{
  "nombre_perfume": "",
  "codigo": "",
  "firma_biometrica": "",
  "apertura": "",
  "corazon": "",
  "huella": "",
  "nota_salida": "",
  "nota_corazon": "",
  "nota_fondo": "",
  "frase_identidad": "",
  "color_hex": "",
  "categoria_sonido": ""
}`;
}
```

---

## CAMBIO 2 — REVELACIÓN DRAMÁTICA (ScreenResult.jsx)

La pantalla de resultado debe revelar cada elemento con timing preciso.
Reemplaza ScreenResult.jsx completo con esta lógica:

### Estados necesarios:
```javascript
const [paso, setPaso] = useState(0);
// paso 0: pantalla negra
// paso 1: aparece el nombre del perfume
// paso 2: aparece la firma biométrica  
// paso 3: aparece apertura (nota salida)
// paso 4: aparece corazon (nota corazon)
// paso 5: aparece huella (nota fondo)
// paso 6: aparece frase_identidad
// paso 7: aparece el frasco SVG
// paso 8: aparecen los botones de acción
```

### Timing de revelación:
```javascript
useEffect(() => {
  if (!perfume) return;
  const tiempos = [0, 800, 1600, 2600, 3600, 4600, 5600, 6800, 8200];
  tiempos.forEach((ms, index) => {
    setTimeout(() => setPaso(index), ms);
  });
}, [perfume]);
```

### Estructura visual de cada elemento:

**Nombre del perfume (paso 1):**
- Tipografía: Playfair Display, tamaño muy grande (text-5xl o más)
- Color: blanco
- Animación: fade-in desde abajo (translateY 20px → 0, opacity 0 → 1, duración 600ms)
- Centrado en pantalla

**Firma biométrica (paso 2):**
- Texto pequeño en dorado (#C9A84C)
- Letra espaciada (tracking-widest)
- Ejemplo: "— CALMA QUE MANDA —"
- Centrado debajo del nombre

**Apertura, corazón, huella (pasos 3, 4, 5):**
- Cada una aparece como un bloque separado
- Label pequeño en gris: "APERTURA" / "CORAZÓN" / "HUELLA"
- Debajo el nombre del ingrediente en dorado
- Debajo la descripción cinematográfica en blanco, tamaño normal, itálica
- Separador dorado entre cada capa (línea de 1px)

**Frase de identidad (paso 6):**
- Tipografía grande, Playfair Display
- Color blanco
- Comillas tipográficas grandes en dorado antes y después
- Centrada
- Esta es la frase que la gente fotografía

**Frasco SVG (paso 7):**
- Ver Cambio 3 abajo

**Botones (paso 8):**
- "Descargar mi fragancia" → genera la tarjeta PNG
- "Asegurar mi lugar VIP" → navega a ScreenCapture
- El botón de descarga va primero, es el principal

---

## CAMBIO 3 — FRASCO VECTORIAL SVG (components/FrascoSVG.jsx)

Crear un nuevo componente FrascoSVG.jsx.

El frasco es un SVG dibujado con CSS/SVG puro. No usar ninguna librería 3D.

```jsx
// FrascoSVG.jsx
export default function FrascoSVG({ colorHex, nombrePerfume }) {
  const colorBase = colorHex || "#8B5E3C";
  const colorClaro = colorBase + "99"; // mismo color con 60% opacidad
  const colorBrillo = colorBase + "33"; // mismo color con 20% opacidad

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 120 200"
        width="120"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tapa */}
        <rect x="42" y="8" width="36" height="18" rx="4"
          fill="#C9A84C" opacity="0.9" />
        <rect x="48" y="4" width="24" height="8" rx="2"
          fill="#C9A84C" />

        {/* Cuello */}
        <rect x="50" y="26" width="20" height="14" rx="2"
          fill={colorBase} opacity="0.85" />

        {/* Cuerpo principal */}
        <rect x="28" y="40" width="64" height="130" rx="12"
          fill={colorBase} opacity="0.75" />

        {/* Brillo lateral izquierdo */}
        <rect x="32" y="48" width="10" height="110" rx="5"
          fill={colorBrillo} opacity="0.6" />

        {/* Brillo central superior */}
        <ellipse cx="60" cy="60" rx="16" ry="8"
          fill="white" opacity="0.08" />

        {/* Reflejo inferior */}
        <rect x="30" y="148" width="60" height="16" rx="6"
          fill={colorClaro} opacity="0.3" />

        {/* Nombre grabado */}
        <text
          x="60" y="115"
          textAnchor="middle"
          fontFamily="serif"
          fontSize="7"
          fill="white"
          opacity="0.7"
          letterSpacing="1"
        >
          AIVORA
        </text>
      </svg>

      {/* Código del perfume debajo del frasco */}
      <p style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "3px" }}>
        {nombrePerfume?.codigo || ""}
      </p>
    </div>
  );
}
```

Importar y usar en ScreenResult.jsx en el paso 7 de la revelación.
Pasar el color_hex que viene del JSON de OpenAI.

---

## CAMBIO 4 — TARJETA DESCARGABLE PNG (utils/generarTarjeta.js)

### Instalar html2canvas:
```bash
npm install html2canvas
```

### Crear un componente oculto TarjetaExport.jsx:

Este componente existe solo para ser capturado por html2canvas. No es visible para el usuario.

```jsx
// components/TarjetaExport.jsx
// Dimensiones: 1080x1920 (Instagram Stories)
// Fondo negro con detalles dorados
// Contiene: logo AIVORA, nombre del perfume, firma biométrica,
//           las 3 notas con sus descripciones, frase de identidad,
//           código único, y al pie: "aivora.co"

export default function TarjetaExport({ perfume, ref }) {
  return (
    <div
      ref={ref}
      style={{
        width: "1080px",
        height: "1920px",
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 80px",
        fontFamily: "serif",
        position: "fixed",
        left: "-9999px", // fuera de pantalla, no visible
        top: 0,
      }}
    >
      {/* Logo */}
      <p style={{ color: "#C9A84C", fontSize: "28px", letterSpacing: "16px", marginBottom: "16px" }}>
        AIVORA
      </p>

      {/* Línea decorativa */}
      <div style={{ width: "200px", height: "1px", background: "#C9A84C", marginBottom: "80px" }} />

      {/* Firma biométrica */}
      <p style={{ color: "#C9A84C", fontSize: "24px", letterSpacing: "8px", marginBottom: "40px" }}>
        — {perfume.firma_biometrica?.toUpperCase()} —
      </p>

      {/* Nombre del perfume */}
      <p style={{ color: "#FFFFFF", fontSize: "72px", marginBottom: "80px", textAlign: "center", lineHeight: 1.2 }}>
        {perfume.nombre_perfume}
      </p>

      {/* Las 3 notas */}
      {[
        { label: "APERTURA", ingrediente: perfume.nota_salida, descripcion: perfume.apertura },
        { label: "CORAZÓN", ingrediente: perfume.nota_corazon, descripcion: perfume.corazon },
        { label: "HUELLA", ingrediente: perfume.nota_fondo, descripcion: perfume.huella },
      ].map((nota, i) => (
        <div key={i} style={{ marginBottom: "48px", textAlign: "center", width: "100%" }}>
          <p style={{ color: "#666", fontSize: "20px", letterSpacing: "6px" }}>{nota.label}</p>
          <p style={{ color: "#C9A84C", fontSize: "32px", margin: "8px 0" }}>{nota.ingrediente}</p>
          <p style={{ color: "#AAAAAA", fontSize: "26px", fontStyle: "italic", lineHeight: 1.4 }}>
            {nota.descripcion}
          </p>
        </div>
      ))}

      {/* Línea separadora */}
      <div style={{ width: "100%", height: "1px", background: "#222", margin: "40px 0" }} />

      {/* Frase de identidad */}
      <p style={{ color: "#FFFFFF", fontSize: "44px", textAlign: "center", lineHeight: 1.4, marginBottom: "60px" }}>
        "{perfume.frase_identidad}"
      </p>

      {/* Código */}
      <p style={{ color: "#444", fontSize: "22px", letterSpacing: "6px" }}>
        {perfume.codigo}
      </p>

      {/* Pie */}
      <p style={{ color: "#333", fontSize: "20px", letterSpacing: "4px", marginTop: "auto" }}>
        aivora.co
      </p>
    </div>
  );
}
```

### Función para generar y descargar:

```javascript
// utils/generarTarjeta.js
import html2canvas from "html2canvas";

export async function descargarTarjeta(elementRef, nombreArchivo) {
  const canvas = await html2canvas(elementRef.current, {
    width: 1080,
    height: 1920,
    scale: 1,
    backgroundColor: "#0A0A0A",
    useCORS: true,
  });

  const link = document.createElement("a");
  link.download = `${nombreArchivo || "mi-fragancia-aivora"}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
```

### Cómo usarlo en ScreenResult.jsx:

```javascript
const tarjetaRef = useRef(null);

const handleDescargar = async () => {
  await descargarTarjeta(tarjetaRef, perfume.codigo);
};

// En el JSX:
// 1. Renderizar <TarjetaExport ref={tarjetaRef} perfume={perfume} /> (invisible, fuera de pantalla)
// 2. El botón "Descargar mi fragancia" llama a handleDescargar
```

---

## CAMBIO 5 — SONIDO AMBIENTAL (utils/sonidoAmbiental.js)

### Instalar Howler.js:
```bash
npm install howler
```

### Archivos de audio — descargar GRATIS de freesound.org:

Buscar y descargar estos 5 audios en formato MP3.
Ponerlos en: public/sounds/

| Archivo | Qué buscar en freesound.org | Duración ideal |
|---|---|---|
| bosque.mp3 | "forest rain ambience loop" | 30-60 seg |
| marino.mp3 | "ocean waves gentle loop" | 30-60 seg |
| floral.mp3 | "spring birds nature loop" | 30-60 seg |
| urbano.mp3 | "city night rain loop" | 30-60 seg |
| desierto.mp3 | "desert wind sand loop" | 30-60 seg |

Todos deben ser loops (que se repitan sin corte) y sin música, solo ambiente.

### Crear utils/sonidoAmbiental.js:

```javascript
import { Howl } from "howler";

let sonidoActual = null;

const sonidos = {
  bosque: "/sounds/bosque.mp3",
  marino: "/sounds/marino.mp3",
  floral: "/sounds/floral.mp3",
  urbano: "/sounds/urbano.mp3",
  desierto: "/sounds/desierto.mp3",
};

export function reproducirSonido(categoria) {
  // Detener cualquier sonido anterior
  if (sonidoActual) {
    sonidoActual.fade(sonidoActual.volume(), 0, 1500);
    setTimeout(() => sonidoActual.stop(), 1500);
  }

  const url = sonidos[categoria] || sonidos.bosque;

  sonidoActual = new Howl({
    src: [url],
    loop: true,
    volume: 0,
    autoplay: true,
  });

  // Fade in suave en 2 segundos
  sonidoActual.fade(0, 0.3, 2000);
}

export function detenerSonido() {
  if (sonidoActual) {
    sonidoActual.fade(sonidoActual.volume(), 0, 1500);
    setTimeout(() => {
      sonidoActual.stop();
      sonidoActual = null;
    }, 1500);
  }
}
```

### Dónde llamarlo en ScreenResult.jsx:

```javascript
import { reproducirSonido, detenerSonido } from "../utils/sonidoAmbiental";

useEffect(() => {
  if (perfume?.categoria_sonido) {
    // Empieza el sonido cuando aparece la frase de identidad (paso 6)
    if (paso >= 6) {
      reproducirSonido(perfume.categoria_sonido);
    }
  }
  return () => detenerSonido(); // limpia cuando el usuario avanza a la siguiente pantalla
}, [paso, perfume]);
```

---

## ORDEN DE EJECUCIÓN PARA CLAUDE CODE

1. Modificar geminiPrompt.js (Cambio 1)
2. Instalar html2canvas y howler: `npm install html2canvas howler`
3. Crear FrascoSVG.jsx (Cambio 3)
4. Crear TarjetaExport.jsx (Cambio 4)
5. Crear generarTarjeta.js (Cambio 4)
6. Crear sonidoAmbiental.js (Cambio 5)
7. Reescribir ScreenResult.jsx integrando todo (Cambio 2 + todos los componentes)
8. Descargar los 5 audios de freesound.org y ponerlos en public/sounds/
9. Probar flujo completo

---

## CHECKLIST FINAL

- [ ] El prompt genera descripciones cinematográficas reales (probar 5 veces)
- [ ] Cada elemento del resultado aparece con pausa dramática
- [ ] El frasco cambia de color según las notas dominantes
- [ ] El botón de descarga genera un PNG de 1080x1920
- [ ] El sonido empieza suave cuando aparece la frase de identidad
- [ ] El sonido para cuando el usuario avanza a la pantalla de captura
- [ ] Todo funciona en móvil
- [ ] Todo funciona sin internet (excepto la llamada a OpenAI)
