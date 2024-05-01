import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { AddNewEntry } from "./components/AddNewEntry"
import { MainPage } from "./pages/MainPage"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <Router> 
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

