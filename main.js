import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World;

//엔진 선언 
const engine = Engine.create();

//렌더 선언
const render = Render.create({
    engine,
    element: document.body,
    options: {
        wireframes: false, //true면 색적용 안됨
        background: '#F7F8C8',
        width: 620,
        height: 850
    }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle:'#E6B143'}
})

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    isStatic: true,
    render: {fillStyle:'#E6B143'}
})
//?

const ground = Bodies.rectangle(310, 820, 620, 60, {
    isStatic: true,
    render: {fillStyle:'#E6B143'}
})

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    isStatic: true,
    isSensor: true,
    render: {fillStyle:'#E6B143'}
})

World.add(world, [leftWall,rightWall,ground,topLine])

Render.run(render);
Runner.run(engine);

//현재 과일 값을 저장할 변수 생성
let currentBody = null;
let currentFruit = null;
//과일 떨어지는 함수 만들기
function addFruit(){
    //과일 index 저장
    const index = Math.floor(Math.random()*5);

    

    const fruit = FRUITS[index];

    const body = Bodies.circle(300, 50, fruit.radius, {
        index : index,
        isSleeping: true,
        render: {
            sprite : {texture: `${fruit.name}.png`},
        },
        restitution: 0.2
    });

    currentBody = body;
    currentFruit = fruit;

    World.add(world,body)
}

addFruit();

