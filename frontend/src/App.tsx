import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lottery from "./pages/Lottery";
import Navbar from "./components/Navbar";
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lottery" element={<Lottery />} />
      </Routes>
    </div>
  );
}

export default App;
