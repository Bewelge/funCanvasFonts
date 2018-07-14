function initSVGPath(txt,opts,effects) {
	
	opts = opts || {};
	opts.text = txt;
	opts.type = "svgPath";
	
	
	let paras = initOptions(opts)
	paras.ind = texts.length;
	texts.push(paras);
	paras.points = [];
	paras.currentSpawned=0;
	paras.continuousSpawn = opts.continuousSpawn || false;
	paras.updateAllSVGPath = true;
	paras.opts.lowestX = 0;
	paras.opts.highestX = 9999;
	paras.opts.lowestY = 0;
	paras.opts.highestY = 9999;
	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	paras.opts.y = yBot-ht/2;


	ct.clearRect(0, 0, cW, cH);

	paras.fontObj = loadFont('https://rawgit.com/google/fonts/master/ofl/titanone/TitanOne-Regular.ttf',function(fontObj) {
		paras.fontObj = fontObj;
		paras.fontPath = fontObj.getPath(txt,paras.opts.x,yBot-ht/2,paras.opts.font)
		//gridPath(paras,0.1)
		prepareCommands(paras.fontPath.commands);
		/*gridPath(paras,10);*/
		
		
		
		paras.fontPath.singlePaths = findAllPaths(paras.fontPath.commands);
		for (let key in paras.fontPath.singlePaths) {
			let sp = paras.fontPath.singlePaths[key];
			for (let i = sp.start;i<sp.end;i++) {
				let p = paras.fontPath.commands[i];
				p.mlx = sp.xm;
				p.mly = sp.ym;
			} 
		}
		
		prepareLetters(paras.fontPath.commands,paras.fontPath.singlePaths);
		ready();
		drawSVGPath(paras,effects);
		
	});
	


	


	
}

