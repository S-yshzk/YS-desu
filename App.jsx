import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts'
import './App.css'

const DrawChart = (props) => {
    const w = 1400;
    const h = 200;
    const date = [-15, 17, 47, 78, 108, 139, 170, 198, 229, 259, 290, 320];
    const mouth = ["2022/8/1", "2022/9/1", "2022/10/1", "2022/11/1", "2022/12/1", "2023/1/1", "2023/2/1", "2023/3/1", "2023/4/1", "2023/5/1", "2023/6/1", "2023/7/1"];
    const change = (item) => {
        if (props.match !== item) {
            props.changeMatch(item);
            props.changeJudge(true);
        } else {
            props.changeMatch({});
            props.changeJudge(false);
        }
    }

    const x = d3.scaleLinear()
        .domain(d3.extent([0, 320]))
        .range([100, w])
        .nice();
    return (
        <g transform="translate(80,550)">
            {/* <rect x={x(date[0])} y={1 / 8 * h} width={x(date[11]) - x(date[0])} height={1 / 4 * h} fill="#1e90ff" opacity={0.4}></rect>
            <rect x={x(date[0])} y={5 / 8 * h} width={x(date[11]) - x(date[0])} height={1 / 4 * h} fill="#1e90ff" opacity={0.4}></rect> */}
            <text textAnchor="middle" dominantBaseline="middle" x={10} y={h / 4}>LaLiga</text>
            <text textAnchor="middle" dominantBaseline="middle" x={10} y={h / 2}>EL</text>
            <text textAnchor="middle" dominantBaseline="middle" x={-15} y={(3 / 4) * h}>COPA DELREY</text>
            <line x1={x(date[0])} y1={1 / 8 * h} x2={x(date[11])} y2={1 / 8 * h} stroke="black"></line>
            <line x1={x(date[0])} y1={3 / 8 * h} x2={x(date[11])} y2={3 / 8 * h} stroke="black"></line>
            <line x1={x(date[0])} y1={5 / 8 * h} x2={x(date[11])} y2={5 / 8 * h} stroke="black"></line>
            <line x1={x(date[0])} y1={7 / 8 * h} x2={x(date[11])} y2={7 / 8 * h} stroke="black"></line>
            {
                date.map((item, index) => {
                    return (
                        <g>
                            <line x1={x(item)} y1={1 / 8 * h} x2={x(item)} y2={7 / 8 * h} stroke="black"></line>
                            <text textAnchor="middle" dominantBaseline="middle" x={x(item)} y={1 / 16 * h}>{mouth[index]}</text>
                        </g>
                    )
                })
            }
            {props.data.map((item, index) => {
                let pos;
                if (item.ligue === 'LaLiga') {
                    pos = h / 4;
                } else if (item.ligue === 'EL') {
                    pos = h / 2;
                } else {
                    pos = h * (3 / 4);
                }
                let c;

                let opacity = 1;

                if (item.members.some(i => i == props.player) === false && props.player !== null) {
                    opacity = 0.15;
                }

                if (props.match === index) {
                    c = 'rgb(0, 0, 255)';
                    opacity = 1;
                } else if (item.stats.result === 'win') {
                    c = 'rgb(0, 255, 0)';
                } else if (item.stats.result === 'lose') {
                    c = 'rgb(255, 0, 0)';
                } else {
                    c = 'rgb(128, 128, 128)';
                }
                return (
                    <g>
                        <circle onClick={() => change(index)} key={index} cx={x(item.elapsed)} index cy={pos} r={5} fill={c} opacity={opacity} style={{ transition: "opacity 0.5s" }}></circle>
                    </g>
                )
            })}
        </g>
    )
}

const Member = (props) => {
    const space = 30;
    let count = 0;
    let pos = 10;
    const change = (item) => {
        if (props.player !== item) {
            props.changePlayer(item);
        } else {
            props.changePlayer(null);
        }
        console.log(props.player);
    }
    return (
        props.data.map((item, index) => {
            if (count === 15) {
                pos += 410;
                count = 0;
            }
            count += 1;
            let c = 'black'
            if (props.player === item.id) {
                c = 'blue'
            }
            return (
                <g transform="translate(0, 50)">
                    <line x1={pos} y1={space * count} x2={pos + 410} y2={space * count} stroke="black"></line>
                    <line x1={pos} y1={space * count} x2={pos} y2={space * (count + 1)} stroke="black"></line>
                    <text onClick={() => change(item.id)} textAnchor="left" dominantBaseline="middle" x={pos + 5} y={(count + (1 / 2)) * space} stroke={c}>{item.pos + item.id + item.name}</text>
                    <line x1={pos + 410} y1={space * count} x2={pos + 410} y2={space * (count + 1)} stroke="black"></line>
                    <line x1={pos} y1={space * (count + 1)} x2={pos + 410} y2={space * (count + 1)} stroke="black"></line>
                </g>
            )
        })
    )
}

