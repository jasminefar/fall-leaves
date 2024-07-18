(function() {
    var canvas,
        cx,
        leaves = [],
        backgroundLeaves = [],
        time = Date.now(),
        MAX_LEAVES = 100, // max number of leaves
        MAX_BACKGROUND_LEAVES = 50, // max number of background leaves
        GRAVITY = 0.02,
        MAX_SIZE = 20, // max radius of the leaves
        MAX_ANGLE = 30, // max angle of a single leaf
        WIND = 0.05, // wind effect
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

    function Leaf(x, y, background) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * MAX_SIZE + 10;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.angle = 0;
        this.vy = background ? Math.random() * 0.5 + 0.5 : Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * WIND;
        this.max_angle = Math.random() * MAX_ANGLE;
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.background = background;
        this.type = Math.floor(Math.random() * 3); // Different types of leaves
    }

    Leaf.prototype.draw = function() {
        cx.save();
        cx.fillStyle = this.color;
        cx.translate(this.x, this.y);
        cx.rotate(this.angle * Math.PI / 180);
        switch (this.type) {
            case 0:
                this.drawSimpleLeaf();
                break;
            case 1:
                this.drawMapleLeaf();
                break;
            case 2:
                this.drawOakLeaf();
                break;
        }
        cx.restore();
    };

    Leaf.prototype.drawSimpleLeaf = function() {
        cx.beginPath();
        cx.moveTo(0, -this.size);
        cx.lineTo(this.size / 2, 0);
        cx.lineTo(0, this.size);
        cx.lineTo(-this.size / 2, 0);
        cx.closePath();
        cx.fill();
    };

    Leaf.prototype.drawMapleLeaf = function() {
        cx.beginPath();
        cx.moveTo(0, -this.size);
        cx.lineTo(this.size / 3, -this.size / 3);
        cx.lineTo(this.size, -this.size / 3);
        cx.lineTo(this.size / 2, 0);
        cx.lineTo(this.size, this.size / 3);
        cx.lineTo(this.size / 3, this.size / 3);
        cx.lineTo(0, this.size);
        cx.lineTo(-this.size / 3, this.size / 3);
        cx.lineTo(-this.size, this.size / 3);
        cx.lineTo(-this.size / 2, 0);
        cx.lineTo(-this.size, -this.size / 3);
        cx.lineTo(-this.size / 3, -this.size / 3);
        cx.closePath();
        cx.fill();
    };

    Leaf.prototype.drawOakLeaf = function() {
        cx.beginPath();
        cx.moveTo(0, -this.size);
        cx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 2, this.size / 2, 0, this.size);
        cx.bezierCurveTo(-this.size / 2, this.size / 2, -this.size / 2, -this.size / 2, 0, -this.size);
        cx.closePath();
        cx.fill();
    };

    Leaf.prototype.fall = function() {
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.direction;
        if (this.angle > this.max_angle || this.angle < -this.max_angle) {
            this.direction *= -1;
        }
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width || this.x < 0) {
            this.x = Math.random() * canvas.width;
        }
    };

    function spawnLeaf(background) {
        var leafCount = background ? backgroundLeaves.length : leaves.length;
        if (leafCount < (background ? MAX_BACKGROUND_LEAVES : MAX_LEAVES)) {
            var x = Math.random() * canvas.width;
            var y = Math.random() * canvas.height;
            if (background) {
                backgroundLeaves.push(new Leaf(x, y, true));
            } else {
                leaves.push(new Leaf(x, y, false));
            }
        }
    }

    function redrawWorld() {
        resizeWorld();
        cx.clearRect(0, 0, canvas.width, canvas.height);
        var leaf, i;
        for (i = 0; i < backgroundLeaves.length; i++) {
            leaf = backgroundLeaves[i];
            leaf.draw();
            leaf.fall();
        }
        for (i = 0; i < leaves.length; i++) {
            leaf = leaves[i];
            leaf.draw();
            leaf.fall();
        }
        spawnLeaf(true);
        spawnLeaf(false);
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
