function initJitter(txt,opts) {
	
	opts = opts || {};
	opts.text = txt;
	opts.type = "jitters";
	
	
	let paras = initOptions(opts)
	paras.ind = texts.length;
	texts.push(paras);
	paras.points = [];
	paras.opts.goingBack=false;
	paras.opts.ticker = 0;
	paras.opts.tick = 1000;
	paras.currentSpawned=0;
	paras.continuousSpawn = opts.continuousSpawn || settings.dots.continuousSpawn;
	paras.updateAllDots = true;
	paras.jitterTicker = 0;
	paras.jitterGoingBack = false;
	paras.jitters=[];

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;


	ct.clearRect(0, 0, cW, cH);

	ct.font = paras.opts.font + "px "+paras.opts.fontFam;
	text = txt;


	for (let i = 0; i < paras.opts.amount; i++) {
		let rnd = 1 + (Math.random()-Math.random()) * paras.opts.colorVar;
		let rnd2 = 1 + (Math.random()-Math.random()) * paras.opts.colorVar;
		let rnd3 = 1 + (Math.random()-Math.random()) * paras.opts.colorVar;
		let r = Math.max(0,Math.min(255,Math.floor(paras.opts.r * rnd)));
		let g = Math.max(0,Math.min(255,Math.floor(paras.opts.g * rnd2)));
		let b = Math.max(0,Math.min(255,Math.floor(paras.opts.b * rnd3)));
		let a = paras.opts.a;//Math.max(0,Math.min(255,Math.floor(settings.jitters.a * rnd)));
		paras.jitters.push([0, 0, (rnd - (rnd2+rnd3)*0.5) * Math.PI, paras.opts.lineWidth2 * (1+(rnd2)*paras.opts.lineWidthVar), paras.opts.r, paras.opts.g, paras.opts.b, paras.opts.a])

	}

	ready();
	drawJitter(paras);
}

function getBlurValue(blur) {
	var userAgent = navigator.userAgent;
	if (userAgent && userAgent.indexOf('Firefox/4') != -1) {
		var kernelSize = (blur < 8 ? blur / 2 : Math.sqrt(blur * 2));
		var blurRadius = Math.ceil(kernelSize);
		return blurRadius * 2;
	}
	return blur;
};