function findPathForPoint(commands,point) {
	let start=0;
	let end = commands.length-1;
	for (let i = point;i<end;i++) {
		if (commands[i].type == "M") {
			end = i;
			break;
		}

	}
	for (let i = point;i>=0;i--) {
		if (commands[i].type == "M") {
			start = i;
			break;
		}

	}
	return {start:start,end:end};
}
function findMiddleForPath(start,end,commands) {
	let xl = 999;
	let yl = 999
	let xh = 0
	let yh = 0
	let xmw = 999;
	let ymw = 999;
	let xm = 999
	let ym = 999
	let totx = 0;
	let toty = 0;
	for (let key =start;key<end && key < commands.length;key++) {

		let p = commands[key];
		
		totx+=p.x;
		toty+=p.y;
		if (p.x < xl) {
			xl = p.x;
		}
		if (p.x > xh) {
			xh = p.x;
		}
		if (p.y < yl) {
			yl = p.y;
		}
		if (p.y > yh) {
			yh = p.y;
		}
	}
	
	xmw = totx / (end-start);//wrong calculation. but not needed. (totx needs to take minX into account)
	ymw = toty / (end-start);//wrong calculation. but not needed. (totx needs to take minX into account)
	xm = xl + (xh-xl) / 2;
	ym = yl + (yh-yl) / 2;
	return {xm:xm,ym:ym,xmw:xmw,ymw:ymw,xl:xl,yl:yl,xh:xh,yh:yh,start:start,end:end}
}
function findAllPaths(commands) {
	let paths= [];
	let start = 0;
	let end = 0;
	for (let key in commands) {
		commands[key].ind = paths.length;
		if (commands[key].type == "M") {
			start = parseInt(key);
		} else if ( commands[key].type == "Z") {
			end = parseInt(key);
			paths.push(findMiddleForPath(start,end,commands))
		}
	}
	return paths;
}
function drawSVGPath(paras,effects) {
	

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let splitSize = paras.opts.splitSize;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	let points = paras.points;
	let rec = ct.canvas.getBoundingClientRect();
	let mx = mouseX - rec.left;
	let my = mouseY - rec.top;

	let totMot = 0;
	let moved = false;
	let max = points.length;
	let fontSize = paras.opts.font;
	let stroke = paras.opts.stroke;
	let fill = paras.opts.fill;
	let mouseRadius = paras.opts.mouseRadius||50;
	let friction = paras.opts.friction;
	let mass = paras.opts.mass;
	let gravity = paras.opts.gravity;
	let mouseGravity = paras.opts.mouseGravity;

	if (paras.continuousSpawn) {
		paras.currentSpawned+=paras.opts.spawnSpeed;
		max = paras.currentSpawned;
	}
	if (paras.updateAllSVGPath) {
		
		ct.clearRect(paras.opts.lowestX, paras.opts.lowestY, paras.opts.highestX-paras.opts.lowestX, paras.opts.highestY-paras.opts.lowestY);
	}
	ct.strokeStyle = stroke;//settings.SVGPath.fill;
	ct.fillStyle = "black";//fill//settings.SVGPath.stroke;
	/*ct.font = paras.opts.font+"px "+ paras.opts.fontFam;
	ct.fillText("SvgPath",x,y);
	ct.beginPath();*/
	
	/*for (let key in paras.fontPath.singlePaths) {
		let sp = paras.fontPath.singlePaths[key];
		let dis = Distance(sp.xm)
	}*/
	for (let key =0;key<paras.fontPath.commands.length&&key<max;key++) {
		let p = paras.fontPath.commands[key];
		let sp = paras.fontPath.singlePaths[p.ind]
		/*if (key < paras.opts.randomPathE && key >= paras.opts.randomPathS) {
			ct.fillStyle="red";
			ct.fillRect(p.x,p.y,10,10)
		}*/

		// let disM = Distance(mx,my,sp.xm,sp.ym);//individual letters
		let disM = Distance(mx,my,p.ox,p.oy);
		p.dm = disM;
		if (p.hasOwnProperty("x1")) {
			let disM1 = Distance(mx,my,p.x1,p.y1);
			p.dm1 = disM1;
		}
		if (p.hasOwnProperty("x2")) {
			let disM2 = Distance(mx,my,p.x2,p.y2);
			p.dm2 = disM2;
			
		}
		//console.log(disM);

		if (disM<mouseRadius) {
			//PUSH ALL POINTS AWAY
			if (/*p.ind+1%2==0*/1 ) {
				let strength = mouseGravity;
				let ang =angle(mx,my,p.x,p.y);
				p.x+=Math.cos(ang)*(1-disM/50)*strength;
				p.y+=Math.sin(ang)*(1-disM/50)*strength;
				if (p.hasOwnProperty("x1")) {
					p.x1 += Math.cos(ang)*(1-disM/50)*strength;
				}
				if (p.hasOwnProperty("y1")) {
					p.y1 += Math.sin(ang)*(1-disM/50)*strength;
				}
				if (p.hasOwnProperty("x2")) {
					p.x2 += Math.cos(ang)*(1-disM/50)*strength;
				}
				if (p.hasOwnProperty("y2")) {
					p.y2 += Math.sin(ang)*(1-disM/50)*strength;
				}



				/*//flashy/fiery-effect
				let ang =angle(mx,my,p.x,p.y);
				//p.x=Math.round(p.x/10)*10+Math.random()*8;
				p.y=Math.round(p.y/10)*10+Math.random()*8;
				if (p.hasOwnProperty("x1")) {
				//	p.x1 = Math.round(p.x1/10)*10+Math.random()*8;
				}
				if (p.hasOwnProperty("y1")) {
					p.y1 = Math.round(p.y1/10)*10+Math.random()*8;
				}
				if (p.hasOwnProperty("x2")) {
				//	p.x2 = Math.round(p.x2/10)*10+Math.random()*8;
				}
				if (p.hasOwnProperty("y2")) {
					p.y2 = Math.round(p.y2/10)*10+Math.random()*8;
				}*/

			//} else {
				// //ATTRACT ALL POINTS 
				// let ang =angle(mx,my,p.x,p.y);
				// p.ang = ang;
				
				// p.x-=Math.cos(-ang)*(disM/50)*0.5;
				// p.y-=Math.sin(-ang)*(disM/50)*0.5;
				// // if (p.hasOwnProperty("x1")) {
				// // 	p.x1 -= Math.cos(ang)*(1-disM/50)*10;
				// // }
				// // if (p.hasOwnProperty("y1")) {
				// // 	p.y1 -= Math.sin(ang)*(1-disM/50)*10;
				// // }
				// // if (p.hasOwnProperty("x2")) {
				// // 	p.x2 -= Math.cos(ang)*(1-disM/50)*10;
				// // }
				// // if (p.hasOwnProperty("y2")) {
				// // 	p.y2 -= Math.sin(ang)*(1-disM/50)*10;
				// // }

				// //Shrink letters individually

				// let ang =angle(paras.fontPath.singlePaths[p.ind].xm,paras.fontPath.singlePaths[p.ind].ym,p.x,p.y);
				// p.ang = ang;
				
				// p.x-=Math.cos(ang)*(disM/50)*0.5;
				// p.y-=Math.sin(ang)*(disM/50)*0.5;
				// if (p.hasOwnProperty("x1")) {
				// 	p.x1 -= Math.cos(ang)*(1-disM/50)*1;
				// }
				// if (p.hasOwnProperty("y1")) {
				// 	p.y1 -= Math.sin(ang)*(1-disM/50)*1;
				// }
				// if (p.hasOwnProperty("x2")) {
				// 	p.x2 -= Math.cos(ang)*(1-disM/50)*1;
				// }
				// if (p.hasOwnProperty("y2")) {
				// 	p.y2 -= Math.sin(ang)*(1-disM/50)*1;
				// }

				//Grow letters individually
				let xOff =  0.5 * strength;
				let yOff =  0.5 * strength;
				
				if (p.x < sp.xm) {
					p.x = Math.min(p.x+xOff,sp.xm);
				}
				if (p.y < sp.ym) {
					p.y = Math.min(p.y+yOff,(sp.ym));
				}
				if (p.x > sp.xm) {
					p.x = Math.max(p.x-xOff,sp.xm);
				}
				if (p.y > sp.ym) {
					p.y = Math.max(p.y-yOff,sp.ym);
				}

				if (p.x1 < sp.xm) {
					p.x1 = Math.min(p.x1+xOff,sp.xm);
				}
				if (p.y1 < sp.ym) {
					p.y1 = Math.min(p.y1+yOff,(sp.ym));
				}
				if (p.x1 > sp.xm) {
					p.x1 = Math.max(p.x1-xOff,sp.xm);
				}
				if (p.y1 > sp.ym) {
					p.y1 = Math.max(p.y1-yOff,sp.ym);
				}
				if (p.x2 < sp.xm) {
					p.x2 = Math.min(p.x2+xOff,sp.xm);
				}
				if (p.y2 < sp.ym) {
					p.y2 = Math.min(p.y2+yOff,(sp.ym));
				}
				if (p.x2 > sp.xm) {
					p.x2 = Math.max(p.x2-xOff,sp.xm);
				}
				if (p.y2 > sp.ym) {
					p.y2 = Math.max(p.y2-yOff,sp.ym);
				}


			}


		} else {

			let yBackSpeed = 0.05;
			let xBackSpeed = 0.05;

			let dis = Distance(p.x,p.y,p.ox,p.oy);
			if (dis>0) {
				let ang = angle(p.x,p.y,p.ox,p.oy); 
				p.x += Math.cos(ang) * Math.min(dis,Math.max(0.05,xBackSpeed*dis))
				p.y += Math.sin(ang) * Math.min(dis,Math.max(0.05,yBackSpeed*dis))
			}
			if (p.hasOwnProperty("y1")) {
				let dis1 = Distance(p.x1,p.y1,p.ox1,p.oy1);
				if (dis1>0) {
					let ang = angle(p.x1,p.y1,p.ox1,p.oy1);
					p.x1 += Math.cos(ang) * Math.min(dis1,Math.max(0.05,xBackSpeed*dis1))
					p.y1 += Math.sin(ang) * Math.min(dis1,Math.max(0.05,yBackSpeed*dis1))
				}
			}
			if (p.hasOwnProperty("y2")) {
				let dis2 = Distance(p.x2,p.y2,p.ox2,p.oy2);
				if (dis2>0) {
					let ang = angle(p.x2,p.y2,p.ox2,p.oy2);
					p.x2 += Math.cos(ang) * Math.min(dis2,Math.max(0.05,xBackSpeed*dis2))
					p.y2 += Math.sin(ang) * Math.min(dis2,Math.max(0.05,yBackSpeed*dis2))
				}
			}
		}
	}


	
	for (let key in effects) {
		drawEffect(ct,paras,effects[key].effect,effects[key].opts);
	}
	



	//drawFontPoints(ct,paras.fontPath.commands);
	//drawAnchorPoints(ct,paras.fontPath.commands);

	
	
	if (totMot < 0.5 && !moved) {
		for (let key in points) {
			let  p = points[key][1];
			p[0]=p[2];
			p[1]=p[3];
			p[4]=0;
			p[5]=0;
		}
		//paras.updateAllSVGPath = false;
	} 
	if (!paras.opts.paused) {
		window.requestAnimationFrame(function(){
			drawSVGPath(paras,effects)
		});
		
	} else {
		paras.draw = function() {
			paras.opts.paused=false
			drawSVGPath(paras,effects);
		}
	}

	/*}*/

}
function drawEffect(ct,paras,type,opts) {
	ct.fillStyle=opts.fillStyle || "black";
	ct.strokeStyle=opts.strokeStyle || null;
	ct.lineWidth = opts.lineWidth || 0;
	
	switch(type) {
		case "normal":
			drawNormalFont(ct,paras.fontPath.commands);
			break;
		case "normalMouse":
			drawNormalFontMouse(ct,paras.fontPath.commands);
			break;
		case "moved": 
		
			drawMovedFont(ct,paras.fontPath.commands);

			break;
		case "spikey": 
		
			drawSpikeyFont(ct,paras.fontPath.commands,opts);

			break;
		case "splitted":
			drawSplitted(ct,paras.fontPath.commands,opts)
		case "curve":
			for (let key in paras.fontPath.singlePaths) {
			let arr = paras.fontPath.singlePaths[key].arr;

			ct.fillStyle="black";
			ct.strokeStyle="black";
			ct.lineWidth=3;
			drawCurve(ct, arr, 0.5, true, 1,true);
		}
	}
	if (opts.fill) {
		ct.fill();
	}
	if (opts.stroke) {
		ct.stroke();
	}
}
function mouseBehavior() {

}

