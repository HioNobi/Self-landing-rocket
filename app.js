var context, controller, falcon_9, loop;

context = document.querySelector("canvas").getContext("2d");

context.canvas.width = 900;
context.canvas.height = 900;
let rocket = new Image();
let water = new Image();
let audio = new Audio("music.mp3");

falcon_9 = {
  height:80,
  jumping:true,
  width:10,
  x: 900, // center of the canvas
  x_velocity:0,
  y:0,
  y_velocity:0,
  thrust: 0,
  hor_thrust: 0,
  angle: 0,
  cut_off: false,

  draw: () =>{
    context.save();
    context.translate(falcon_9.x + falcon_9.width/2,falcon_9.y + falcon_9.height/2);
    context.rotate(-(Math.atan(falcon_9.x_velocity / falcon_9.angle)));
    context.fillStyle = "#ffffff";
    context.beginPath();
    context.drawImage(rocket, -(falcon_9.width/2), -(falcon_9.height/2), falcon_9.width,falcon_9.height);
    if(!falcon_9.cut_off){
      context.fillStyle = 'red';
      context.ellipse(-(falcon_9.width/2) + 5, falcon_9.height/2, 40, 5, Math.PI / 2, -1.6, 0.5 * Math.PI);
    }
    context.fill();
    context.restore();
  },

  burn: () => {
    // Vertical burn
    if(falcon_9.y_velocity > 0.5){
      falcon_9.thrust -= 0.006;
    }else if(falcon_9.y_velocity < 0.5){
      falcon_9.thrust += 0.00989;
      if(falcon_9.thrust > 0){
        falcon_9.thrust = 0;
      } 
    }
    console.log(falcon_9.thrust)
    //Horizontal burn
    let x_distance = -((falcon_9.x + (falcon_9.width /  2)) - (ship.x + (ship.width / 2) + 30))
    if(falcon_9.x + falcon_9.width / 2 < ship.x + ship.width / 2){
      if(x_distance > 1000){
        falcon_9.hor_thrust = 5;
      }else{
        falcon_9.hor_thrust = x_distance / 200;
      }
    }else if(falcon_9.x + falcon_9.width / 2 > ship.x + ship.width / 2){
      if(x_distance < -1000){
        falcon_9.hor_thrust = -5;
      }else{
        falcon_9.hor_thrust = x_distance / 200;
      }
    }
    // if(falcon_9.x_velocity > 0){
    //   falcon_9.hor_thrust -= 0.1;
    // }else if(falcon_9.x_velocity < 0){
    //   falcon_9.hor_thrust += 0.1
    // }
  },
};

ship = {
    height: 10,
    width:110,
    x:100, // center of the canvas  
    y:870,
    y_velocity: 0,
    speed:0.15,
    constant:1,
    draw: () =>{
        context.strokeStyle = "#202830";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(ship.x, ship.y);
        context.lineTo(ship.x + ship.width, ship.y);
        context.stroke();
    }
}

let wind_vel = -0.000000000000000000009;
let gravity = 0.03;
let times = 1;

audio.play();

loop = function() {
    //Set source for images
    rocket.src = "rocket.PNG";
    water.src = "water.PNG";

    //If falcon 9 falling below 100px
    if (falcon_9.y > 100 && !falcon_9.cut_off) {
        falcon_9.burn();
    }
    if(!falcon_9.cut_off){
      falcon_9.x_velocity = wind_vel + falcon_9.hor_thrust;
      falcon_9.angle += gravity;
      falcon_9.y_velocity += gravity + falcon_9.thrust;
      falcon_9.y += falcon_9.y_velocity;
    }
    // if falcon_9 is falling below floor line
    if ((falcon_9.y + falcon_9.height > ship.y && falcon_9.y + falcon_9.height < ship.y + 5) && (falcon_9.x + 3 >= ship.x && falcon_9.x + 4 <= ship.x + ship.width)) {
      falcon_9.thrust = 0;
      gravity = 0;
      falcon_9.x_velocity = ship.speed;
      falcon_9.y_velocity = 0;
      falcon_9.hor_thrust = 0;
      falcon_9.angle = 90;
      falcon_9.cut_off = true;

      if(times == 1){
        console.log("Ò course")
        context.fillStyle = "#000000";
        context.fillRect(0, 0, 900, 900);
        context.font = "20px Georgia";
        context.fillText("Lost signal", 300, 350);
        context.font = "20px Georgia";
        context.fillText("Of cource we still love you", 250, 400);
        alert("Lost signal");
        alert("Of course we still love you")
        context.fill();
        setTimeout(() => {
          console.log("Signal back");
          alert("Signal back, sorry!")
        }, 5000);
      }

      times += 1;
    }

    context.font = "20px Georgia";
    context.fillText("Lost signal", 900, 350);
    //If the ship go out of the screen
    if(ship.x > 900){
      ship.x = 0 - ship.width - 1;
      falcon_9.x = ship.x + ship.width / 2 - falcon_9.width / 2;
    }

    falcon_9.x += falcon_9.x_velocity;
    ship.x += ship.speed;

    context.fillStyle = "#000000";
    context.fillRect(0, 0, 900, 900);// x, y, width, height
    falcon_9.draw();
    context.drawImage(water, 0, 870, 1000, 100)

    ship.draw();
    // call update when the browser is ready to draw again
    window.requestAnimationFrame(loop);

};

window.requestAnimationFrame(loop);
