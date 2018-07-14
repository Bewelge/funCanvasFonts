function initSplash(txt,opts) {
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
	paras.ticker0=1;
	paras.ticker1=0;
	paras.ticker2=0;
	paras.mouseInk=0;
	paras.inks=[];
	

	let ct = paras.ctx;
	let wd = paras.opts.txtWidth;
	let ht = paras.opts.txtHeight;
	let x = paras.opts.x;
	let y = paras.opts.y;
	let cW = paras.opts.canvasW;
	let cH = paras.opts.canvasH;
	let yTop = cH/2 - ht/2;
	let yBot = cH/2 + ht/2;

	

	ready();
	drawSplash(paras);
}




function drawSplash(paras) {
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
	let font = paras.opts.font || settings.elecs.font;
	let fontFam =paras.opts.fontFam || settings.elecs.fontFam;
	let fontStr = font+"px "+fontFam;

	ct.clearRect(0, 0, width, height);

	let mouseIn = false;
	if (mx > x && mx < x + wd && my > y - ht * 3 / 4 / 1.2 &&  my < y + ht / 4 / 1.2) {
		mouseIn=true;
	}

	let ang = angle(my, my, x + wd / 2, y - ht / 4);
	let dis = Distance(my, my, x + wd / 2, y - ht / 4);
	let disX = Math.abs((x + wd / 2) - my);
	let disY = Math.abs((y - ht / 4) - my);
	
	ct.font=fontStr;
	if (paras.ticker0 < 100) {
		let xx = cW*0.75 - cW*0.25*paras.ticker0/100;
		let yy = cH*2 - cH*3/2*paras.ticker0/100;
		ct.beginPath();
		ct.arc(xx,yy,50-paras.ticker0*0.1,0,Math.PI*2,0);
		ct.fill();
		ct.closePath();
		paras.ticker0+=2;
	} 
	if (paras.ticker0 > 99 && paras.ticker0 < 110) {
		paras.ticker0=111;
		paras.ticker1 = 1;
		console.log(paras.ticker1);
		paras.ticker1 = 1;
		paras.total=0;
		for (let i = 0;i<200; i++) {
			let siz = Math.ceil(Math.random()*40)
			paras.total+=siz;
			paras.inks.push([
				cW/2  + Math.floor(Math.random()*wd/2) - Math.floor(Math.random()*wd/2),
				cH/2  + Math.floor(Math.random()*ht/2) - Math.floor(Math.random()*ht/2),
				siz])
		}
		paras.cTotal=paras.total;
	}
	if (paras.ticker1 > 0 ) {
		ct.globalAlpha=0.3;
		ct.strokeText(paras.opts.text,x,y);
		ct.globalAlpha=1;
		if (paras.ticker1<5) {
			// ct.beginPath();
			// //ct.arc(cW/2,cH/2,50+Math.sqrt(Math.pow(1+2*paras.ticker1,4)),0,Math.PI*2,0);
			// ct.fill();
			// ct.closePath();
			
		}
		paras.ticker1++;
	}
		paras.cTotal=0;
		ct.beginPath();
	for (let key=paras.inks.length-1;key>=0;key--) {
		let i = paras.inks[key];
		paras.cTotal+=i[2];
		ct.globalAlpha=Math.min(1,i[2]/25);
		ct.moveTo(i[0],i[1]);
		ct.arc(i[0],i[1],Math.max(1,i[2]),0,Math.PI*2,0);
		i[2]-=0.5;
		ct.fill();
		if (i[2]<0) {
			paras.inks.splice(key,1);
		}
	}
		ct.closePath();
		ct.globalAlpha=1;

	if (!paras.opts.paused) {

		window.requestAnimationFrame(function() {
			drawSplash(paras)
		});
	} else {
		paras.draw = function() {
			paras.opts.paused=false;
			drawSplash(paras);
		};
	}


}