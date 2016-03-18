(function asteroidSetup() {
    'use strict';
    
    /**
     * This code is all given to you. It sets up the creation of 
     * the asteroids at random intervals and with random properties.
     * 
     * When the "crash" event is fired on the <main> element this 
     * adding of asteroids will stop!
     */
    
    var maxAsteroids = 20; // in other words... difficulty level
    var main = document.querySelector('main');
    var ship = document.querySelector('#ship');
    var style = document.documentElement.appendChild(document.createElement("style"));
    var asteroids = [];
    var addAsteroidHandle;

    main.addEventListener('crash', function() {
        clearTimeout(addAsteroidHandle);
        asteroids.forEach(function(asteroid) {
            asteroid.style.animationPlayState = 'paused';
        });
    });

    function addAsteroid() {
        var asteroid = document.createElement('aside');
        asteroids.push(asteroid);
        asteroid.style.animationDuration = (Math.floor(Math.random() * 30) + 5) + 's';
        asteroid.style.animationName = 'a' + asteroids.length;
        main.appendChild(asteroid);

        var scale = (Math.random() * 1.3) + 0.3;
        var rotation = (Math.random() * 360) + 180;
        var skew = { x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 30) };
        var startPos = Math.floor(Math.random() * 100);
        var endPos = Math.floor(Math.random() * 50) + ((startPos < 50) ? 50 : -50);

        var start, end;
        if (rotation < 270) {
            start = 'top: -15%; left: ' + startPos + '%;';
            end = 'top: 110%; left: ' + endPos + '%;';
        } else if (rotation < 360) {
            start = 'top: ' +  startPos + '%; left: -15%;';
            end = 'top: ' + endPos + '%; left: 110%;';
        } else if (rotation < 450) {
            start = 'bottom: 10%; right: ' + startPos + '%;';
            end = 'bottom: 110%; right: ' + endPos + '%;';
        } else {
            start = 'bottom: ' + startPos + '%; right: -15%;';
            end = 'bottom: ' + endPos + '%; right: 110%;';
        }

        var rule = 'a' + asteroids.length + ' {\
            0% {\
                ' + start + '\
                transform: rotate(0deg) skew(' + skew.x + 'deg,' + skew.y + 'deg) scale(' + scale + ',' + scale + ');\
            }\
            100% {\
                ' + end + '\
                transform: rotate(' + rotation + 'deg) skew(' + skew.x + 'deg,' + skew.y + 'deg) scale(' + scale + ',' + scale + ');\
            }\
        }';

        if (CSSRule && CSSRule.KEYFRAMES_RULE) {
            style.sheet.insertRule('@keyframes ' + rule, 0);
        }

        if (asteroids.length <= maxAsteroids) {
            addAsteroidHandle = setTimeout(addAsteroid, (maxAsteroids * 1000) - Math.floor(Math.random() * (asteroids.length * 1000)));
        }
        
        var event = new CustomEvent('asteroidDetected', { detail: asteroid });
        ship.dispatchEvent(event);
    }

    addAsteroid();

})();
