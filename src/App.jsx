import { useState } from 'react'
import LandingPage from './components/LandingPage'
import ScreenEntry from './components/ScreenEntry'
import ScreenFaceScan from './components/ScreenFaceScan'
import ScreenTest from './components/ScreenTest'
import ScreenLoading from './components/ScreenLoading'
import ScreenResult from './components/ScreenResult'
import ScreenCapture from './components/ScreenCapture'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [appData, setAppData] = useState({
    nombre: '',
    emocion: null,
    respuestas: [],
    perfilOlfativo: {},
    perfume: null,
  })

  function updateData(partial) {
    setAppData(prev => ({ ...prev, ...partial }))
  }

  function goTo(screenName) {
    setScreen(screenName)
  }

  const props = { appData, updateData, goTo }

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-white ${screen === 'landing' ? 'overflow-x-hidden' : 'overflow-hidden'}`}>
      {screen === 'landing'  && <LandingPage onStart={() => setScreen('entry')} />}
      {screen === 'entry'    && <ScreenEntry    {...props} onBack={() => setScreen('landing')} />}
      {screen === 'facescan' && <ScreenFaceScan {...props} />}
      {screen === 'test'     && <ScreenTest     {...props} />}
      {screen === 'loading'  && <ScreenLoading  {...props} />}
      {screen === 'result'   && <ScreenResult   {...props} />}
      {screen === 'capture'  && <ScreenCapture  {...props} />}
    </div>
  )
}
