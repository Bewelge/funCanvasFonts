function initHangingLetters(txt,opts) {
	let paras = initResizedLetters(txt,opts);
	ready();
	drawHangingLetters(paras);
}


function initResizedLetters(txt,opts) {
	opts = opts || {};
	opts.text = txt;
	opts.type = "lettersHanging";
	opts.width=width;
	
	
	let paras = initOptions(opts);
	paras.draw = drawSplits;
	paras.ind = texts.length;
	texts.push(paras);
	paras.currentSpawned = 0;
	
	paras.lastMouseX = 0;
	paras.lastMouseY = 0;
	paras.updateAllDots=true;
	paras.opts.avgLetterW = 0;

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	let font = paras.opts.font || 50;
	let fontFam = paras.opts.fontFam || "Arial bold";
	let fontStr = font +"px "+fontFam;
	
	let lets = txt.split("");

	ct.font = fontStr;
	wd = Math.ceil(ct.measureText(txt).width);
	
	let maxSpac =0;
	let totW = paras.opts.canvasW*1.2;
	paras.opts.avgLetterW = ct.canvas.width;
	paras.letters=[];
	console.log(ct.canvas.width);
	while (totW > paras.opts.canvasW) {
		paras.letters=[];


		for (let key in lets) {
			let twd = Math.ceil(ct.measureText(lets[key]).width);
			let tht = Math.ceil(getTextHeight(fontFam, font, lets[key]).height);
			console.log(twd,tht)
			let newCn = document.createElement("canvas");

			newCn.width = twd;
			newCn.height = tht;
			let newC = newCn.getContext("2d");
			newC.fillStyle=paras.opts.letterFill;
			newC.font = fontStr;
			newC.textBaseline = "top";
			newC.fillText(lets[key],0,0);
			if (paras.opts.lineWidth) {
				newC.strokeStyle=paras.opts.letterStroke;
				newC.lineWidth=paras.opts.letterLineWidth;
				newC.stokeText(lets[key],0,0);
			}
			
			//letterWidth, letterHeight, x, y, targetX, targetY
			paras.letters.push([newCn,[twd,tht,0,0,0,0,0]]);

			if(twd>paras.opts.avgLetterW ) {
				paras.opts.avgLetterW=twd;
			}
			if (tht > paras.opts.avgLetterW) {
				paras.opts.avgLetterW=tht;
			}
			//document.body.appendChild(newCn);
		}
		paras.opts.avgLetterW*=0.25*paras.opts.letterSize;
		totW = paras.opts.avgLetterW * 2 * lets.length;
		font--;
		fontStr = font +"px "+fontFam;
		ct.font = fontStr;
	}
	paras.opts.font = font;
	console.log(totW);
	//paras.opts.canvasW = totW;
	paras.opts.txtWidth = totW;
	/*paras.opts.canvasW = totW;
	ct.canvas.width = totW;*/
	console.log(ct.canvas.width)
	x = ct.canvas.width/2 - totW/2 - paras.opts.avgLetterW;
	paras.opts.x = x;
	console.log(paras.letters);
	for (let key in paras.letters) {
		let l = paras.letters[key][1];
		x+=paras.opts.avgLetterW*2;
		y = cH/2;
		l[2] = x;
		l[3] = y ;
		l[4] = x;
		l[5] = y ;
		

	}
	console.log(paras)
	paras.letters[0][1][2]-=50;
	//paras.letters[1][1][2]-=25;
	//paras.letters[2][1][2]-=50;
	return paras;
	
}


function updateHangingLetters(paras) {
	let ct = paras.ctx;
	let rec = ct.canvas.getBoundingClientRect();
	let mx = mouseX - rec.left;
	let my = mouseY - rec.top;
	
	let mousePower = paras.opts.mousePower || 100;
	let friction = paras.opts.friction || 1;
	let lastMouseX = paras.opts.lastMouseX
	let lastMouseY = paras.opts.lastMouseY

	for (let key in paras.letters) {
		let l = paras.letters[key][1];
		let x = l[2];
		let y = l[3];
		let dif = l[2] - l[4];
		if (l[4]!=0) {
			if (dif < 0) {
				l[6]+=500 * paras.opts.gravity;
			} else if (dif > 0) {
				l[6]-=500 * paras.opts.gravity;
			}
		}
		let newX = l[2] + paras.opts.speed/100 * l[6];
		let mouseIn= false;
		if (Distance(mx,my,x,y)<paras.opts.avgLetterW ) {
			mouseIn=true;
			l[6]=Math.sign(mx - lastMouseX) * paras.opts.mousePower;
			newX = l[2] + paras.opts.speed/100 * l[6];
		}
		paras.opts.lastMouseX = mouseX;
		paras.opts.lastMouseY = mouseY;
		let ang = angle(newX, l[3], l[4], 0);
		let dis = Distance(l[2], l[3], l[4], 0);
		let newY = l[5] - Math.pow( l[4]-newX, 2) * 0.004;  

		if (l[6]!=0) {
			innerLoop:
			for (let kei in paras.letters) {
				//check coll
				if(kei == key) continue innerLoop;
				if (Math.abs(newX - paras.letters[kei][1][2]) < paras.opts.avgLetterW*2) {
					
					newX = paras.letters[kei][1][2] + Math.sign(newX - paras.letters[kei][1][2]) * paras.opts.avgLetterW*2;
					newY = l[5] - Math.pow( l[4]-newX, 2) * 0.004;  
					
					let tmpV = l[6];
					l[6] = paras.letters[kei][1][6];
					paras.letters[kei][1][6] = tmpV;
				}
			}
			
		}
		

		l[2] = newX;
		l[3] = newY;

		l[6]*=friction
	}
}

function drawHangingLetters(paras) {

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
	
	updateHangingLetters(paras);

	ct.clearRect(0,0,cW,cH);

	//Draw ropes/lines and circles .
	for (let key in paras.letters) {
		let l = paras.letters[key];
		let x = l[1][2];
		let y = l[1][3];
		
		ct.strokeStyle=paras.opts.ropesStroke;
		ct.lineWidth=paras.opts.ropesLineWidth;
		ct.beginPath();
		ct.moveTo(l[1][4], 0);
		ct.lineTo(l[1][2], l[1][3]);
		ct.stroke();
		ct.closePath();

		let mouseIn= false;
		if (Distance(mx,my,x,y)<paras.opts.avgLetterW) {
			mouseIn=true;
			
		}

		ct.fillStyle=paras.opts.circleFill;
		ct.beginPath();
		ct.arc(l[1][2] ,l[1][3],paras.opts.avgLetterW,0,Math.PI*2,0);
		ct.fill();
		if (paras.opts.circleLineWidth) {
			ct.lineWidth=paras.opts.circleLineWidth;
			ct.strokeStyle=paras.opts.circleStroke;
			ct.stroke();
		}
		/*if (mouseIn) {
			ct.stroke();
		}*/
		ct.closePath();
	}
	//Draw Letters
	for (let key in paras.letters) {

		let l = paras.letters[key];
		let x = l[1][2];
		let y = l[1][3];
		let ang = (angle(x,y,l[1][4],0))+Math.PI*0.5

		ct.save(),
		ct.translate(x,y);
		ct.rotate(ang)

		ct.drawImage(l[0],-l[1][0]/2,-l[1][1]/2);//-l[1][0]/2-letterSpacing,-l[1][1]/2);
		

		ct.restore();
	}

	if (!paras.paused) {
		window.requestAnimationFrame(function() {
			drawHangingLetters(paras)
		});
		
	} else {
		paras.draw = function() {
			paras.paused=false;
			drawHangingLetters(paras);
		}
	}
}