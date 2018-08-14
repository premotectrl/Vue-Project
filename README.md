# Vue-Project
This a Vue play field
Other

https://bitbucket.org/kukaaustin/kuka-core-controls/downloads/

imagePath: function () {
  return require('~assets/' + this.country.name + '.jpg') // or @ // this is  a computed property
}


window.onload = function() {
  //Canvas initialization
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  
  var W = canvas.width;
  var H = canvas.height;
  var degrees = 0;
  var new_degrees = 0;
  var difference = 0;
  var color = "lightgreen";
  var bgcolor = "#222";
  var text;
  var animation_loop, redraw_loop;
  
  function init() {
    //Clear the canvas every time a chart is drawn
    ctx.clearRect(0,0,W,H);
    
    //Background 360 degree arc
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = 30;
    ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2, false);
    ctx.stroke();
    
    //Gauge will be a simple arc
    //Angle in radians = angle in degrees * PI / 180
    var radians = degrees / 100;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 30;
    //The arc starts from the rightmost end. If we deduct 90 degrees from the angles, the arc will start from the topmost end
    ctx.arc(W / 2, H / 2, 100, Math.PI ,  (radians + 1)  * Math.PI, false);
    ctx.stroke();
    
    //Adding the text
    ctx.fillStyle = color;
    ctx.font = "50px bebas";
    text = Math.floor(degrees) + "%";
    //Centering the text by deducting half of text width from position x
    text_width = ctx.measureText(text).width;
    //Adding manual value to position y since the height of the text cannot be measured easily
    ctx.fillText(text, W / 2 - text_width / 2, H / 2 + 15);
  }
  
  function draw() {
    //Cancel any movement animation if a new chart is requested
    if (typeof animation_loop != undefined) clearInterval(animation_loop);
    
    //Random degree from 0 to 360
    new_degrees = Math.random()*10;
    difference = new_degrees - degrees;
    //This will animate the gauge to new positions.
    //The animation will take 1 second.
    //Time for each frame is 1 second / difference in degrees
    animation_loop = setInterval(animate_to, 10/difference); 
  }
  
  //Function to make the chart move to new degrees
  function animate_to() {
    //Clear animation loop if degrees reaches to new_degrees
    if (degrees == new_degrees) clearInterval(animation_loop);
    
    if (degrees < new_degrees) degrees += 0.11;
    else degrees -= 0.11;
    
    init();
  }
  
  //Animation
  draw();
  redraw_loop = setInterval(draw, 4000); //Draw a new shart every 2 seconds
  
}
