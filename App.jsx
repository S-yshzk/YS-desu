import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import * as d3 from "d3";
import "./App.css"
const Box = (props) => {
  const l = 5
  const ref = useRef();
  const target = null;
  
  useFrame(() => (ref.current.rotation.x += 0.01));
  let c;
  if (props.result === 'win') {
    c = 'rgb(0, 255, 0)';
  } else if (props.result === 'lose') {
    c = 'rgb(255, 0, 0)';
  } else {
    c = 'rgb(128, 128, 128)';
  }
  let judge = 0.2;
  console.log(props.data.includes(props.target));
  if(props.data.some(item => item == props.target)) {
    judge = 2;
  }
  return (
    <mesh onClick={(e) => console.log(props.index)} {...props} ref={ref}>
      <boxGeometry args={[l, l, l]} stroke="black"/>
      <meshStandardMaterial color={c} transparent={true} opacity={judge}/>
    </mesh>
  )
}


const Members = (props) => {
  const wLen = 400;
  const hLen = 700;
  const space = hLen / props.data.length;
  let c = "black";
  const change = (item) => {
    if(c === "black4869") {
      props.changeTarget(item);
      c = "blue"
    } else {
      props.changeTarget(null);
      c = "black"
    }
  }
  return (
    props.data.map((item, index) => {
      return (
        <g>
          <line x1={0} y1={space * (index + 1)} x2={wLen} y2={space * (index + 1)} stroke='black'></line>
          <text onClick={() => change(item.id)} dominantBaseline="middle" x={10} y={space * (index + 3 / 2) } fill={c}>{item.pos}:{item.id}:{item.name}</text>
        </g>
      )
    })
  )
}

const LineZ = (props) => {
  return (
    <mesh>
      <Line points={[[props.x, -10, props.z1], [props.x, -10, props.z2]]} color="black" linewidth={2} />
    </mesh>
  )
}

const LineX = (props) => {
  return (
    <mesh >
      <Line points={[[-50, -10, props.z], [50, -10, props.z]]} color="black" lineWidth={2}></Line>
    </mesh>
  )
}

const Print = (props) => {
  return (
    <Text position={[-60, -10, props.z]} fontSize={5} color="pink" anchorX="center" anchorY="middle">{props.text}</Text>
  )
}

const App = () => {
  const ref2 = useRef();
  const url1 = '/matchsData.json';
  const url2 = '/membersData.json'
  const [matchsData, setMatchsData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [isTarget, setIsTarget] = useState(false);
  const [target, setTarget] = useState(null);
  const date = [-15, 17, 47, 78, 108, 139, 170, 198, 229, 259, 290, 320];
  const mouth = ["2022/8/1", "2022/9/1", "2022/10/1", "2022/11/1", "2022/12/1", "2023/1/1", "2023/2/1", "2023/3/1", "2023/4/1", "2023/5/1", "2023/6/1", "2023/7/1"];
  useEffect(() => {
    fetch(url1).then((response) => response.json())
      .then((jsonData) => {
        setMatchsData(jsonData);
      })
    fetch(url2).then((response) => response.json())
      .then((jsonData) => {
        setMembersData(jsonData);
      })
  }, []);

  const changeTarget = (newTarget)=> {
    console.log(newTarget);
    setTarget(newTarget);
  }

  const cameraRef = useRef();
  const z = d3.scaleLinear()
    .domain(d3.extent([0, 294]))
    .range([10000, 9000])
    .nice();
  return (
    <div>
      <div className='container'>
        <Canvas ref={cameraRef} camera={{ fov: 60, position: [0, 35, 10200] }}>
          <ambientLight intensity={0.5} />
          <mesh ref={ref2} >
            {/* <meshStandardMaterial color={"blue"} /> */}
            {matchsData.map((item, index) => {
              let pos;
              if (item.ligue === "LaLiga") {
                pos = -30;
              } else if (item.ligue === "EL") {
                pos = 0;
              } else {
                pos = 30
              }
              return (
                <Box key={index} position={[pos, -3, z(item.elapsed)]} result={item.stats.result} index={index} data={item.members} target={target} stroke="black"/>
              )
            })}
          </mesh>
          <LineZ x={-45} z1={z(date[0])} z2={z(date[date.length - 1])}></LineZ>
          <LineZ x={-15} z1={z(date[0])} z2={z(date[date.length - 1])}></LineZ>
          <LineZ x={15} z1={z(date[0])} z2={z(date[date.length - 1])}></LineZ>
          <LineZ x={45} z1={z(date[0])} z2={z(date[date.length - 1])}></LineZ>
          <Text position={[-30, -15, 10050]} fontSize={5} color="blue" anchorX="center" anchorY="middle">LaLiga</Text>
          <Text position={[0, -15, 10050]} fontSize={5} color="blue" anchorX="center" anchorY="middle">EL</Text>
          <Text position={[30, -15, 10050]} fontSize={5} color="blue" anchorX="center" anchorY="middle">COPA DELREY</Text>
          <OrbitControls maxDistance={10200} minDistance={9100} zoomSpeed={0.01} enableRotate={false} enablePan={false} />
          {date.map((item, index) => {
            return (
              <group>
                <LineX z={z(item)}></LineX>
                <Print z={z(item)} text={mouth[index]}></Print>
              </group>
            )
          })}
          {console.log(ref2)}
        </Canvas>
      </div>
      <div className='member'>
        <svg>
          {/* {membersData.map((item, index) => {
            return (
              <line x1={30} y1={index * 50} x2={150} y2={index * 50} stroke='black'></line>
            )
          })
          }
          {membersData.map((item, index) => <text onClick={(e) => console.log(item.name)} dominantBaseline='middle' x={20} y={index * 50 + 25}>{item.name}</text>)} */}
          <Members data={membersData} changeTarget={changeTarget}></Members>
        </svg>
      </div>
    </div>
  );
};



export default App;
