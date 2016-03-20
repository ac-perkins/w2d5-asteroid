(function gameSetup() {
    'use strict';

    // Create your "ship" object and any other variables you might need...
var ship = {
  velocity: 0,
  angle: 0,
  element: document.getElementById('ship')
};

var asteroids = [];

ship.element.style.top = "350%";
ship.element.style.left = "600%";
console.log(ship);

    ship.element.addEventListener('asteroidDetected', function (event) {
        // You can detect when a new asteroid appears with this event.
        // The new HTML element will be in event.detail
        // alert("Asteroid detected!");
        // console.log(event.detail);

        asteroids.push(event.detail);
        console.log(asteroids[0].getBoundingClientRect());
    });


    // var htmlMain = document.querySelector('main');
    //
    // htmlMain.innerHTML = 'Press Space to teleport' + htmlMain.innerHTML;
    // htmlMain.style.color = "white";

    /**
     * Use this function to handle when a key is pressed. Which key? Use the
     * event.keyCode property to know:
     *
     * 37 = left
     * 38 = up
     * 39 = right
     * 40 = down
     *
     * @param  {Event} event   The "keyup" event object with a bunch of data in it
     * @return {void}          In other words, no need to return anything
     */
    function handleKeys(event) {
        console.log(event.keyCode);
        if (event.keyCode === 38) {
          if (ship.velocity >= 30) {
            ship.velocity = 30;
            // console.log(ship.velocity);
          }
          else {
          ship.velocity = ship.velocity + 1;
          // console.log(ship.velocity);
          }
        }
        if (event.keyCode === 40) {
          if (ship.velocity <= 0) {
            ship.velocity = 0;
            // console.log(ship.velocity);
          }
          else {
          ship.velocity = ship.velocity - 1;
          // console.log(ship.velocity);
          }
        }
        if (event.keyCode === 37) {
            ship.angle = ship.angle - 20;
            ship.element.style.transform = "rotate(" + ship.angle + "deg)";
            // console.log(ship.angle);
          }
        if (event.keyCode === 39) {
            ship.angle = ship.angle + 20;
            ship.element.style.transform = "rotate(" + ship.angle + "deg)";
            // console.log(ship.angle);
          }

          // PRESS SPACE TO TELEPORT!
        if (event.keyCode === 32) {
              ship.element.style.top = (Math.random() * 750) + "px";
              ship.element.style.left = (Math.random() * 1000) + "px";
              ship.element.style.transform = "rotate(" + (Math.random() * 360) + "deg)";
              ship.angle = (Math.random() * 360);
              // console.log(ship.angle);
        }

          // PRESS H FOR HYPERDRIVE!
        if (event.keyCode === 72) {
            ship.velocity = 100;
        }

          // PRESS C TO CLOAK
        if (event.keyCode === 67) {
              ship.element.style.opacity = 0;
        }

          // PRESS V TO DECLOAK
        if (event.keyCode === 86) {
              ship.element.style.opacity = 1;
        }
    }

    document.querySelector('body').addEventListener('keyup', handleKeys);

    /**
     * This event handler will execute when a crash occurs, however
     * YOU MUST call the crash() function when you detect a crash (see below).
     *
     * return {void}
     */
    document.querySelector('main').addEventListener('crash', function () {
      ship.velocity = 0;
      ship.element.style.transform = "rotate(360deg) scale(.001) skew(70deg, 70deg)";
      ship.element.style.transition = "all 2.5s";
      ship.element.style.borderBottom = "50px solid red";
    });

    /**
     * This is the primary "game loop"... in traditional game development, things
     * happen in a loop like this. This function will execute every 20 milliseconds
     * in order to do various things. For example, this is when all game entities
     * (ships, etc) should be moved, and also when things like hit detection happen.
     *
     * @return {void}
     */
    function gameLoop() {
        // This function for getting ship movement is given to you (at the bottom).
        // NOTE: you will need to change these arguments to match your ship object!
        var move = getShipMovement(ship.velocity, ship.angle);

        ship.element.style.top = (parseInt(ship.element.style.top) - move.top) + "px";
        ship.element.style.left = (parseInt(ship.element.style.left) + move.left) + "px";
        // Time to check for any collisions (see below)...
        checkForCollisions(ship.element.getBoundingClientRect(), asteroids);

        if (parseInt(ship.element.style.top) < -50) {
          ship.element.style.top = window.innerHeight + "px";
        }
        if (parseInt(ship.element.style.top) > window.innerHeight) {
          ship.element.style.top = -50 + "px";
        }
        if (parseInt(ship.element.style.left) < -50) {
          ship.element.style.left = window.innerWidth + "px";
        }
        if (parseInt(ship.element.style.left) > window.innerWidth) {
          ship.element.style.left = -50 + "px";
        }

        // console.log(parseInt(ship.element.style.top));
    }

    /**
     * This function checks for any collisions between asteroids and the ship.
     * If a collision is detected, the crash method should be called with the
     * asteroid that was hit:
     *    crash(someAsteroidElement);
     *
     * You can get the bounding box of an element using:
     *    someElement.getBoundingClientRect();
     *
     * A bounding box is an object with top, left, width, and height properties
     * that you can use to detect whether one box is on top of another.
     *
     * @return void
     */
    function checkForCollisions(shipPos, aPos) {
      for (var i = 0; i < asteroids.length; i++) {
        var asteroidsPos = aPos[i].getBoundingClientRect();
        // console.log(asteroidsPos);
      if (!(asteroidsPos.left > shipPos.right ||
           asteroidsPos.right < shipPos.left ||
           asteroidsPos.top > shipPos.bottom ||
           asteroidsPos.bottom < shipPos.top)) {
             crash(asteroids[i]);
             console.log("CRASH!!!");
           }
      }
    }


    /** ************************************************************************
     *       These functions and code are given to you. DO NOT ALTER THEM.
     ** ************************************************************************/

     var loopHandle = setInterval(gameLoop, 20);

     /**
      * Executes the code required when a crash has occurred. You should call
      * this function when a collision has been detected with the asteroid that
      * was hit as the only argument.
      *
      * @param  {HTMLElement} asteroidHit The HTML element of the hit asteroid
      * @return {void}
      */
    function crash(asteroidHit) {
        document.querySelector('body').removeEventListener('keyup', handleKeys);
        asteroidHit.classList.add('hit');
        document.querySelector('#ship').classList.add('crash');

        var event = new CustomEvent('crash', { detail: asteroidHit });
        document.querySelector('main').dispatchEvent(event);
    }

    /**
     * Get the change in ship position (movement) given the current velocity
     * and angle the ship is pointing.
     *
     * @param  {Number} velocity The current speed of the ship (no units)
     * @param  {Number} angle    The angle the ship is pointing (no units)
     * @return {Object}          The amount to move the ship by with regard to left and top position (object with two properties)
     */
    function getShipMovement(velocity, angle) {
        return {
            left: (velocity * Math.sin(angle * Math.PI / 180)),
            top: (velocity * Math.cos(angle * Math.PI / 180))
        };
    }

})();
