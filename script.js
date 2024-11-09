
// 使用モジュール
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

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
      // antialias: true, // アンチエイリアス
      wireframes: false, // ワイヤーフレーム
      background: null, // 背景色を透明
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
        xScale: 0.5,
        yScale: 0.5
      }
    },
  }
);

// ワールドにすべてのボディ（オブジェクト）を追加
Composite.add(world, [
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 20, { isStatic: true }), // 上の壁 rectangle(中心位置のx座標, 中心位置のy座標, width, height, options)
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 20, { isStatic: true }), // 下の壁
  Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }), // 右の壁
  Bodies.rectangle(0, window.innerHeight / 2, 20, window.innerHeight, { isStatic: true }), // 左の壁
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

// 画面外にボールが出た場合
Events.on(engine, 'beforeUpdate', function() {
  if (ball.position.x < 0 || ball.position.x > window.innerWidth || 
      ball.position.y < 0 || ball.position.y > window.innerHeight) {
      
      setTimeout(() => {
        // 位置をリセット
        Matter.Body.setPosition(ball, { x: window.innerWidth / 2, y: window.innerHeight / 4 });
        
        // 速度もリセットして安定させる
        Matter.Body.setVelocity(ball, { x: 0, y: 0 });
      }, 1000);
  }
});

document.addEventListener('click', (event) => {
  // クリック位置を取得
  const mousePosition = { x: event.clientX, y: event.clientY };

  // クリック位置がボールの範囲内にあるかチェック
  const clickedBodies = Matter.Query.point([ball], mousePosition);

  if (clickedBodies.length > 0) {
      // ボールの中心位置とクリック位置の差をベクトルで取得
      const deltaX = ball.position.x - mousePosition.x; // x方向を反転
      const deltaY = ball.position.y - mousePosition.y; // y方向を反転

      // 力の大きさを調整
      const forceMagnitude = 0.02; // 力の大きさは調整可能

      // 反転した方向に力を加える
      const force = {
          x: deltaX * forceMagnitude,
          y: deltaY * forceMagnitude
      };

      // ボールに力を加えて反対方向に飛ばす
      Matter.Body.applyForce(ball, ball.position, force);
  }
});

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