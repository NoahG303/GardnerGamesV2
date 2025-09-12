import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Lottery from './Lottery'
import './App.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lottery" element={<Lottery />} />
      </Routes>
    </div>
  )
}

export default App