function drawAnchorPoints(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.x,p.y);
				
				break;
			case "L":
				
				ct.lineTo(p.x,p.y);
				
				break;
			case "Q":
				ct.lineTo(p.x,p.y);
				ct.lineTo(p.x1,p.y1);
				ct.moveTo(p.x,p.y);
				

				break;
			case "C":
				ct.lineTo(p.x,p.y);
				ct.moveTo(p.x,p.y);
				ct.lineTo(p.x1,p.y1);
				ct.moveTo(p.x,p.y);
				ct.lineTo(p.x2,p.y2);
				
				break;
			case "Z":
				
				ct.closePath();
				ct.stroke();
				break;
			default: 

				//console.log(p.type)

		}
	}
	ct.stroke();
}


function gridPath(paras,factor) {
	for (let key in paras.fontPath.commands) {
			let c = paras.fontPath.commands[key];
			c.x=Math.floor(c.x/factor)*factor;
			c.y=Math.floor(c.y/factor)*factor;
			if (c.hasOwnProperty("x1")) {
				c.x1 = Math.floor(c.x1/factor)*factor
			}
			if (c.hasOwnProperty("y1")) {
				c.y1 = Math.floor(c.y1/factor)*factor
			}
		}
	ready();
	drawSVGPath(paras);
}
function morphEachLetter(paras,radius) {
	for (let kei in paras.singlePaths) {
		let sp = paras.singlePaths[kei];

		start = sp.start;
		end = sp.end;
		let lng = end - start;
		let angSplit = Math.PI*2 / lng;
		let curAng = -angle(paras.commands[start].x,paras.commands[start].y,paras.commands[start].mlx,paras.commands[start].mly);
		let xBackSpeed=0.001;
		let yBackSpeed=0.001;
		
		for (let key = start;key<end;key++) {
			if (key == start) {

			}
			let p = paras.commands[key];
			let ang = curAng// -angle(p.mlx,p.mly,p.x,p.y)
			let px = p.mlx+Math.cos(curAng)*radius;
			let py = p.mly+Math.sin(curAng)*radius;
			p.x = px;
			p.y = py;

			let ang1 = curAng// angle(p.mlx,p.mly,p.x1,p.y1)
			let px1 = p.mlx+Math.cos(curAng)*radius;
			let py1 = p.mly+Math.sin(curAng)*radius;
			p.x1 = px1;
			p.y1 = py1;

			let ang2 = curAng// angle(p.mlx,p.mly,p.x2,p.y2)
			let px2 = p.mlx+Math.cos(curAng)*radius;
			let py2 = p.mly+Math.sin(curAng)*radius;
			p.x2 = px2;
			p.y2 = py2;
			
			curAng+=angSplit

		}
	}
}

