import React, { useEffect, useState, useRef, ReactElement } from 'react';

interface indexProps {

}

const InSea: React.FC<indexProps> = ({ }): ReactElement => {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const HAMMERHEAD_RENDERER = {
      HAMMERHEAD_COUNT: window.innerWidth/150,
      ADD_INTERVAL: 40,
      DELTA_THETA: Math.PI / 1000,
      ADJUST_DISTANCE: 50,
      ADJUST_OFFSET: 10,

      init: function () {
        this.setParameters();
        this.reconstructMethod();
        this.createHammerHeads(this.INIT_HAMMERHEAD_COUNT);
        this.render();
      },
      setParameters: function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        canvasRef.current.width = this.width;
        canvasRef.current.height = this.height;
        this.context = canvasRef.current.getContext('2d');
        this.interval = this.ADD_INTERVAL;
        this.distance = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
        this.x = this.width;
        this.destinationX = this.x;
        this.theta = 0;
        this.hammerheads = [];
      },
      reconstructMethod: function () {
        this.render = this.render.bind(this);
      },
      createHammerHeads: function () {
        for (let i = 0, length = this.HAMMERHEAD_COUNT; i < length; i++) {
          this.hammerheads.push(new HAMMERHEAD(this.width, this.height));
        }
      },
      render: function () {
        requestAnimationFrame(this.render);

        let gradient = this.context.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.distance),
          rate = (1 + 0.2 * Math.sin(this.theta));

        gradient.addColorStop(0, 'hsl(195, 80%, ' + (90 * rate) + '%)');
        gradient.addColorStop(0.2, 'hsl(195, 100%, ' + (50 * rate) + '%)');
        gradient.addColorStop(1, 'hsl(220, 100%, ' + (10 * rate) + '%)');

        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);

        this.hammerheads.sort(function (hammerhead1, hammerhead2) {
          return hammerhead1.z - hammerhead2.z;
        });
        for (let i = this.hammerheads.length - 1; i >= 0; i--) {
          if (!this.hammerheads[i].render(this.context)) {
            this.hammerheads.splice(i, 1);
          }
        }
        this.context.clearRect(this.x, 0, this.width - this.x, this.height);

        if (this.interval-- == 0) {
          this.interval = this.ADD_INTERVAL;
          this.hammerheads.push(new HAMMERHEAD(this.width, this.height));
        }
        this.theta += this.DELTA_THETA;
        this.theta %= Math.PI * 2;

        if (this.destinationX > this.x) {
          this.x = Math.min(this.x + this.ADJUST_DISTANCE, this.destinationX);
        } else {
          this.x = Math.max(this.x - this.ADJUST_DISTANCE, this.destinationX);
        }
      }
    };
    const HAMMERHEAD = function (width, height) {
      this.width = width;
      this.height = height;
      this.init();
    };
    HAMMERHEAD.prototype = {
      COLOR: 'hsl(220, %s%, 30%)',
      ANGLE_RANGE: { min: -Math.PI / 8, max: Math.PI / 8 },
      INIT_SCALE: 0.1,
      MAX_Z: 10,
      DELTA_PHI: Math.PI / 80,
      VELOCITY: 3,
      VERTICAL_THRESHOLD: 80,

      init: function () {
        this.theta = this.ANGLE_RANGE.min + (this.ANGLE_RANGE.max - this.ANGLE_RANGE.min) * Math.random();
        this.x = this.width / 2 + this.width / 4 * this.theta / Math.PI * 8;
        this.y = this.height + this.VERTICAL_THRESHOLD * this.INIT_SCALE;
        this.z = Math.random() * this.MAX_Z;
        this.vx = -this.VELOCITY * Math.cos(this.theta + Math.PI / 2);
        this.vy = -this.VELOCITY * Math.sin(this.theta + Math.PI / 2);

        this.phi = Math.PI * 2 * Math.random();
        this.color = this.COLOR.replace('%s', 90 - 60 * this.z / this.MAX_Z | 0);
      },
      render: function (context) {
        const tailX = 20 * Math.sin(this.phi),
          angle = Math.sin(this.phi),
          height = this.height + this.VERTICAL_THRESHOLD,
          scale = this.INIT_SCALE + (1 - this.INIT_SCALE) * (height - this.y) / height * (this.MAX_Z - this.z) / this.MAX_Z;

        context.save();
        context.fillStyle = this.color;
        context.translate(this.x, this.y);
        context.scale(scale, scale);
        context.rotate(this.theta);
        context.beginPath();
        context.moveTo(-20, -40);
        context.bezierCurveTo(-8, -48, 8, -48, 20, -40);
        context.lineTo(20, -28);
        context.lineTo(8, -36);
        context.lineTo(8, -8);
        context.lineTo(20, 4 + 6 * angle);
        context.lineTo(8, 0);
        context.lineTo(6, 16);
        context.quadraticCurveTo(4, 32, tailX, 64);
        context.quadraticCurveTo(-4, 32, -6, 16);
        context.lineTo(-8, 0);
        context.lineTo(-20, 4 - 6 * angle);
        context.lineTo(-8, -8);
        context.lineTo(-8, -36);
        context.lineTo(-20, -28);
        context.closePath();
        context.fill();

        context.save();
        context.beginPath();
        context.translate(tailX, 64);
        context.rotate(-Math.sin(this.phi) * Math.PI / 6);
        context.moveTo(0, -5);
        context.lineTo(10, 15);
        context.lineTo(0, 5);
        context.lineTo(-10, 15);
        context.closePath();
        context.fill();
        context.restore();
        context.restore();

        this.x += this.vx * scale;
        this.y += this.vy * scale;
        this.phi += this.DELTA_PHI;
        this.phi %= Math.PI * 2;

        return this.y >= -this.VERTICAL_THRESHOLD;
      }
    };

    HAMMERHEAD_RENDERER.init()

  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} width="1920" height="950"></canvas>
    </>
  );
}

export default InSea;