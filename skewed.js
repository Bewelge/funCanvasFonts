function initSkewed(txt,opts) {
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
	

	ready();
	drawSkewed(paras);
}




function drawSkewed(paras) {
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
	ct.fillStyle="white";
	ct.fillRect(x + wd / 2, y - ht / 4,10,10);

	ct.save();
	ct.translate(x+wd/2,y+ht/4);
	
	ct.transform(0,Math.cos(ang)*(disX/wd)*2,1,0,0,0);
	ct.font = fontStr;

	let rgr = ct.createRadialGradient(my, my, wd / 10, mx, my, width);
	rgr.addColorStop(0, "rgba(255, 0, 255, 0.5)");
	rgr.addColorStop(0.5, "rgba(0, 255, 255, 0.9)");
	rgr.addColorStop(1, "rgba(255, 0, 255, 0.5)");



	ct.strokeStyle=rgr;
	ct.strokeText(text,  -wd/2,  -ht/4 );
	ct.restore();
	

	if (!paras.opts.paused) {

		window.requestAnimationFrame(function() {
			drawSkewed(paras)
		});
	} else {
		paras.draw = function() {
			paras.opts.paused=false;
			drawSkewed(paras);
		};
	}


}