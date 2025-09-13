import { useNavigate } from "react-router-dom";
import './App.css';

function Home() {
  const navigate = useNavigate();
  
  return (
    <div>
      <h1 className="page-header">Home</h1>
      <button onClick={() => navigate("/lottery")}>To the Lottery</button>
    </div>
  )
}

export default Home