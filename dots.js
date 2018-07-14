function initDots(txt,opts) {
	
	opts = opts || {};
	opts.text = txt;
	opts.type = "dots";
	
	
	let paras = initOptions(opts)
	paras.ind = texts.length;
	texts.push(paras);
	paras.points = [];
	paras.currentSpawned=0;
	paras.continuousSpawn = opts.continuousSpawn || settings.dots.continuousSpawn;
	paras.updateAllDots = true;
	paras.opts.lowestX = 0;
	paras.opts.highestX = 9999;
	paras.opts.lowestY = 0;
	paras.opts.highestY = 9999;
	paras.opts.currentSize = 1;
	paras.opts.targetSize = 1;

	let fill = paras.opts.fillStyle || paras.opts.strokeStyle || "black";

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	let radius = opts.radius || paras.opts.radius || 1;
	console.log(fill,radius);
	ct.clearRect(0, 0, cW, cH);
	
	if (opts.cacheImg) {
		let newC = createCanvas(radius*2,radius*2);
		let newCt = newC.getContext("2d");
		newCt.fillStyle=opts.fillStyle;
		console.log(fill);
		newCt.beginPath();
		newCt.arc(radius,radius,radius,0,Math.PI*2,0);
		newCt.fill();
		newCt.closePath();
		paras.opts.cachedImg = newC;
	}


	let tmpCn = createCanvas(cW,cH);
	tmpCn.width = cW;
	tmpCn.height = cH;
	let tmpC = tmpCn.getContext("2d");

	ct.clearRect(0, 0, cW, cH);
	tmpC.clearRect(0, 0, cW, cH);
	
	//ct.fillStyle = "white";
	//ct.fillRect(0, 0, cW, cH);

	//tmpC.fillStyle = "white";
	//tmpC.fillRect(0, 0, cW, cH);

	ct.fillStyle = opts.fillStyle || "black";
	ct.strokeStyle= opts.strokeStyle || "black";
	console.log(ct.fillStyle,ct.strokeStyle)
	ct.lineWidth=opts.lineWidth || 1;
	paras.opts.font = Math.round(paras.opts.font)
	ct.font = paras.opts.font + "px "+paras.opts.fontFam;
	
	if (opts.fill) {
		
		ct.fillText(txt,x,y);
		
	} 
	console.log(opts.fill);
	if (opts.stroke) {
		

		ct.strokeText(txt, x, y);
	} 
	if (!opts.stroke && !opts.fill) {
		ct.strokeText(txt, x, y);	
	}
	//let abc = createCanvas(cW,cH).getContext("2d");
	//abc.putImageData(ct.getImageData(0,0,cW,cH),0,0);
	//document.body.appendChild(abc.canvas);
	//tmpC.font = settings.dots.font + "px Arial black";
	//tmpC.fillStyle = "black";
	//tmpC.fillText(txt, x, y);

	edges = /*getEdgeMapBlack(ct.canvas, 4); //*/ ct.getImageData(0, 0, cW, cH);
	
	//tmpC.putImageData(edges, 0, 0);
	//document.body.appendChild(tmpCn);
	
	dt = tmpC.getImageData(0, 0, cW, cH);
	
	ct.clearRect(0, 0, cW, cH);


	spawnParticlesFromEdgeMap(edges, paras.opts.randomStart, cW, cH, paras.points, paras);
}
function spawnParticlesFromEdgeMap(edgeMap, randomStart, cW, cH, points, paras) {
	let fontSize = paras.opts.font;
	
	loop1:
		for (let i = 0; i < edgeMap.data.length; i += 4) {
			let bool = true;
			let x1 = Math.floor(i / 4) % cW;
			let y1 = Math.floor((i / 4) / cW);
			
			if (edgeMap.data[i+3]>0) {
				loop2: 
				for (let key = 0; key < points.length; key++) {
					let dis = Distance(points[key][2], points[key][3], x1, y1);

					if (dis < paras.opts.margin * fontSize / 6) {

						bool = false;
						break loop2;
					}
				}
				if (bool) {
					x1 = Math.floor(i / 4) % cW;
					y1 = Math.floor((i / 4) / cW);


					points.push([Math.floor(Math.random() * cW), Math.floor(Math.random() * cH), x1, y1, 0, 0,4 + (2 * Math.floor(Math.random()-2*Math.random())*paras.opts.randomSpeed)]);
					//if (paras.opts.useImg) {
						points[points.length-1].push("rgba("+edgeMap.data[i]+","+edgeMap.data[i+1]+","+edgeMap.data[i+2]+","+edgeMap.data[i+3]/255+")");
					//}
					if (!randomStart) {
						points[points.length - 1][0] = points[points.length - 1][2];
						points[points.length - 1][1] = points[points.length - 1][3];
					}
					continue loop1;

				}

			}
		}

		if (paras.opts.randomSort) {
			points.sort(random)
			points.sort(random)
			points.sort(random)
		}
		if (paras.opts.useImg) {
			paras.points = createImagesFromDots(paras.points,paras.opts.radius*2);
			
		}


	ready();

	drawDots(paras);//start rendering

}
function createImagesFromDots(dots,radius,colors) {
	let imgArr=[];
	for (let key in dots) {
		let d = dots[key];
		
		let ct = createCanvas(radius,radius).getContext("2d");
		ct.fillStyle=getClosestColor(d[6],colors);
		ct.beginPath();
		ct.arc(radius/2,radius/2,radius/2,0,Math.PI*2,0);
		ct.fill();
		ct.closePath();
		
		imgArr.push([d[0],d[1],d[2],d[3],d[4],d[5],ct.canvas])

	}
	return imgArr;
}	
function getClosestColor(color1,color23)  {

}
function drawDots(paras) {
	

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
	let mouseRadius = paras.opts.mouseRadius;
	let friction = paras.opts.friction;
	let mass = paras.opts.mass;
	let gravity = paras.opts.gravity;
	let mouseGravity = paras.opts.mouseGravity;
	let cSize = paras.opts.currentSize;
	let tSize = paras.opts.targetSize;

	if (cSize!=tSize) {
		//cSize=tSize;
		if ( shiftAllDots(paras,tSize,cSize)) {
			//to make sure it finishes this.
		}
			
	}
	if (paras.continuousSpawn) {
		paras.currentSpawned+=paras.opts.spawnSpeed;
		paras.updateAllDots=true;
		max = paras.currentSpawned;
	}
	if (paras.updateAllDots) {
		
		ct.clearRect(paras.opts.lowestX, paras.opts.lowestY, paras.opts.highestX-paras.opts.lowestX, paras.opts.highestY-paras.opts.lowestY);
	}
	ct.strokeStyle = stroke;//settings.dots.fill;
	ct.fillStyle = fill || stroke//settings.dots.stroke;
	/*let rgr = ct.createLinearGradient(0,0,cW,cH);
	rgr.addColorStop(0,"rgba(131,140,240,0.5");
	rgr.addColorStop(1,"rgba(255,0,0,0.5");*/
		
	
	loop1:
		for (let key = 0; key < points.length && key < max; key++) {
			let p = points[key];
			if (p[0]<paras.opts.lowestX) {
				paras.opts.lowestX=p[0];
			}
			if (p[1]<paras.opts.lowestY) {
				paras.opts.lowestY=p[1];
			}
			if (p[0]>paras.opts.highestX) {
				paras.opts.highestX=p[0];
			}
			if (p[1]>paras.opts.highestY) {
				paras.opts.highestY=p[1];
			}
			let siz = 1;//1+(Math.abs(p[4])+Math.abs(p[5]))/10 ;

			let disM = Distance(p[0], p[1], mx, my);
			if (disM < mouseRadius*fontSize) {
				paras.updateAllDots = true;
				let ang = angle(p[0], p[1], mx, my);
				p[4] -= Math.cos(ang) * disM / (fontSize*mass/mouseGravity);
				p[5] -= Math.sin(ang) * disM / (fontSize*mass/mouseGravity);
			}

			if (paras.updateAllDots) {



				let disT = Distance(p[0], p[1], p[2], p[3]);

				let ang = angle(p[0], p[1], p[2], p[3]);
			
				p[4] += Math.cos(ang) * (Math.max(1,disT)) / (fontSize*mass/gravity);
				p[5] += Math.sin(ang) * (Math.max(1,disT)) / (fontSize*mass/gravity);

				p[0] += p[4]*p[6];
				p[1] += p[5]*p[6];
				p[4] *= friction;
				p[5] *= friction;


				totMot += Math.abs(p[4]) + Math.abs(p[5]);

				/*if ((paras.opts.strokeRadius > 0 && paras.opts.lineWidth > 0) || paras.opts.reject > 0) {
						//console.log("lagger")
					loop2: for (let key1 in points) {
						let p2 = points[key1];
						if (key == key1) {
							continue loop2;
						}
						let dis = Distance(p[0], p[1], p2[0], p2[1]);

						if (dis < paras.opts.strokeRadius * fontSize / 6) {

							
							ct.strokeStyle=paras.opts.stroke;
							ct.lineWidth = paras.opts.lineWidth * (dis / (paras.opts.strokeRadius * fontSize / 6));
							ct.beginPath();
							ct.moveTo(p[0], p[1]);
							ct.lineTo(p2[0], p2[1]);

							ct.stroke();
							ct.closePath();
						}
						if (paras.opts.reject) {
							if (dis < paras.opts.reject  * fontSize / 6) {
						//dots push each other away

								let ang = angle(p[0], p[1], p2[0], p2[1]);
								p[4] -= Math.cos(ang) * dis / (paras.opts.reject * fontSize/6);
								p[5] -= Math.sin(ang) * dis / (paras.opts.reject * fontSize/6);
							}
						}
					}
				}*/


			//	if (paras.opts.radius > 0) {
					if (paras.opts.cacheImg) {
						//ct.putImageData(paras.opts.cachedImg,p[0],p[1]);
						ct.drawImage(paras.opts.cachedImg,p[0]-2,p[1]-2);
					} else {

						//ct.fillStyle = "rgba(0,0,0,0.1)";//fill;
						//ct.lineWidth=0;
						//ct.strokeStyle="rgba(0,0,0,0)";
						ct.fillStyle=p[7]
						ct.fillRect(p[0]-siz*paras.opts.radius,p[1]-siz*paras.opts.radius,siz*paras.opts.radius*2,siz*paras.opts.radius*2)
						if (Math.abs(p[4])+Math.abs(p[5])>1) {
							
							for (let i = (Math.abs(p[4])+Math.abs(p[5]));i>=0;i-=1) {
								// ct.globalAlpha=1 - i/(p[4]+p[5])/2
								ct.fillRect(p[0]-siz*paras.opts.radius-p[4]*2*(i),p[1]-siz*paras.opts.radius-p[5]*2*i,siz*paras.opts.radius*2,siz*paras.opts.radius*2)
							}
						}
						// ct.beginPath();
						// //ct.moveTo(p[0], p[1]);
						// ct.arc(p[0], p[1], paras.opts.radius * siz , 0, Math.PI * 2, 0);
						// ct.fill();
						// ct.closePath();
					}
					

			//	}
			}


		}
		if (paras.opts.reject && paras.opts.rejectReduce) {
			paras.opts.reject = Math.sin(0.1*(Math.abs(paras.opts.reject)+paras.opts.rejectReduce))
			paras.opts.rejectReduce+=1;
			
		}
		/*if (totMot < 100 && !moved) {
			ct.fillStyle="rgba(0,0,0,"+(1-totMot/100)+")";
		console.log(ct.fillStyle);
		ct.fillText(paras.opts.text, paras.opts.x, paras.opts.y);
	}	*/
	
	if (totMot < 0.5 && !moved) {
		for (let key in points) {
			let  p = points[key][1];
			p[0]=p[2];
			p[1]=p[3];
			p[4]=0;
			p[5]=0;
		}
		paras.updateAllDots = false;
	} /*else {*/
	if (!paras.opts.paused) {
		window.requestAnimationFrame(function(){
			drawDots(paras)
		});
		
	} else {
		paras.draw = function() {
			paras.opts.paused=false
			drawDots(paras);
		}
	}
}
	function shiftAllDots(paras,tSize,cSize) {
		paras.opts.currentSize=tSize;//+=factor;
		paras.updateAllDots=true;
		let scale=tSize/cSize;
		
		let newX = (paras.opts.canvasW - paras.opts.txtWidth*scale)/2;
		let shiftW = (paras.opts.x - newX );
		
		
		let newY = (paras.opts.canvasH - paras.opts.txtHeight * scale)/2;
		let shiftH = (paras.opts.y - newY );
		
		for (let key = 0; key < paras.points.length; key++) {
			let p = paras.points[key];
			
			let nX = p[0] - paras.opts.x;
			let nY = p[1] - paras.opts.y;
			let nX2 = nX*scale;
			let nY2 = nY*scale;
			paras.points[key][2] += nX2 - nX;
			paras.points[key][3] += nY2 - nY;
			paras.points[key][2] -= shiftW;
			paras.points[key][3] -= shiftH;
		}
		paras.opts.x = newX;
		paras.opts.y = newY;
		paras.opts.txtWidth = wd * scale;
		paras.opts.txtHeight = ht * scale;
		return true;
	

	/*}*/

}
