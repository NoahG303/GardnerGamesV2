import { useState, useEffect } from 'react';
import { Form, Input, Button } from "antd";
import './App.css';

function Lottery() {
  const PLAYER_COUNT = 12;
  const [status, setStatus] = useState<string>("PRE");
  const [players, setPlayers] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [odds, setOdds] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [results, setResults] = useState<string[]>(Array(PLAYER_COUNT).fill(""));
  const [greens, setGreens] = useState<number[]>(Array(4).fill(-1));
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
      lotteryOdds.push(((dividers[i]-last) / 10)  + "%"); // math: my odds range / 10 (out of 1000) for %
      last = dividers[i];
    }
    setOdds(lotteryOdds);
  }, [])

  const runLottery = () => {
    // generate all 1001 (14 C 4) options of balls
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

    // map combos --> who wins if they get that combo, based on odds
    const combosToWinners: Record<string, number> = {};
    let currIdx = 0;
    for (let i = 0; i < 1000; i++) {
      if (i === dividers[currIdx]) {
        currIdx++;
      }
      combosToWinners[allCombos[i]] = currIdx;
    }

    // draw balls for winners
    const lotteryResults: number[] = [];
    while (lotteryResults.length < 4) {
      // generate 4 ball combo
      const selected = new Set<string>();
      while (selected.size < 4) {
        const ball = ballOptions[Math.floor(Math.random() * ballOptions.length)];
        selected.add(ball);
      }
      const selectedCombo = Array.from(selected).sort().join("");

      // ignore 1001st option & repeat winners
      if (selectedCombo === "BCDE") continue;
      const winner = combosToWinners[selectedCombo];
      if (lotteryResults.includes(combosToWinners[selectedCombo])) continue;

      lotteryResults.push(winner);
    }

    // fill rest of order after winners
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
    const updatedPlayers = players.map((_, idx) => values[idx]); // store updated player names if we have any changes
    setPlayers(updatedPlayers);
    setStatus("GO");
    const lotteryResults = runLottery();
    const lotteryWinners = lotteryResults.slice(0,4);
    const toBeGreen = lotteryWinners.map((index, _) => PLAYER_COUNT-1-index); // reverse top 4 indices
    setGreens(toBeGreen);
    setResults(lotteryResults.map((idx) => updatedPlayers[idx])); // results idx --> name
  }

  return (
    <>
      <div>
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
                          fontWeight: "bold",
                          backgroundColor: (
                            // is in the top 4
                            greens.includes(idx) &&
                            // hide at the start bc math
                            revealIndex !== -1 &&
                            // if most recently revealed person was expected after me --> show me, or also show all once we hit top 4
                            (PLAYER_COUNT-1-players.indexOf(results[PLAYER_COUNT-1-revealIndex]) >= idx || revealIndex >= PLAYER_COUNT-1-4) &&
                            // hasn't been revealed yet
                            results.slice(0,PLAYER_COUNT-1-revealIndex).includes(players[PLAYER_COUNT-1-idx])
                          )
                            ? "green"
                            : "white",
                          transition: "background-color 0.5s ease 1s"
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
        </div>)}
      </div>
    </>
  )
}

export default Lottery;
