
// 使用モジュール
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;

// エンジンの生成
const engine = Engine.create();
const world = engine.world;

// レンダラーの生成
const render = Render.create({
    element: document.querySelector('.js-canvas'),
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false, // ワイヤーフレーム
    }
});

// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
// var boxB = Bodies.rectangle(450, 50, 80, 80);

const ball = Bodies.circle(
  window.innerWidth / 2, // 円の中心位置（x座標）
  window.innerHeight / 4, // 円の中心位置（y座標）
  50, // 半径
  {
    // isStatic: false, // trueにすると静的なオブジェクトになる
    restitution: 0.9, // 弾性係数
    render: {
      sprite: {
        texture: './ball.png',
        xScale: 0.125,
        yScale: 0.125
      }
    },
  }
);

// ワールドにすべてのボディ（オブジェクト）を追加
Composite.add(world, [
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true }), // 上の壁
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true }), // 下の壁
  Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }), // 右の壁
  Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }), // 左の壁
  ball,
]);

// Composite.add(world, [ball]);

// マウス制御
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
        visible: false
    }
  }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

// リサイズ設定
window.addEventListener('resize', () => {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

  Composite.clear(world, false, true);

  Composite.add(world, [
    boxA, boxB, ball,
    Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true }),
    Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true }),
    Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true }),
    Bodies.rectangle(0, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true })
  ]);
});