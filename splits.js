function initSplits(txt,opts) {
	

	opts = opts || {};
	opts.text = txt;
	opts.type = "splits";
	
	
	
	let paras = initOptions(opts);
	paras.draw = drawSplits;
	paras.ind = texts.length;
	texts.push(paras);
	paras.currentSpawned = 0;
	paras.splits=[];
	paras.updateAllDots=true;
	

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;
	

	let tmpC = createCanvas(cW, cH);
	let tmpCt = tmpC.getContext("2d");
	tmpCt.textBaseline = ct.textBaseline;
	ct.fillStyle= opts.fill || paras.opts.fill || "black";
	console.log(paras);
	ct.clearRect(0, 0, cW, cH);
	tmpCt.clearRect(0, 0, cW, cH);

	//tmpCt.fillStyle="white";
	//tmpCt.fillRect(0,0,cW,cH);

	tmpCt.font = ct.font;//settings.splits.font + "px "+settings.splits.fontFam;
	tmpCt.fillStyle = ct.fillStyle;//"rgba(140,151,211,0.8)";
	tmpCt.fillText(txt,  x,  y);
	console.log(tmpCt.font,tmpCt.fillStyle);
	
	//edges = getEdgeMapBlack(tmpCt.canvas, 4, 0, cW, cH);
	//tmpCt.putImageData(edges, 0, 0);
	
	//testLine(width/2-wd/2, height/2+ht.height/4, wd, 'red');
	//testLine(width/2-wd/2, height/2+ht.height/4 + ht.ascent, wd, 'green');
	//testLine(width/2-wd/2, height/2+ht.height/4 + ht.height, wd, 'blue');
	dt = tmpCt.getImageData(0, 0, cW, cH);
	
	
	
	
	let splits = paras.splits;
	let splitSize = paras.opts.splitSize;
	console.log(splitSize);
	paras.opts.splitSize = splitSize;
	for (let i = Math.floor(x/splitSize); i < Math.ceil((x+wd) / splitSize); i++) {
		
		for (let j = Math.floor(y/splitSize); j < Math.ceil((y+ht) / splitSize); j++) {
			//tmpCt.strokeRect(i*splitvSize,j*splitSize,splitSize,splitSize)
			let bool = checkSplit(tmpCt.getImageData( i * splitSize,  j * splitSize, splitSize, splitSize));
			
			if (bool) {
				let c = document.createElement("canvas");
				c.width = splitSize;
				c.height = splitSize;
				let splitCt = c.getContext("2d");
				splitCt.drawImage(tmpC,  i * splitSize, j * splitSize, splitSize, splitSize, 0, 0, splitSize, splitSize);
				splits.push([c, [ i * splitSize,j * splitSize,  i * splitSize, j * splitSize, 0, 0, -Math.PI * 0.0, 0]]);
				if (paras.opts.randomStart) {
					let s = splits[splits.length - 1][1];
					s[0] = Math.random() * cW;
					s[1] = Math.random() * cH;
					s[6] = (Math.random() - Math.random()) * Math.PI * 2
				}
				
			}
		}
	}

	if (paras.opts.randomSort) {
		paras.splits.sort(random);
		paras.splits.sort(random);
		paras.splits.sort(random);
	}

	ready();
	drawSplits(paras);

}

