import { useState, useEffect } from 'react'
import './App.css'

function Lottery() {
  const [status, setStatus] = useState("PRE")
  const [players, setPlayers] = useState<string[]>(Array(12).fill(""))

  useEffect(() => {
    setPlayers([
      "Cousin Quinn",
      "Aidang",
      "Mr. Cox",
      "Rudy Gobert",
      "'Arry Pohuh",
      "Commissioner Gordoner",
      "Eggnog",
      "Micbruh",
      "Gaidan",
      "Klye",
      "Ballsaac",
      "Mr. Shka"
    ])
  }, [])

  const startLottery = () => {
    setStatus("IP")
  }

  return (
    <>
      <div className="page-border">
        {status === "PRE" && (<div>
          <h1 className="page-header">Welcome to the lottery.</h1>
          <button onClick={startLottery}>Click here to begin.</button>
        </div>)}
        {status === "IP" && <div>
          <h1 className="page-header">This year's players:</h1>
          {players.map((playerName, idx) => (
            <p>{playerName}, {idx}</p>
          ))}
        </div>}
      </div>
    </>
  )
}

export default Lottery