const DrawMatchStats = (props) => {
    const space = 40;
    const head = 90;
    if (props.judge) {
        return (
            <g transform="translate(1200, 50)">
                <rect x={-80} y={-40} width={250} height={500} fill="#1e90ff" stroke="black" opacity={0.5}></rect>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head}>ligue:{props.match.ligue}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head + space * 1}>節:{props.match.id}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head + space * 2}>date:{props.match.date}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head + space * 3}>相手:{props.match.op}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head + space * 4}>結果：{props.match.stats.result}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={head + space * 5}>スコア：{props.match.stats.score}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={-20} fontFamily="Arial" fontSize={20}>試合情報</text>
            </g>
        )
    } else {
        return (
            <g transform="translate(1200, 50)">
                <rect x={-80} y={-40} width={250} height={500} fill="#1e90ff" stroke="black" opacity={0.5}></rect>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={200}>試合を選択</text>
                <text textAnchor="middle" dominantBaseline="middle" x={40} y={-20} fontFamily="Arial" fontSize={20}>試合情報</text>
            </g>
        )
    }
}

const DrawPlayerStats = (props) => {
    let sum = 0;
    let winCount = 0;
    let drawCount = 0;
    let loseCount = 0;
    for (const item of props.matchData) {
        if (item.members.some(i => i == props.player) || props.player === null) {
            if (item.stats.result === "win") {
                sum++;
                winCount++;
            } else if (item.stats.result === "draw") {
                sum++;
                drawCount++;
            } else {
                sum++;
                loseCount++;
            }
        }
    }
    const p = Math.round(sum / 51 * 100);
    const winRate = Math.round(winCount / sum * 100);
    const drawRate = Math.round(drawCount / sum * 100);
    const loseRate = Math.round(loseCount / sum * 100);
    const head = 10;
    const playerData = [{ "name": "勝ち", "value": winRate }, { "name": "引き分け", "value": drawRate }, { "name": "負け", "value": loseRate }];
    const colors = ['#00ff00', '#808080', '#ff0000']
    let t1 = "全試合の結果"
    let t2 = null;
    if (props.player !== null) {
        for (const item of props.membersData) {
            if(item.id == props.player) {
                t1 = item.name;
                t2 = "先発時の戦績";
            }
        }
    }
    return (
        <div className="DrawPlayerStats">
            <PieChart width={730} height={300} style={{ position: 'absolute', top: 200, left: 600 }}>
                <Pie data={playerData} dataKey="value" nameKey="name" cx={370} cy="55%" startAngle={90} endAngle={-270} animationBegin={100} animationDuration={800} outerRadius={90}label >
                    {playerData.map((entry, index) => {
                        return (
                            <Cell key={`cell-${index}`} fill={colors[index]} />
                        )
                    })}
                    <Tooltip />
                </Pie>
            </PieChart>
            <svg width={500} height={500} style={{ position: 'absolute', top: 0, left: 750 }}>
                <text textAnchor="middle" dominantBaseline="middle" x={220} y={30} fontFamily="Arial" fontSize={11}>{t1}</text>
                <text textAnchor="middle" dominantBaseline="middle" x={220} y={55} fontFamily="Arial" fontSize={16}>{t2}</text>
                <text textAnchor="end" dominantBaseline="middle" x={260} y={90 + head}>試合数：{sum}</text>
                <text textAnchor="end" dominantBaseline="middle" x={260} y={120 + head}>勝ち：{winCount}</text>
                <text textAnchor="end" dominantBaseline="middle" x={260} y={150 + head}>引き分け：{drawCount}</text>
                <text textAnchor="end" dominantBaseline="middle" x={260} y={180 + head}>負け：{loseCount}</text>
                <text textAnchor="end" dominantBaseline="middle" x={260} y={210 + head}>出場率：{p}%</text>
            </svg>
        </div>
    )
}

function App() {
    const url1 = '/matchesData.json';
    const url2 = '/membersData.json'
    const [matchesData, setMatchesData] = useState([]);
    const [membersData, setMembersData] = useState([]);
    const [player, setPlayer] = useState(null);
    const [match, setMatch] = useState(null);
    const [judge, setJudge] = useState(false);
    const w = 1410;
    const h = 740;
    const changePlayer = (item) => {
        setPlayer(item);
    }
    const changeMatch = (item) => {
        setMatch(item);
    }
    const changeJudge = (j) => {
        setJudge(j);
    }
    useEffect(() => {
        fetch(url1).then((response) => response.json())
            .then((jsonData) => {
                setMatchesData(jsonData);
            })
        fetch(url2).then((response) => response.json())
            .then((jsonData) => {
                setMembersData(jsonData);
            })
    }, []);
    return (
        <div>
            <h1>レアルソシエダ戦績</h1>
            <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0 }}>
                <rect x={850} y={10} width={250} height={500} fill="#1e90ff" stroke="black" opacity={0.5}></rect>
                <Member data={membersData} changePlayer={changePlayer} player={player}></Member>
                <DrawMatchStats match={matchesData[match]} judge={judge} ></DrawMatchStats>
                <DrawChart data={matchesData} h={h} player={player} changeMatch={changeMatch} match={match} changeJudge={changeJudge}></DrawChart>
            </svg>
            <DrawPlayerStats matchData={matchesData} player={player} membersData={membersData}></DrawPlayerStats>
        </div>
    )
}
export default App;
