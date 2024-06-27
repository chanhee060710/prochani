
import { FRUITS } from "./fruits.js";

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Body = Matter.Body,
    Events = Matter.Events;

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
    name: "topLine",
    render: {fillStyle:'#E6B143'}
})

World.add(world, [leftWall,rightWall,ground,topLine])

Render.run(render);
Runner.run(engine);

//현재 과일 값을 저장할 변수 생성
let currentBody = null;
let currentFruit = null;
//키 조작으 ㄹ제어하는 변수 생성
let disableAction = false;
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

window.onkeydown = (event) =>{

    //제어 조작 변수가 true 경우 바로 리턴
    if(disableAction)
        return
    
    switch(event.code){
        case "KeyA":
            if(currentBody.position.x - currentFruit.radius>30)
            Body.setPosition(currentBody,{
                x: currentBody.position.x - 10,
                y: currentBody.position.y
            })
            break;
        case "KeyD":
            if(currentBody.position.x + currentFruit.radius<570)
            Body.setPosition(currentBody,{
                x: currentBody.position.x + 10,
                y: currentBody.position.y
            })
            break;
        case "KeyS":
            currentBody.isSleeping = false;
            disableAction = true;
            setTimeout(()=>{
                addFruit();
                disableAction = false;
            },1000)
            break;
    }
}

Events.on(engine,"collisionStart",(event)=>{
    //콜리전 이벤트 발생시 생기는 모든 오브젝트를 비교
    event.pairs.forEach((collision) =>{
        if(collision.bodyA.index == collision.bodyB.index){


            //기존 과일의 index를 저장
            const index = collision.bodyA.index;

            if(index === FRUITS.length - 1){
                return;
            }

            //충돌이 일어나는 같은 과일 제거
            World.remove(world,[collision.bodyA,collision.bodyB]);


            //기존 과일에서 1증가 시킨 값을 저장
            const newFruits = FRUITS[index+1];
            const newBody = Bodies.circle(
                collision.collision.supports[0].x,
                collision.collision.supports[0].y,
                newFruits.radius,
                {
                    //과일 index 저장
                    index: index+1,
                    //새로운 과일 렌더링
                    render: {sprite : {texture : `${newFruits.name}.png`}},
                }
            )
                World.add(world,newBody);

                
        }
        // if( !disableAction && (collision.bodyA.name === "topLine" || collision.bodyB === "topLine"))
        //         alert("Game Over");
        //         disableAction = true;
    })
})

addFruit();