function morphPointsIntoCircle(commands,radius,x,y,start,end) {
	start = start || 0;
	end = end || commands.length;
	let lng = end - start;
	let angSplit = Math.PI*2 / lng;
	let curAng = 0;
	let xBackSpeed=0.001;
	let yBackSpeed=0.001;
	
	for (let key = start;key<end;key++) {
		let p = commands[key];
		let ang = curAng// -angle(p.mlx,p.mly,p.x,p.y)
		let px = p.mlx+Math.cos(curAng)*radius;
		let py = p.mly+Math.sin(curAng)*radius;
		p.x = px;
		p.y = py;

		let ang1 = curAng// angle(p.mlx,p.mly,p.x1,p.y1)
		let px1 = p.mlx+Math.cos(curAng)*radius;
		let py1 = p.mly+Math.sin(curAng)*radius;
		p.x1 = px1;
		p.y1 = py1;

		let ang2 = curAng// angle(p.mlx,p.mly,p.x2,p.y2)
		let px2 = p.mlx+Math.cos(curAng)*radius;
		let py2 = p.mly+Math.sin(curAng)*radius;
		p.x2 = px2;
		p.y2 = py2;
		
		curAng+=angSplit
/*		let dis = Distance(px,py,p.ox,p.oy)
		if (dis >0 ) {
			p.ox += Math.cos(ang) * xBackSpeed*dis
			p.oy += Math.sin(ang) * yBackSpeed*dis
		}*/

		/*let ang1 = angle(width/2,height/2,p.ox1,p.oy1)
		let px1 = width/2+Math.cos(ang1)*radius;
		let py1 = height/2+Math.sin(ang1)*radius;
		let dis1 = Distance(px1,py1,p.ox1,p.oy1)
		if (dis > 0 ) {
			p.ox1 += Math.cos(ang1) * xBackSpeed*dis1
			p.oy1 += Math.sin(ang1) * yBackSpeed*dis1
		}

		let ang2 = angle(width/2,height/2,p.ox2,p.oy2)
		let px2 = width/2+Math.cos(ang2)*radius;
		let py2 = height/2+Math.sin(ang2)*radius;
		let dis2 = Distance(px2,py2,p.ox2,p.oy2)
		if (dis > 0 ) {
			p.ox2 += Math.cos(ang2) * xBackSpeed*dis2
			p.oy2 += Math.sin(ang2) * yBackSpeed*dis2
		}*/
	}
}
function drawNormalFont(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				break;
			case "L":
				ct.lineTo(p.ox, p.oy);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(p.ox1, p.oy1, p.ox, p.oy);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				ct.bezierCurveTo(p.ox1, p.oy1, p.ox2, p.oy2, p.ox, p.oy);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	//ct.beginPath();
	
}
function drawSmoothFont(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		let lastX = p.x;
		let lastY = p.y;
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				lastX = p.x;
				lastY = p.y;
				break;
			case "L":
				ct.quadraticCurveTo(p.x, p.y,lastX, lastY);
				lastX = (lastX+p.x)/2;
				lastY = (lastY+p.y)/2;
				break;
			case "Q":
				ct.quadraticCurveTo(p.x, p.y,lastX, lastY);
				lastX = (lastX+p.x)/2;
				lastY = (lastY+p.y)/2;
				break;
			case "C":
				ct.quadraticCurveTo(p.x, p.y,lastX, lastY);
				lastX = (lastX+p.x)/2;
				lastY = (lastY+p.y)/2;
				break;
			case "Z":
				ct.quadraticCurveTo(p.x, p.y,lastX, lastY);
				lastX = (lastX+p.x)/2;
				lastY = (lastY+p.y)/2;
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
}
function drawSplitted(ct,commands,opts) {
	if (!opts.hasOwnProperty("splitted")) {
		opts.splitted=[];
		for (let key in commands) {
			for (let kei in commands[key].fontPath.singlePaths) {
				opts.splitted.push([]);
				for (let item in commands[key].fontPath.singlePath[kei].arr2) {
					//todo
				}
			}
		}
	}

}
function drawNormalFontMouse(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		let offX=0;
		let offY=0;
		let offX1=0;
		let offY1=0;
		let offX2=0;
		let offY2=0;
		if (p.dm<20) {
			offX = Math.cos(p.ang)*Math.sqrt(p.dm)*0.5 ;
			offY = Math.sin(p.ang)*Math.sqrt(p.dm)*0.5 ;
			let offX1 = 0;//offX;//Math.cos(p.ang)*p.dm1 * 0.5 || 0;
			let offY1 = 0;//offY;//Math.sin(p.ang)*p.dm1 * 0.5 || 0;	
			let offX2 = 0;//offX;//Math.cos(p.ang)*p.dm2 * 0.5 || 0;
			let offY2 = 0;//offY;//Math.sin(p.ang)*p.dm2 * 0.5 || 0;
		}
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox+offX,p.oy+offY);
				break;
			case "L":
				ct.lineTo(p.ox+offX, p.oy+offY);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(p.ox1+offX1, p.oy1+offY1, p.ox+offX, p.oy+offY);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);

				ct.bezierCurveTo(p.ox1+offX1, p.oy1+offY1, p.ox2+offX2, p.oy2+offY2, p.ox+offX, p.oy+offY);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	//ct.beginPath();
	
}
function drawFontPoints(ct,commands) {
	
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				
				ct.fillStyle="blue";
				ct.fillRect(p.ox,p.oy,3,3);
				ct.fillRect(p.x,p.y,3,3);
				break;
			case "L":
				
				ct.fillStyle="green";
				ct.fillRect(p.ox,p.oy,3,3);
				ct.fillRect(p.x,p.y,3,3);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				
				ct.fillStyle="rgba(255,0,0,1)";
				ct.fillRect(p.ox,p.oy,3,3);
				ct.fillRect(p.x,p.y,3,3);
				ct.fillStyle="rgba(155,0,0,1)";
				ct.fillRect(p.ox1,p.oy1,3,3);
				ct.fillRect(p.x1,p.y1,3,3);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				
				ct.fillStyle="rgba(0,255,0,1)";
				ct.fillRect(p.ox,p.oy,3,3);
				ct.fillRect(p.x,p.y,3,3);
				ct.fillStyle="rgba(0,155,0,1)";
				ct.fillRect(p.ox1,p.oy1,3,3);
				ct.fillRect(p.x1,p.y1,3,3);
				ct.fillStyle="rgba(0,80,0,1)";
				ct.fillRect(p.o2,p.oy2,3,3);
				ct.fillRect(p.x2,p.y2,3,3);
				break;
			case "Z":
				
				ct.fillStyle="rgba(255,255,0,1)";
				ct.fillRect(p.ox,p.oy,30,30);
				ct.fillStyle="rgba(255,255,0,1)";
				ct.fillRect(p.x,p.y,30,30);
				break;
			default: 

				//console.log(p.type)

		}
	}
	//ct.beginPath();
	
}
function checkMouseInPath(ct,commands,mx,my) {
	ct.beginPath();
	let mouseInPath = false;
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.x,p.y);
				break;
			case "L":
				ct.lineTo(p.x, p.y);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(p.x1, p.y1, p.x, p.y);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				ct.bezierCurveTo(p.x1, p.y1, p.x2, p.y2, p.x, p.y);
				break;
			case "Z":
				if (ct.isPointInPath(mx,my)) {
					console.log("in");
					return true;
				}
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	return false;
	
	//ct.closePath();
	//ct.beginPath();
	
}
function drawMovedFont(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.x,p.y);
				break;
			case "L":
				ct.lineTo(p.x, p.y);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(p.x1, p.y1, p.x, p.y);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				ct.bezierCurveTo(p.x1, p.y1, p.x2, p.y2, p.x, p.y);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	
	//ct.closePath();
	//ct.beginPath();
	
}

