(function() {
    var canvas,
        cx,
        leaves = [],
        time = Date.now(),
        MAX_LEAVES = 100, // max number of leaves
        GRAVITY = 0.02,
        MAX_SIZE = 20, // max radius of the leaves
        MAX_ANGLE = 30, // max angle of a single leaf
        COLORS = [
            'rgba(255, 0, 0, 0.75)',
            'rgba(255, 165, 0, 0.75)',
            'rgba(255, 255, 0, 0.75)',
            'rgba(0, 255, 0, 0.75)',
            'rgba(0, 255, 255, 0.75)',
            'rgba(0, 0, 255, 0.75)',
            'rgba(255, 0, 255, 0.75)'
        ];

    canvas = document.querySelector('canvas');
    cx = canvas.getContext('2d');

    function Leaf(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * MAX_SIZE + 10;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.angle = 0;
        this.vy = Math.random() * 2 + 1;
        this.max_angle = Math.random() * MAX_ANGLE;
        this.direction = Math.random() < 0.5 ? 1 : -1;
    }

    Leaf.prototype.draw = function() {
        cx.save();
        cx.fillStyle = this.color;
        cx.translate(this.x, this.y);
        cx.rotate(this.angle * Math.PI / 180);
        cx.beginPath();
        cx.moveTo(0, -this.size);
        cx.lineTo(this.size / 2, 0);
        cx.lineTo(0, this.size);
        cx.lineTo(-this.size / 2, 0);
        cx.closePath();
        cx.fill();
        cx.restore();
    };

    Leaf.prototype.fall = function() {
        this.y += this.vy;
        this.angle += this.direction;
        if (this.angle > this.max_angle || this.angle < -this.max_angle) {
            this.direction *= -1;
        }
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    };

    function spawnLeaf() {
        leaves.push(new Leaf(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    function redrawWorld() {
        resizeWorld();
        cx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < leaves.length; i++) {
            leaves[i].draw();
            leaves[i].fall();
        }
        if (leaves.length < MAX_LEAVES) {
            spawnLeaf();
        }
        requestAnimationFrame(redrawWorld);
    }

    function resizeWorld() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeWorld);

    resizeWorld();
    redrawWorld();

})();
