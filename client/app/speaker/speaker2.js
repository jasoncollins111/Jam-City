'use strict'

    var canvas2 = document.getElementById('speaker2');
    var context2 = canvas2.getContext('2d');
    var centerX = canvas2.width / 2;
    var centerY = canvas2.height / 2;
    var radius = 100;

    var angle = 0;
    var angle2 = 0;
    var variant = .4;
    var toggle = false;

    setInterval(function(){
       toggle = !toggle;
       if(toggle){
         variant = .5;
       } else{
         variant = .49;
       }

    }, 500)

    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;


    function drawCircle2(context, X, Y){
      context2.clearRect(0, 0, canvas2.width, canvas2.height);
      var grd = context2.createLinearGradient(150.000, 300.000, 150.000, 0.000);
      context2.beginPath();
      var radius = 170 + 30 * Math.abs(Math.cos(angle));
      var radius2 = 170 + 30 * Math.abs(Math.cos(angle2));


      context2.beginPath();
      context2.arc(centerX, centerY, radius/2, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#B73144');
      grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
      context2.fillStyle = grd;
      context2.globalAlpha= .6*variant;
      context2.fill();

      context2.arc(centerX, centerY, radius*variant, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#B73144');
      grd.addColorStop(1.000, 'rgba(255, 255, 255, 1.000)');
      context2.fillStyle = grd;
      context2.globalAlpha = .7*angle2;
      context2.fill();

      context2.beginPath();
      context2.arc(centerX, centerY, radius/1.25*variant, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#41A7C7');
      grd.addColorStop(1.000, '#41A7C7');
      context2.fillStyle = grd;
      context2.fill();

      context2.beginPath();
      context2.arc(centerX, centerY, radius/1.5*variant, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, '#41A7C7');
      grd.addColorStop(1.000, '#41A7C7');
      context2.fillStyle = grd;
      context2.fill();

      context2.beginPath();
      context2.arc(centerX, centerY, radius/2.5*variant, 0, 2 * Math.PI, false);
      grd.addColorStop(0.000, 'rgba(0, 0, 0, 0.500)');
      grd.addColorStop(1.000, '#336FA0');
      context2.fillStyle = grd;
      context2.fill();


      angle2 += Math.PI / 128;
      requestAnimationFrame(drawCircle1);
    }

    drawCircle2()
