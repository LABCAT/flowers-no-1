import Scene from './Scene.js'
import Audio from './Audio.js'
import { GlobalContextProvider } from './context/Context';

export default function App() {
  return (
    <GlobalContextProvider>
      <Scene />
      <Audio />
    </GlobalContextProvider>
  )
}