function checkSplit(spl) {
	spl = spl.data;
	for (let i = 0; i < spl.length - 3; i += 4) {
		if (spl[i + 3] > 0) {
			return true;
		}

	}
	return false;
}
function drawSplits(paras) {
	
	let mouseRadius = paras.opts.mouseRadius;
	let totMot = 0;
	let moved = false;
	let splits = paras.splits;
	let max = splits.length;
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
	let splitSize = paras.opts.splitSize;
	let friction = paras.opts.friction;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;

	let rotate = settings.splits.rotate;
	if (rotate == "constant") {

	}
	let fontSize = paras.opts.font;
	if (paras.opts.continuousSpawn) {
		if (paras.currentSpawned < splits.length) {
			paras.currentSpawned+=paras.opts.spawnSpeed;
			max = paras.currentSpawned;
			paras.updateAllDots = true;
		}

	}
	if (paras.updateAllDots || max < splits.length) {
		ct.clearRect(0, 0, cW, cH);
	}
	ct.globalAlpha = paras.opts.alpha;
	/*ctx.globalCompositeOperation="source-over";
	ctx.fillText(text, width / 2 - wd / 2, height/2 + ht.height / 4);*/
	/*ctx.globalCompositeOperation="multiply";	*/
	loop1:
		for (let key = 0; key < splits.length && key < max; key++) {
			let p = splits[key][1];

			let disM = Distance(p[0], p[1], mx, my);

			if (disM < fontSize * paras.opts.mouseRadius) {
				paras.updateAllDots = true;
				let ang = angle(p[0], p[1], mx, my);
				p[4] -= Math.cos(ang) * disM / (fontSize * paras.opts.mass/paras.opts.mouseGravity);
				p[5] -= Math.sin(ang) * disM / (fontSize * paras.opts.mass/paras.opts.mouseGravity);
				
				p[6] += ((-1) * (key + 1) % 2) * 0.1 * ((1 - disM ) * paras.opts.angMass / paras.opts.angGrav);
			}

			if (paras.updateAllDots || max < splits.length) {


				let maxV = paras.opts.maxVelocity;
				let disT = Distance(p[0], p[1], p[2], p[3]);

				let ang = angle(p[0], p[1], p[2], p[3]);
				p[4] += Math.cos(ang) * disT / (fontSize  * paras.opts.mass / paras.opts.gravity) ;
				p[5] += Math.sin(ang) * disT / (fontSize  * paras.opts.mass / paras.opts.gravity) ;
				if (p[6] > Math.PI * 2) {
					p[6] -= Math.PI * 2;
					p[6] *= -1;
				}
				if (p[6] < -Math.PI * 2) {
					p[6] += Math.PI * 2;
					p[6] *= -1;
				}
				if (Math.abs(Math.abs(p[6]) - Math.PI * 0) <= 0.05) {
					p[6] = Math.PI * 0;
					p[7] *= 0.5;
					if (p[7] <= 0.05) {
						p[7] = 0;
					}
				} else if (p[6] != Math.PI * 0) {
					p[7] -=  findSideToTurn(p[6], Math.PI * 0) * paras.opts.angGrav / paras.opts.angMass;
				}

				p[0] += p[4] ;
				p[1] += p[5] ;
				p[6] = p[6] + p[7];
				p[4] *= friction;
				p[5] *= friction;
				p[7] *= friction;
				totMot += Math.abs(p[4]) + Math.abs(p[5]) + Math.abs(p[7]);

				ct.save(),
				ct.translate(p[0]+splitSize/2, p[1]+splitSize/2);
				ct.rotate(p[6]);

				let si = 1 - (Math.abs(p[4]) + Math.abs(p[5])) / 1000;

				ct.drawImage(splits[key][0], - splitSize / 2, - splitSize / 2, si * splitSize, si * splitSize);
				/*ctx.drawImage(splits[key][0],p[0]-splitSize/2,p[1]-splitSize/2);*/
				ct.restore();
			}

		}
		ct.globalAlpha = 1;

	if (totMot < 0.1 && !moved) {
		paras.updateAllDots = false;
		if (max == splits.length) {
			for (let key in splits) {
				let s = splits[key][1];
				s[0] = s[2];
				s[1] = s[3];
				//s[4] = (Math.random() - Math.random()) * 750;
				//s[5] = (Math.random() - Math.random()) * 750;
				s[6] = 0;
				//s[7] = (Math.random() - Math.random()) * 550;
				paras.updateAllDots = true;
			}


		}
	} /*else {*/
	if (!paras.opts.paused) {

		window.requestAnimationFrame(function() {
			drawSplits(paras)
		});
	} else {
		paras.draw = function() {
			paras.opts.paused=false;
			drawSplits(paras);
		};
	}
}