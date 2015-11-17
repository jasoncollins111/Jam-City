'use strict'

    var canvas = document.getElementById('speaker1');
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 100;

    var angle = 0;
    var angle2 = 0;
    var variant = .4;
    var variant2 = 0;
    var toggle = false;

    setInterval(function(){
       variant2 = Math.random()/1.45
    }, 150)

    setInterval(function(){
       toggle = !toggle;
       if(toggle){
         variant = .5;
       } else{
         variant = .45;
       }

    }, 300)

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;


    function drawCircle1(){
      context.clearRect(0, 0, canvas.width, canvas.height);
      var grd = context.createLinearGradient(150.000, 300.000, 150.000, 0.000);
      context.beginPath();
      var radius = 170 + 30 * Math.abs(Math.cos(angle));
      var radius2 = 170 + 30 * Math.abs(Math.cos(angle2));


      context.beginPath();
      context.arc(centerX, centerY, radius/2, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#B73144');
      grd.addColorStop(1.000, 'rgba(255, 255, 255, 0.000)');
      context.fillStyle = grd;
      // context.globalAlpha= .6*variant;
      context.fill();

      context.arc(centerX, centerY, radius*variant2, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#FF3A4A');
      grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
      // grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
      context.fillStyle = grd;
      // context.globalAlpha = .7*angle2;
      context.fill();

      context.beginPath();
      context.arc(centerX, centerY, radius/1.25*variant, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#41A7C7');
      grd.addColorStop(1.000, '#41A7C7');
      context.fillStyle = grd;
      context.fill();

      context.beginPath();
      context.arc(centerX, centerY, radius/1.5*angle, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#41A7C7');
      grd.addColorStop(1.000, '#41A7C7');
      context.fillStyle = grd;
      context.fill();

      context.beginPath();
      context.arc(centerX, centerY, radius/2.5*variant, 0, 2 * Math.PI, false);
      // grd.addColorStop(0.000, 'rgba(0, 0, 0, 1.000)');
      grd.addColorStop(1.000, '#336FA0');
      context.fillStyle = grd;
      context.fill();


      angle2 += Math.PI / 64;
      requestAnimationFrame(drawCircle1);
    }

    drawCircle1()