function drawJitter(paras) {

	let mouseRadius = paras.opts.mouseRadius;
	let jitters = paras.jitters;
	let totMot = 0;
	let moved = false;
	
	let max = jitters.length;
	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let rec = ct.canvas.getBoundingClientRect();
	let mx = mouseX - rec.left;
	let my = mouseY - rec.top;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let friction = paras.opts.friction;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	let goingBack = paras.jitterGoingBack;
	let ticker = paras.opts.ticker;
	let tick = paras.opts.tick
	
	let mouseIn = 0;
	if (mx > x && mx < x + wd && my > y  / 1.2 && my < y +ht / 1.2) {
		mouseIn=1;
		goingBack=false;
	}
	if (!mouseIn) {
		if (!paras.jitterGoingBack) {
			paras.jitterTicker = (paras.jitterTicker + paras.opts.tickSpeed);
			if (paras.jitterTicker > 1) {
				paras.jitterGoingBack = true;
				goingBack=true;
			}
		} else {
			paras.jitterTicker = (paras.jitterTicker - paras.opts.tickSpeed);
			if (paras.jitterTicker < -1) {
				paras.jitterGoingBack = false;
				goingBack=false;
			}
		}
		
	}

	



	let ang = angle(mx, my, x + wd / 2, yBot + ht/2 );
	let dis = Distance(mx, my, x + wd / 2, yBot + ht/2 );

	
	ct.clearRect(0,0,cW,cH);
	
	
	if (!paras.opts.fillInFront) {
		ct.font = paras.opts.font+"px " + paras.opts.fontFam;
		ct.fillStyle=paras.opts.fill;
		ct.fillText(text, x, y );
		ct.lineWidth=paras.opts.lineWidth;
		ct.strokeStyle=paras.opts.stroke;
		ct.strokeText(text, x, y );
		
	}
	//ctx.clearRect(0, 0, width, height);
	for (let key in jitters) {
		let e = jitters[key];

		let newX = e[0] + Math.cos(e[2]) * (paras.opts.speed + paras.opts.mouseGravity * Math.random() * 1 *mouseIn);
		let newY = e[1] + Math.sin(e[2]) * (paras.opts.speed + paras.opts.mouseGravity * Math.random() * 1 *mouseIn);
		
		if (goingBack) {
			/*if (e[0] == 0) {
				newX = 0;
			}
			if (e[1] == 0) {
				newY = 0;
			}*/
		} else {

			e[2] += (Math.random() - Math.random())*0.1 ;
			if (newX < -paras.opts.extent) {
				newX = -(paras.opts.extent);
				e[2] += Math.PI;//(Math.random() - Math.random()) * Math.PI;
			}
			if (newX > paras.opts.extent) {
				newX = (paras.opts.extent);
				e[2] += Math.PI;//(Math.random() - Math.random()) * Math.PI;
			}
			if (newY < -paras.opts.extent) {
				newY = -(paras.opts.extent);
				e[2] += Math.PI;//(Math.random() - Math.random()) * Math.PI;
			}
			if (newY > paras.opts.extent) {
				newY = (paras.opts.extent);
				e[2] += Math.PI;//(Math.random() - Math.random()) * Math.PI;
			}
			/*if (mouseIn) {*/
				e[0] = newX;
				e[1] = newY;
				
			/*}*/
		}



		if (goingBack) {

			e[0] = (e[0] * (paras.opts.gravity));
			e[1] = (e[1] * (paras.opts.gravity));

			e[2] = angle(e[0], e[1], 0, 0);
			if (Math.abs(e[0]) < 0.5) {
				e[0] = 0;
				e[2] = (Math.random() - Math.random()) * Math.PI;
			}
			if (Math.abs(e[1]) < 0.5) {
				e[1] = 0;
				e[2] = (Math.random() - Math.random()) * Math.PI;
			}

		}
		if (1) {
			/*let newCn = document.createElement("canvas");
			newCn.width = wd;
			newCn.height = ht;
			let newC = newCn.getContext("2d");*/
			
			
			/*let rgr2 = ct.createRadialGradient(mouseX, mouseY, 1, mouseX, mouseY, wd);
		
			rgr2.addColorStop(0, "rgba(" + (e[4]) + "," + (e[5]) + "," + (e[6]) + ","+e[7]+")");
			rgr2.addColorStop(paras.opts.drawSize, "rgba(0,0,0,0.5)");
			rgr2.addColorStop(1, "rgba(0,0,0,0)");*/

			ct.lineWidth = (e[3]) ;//* (1 - 0.5 * ( Math.abs(e[0]) + Math.abs(e[1]) )/paras.opts.extent) ;
			
			
			ct.font =  (paras.opts.font)+"px " + paras.opts.fontFam;
			ct.strokeStyle=paras.opts.stroke2;
			
			ct.strokeText(paras.opts.text, (x+e[0]), (y+e[1]));
			ct.fillStyle=paras.opts.fill2;
			ct.fillText(paras.opts.text, (x+e[0]), (y+e[1]));
			//e.push(newCn);
			//ctx.drawImage(e[8],x+e[0],y+e[1]);
		} else {
			
			ct.drawImage(e[8],x+e[0],y+e[1]-ht*3/4);
		}

	}
	//ctx.restore();
	if (paras.opts.fillInFront) {
		ct.font = paras.opts.font+"px " + paras.opts.fontFam;
		ct.fillStyle=paras.opts.fill;
		ct.fillText(paras.opts.text, x, y );
		ct.lineWidth=paras.opts.lineWidth;
		ct.strokeStyle=paras.opts.stroke;
		ct.strokeText(paras.opts.text, x, y );
		
	}
	// ctx.save();
	// ctx.globalCompositeOperation="source-atop";
	//ctx.fillStyle = "rgba(255,255,255,0.5)"; //"rgba(0,0,255,1)";
	//drawShadowEffects(text, ctx, "Shadow3D", x, y);
	/*ctx.restore();*/



	//ctx.fillText(text, x, y );

	if (!paras.opts.paused) {
		window.requestAnimationFrame(function(){
			drawJitter(paras)
		});
		
	} else {
		paras.draw = function() {
			paras.opts.paused=false
			drawJitter(paras);
		}


	}
	/*window.requestAnimationFrame(drawJitter)*/
}