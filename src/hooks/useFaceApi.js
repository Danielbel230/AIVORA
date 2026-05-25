import { useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

const MODELS_URL = '/models'

const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 160,
  scoreThreshold: 0.1,
})

export function useFaceApi() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(null)

  async function cargarModelos() {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
      ])
      console.log('[useFaceApi] Modelos cargados:', {
        tinyFace:    faceapi.nets.tinyFaceDetector.isLoaded,
        landmarks:   faceapi.nets.faceLandmark68Net.isLoaded,
        expressions: faceapi.nets.faceExpressionNet.isLoaded,
      })
      console.log('[TEST] Modelos activos, iniciando detección...')
      setCargado(true)
    } catch (err) {
      console.error('[useFaceApi] Error cargando modelos:', err)
      setError('No se pudieron cargar los modelos: ' + err.message)
    }
  }

  async function iniciarCamara() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      return true
    } catch (err) {
      console.error('[useFaceApi] Error cámara:', err)
      setError('Cámara rechazada o no disponible')
      return false
    }
  }

  // Esperar a que el video tenga dimensiones reales
  async function esperarVideo() {
    const video = videoRef.current
    if (!video) return false
    if (video.readyState >= 2 && video.videoWidth > 0) return true

    return new Promise(resolve => {
      function check() {
        if (video.readyState >= 2 && video.videoWidth > 0) {
          resolve(true)
        } else {
          video.addEventListener('loadeddata', () => resolve(true), { once: true })
          // Fallback timeout por si loadeddata no dispara
          setTimeout(() => resolve(video.videoWidth > 0), 3000)
        }
      }
      check()
    })
  }

  function detenerCamara() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  // Returns { emocion: string|null, detections: array|null }
  async function detectar() {
    console.log('[DETECTAR] función ejecutada')
    const video = videoRef.current
    console.log('[DETECTAR] video:', video?.videoWidth, 'readyState:', video?.readyState, 'cargado:', cargado)
    if (!video || !cargado) return { emocion: null, detections: null }
    if (video.readyState < 2 || video.videoWidth === 0) {
      console.log('[useFaceApi] Video no listo. readyState:', video.readyState, 'videoWidth:', video.videoWidth)
      return { emocion: null, detections: null }
    }

    try {
      const detections = await faceapi
        .detectAllFaces(video, DETECTOR_OPTIONS)
        .withFaceLandmarks()
        .withFaceExpressions()

      if (!detections || detections.length === 0) {
        console.log('[SCAN] Sin detección en este frame | readyState:', video.readyState,
          '| videoSize:', video.videoWidth, 'x', video.videoHeight)
        return { emocion: null, detections: null }
      }
      console.log('[SCAN] Score:', detections[0].detection.score.toFixed(3),
        '| videoSize:', video.videoWidth, 'x', video.videoHeight)

      const expresiones = detections[0].expressions
      const emocion = Object.entries(expresiones).sort((a, b) => b[1] - a[1])[0][0]

      return { emocion, detections }
    } catch (err) {
      console.error('[useFaceApi] Error detectando:', err)
      return { emocion: null, detections: null }
    }
  }

  return { videoRef, cargado, error, cargarModelos, iniciarCamara, detenerCamara, detectar, esperarVideo }
}