function drawMovedFontInv(ct,commands) {
	ct.beginPath();
	for (let key in commands) {

		let p = commands[key];
		let x = p.mlx - (p.x - p.ox)*1
		
		let y = p.mly +  (p.y-p.mly) * Math.abs(p.x - p.ox)/Math.abs(  p.ox - p.mlx )*1 - Math.abs(  p.y - p.oy )*1///*p.mly - (*/p.y /*- p.oy)*/
		let x1 = p.mlx - (p.x1 - p.ox1)*1
		let y1 = p.mly +  (p.y1-p.mly) * Math.abs(p.x - p.ox)/Math.abs(  p.ox - p.mlx )*1 - Math.abs(  p.y - p.oy )*1///*p.mly - (*/p.y1/* - p.oy1)*/
		let x2 = p.mlx - (p.x2 - p.ox2)*1
		let y2 = p.mly +  (p.y2-p.mly) * Math.abs(p.x - p.ox)/Math.abs(  p.ox - p.mlx )*1 - Math.abs(  p.y - p.oy )*1///*p.mly - (*/p.y2/* - p.oy2)*/
		switch (p.type) {
			case "M":
				ct.moveTo(x,y);
				break;
			case "L":
				ct.lineTo(x,y);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(x1,y1, x, y);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				ct.bezierCurveTo(x1,y1, x2, y2, x, y);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	
	//ct.closePath();
	//ct.beginPath();
	
}
function drawMovedFont2(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.x,p.y);
				break;
			case "L":
				ct.lineTo(p.x, p.y);
				break;
			case "Q":
			//ct.lineTo(p.x,p.y);
				ct.quadraticCurveTo(p.ox1, p.oy1, p.x, p.y);
				break;
			case "C":
			//ct.lineTo(p.x,p.y);
				ct.bezierCurveTo(p.ox1, p.oy1, p.ox2, p.oy2, p.x, p.y);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	
	//ct.closePath();
	//ct.beginPath();
	
}
function drawStraightFont(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.x,p.y);
				break;
			case "L":
				ct.lineTo(p.x, p.y);
				break;
			case "Q":
				ct.lineTo(p.x, p.y);
				break;
			case "C":
				ct.lineTo(p.x,p.y);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
	
	//ct.closePath();
	//ct.beginPath();
	
}
function drawSpikeyFont(ct,commands,opts) {
	let am = opts.strength || 0.5;
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				break;
			case "L":
				case "L":
				ct.lineTo(p.ox, p.oy);
				break;
			case "Q":
				ct.quadraticCurveTo(p.x1+am * (p.ox1-p.x1), p.y1+am * (p.oy1-p.y1), p.ox, p.oy);
			case "C":
				ct.bezierCurveTo(p.x1+am * (p.ox1-p.x1), p.y1+am * (p.oy1-p.y1), p.x2+am * (p.ox2-p.x2), p.y2+am * (p.oy2-p.y2), p.ox, p.oy);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
}
function drawSpikeyFontXL(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				break;
			case "L":
				ct.lineTo(p.ox, p.oy);
				break;
			case "Q":
				ct.quadraticCurveTo(p.x1+4 * (p.ox1-p.x1), p.y1+4 * (p.oy1-p.y1), p.ox, p.oy);
			case "C":
				ct.bezierCurveTo(p.x1+4 * (p.ox1-p.x1), p.y1+4 * (p.oy1-p.y1), p.x2+4 * (p.ox2-p.x2), p.y2+4 * (p.oy2-p.y2), p.ox, p.oy);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
}
function drawSpikeyFontS(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				break;
			case "L":
				ct.lineTo(p.ox, p.oy);
				break;
			case "Q":
				ct.quadraticCurveTo(p.x1+0.5 * (p.ox1-p.x1), p.y1+0.5 * (p.oy1-p.y1), p.ox, p.oy);
			case "C":
				ct.bezierCurveTo(p.x1+0.5 * (p.ox1-p.x1), p.y1+0.5 * (p.oy1-p.y1), p.x2+0.5 * (p.ox2-p.x2), p.y2+0.5 * (p.oy2-p.y2), p.ox, p.oy);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
}
function drawSpikeyFontXS(ct,commands) {
	ct.beginPath();
	for (let key in commands) {
		let p = commands[key];
		switch (p.type) {
			case "M":
				ct.moveTo(p.ox,p.oy);
				break;
			case "L":
				ct.lineTo(p.ox, p.oy);
				break;
			case "Q":
				ct.quadraticCurveTo(p.x1+0.25 * (p.ox1-p.x1), p.y1+0.25 * (p.oy1-p.y1), p.ox, p.oy);
			case "C":
				ct.bezierCurveTo(p.x1+0.25 * (p.ox1-p.x1), p.y1+0.25 * (p.oy1-p.y1), p.x2+0.25 * (p.ox2-p.x2), p.y2+0.25 * (p.oy2-p.y2), p.ox, p.oy);
				break;
			case "Z":
				ct.closePath();
				break;
			default: 
				console.log("defaultin lul")

		}
	}
}
function prepareCommands(commands) {
	for (let key in commands) {
		let c = commands[key];
		c.ox=c.x;
		c.oy=c.y;
		c.xMot = 0;
		c.yMot = 0;
		if (c.hasOwnProperty("x1")) {
			c.ox1 = c.x1;
		}
		if (c.hasOwnProperty("y1")) {
			c.oy1 = c.y1;
		}
		if (c.hasOwnProperty("x2")) {
			c.ox2 = c.x2;
		}
		if (c.hasOwnProperty("y2")) {
			c.oy2 = c.y2;
		}
	}
}
function prepareLetters(commands,singlePaths) {
	for (let kei in singlePaths) {
		let sp = singlePaths[kei];
		sp.arr = []
		sp.arr2 = [];
		for (let key = sp.start;key<sp.end;key++) {
			let p = commands[key];
			sp.arr.push(p.x,p.y);
			sp.arr2.push([p.type,p.x,p.y,p.x1,p.y1,p.x2,p.y2]);
		}
	}
}
function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

    showPoints  = showPoints ? showPoints : true;

    ctx.beginPath();

    drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

        ctx.stroke();
        //ctx.fill();
    if (showPoints) {
        ctx.beginPath();
        //for(var i=0;i<ptsa.length-1;i+=2) 
                //ctx.fillRect(ptsa[i] - 2, ptsa[i+1] - 2, 4, 4);
    }
}
function getCurvePoints(pts, tension, isClosed, numOfSegments) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : true;
    numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [],    // clone array
        x, y,           // our x,y coords
        t1x, t2x, t1y, t2y, // tension vectors
        c1, c2, c3, c4,     // cardinal points
        st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    //
    _pts = pts.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.unshift(pts[pts.length - 1]);
        _pts.unshift(pts[pts.length - 2]);
        _pts.push(pts[0]);
        _pts.push(pts[1]);
    }
    else {
        _pts.unshift(pts[1]);   //copy 1. point and insert at beginning
        _pts.unshift(pts[0]);
        _pts.push(pts[pts.length - 2]); //copy last point and append
        _pts.push(pts[pts.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
        for (t=0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i+2] - _pts[i-2]) * tension;
            t2x = (_pts[i+4] - _pts[i]) * tension;

            t1y = (_pts[i+3] - _pts[i-1]) * tension;
            t2y = (_pts[i+5] - _pts[i+1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st; 
            c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function drawLines(ctx, pts) {
	//ctx.fillRect(pts[0],pts[1],4,4);
    ctx.moveTo(pts[0], pts[1]);
    for(i=2;i<pts.length-1;i+=2) ctx.lineTo(pts[i], pts[i+1]);
}
