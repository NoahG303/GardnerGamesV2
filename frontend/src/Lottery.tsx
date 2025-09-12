import { useState, useEffect } from 'react';
import { Form, Input, Button } from "antd";
import './App.css';

function Lottery() {
  const PLAYER_COUNT = 12;
  const [status, setStatus] = useState<string>("PRE");
  const [players, setPlayers] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [odds, setOdds] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [results, setResults] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [revealIndex, setRevealIndex] = useState<number>(-1);
  const [form] = Form.useForm();

  const ballOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E"];
  const dividers = [140, 280, 420, 560, 675, 770, 845, 895, 935, 965, 985, 1000]; // not automatable?

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
    ]); // not automatable - hard coded for us

    const lotteryOdds: string[] = [];
    let last = 0;
    for (let i = 0; i < PLAYER_COUNT; i++) {
      lotteryOdds.push(((dividers[i]-last) / 10)  + "%");
      last = dividers[i];
    }
    setOdds(lotteryOdds);
  }, [])

  const runLottery = () => {
    const allCombos: string[] = [];
    for (let a = 0; a < 14; a++) {
      for (let b = a + 1; b < 14; b++) {
        for (let c = b + 1; c < 14; c++) {
          for (let d = c + 1; d < 14; d++) {
            allCombos.push(ballOptions[a] + ballOptions[b] + ballOptions[c] + ballOptions[d]);
          }
        }
      }
    }

    const combosToWinners: Record<string, number> = {};
    let currIdx = 0;

    for (let i = 0; i < 1000; i++) {
      if (i === dividers[currIdx]) {
        currIdx++;
      }
      combosToWinners[allCombos[i]] = currIdx;
    }

    const lotteryResults: number[] = [];
    while (lotteryResults.length < 4) {
      const selected = new Set<string>();
      while (selected.size < 4) {
        const ball = ballOptions[Math.floor(Math.random() * ballOptions.length)];
        selected.add(ball);
      }
      const selectedCombo = Array.from(selected).sort().join("");

      if (selectedCombo === "BCDE") continue;
      const winner = combosToWinners[selectedCombo];
      if (lotteryResults.includes(combosToWinners[selectedCombo])) continue;

      lotteryResults.push(winner);
    }

    for (let i = 0; i < PLAYER_COUNT; i++) {
      if (!lotteryResults.includes(i)) {
        lotteryResults.push(i);
      }
    }
    
    return lotteryResults;
  }

  const startLottery = () => {
    setStatus("IP");
  }

  const onFinish = (values: Record<number, string>) => {
    const updatedPlayers = players.map((_, idx) => values[idx]);
    setPlayers(updatedPlayers);
    setStatus("GO");
    const lotteryResults = runLottery();
    setResults(lotteryResults.map((idx) => updatedPlayers[idx]));
  }

  return (
    <>
      <div className="page-border">
        {status === "PRE" && (<div>
          <h1 className="page-header">Welcome to the Armchair Analysts 2025-26 season draft lottery</h1>
          <button onClick={startLottery}>Click here to begin</button>
        </div>)}
        {status === "IP" && <div>
          <h1 className="page-header">This year's contenders:</h1>
          <div style={{ maxWidth: 350, margin: "auto" }}>
            <Form
              form={form}
              onFinish={onFinish}
              layout="horizontal"
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
            >
              {players.map((playerName, idx) => (
                <Form.Item
                  key={idx}
                  label={`Player ${idx+1} (odds: ${odds[idx]}):`}
                  name={idx}
                  rules={[{ required: true, message: `Please enter Player ${idx+1}` }]}
                  initialValue={playerName}
                  style={{ marginBottom: 8 }}
                >
                  <Input />
                </Form.Item>
              ))}
              <Form.Item style={{ display: 'flex', justifyContent: 'center' }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>}
        {status === "GO" && (<div>
          <div style={{ display: "flex", width: "50vw" }}>
            <div style={{ flex: 1 }}>
              <h2 className="page-header">Expected Results:</h2>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {players.slice().reverse().map((playerName, idx) => (
                    <tr key={idx}>
                      <td
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                          padding: "8px",
                          color: "black",
                          fontWeight: "bold"
                        }}
                      >
                        {playerName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ flex: 1 }}>
              <h2 className="page-header">Actual Results:</h2>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {results.slice().reverse().map((playerName, idx) => (
                    <tr key={idx}>
                      <td
                        style={{
                          border: "2px solid black",
                          textAlign: "center",
                          padding: "8px",
                          color: revealIndex >= idx ? "black" : "transparent",
                          fontWeight: "bold",
                          transition: "color 2s ease"
                        }}
                      >
                        {playerName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>              
          </div>
          <button onClick={() => setRevealIndex(revealIndex+1)} disabled={revealIndex >= PLAYER_COUNT-1}>
            Reveal Next
          </button>
          {revealIndex >= 7 && (<div>
            {results.slice(0, PLAYER_COUNT-1-revealIndex).reverse().map((person, idx) => (
              <p key={idx}>{person}</p>
            ))}
          </div>)}
        </div>)}
      </div>
    </>
  )
}

export default Lottery;
