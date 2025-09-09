import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home'
import Lottery from './Lottery'
import './App.css'

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/lottery">Lottery</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lottery" element={<Lottery />} />
      </Routes>
    </div>
  )
}

export default App
