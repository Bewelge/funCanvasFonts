var mainCanvas = null;
var ctx = null;
var bgCanvas = null;
var frCanvas = null;
var ctxBG = null;
var ctxFront = null;
var gameBoard = null;
var hlfSize = 0;
var qrtSize = 0;
var paused = false;
var lastTick = 0;
var ticker = 0;
var doneTicks = 0;
var tickSpeed = 10;
var bw;
var bh;
var lng;
var maxmax;
var diagLng;
var tileSize;
var tileMap;
var mouseX = 0;
var mouseY = 0;
var doneTicks = 0;
var cam = {
	x: 0,
	y: 0
}
var moveDots;
function resize() {

};
function loadFonts() {

}

//'https://rawgit.com/google/fonts/master/ofl/titanone/TitanOne-Regular.ttf'
function loadFont(url,callback) {
	opentype.load(url, function(err, font) {
	    if (err) {
	         console.log('Font could not be loaded: ' + err);
	    } else {
	        //var ctx = createCanvas(200,200).getContext("2d");
	        //document.body.appendChild(ctx.canvas);
	        // Construct a Path object containing the letter shapes of the given text.
	        // The other parameters are x, y and fontSize.
	        // Note that y is the position of the baseline.
	        //var path = font.getPath('Svg Path', 0, 0, 100);

	        callback(font);//return path;
	        // If you just want to draw the text you can also use font.draw(ctx, text, x, y, fontSize).
	        //path.draw(ctx);
	    }
	});

}
function loadImg() {
	
	var img = new Image();
	img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Love_Heart_SVG.svg/2000px-Love_Heart_SVG.svg.png";
	img.onload = function() {
		//start();
	}

}



function start() {

	width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
	height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
	width = Math.floor(0.8*width);
	height = Math.floor(height - 50);
	
	hlfSize = Math.floor(Math.min(width, height) / 2) + 0.5;
	qrtSize = Math.floor(hlfSize / 2) + 0.5;

	bw = Math.floor((width) / 2) + 1;
	bh = Math.floor((height) / 2) + 1;
	lng = 113; 
	maxmax = Math.floor(Math.sqrt(Math.pow(lng, 2) + Math.pow(lng, 2)));
	diagLng = 320; 
	tileSize = 32; 
	console.log(qrtSize);
	

	document.addEventListener("keydown", keyDownMine);
	document.addEventListener("keyup", keyReleaseMine);
	//document.getElementById("fileUp").addEventListener("change",fileChange)

	document.addEventListener("mousemove", mouseMoveMine);
	document.addEventListener("click", mouseClickMine);
	document.addEventListener("mouseup", mouseUpMine);
	document.addEventListener("mousedown", mouseDownMine);

	nextCarousel();
	
	//initJitter("Hello");
	//initSplits("Bewelge",{font:100,fill:"rgba(0,0,255,0.8)",lineWidth:0,strokeRadius:0,radius:1.5,splitSize:10,spawnSpeed:1.5,randomStart:true,randomSort:true,mouseGravity:5,angMass:100});
	// window.setTimeout(function() {

	//initSkewed("cText.js");
	//initHangingLetters("cnvTxt.js",{height:400});
	//initNormalLetters("Hello");
	//initDots("Bewelge",{/*width:width,height:height,*/font:100,stroke:"rgba(250,250,250,1)",lineWidth:0,strokeRadius:0,radius:2,margin:1,useImg:false,mouseGravity:9,spawnSpeed:0.5});
	//initDots("Bewelge",{/*width:width,height:height,*/font:100,stroke:"rgba(0,0,0,1)",lineWidth:0,strokeRadius:0,radius:1,margin:0.2,useImg:false,mouseGravity:0.5,randomSort:false,randomStart:true,continuousSpawn:true,spawnSpeed:2});
	//draw2();
	/*initSVGText("*Your Company Name*!");*/
	// },2500)


}
$("#next").click(nextCarousel);
$("#previous").click(prevCarousel);
var curCarousel = -1;
var carousel = [
	//function() {
		//let c = document.createElement("canvas").getContext("2d");
		//let lgr = c.createLinearGradient(width/2,0,width/2,height);
		//lgr.addColorStop(0,"rgba(0,0,0,1)");
		//lgr.addColorStop(1,"rgba(250,250,250,1)");
		//initJitter("combine",{font:75,gravity:0.05,speed:0.5,mouseGravity:0.1,extent:10,amount:10,tickSpeed:0.001,fill:"rgba(255,0,0,0)",fill2:"rgba(255,0,0,0)",stroke:"rgba(255,0,0,0)",lineWidth:0,stroke2:"rgba(255,255,255,0.1)",lineWidth2:0.2});
		//initSplits("combine",{font:75,fill:lgr,lineWidth:0,strokeRadius:0,radius:1.5,splitSize:15,spawnSpeed:1.5,randomStart:true,randomSort:true,gravity:0.5,mouseGravity:0.5,angMass:100});
		//initDots("combine",
		//{
		//	font:75,
		//	stroke:true,
		//	fill:false,
		//	strokeStyle:"rgba(255,0,0,0.5)",
		//	fillStyle:"rgba(50,50,150,0.7)",
		//	lineWidth:0,
		//	strokeRadius:0,
		//	radius:2,
		//	margin:0.2,
		//	useImg:false,
		//	gravity:0.5,
		//	cacheImg:true,
		//	randomSpeed:0,
		//	parseColors:true,
		//	mass:0.5,
		//	mouseGravity:2,
		//	mouseRadius:0.5,
		//	randomSort:true,
		//	randomStart:true,
		//	continuousSpawn:true,
		//	spawnSpeed:5
		//});
		
	
	//},
	function() {
		
		initDots("Dots",
		{
			font:100,
			stroke:"rgba(0,0,0,1)",
			lineWidth:0,
			strokeRadius:5,
			radius:1,
			margin:0.02,
			useImg:false,
			gravity:0.5,
			randomSpeed:1,

			parseColors:true,
			mass:0.5,
			mouseGravity:1.5,
			randomSort:false,
			randomStart:false,
			continuousSpawn:false,
			spawnSpeed:50
		});
	},
	function() {
		
		initDots("Dots",
		{
			font:100,
			fill:"rgba(255,255,0,1)",
			fillStyle:"rgba(0,255,255,1)",
			lineWidth:0,
			strokeRadius:0,
			radius:1.5,
			margin:0.1,
			useImg:false,
			gravity:0.2,
			randomSpeed:0.5,
			parseColors:true,
			mass:0.5,
			mouseGravity:1.5,
			randomSort:true,
			randomStart:true,
			continuousSpawn:true,
			spawnSpeed:50
		});
		initDots("Dots",
		{
			font:100,
			stroke:"rgba(0,0,0,1)",
			lineWidth:0,
			strokeRadius:0,
			radius:1,
			margin:0.02,
			useImg:false,
			gravity:0.5,
			randomSpeed:0.5,
			parseColors:true,
			mass:05,
			mouseGravity:1.5,
			randomSort:true,
			randomStart:true,
			continuousSpawn:true,
			spawnSpeed:50
		});
	},
	function() {
		initSVGPath("SVG Path", 
		{
				fill:"black",
				font:100,
				continuousSpawn:true,
				mouseGravity:-5,
				mouseRadius:104,
		},
			[
		{
			effect: "moved",
			opts: {
				fill:true,
				fillStyle:"rgba(0,0,255,0.5)",
				stroke:true,
				strokeStyle:"rgba(255,255,255,0.4)",
				font:100,
				continuousSpawn:true,
			}
		},
		//{
		//	effect: "normal",
		//	opts: {
		//		fill:true,
		//		fillStyle:"rgba(0,0,50,1)",
		//		strength:1,
		//		mouseRadius:100,
		//		font:100,
		//		continuousSpawn:true,
		//	}
		//}
		]) 
	},
	//function () {
	//	initSplash("Splash!");
	//},
	
	// function() {
		
	// 	initDots("Dots",{/*width:width,height:height,*/font:100,stroke:"rgba(250,250,250,1)",lineWidth:0,strokeRadius:0,radius:2,margin:1,useImg:false,mouseGravity:9,spawnSpeed:0.5});
	// },
	function() {
		initSplits("Splits",{font:100,fill:"rgba(0,0,255,0.8)",splitSize:10,spawnSpeed:1.5,randomStart:true,randomSort:true,mouseGravity:5,angMass:100});
	},
	function() {
		
		initHangingLetters("Hangin'",{height:400});
	},
	function() {
		initJitter("Jitter",{amount:50});
	},
	//function() {
	//	initSkewed("Skewed");
	//},
]
Element.prototype.clear = function(){while (this.firstChild) {this.removeChild(this.firstChild);}}
function clearCarousel(callback) {
	$("#canvasCont").animate({
		left:width+"px",
		opacity:0,
	},1000, function() {
		for (let key in texts) {
			texts[key].opts.paused=true;
		}
		document.getElementById("canvasCont").clear();
		texts.length=0;
		$("#canvasCont").css("left",-width);
		callback()})
}
//Slides screen out to different side.
function clearCarouselRight(callback) {
	$("#canvasCont").animate({
		left:-width+"px",
		opacity:0,
	},1000, function() {
		for (let key in texts) {
			texts[key].opts.paused=true;
		}
		document.getElementById("canvasCont").clear();
		texts.length=0;
		$("#canvasCont").css("left",width);
		callback()})
}
function startCarousel() {
	$("#canvasCont").animate({
			"left":0,
			"opacity":1
		});
}
function  nextCarousel() {
	$("#canvasContOverlay").fadeIn("slow");
	$("#canvasContOverlayInner").css({
		"top":"0%",
		"left":"0%",
		"height":"100%",
		"width":"100%",
		borderTopLeftRadius:0,
		borderTopRightRadius:0,
		borderBottomLeftRadius:0,
		borderBottomRightRadius:0,
		
	})
	$("#canvasContOverlayInner").animate({
		top:"49%",
		left:"45%",
		"height":"2%",
		"width":"10%",
		borderTopRightRadius:"10px",
		borderBottomRightRadius:"10px",
	});
	clearCarouselRight(function() {
		//callback if canvas has slid left
		curCarousel++;
		if(curCarousel>carousel.length - 1) {
			curCarousel=0;
		}
		carousel[curCarousel]();
		startCarousel();
	})
}
function  prevCarousel() {
	$("#canvasContOverlay").fadeIn();
	$("#canvasContOverlayInner").css({
		"top":"0%",
		"left":"0%",
		"height":"100%",
		"width":"100%",
		borderTopLeftRadius:0,
		borderTopRightRadius:0,
		borderBottomLeftRadius:0,
		borderBottomRightRadius:0,

	})
	

	$("#canvasContOverlayInner").animate({
		top:"49%",
		left:"45%",
		"height":"2%",
		"width":"10%",
		borderTopLeftRadius:"10px",
		borderBottomLeftRadius:"10px",
	});
	clearCarousel(function() {
		//callback if canvas has slid left
		curCarousel--;
		if(curCarousel<0) {
			curCarousel=carousel.length-1;
		}
		carousel[curCarousel]();
		startCarousel();
	})
}
function ready() {
	
		$("#canvasContOverlay").fadeOut(0)
		
}
var edges;
var wd;
var ht;
//var letters=[];
/*var paras.opts.avgLetterW=0;*/
/*var letterSpacing=0;*/
var cW=400;
var cH=100;
var x = 0;
var y = 0;
function initSettings(type) {
	for (let key in settings[type]) {
		document.getElementById("settings").appendChild(createSettingDiv(settings[type][key]))
	}
}
function createSettingDiv(setting) {	
	let outer = createDiv("outerSettingDiv"+setting.name,"outerSettingDiv");
	let inner = null;
	switch(setting.type) {
		case "range": 
			inner = createSliderInputDiv(setting.name+"slider","slider",{width:"100%"},{step:setting.step,min:setting.min,max:setting.max},{},settings.variable,setting.reload);
			break;
	} 
	console.log(inner);
	if (inner) {

	outer.appendChild(inner);
	}
	return outer;
}
function initOptions(opts) {
	let ct;
	let newCn = false;/*
	let font = opts.font || settings[opts.type].font;
	let fontFam = opts.fontFam || settings[opts.type].fontFam;*/

	console.log(opts.ctx);
	if (opts.hasOwnProperty("ctx")) {
		ct = opts.ctx;
	} else {

		newCn = document.createElement("canvas");
		document.getElementById("canvasCont").appendChild(newCn);
		ct = newCn.getContext("2d");
		
	}
	let font = opts.font || settings[opts.type].font;
	let fontFam = opts.fontFam || settings[opts.type].fontFam;
	ct.font = font + "px "+fontFam;
	text = opts.text;

	wd = Math.ceil(ct.measureText(text).width);
	ht = Math.ceil(getTextHeight(settings[opts.type].fontFam, font).height);

	cW = Math.ceil(opts.width) || wd*2;
	cH = Math.ceil(opts.height) || ht*2;
	if (newCn) {
	 	newCn.width = cW;
		newCn.height = cH;	
	}
	let x,y;
	if (opts.alignV == "top") {
		ct.textBaseline = "top";
		y = 0;
	} else if ( opts.alignV == "bottom") {
		ct.textBaseline = "top";
		y = cH - ht;
	} else {
		ct.textBaseline = "top";
		y = cH/2-ht/2;
	}  
	if (opts.alignH == "right") {
		x = Math.floor(cW - wd);
	} else if (opts.alignH == "left") {
		x = 0;
	} else {
		x = Math.floor(cW / 2 - wd / 2);
	}
	console.log(x,y);
	let fontStr = font + "px "+fontFam
	ct.font = fontStr;
	let params = {text:text,txtWidth: wd,txtHeight: ht,canvasW: cW,canvasH: cH,x: x,y: y};
	params.paused=false;
	

	params.letters = [];
	let lets = text.split("");
	for (let key in lets) {
			let twd = Math.ceil(ct.measureText(lets[key]).width);
			let tht = Math.ceil(getTextHeight(fontFam, font, lets[key]).height);
			
			let newCn = document.createElement("canvas");
			
			newCn.width = twd;
			newCn.height = tht;
			let newC = newCn.getContext("2d");
			newC.fillStyle=opts.letterFill;
			newC.font = fontStr;
			newC.textBaseline = "top";
			newC.fillText(lets[key],0,0);
			if (opts.lineWidth) {
				newC.strokeStyle=opts.letterStroke;
				newC.lineWidth=opts.letterLineWidth;
				newC.strokeText(lets[key],0,0);
			}
			
			//letterWidth, letterHeight, x, y, targetX, targetY
			params.letters.push([newCn,[twd,tht,0,0,0,0,0]]);

			if(twd>params.avgLetterW ) {
				params.avgLetterW=twd;
			}
			//document.body.appendChild(newCn);
		}
		params.avgLetterW*=0.5*params.letterSize;
		
	
	
	for (let key in params.letters) {
		let l = params.letters[key][1];
		x+=params.avgLetterW*2;
		y = cH/2;
		l[2] = x;
		l[3] = y ;
		l[4] = x;
		l[5] = y ;
		

	}
	for (let key in opts) {
		
			params[key] = opts[key];
		
	}
	for (let key in settings[opts.type]) {
		if (!params.hasOwnProperty(key)) {
			
			params[key] = settings[opts.type][key];
		}	
		
	}
	//need to bind to individual texts[x] settings.
	//initSettings(texts[0]);

	return {ctx:ct,opts:params}
	/*initSplits(text,ct);*/

}

function drawNormalLetters(paras) {
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

	
	//Draw Letters
	for (let key in paras.letters) {

		let l = paras.letters[key];
		x += l[1][0];
		let y = l[1][3];
		let ang = (angle(x,y,l[1][4],0))+Math.PI*0.5

		ct.save(),
		ct.translate(x-l[1][0]/2,y);
		//ct.rotate(ang)

		ct.drawImage(l[0],-l[1][0]/2,-l[1][1]/2);//-l[1][0]/2-letterSpacing,-l[1][1]/2);
		

		ct.restore();
	}

	if (!paras.paused) {
		window.requestAnimationFrame(function() {
			drawNormalLetters(paras)
		});
		
	} else {
		paras.draw = function() {
			paras.paused=false;
			drawNormalLetters(paras);
		}
	}
}
function initNormalLetters(txt,opts) {
	let paras = initLetters(txt,opts);
	let x = paras.opts.x;
	/*for (let key in paras.letters) {
		initJitter(txt.split("")[key],{
			x:x,
			y:paras.letters[key][1][3],
			canvasW:paras.opts.canvasW,
			ctx:paras.ctx,
		})
		x+=paras.letters[key][1][0]
	}*/
	drawNormalLetters(paras);
}


function initLetters(txt,opts) {
	opts = opts || {};
	opts.text = txt;
	opts.type = "letters";
	
	
	
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
	paras.opts.avgLetterW = wd / lets.length;
	
	
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
		//	document.body.appendChild(newCn);
		}
		paras.opts.avgLetterW*=0.5*paras.opts.letterSize;
		
	
	
	
	for (let key in paras.letters) {
		let l = paras.letters[key][1];
		x+=paras.opts.avgLetterW*2;
		y = cH/2;
		l[2] = x;
		l[3] = y ;
		l[4] = x;
		l[5] = y ;
		

	}
	
	return paras;
	
}
function initSVGText(txt) {

      
    let fs = 100;
	ctx.font = fs+"px 'Titan One', cursive"
   	while (ctx.measureText(txt).width>width) {
   		fs-=0.5;
   		ctx.font = fs+"px 'Titan One', cursive"
   	}
      
   
	wd = Math.ceil(ctx.measureText(txt).width);
	ht = Math.ceil(getTextHeight("'Titan One', cursive", 100).height);

	let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
	svg.setAttributeNS(null,"class","intro");
	svg.setAttributeNS(null,"width",wd);
	svg.setAttributeNS(null,"height",ht);
	svg.setAttributeNS(null,"viewbox","0 0 "+height+" "+width+"");

	let txt1 = document.createElementNS("http://www.w3.org/2000/svg","text");
	txt1.setAttributeNS(null,"font-size",fs+"px");
	txt1.setAttributeNS(null,"text-anchor","start");
	txt1.setAttributeNS(null,"x",0);
	txt1.setAttributeNS(null,"y",ht*3/4);
	txt1.setAttributeNS(null,"class","text text-stroke");
	txt1.setAttributeNS(null,"clip-path","url(#text1)");
	txt1.innerHTML=txt;
	svg.appendChild(txt1);
	let txt11 = document.createElementNS("http://www.w3.org/2000/svg","text");
	txt11.setAttributeNS(null,"font-size",fs+"px");
	txt11.setAttributeNS(null,"text-anchor","start");
	txt11.setAttributeNS(null,"x",0);
	txt11.setAttributeNS(null,"y",ht*3/4);
	txt11.setAttributeNS(null,"class","text text-stroke text-stroke-2");
	txt11.setAttributeNS(null,"clip-path","url(#text1)");
	txt11.innerHTML=txt;
	svg.appendChild(txt11);

  	let defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
  	
  	let clipPath = document.createElementNS("http://www.w3.org/2000/svg","clipPath");
  	clipPath.setAttributeNS(null,"id","text1");

  	let txt2 = document.createElementNS("http://www.w3.org/2000/svg","text");
	txt2.setAttributeNS(null,"text-anchor","start");
	txt2.setAttributeNS(null,"font-size",fs+"px");
	txt2.setAttributeNS(null,"x",0);
	txt2.setAttributeNS(null,"y",ht*3/4);
	txt2.setAttributeNS(null,"class","text");
	txt2.innerHTML = txt;
	clipPath.appendChild(txt2);

	defs.appendChild(clipPath);
   
  	svg.appendChild(defs);
  	
  	document.body.appendChild(svg);


	svg.setAttributeNS(null,"class","intro go");
	
}

var texts = [];



var testLine = function(x, y, len, style) {
	ctxBG.strokeStyle = style;
	ctxBG.beginPath();
	ctxBG.moveTo(x, y);
	ctxBG.lineTo(x + len, y);
	ctxBG.closePath();
	ctxBG.stroke();
}

var text;






function random(a, b) {
	if (Math.random()<0.5)  return 1

	return 0
}
var settings = {
	dots: {
		/*font: {
			type:"range",
			name:"Font Size",
			min:6,
			max:150,
			step:1
		},*/
		font:64,

		fontFam: "'Titan One', cursive",

		fill: "rgba(0,0,0,0.5)",
		radius: 1,
		lineWidth2: 0, 
		
		stroke: "rgba(255,0,255,0.15)",
		strokeRadius: 0,
		lineWidth: 0,
		
		reject: 0,
		rejectReduce:0,

		continuousSpawn: false,
		randomStart: true,
		randomSort: true,
		spawnSpeed: 50,

		margin: 0.3,
		maxAmount: 500,
		
		friction:0.9,
		mouseGravity:1.5,
		gravity:0.4,
		mouseRadius: 0.5,
		mass:1,

	},
	svgPath: {
		font:100,
		fontFam: "'Titan One', cursive",

		fill: "rgba(0,0,0,0.5)",
		radius: 1,
		lineWidth2: 0, 
		
		stroke: "rgba(255,0,255,0.15)",
		strokeRadius: 0,
		lineWidth: 0,
		
		reject: 0,
		rejectReduce:0,

		continuousSpawn: false,
		randomStart: true,
		randomSort: true,
		spawnSpeed: 50,

		margin: 0.3,
		maxAmount: 500,
		
		friction:0.9,
		mouseGravity:1.5,
		gravity:0.4,
		mouseRadius: 10,
		mass:1,

	},
	splits: {

		font: 100,
		fontFam: "'Titan One', cursive",
		alpha: 1,
		amount: 100,
		splitSize: 5,
		rotate: true,
		maxVelocity: 10,
		angMass: 100,
		angGrav: 5,

		continuousSpawn: true,
		randomSort:false,
		randomStart:false,
		spawnSpeed:10,

		gravity:0.5,
		mass:0.1,
		mouseRadius:0.5,
		mouseGravity:5,
		friction:0.5,
	},
	jitters: {
		fill: "rgba(50,100,50,0)",
		fill2: "rgba(100,150,100,0.02)",
		stroke: "rgba(0,0,0,0)",
		stroke2: "rgba(0,0,155,0.05)",
		fillInFront: true,
		gravity:0.99,
		speed:0.15,
		mouseGravity:0.25,
		tickSpeed:0.01,
		font:100,
		fontFam: "'Titan One', cursive",
		lineWidth:0.1,
		lineWidth2: 1,
		lineWidthVar:0.5,
		colorVar:1,
		extent:20,
		amount:30,

	},
	letters: {

		font:100,
		fontFam: "'Titan One', cursive",
		letterFill: "rgba(50,100,150,0.8)",
		letterStroke: "rgba(255,255,255,1)",
		letterLineWidth: 1,
		letterSize:2,

		
		mousePower:100,
		gravity:0.01,
		speed:1,
		friction:1,


		
		

	},
	lettersHanging: {
		circleFill: "rgba(0,0,155,1)",
		circleStroke: "rgba(0,0,255,0.5)",
		circleLineWidth: 2,

		font:100,
		fontFam: "'Titan One', cursive",
		letterFill: "rgba(0,0,0,0.8)",
		letterStroke: "rgba(255,255,255,1)",
		letterLineWidth: 1,
		letterSize:2,

		ropesStroke: "rgba(255,255,255,1)",
		ropesLineWidth: 4,
		
		mousePower:100,
		gravity:0.01,
		speed:1,
		friction:1,


		
		

	},
}
var updateAllDots = true;
var currentSpawned = 0;



function draw2() {
	//Randomly choose best dots to connect to get lowest MSE to original image.

	let mse = getMSEBetter(ctx, 0, 0, width, height);

	let rnd1 = Math.floor(Math.random() * points.length);
	let lowest = mse;

	let lowInd = 0;
	ctx.lineWidth = fontSize / 25;
	ctx.strokeStyle = "rgba(0,0,0,1)";
	for (let i = 0; i < points.length; i++) {
		if (i == rnd1) continue;
		let tmpCnv = document.createElement("canvas");
		tmpCnv.width = width;
		tmpCnv.height = height;
		let tmpCtx = tmpCnv.getContext("2d");
		tmpCtx.putImageData(ctx.getImageData(0, 0, width, height), 0, 0);
		tmpCtx.lineWidth = fontSize / 25;
		tmpCtx.strokeStyle = "rgba(0,0,0,1)";
		tmpCtx.beginPath();
		tmpCtx.moveTo(points[rnd1][2], points[rnd1][3]);
		tmpCtx.lineTo(points[i][2], points[i][3]);
		tmpCtx.stroke();
		tmpCtx.closePath();

		let newMSE = getMSEBetter(tmpCtx, 0, 0, width, height);
		console.log(newMSE,lowest);
		if (newMSE <= lowest) {
			ctx.beginPath();
			ctx.moveTo(points[rnd1][2], points[rnd1][3]);
			ctx.lineTo(points[i][2], points[i][3]);
			ctx.stroke();
			ctx.closePath();
			break;
			/*lowest = newMSE;
			lowInd = tmpCnv;*/
		}
	}
	/*if (lowInd) {
		ctx.clearRect(0,0,width,height);
		ctx.drawImage(lowInd,0,0,width,height);
	}*/
	window.requestAnimationFrame(draw2);
}

function getMSEBetter(ct, x, y, w, h) {
	try {
		let data1 = ct.getImageData(x, y, w, h).data;
		//let data2 = dt;
		let sum = 0;
		for (let i = 0; i < data1.length - 3; i += 4) {

			sum += Math.abs(data1[i] - dt.data[i]) + Math.abs(data1[i + 1] - dt.data[i + 1]) + Math.abs(data1[i + 2] - dt.data[i + 2] + Math.abs(data1[i + 3] - dt.data[i + 3]));
			/*sum += (Math.abs(data1[i + 1] - dt[i + 1]));
			sum += (Math.abs(data1[i + 2] - dt[i + 2]));*/
			//sum += (Math.abs(data1[i + 3] - data2[i + 3]));

		}
		return sum;
	} catch (e) {

		return 1E91;
	}
}
var gpu;
var points = [];

function getEdgeMap(cv, tol) {
	tol = tol || 4;
	let dt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
	let ndt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height);

	for (let i = 0; i < dt.length - 3; i += 4) {
		let dif = 0;
		for (let j = 1; j < 9; j++) {
			let pos = getPosForI(j, (i / 4) % cv.width, Math.floor((i / 4 / cv.width)));

			if (pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width) {
				let m1 = (dt[i] + dt[i + 1] + dt[i + 2]) / 3;
				let m2 = (dt[pos.col * 4 + width * 4 * pos.row] + dt[pos.col * 4 + width * 4 * pos.row + 1] + dt[pos.col * 4 + width * 4 * pos.row + 2]) / 3;

				dif += Math.abs(m1 - m2);

			}
		}
		dif = dif / tol;
		//console.log(dif);
		ndt.data[i] = dif;
		ndt.data[i + 1] = dif;
		ndt.data[i + 2] = dif;
		ndt.data[i+3] = 0;
		//ndt.data[i+3] = 20;
	}
	return ndt;
}
function getEdgeMapAlpha(cv, tol) {
	tol = tol || 4;
	let dt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;

	let ndt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height);
	let ar = new Uint8ClampedArray();
	
	for (let i = 0; i < dt.length - 3; i += 4) {
		/*ndt.data[i+0]=0;
		ndt.data[i+1]=0;
		ndt.data[i+2]=0;
		ndt.data[i+3]=0;*/
		let dif = 0;
		for (let j = 1; j < 9; j++) {
			let pos = getPosForI(j, (i / 4) % cv.width, Math.floor((i / 4) / cv.width));
			
			if (pos.row >= 0 && pos.row < cv.height && pos.col >= 0 && pos.col < cv.width) {
				
				let m1 = (dt[i] + dt[i + 1] + dt[i + 2]) / 3;
				let m2 = (dt[pos.col * 4 + width * 4 * pos.row] + dt[pos.col * 4 + width * 4 * pos.row + 1] + dt[pos.col * 4 + width * 4 * pos.row + 2]) / 3;

				dif += Math.abs(m1 - m2);

			}
		}
		if (dif > 100) {
			ndt.data[i] = 0;
			ndt.data[i + 1] = 0;
			ndt.data[i + 2] = 0;
			ndt.data[i + 3] = 255;
			
		} else {
			ndt.data[i + 0] = 255;
			ndt.data[i + 1] = 255;
			ndt.data[i + 2] = 255;
			ndt.data[i + 3] = 0;
		}
		//ndt.data[i+3] = 20;
	}

	let newC = createCanvas(cv.width,cv.height);
	newC.getContext("2d").putImageData(ndt,0,0);
	document.body.appendChild(newC);
	console.log("done");
	return ndt;
}
function getEdgeMapBlack(cv, tol) {
	tol = tol || 1;
	let dt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data;
	let ndt = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height);
	let ar = new Uint8ClampedArray();
	for (let i = 0; i < dt.length - 3; i += 4) {
		let dif = 0;
		for (let j = 1; j < 9; j++) {
			let pos = getPosForI(j, (i / 4) % cv.width, Math.floor((i / 4) / cv.width));
			
			if (pos.row >= 0 && pos.row < cv.height && pos.col >= 0 && pos.col < cv.width) {
				let m1 = (dt[i] + dt[i + 1] + dt[i + 2]) / 3;
				let m2 = (dt[pos.col * 4 + cv.width * 4 * pos.row] + dt[pos.col * 4 + cv.width * 4 * pos.row + 1] + dt[pos.col * 4 + cv.width * 4 * pos.row + 2]) / 3;

				dif += Math.abs(m1 - m2);

			}
			//dif += Math.abs(dt[i]   - dt[pos.x*4 + cv.width * 4 * pos.y + 1]);
			//dif += Math.abs(dt[i+1] - dt[pos.x*4 + cv.width * 4 * pos.y + 1]);
			//dif += Math.abs(dt[i+2] - dt[pos.x*4 + cv.width * 4 * pos.y + 1]);
			//dif += dt[i+3] - dt[pos.x*4 + cv.width * 4 * pos.y];
		}
		dif = dif / tol;
		//console.log(dif);
		ndt.data[i] = dif;
		ndt.data[i + 1] = dif;
		ndt.data[i + 2] = dif;
		//ndt.data[i+3] = 20;
	}
	for (let i = 0; i < ndt.data.length-3; i += 4) {
		ndt.data[i] = 255 - ndt.data[i];
		ndt.data[i + 1] = 255 - ndt.data[i + 1];
		ndt.data[i + 2] = 255 - ndt.data[i + 2];
		if (ndt.data[i] + ndt.data[i + 1] + ndt.data[i + 2] > 650) {
			ndt.data[i] = 0;
			ndt.data[i + 1] = 0;
			ndt.data[i + 2] = 0;
			ndt.data[i + 3] = 0;
		} else {
			ndt.data[i] = 255;
			ndt.data[i + 1] = 255;
			ndt.data[i + 2] = 255;
			ndt.data[i + 3] = 255;
		}
	}
	return ndt;
}








function roundRect(ctx, x, y, width, height, radius, fill, stroke, fs, ss, lw) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {
			tl: radius,
			tr: radius,
			br: radius,
			bl: radius
		};
	} else {
		var defaultRadius = {
			tl: 0,
			tr: 0,
			br: 0,
			bl: 0
		};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.fillStyle = fs;
	ctx.strokeStyle = ss;
	ctx.lineWidth = lw;
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
	ctx.closePath();

}


var mousePressed=false;
var mouseDown =false;
var mouseReleased=false;
function mouseClickMine(e) {
	
	mousePressed=true;
}
function mouseDownMine(e) {
	
	mouseDown=false;
}
function mouseUpMine(e) {
	console.log(e);
	mouseDown = false;
	mousePressed = false;
	mouseReleased = true;
}

function mouseMoveMine(e) {
	/*let rect = {left:0,top:0}
	if (e.target.tagName == "CANVAS") {
		rect = e.target.getBoundingClientRect();
	}*/
	
	mouseX = e.clientX;//e.pageX ;//- rect.left;
	mouseY = e.clientY;//e.pageY ;//- rect.top;

}

function keyDownMine(e) {
	let key = e.key;
	if (key == "ArrowDown") {
		downPressed = true;

	} else if (key == "ArrowUp") {
		upPressed = true;

	} else if (key == "ArrowLeft") {
		leftPressed = true;

	} else if (key == "ArrowRight") {
		rightPressed = true;

	} else if (key == "Digit1") {
		zoom = 1;
	} else if (key == "Digit2") {
		zoom = 2;
	} else if (key == " ") {
		spacePressed = true;
	} else if (key == "Shift") {
		shiftPressed = true;
	}
}

function keyReleaseMine(e) {

	if (e.key == "ArrowDown") {
		downPressed = false;

	} else if (e.key == "ArrowUp") {
		upPressed = false;

	} else if (e.key == "ArrowLeft") {
		leftPressed = false;

	} else if (e.key == "ArrowRight") {
		rightPressed = false;

	} else if (e.key == " ") {
		spacePressed = false;
	} else if (e.key == "Shift") {
		shiftPressed = false;
	}

}


function drawImage(Tctx, spriteSheet, thatImage, x, y, size, rot) {
	Tctx.save();
	Tctx.translate(x,
		y);
	Tctx.rotate(rot);
	Tctx.drawImage(
		images[spriteSheet].img,
		Math.floor(images[spriteSheet][thatImage].x),
		Math.floor(images[spriteSheet][thatImage].y),
		Math.floor(images[spriteSheet][thatImage].w),
		Math.floor(images[spriteSheet][thatImage].h), -Math.floor((images[spriteSheet][thatImage].w * size) / 2) + 0.5, -Math.floor((images[spriteSheet][thatImage].h * size) / 2) + 0.5,
		Math.floor(images[spriteSheet][thatImage].w * size) + 0.5,
		Math.floor(images[spriteSheet][thatImage].h * size) + 0.5);
	Tctx.restore();
}



function createDiv(id, className, w, h, t, l, mL, mT, abs) {
	let tmpDiv = document.createElement("div");
	tmpDiv.style.width = w;
	tmpDiv.style.height = h;
	tmpDiv.style.marginTop = mT;
	tmpDiv.style.marginLeft = mL;
	tmpDiv.id = id;
	tmpDiv.className = className;
	if (abs) {
		tmpDiv.style.position = "absolute";
	}
	return tmpDiv;
}

function createCanvas(w, h, mL, mT, id, className, L, T, abs) {

	let tmpCnv = document.createElement("canvas");
	tmpCnv.id = id;
	tmpCnv.className = className;
	tmpCnv.width = w;
	tmpCnv.height = h;
	tmpCnv.style.marginTop = mT + "px";
	tmpCnv.style.marginLeft = mL + "px";
	tmpCnv.style.top = L + "px";
	tmpCnv.style.left = T + "px";
	return tmpCnv;
}

function angle(p1x, p1y, p2x, p2y) {

	return Math.atan2(p2y - p1y, p2x - p1x);

}

function Distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}
var dummyContext = document.createElement("canvas");

function hslToRgbString(h, s, l, a) {
	// a = a || 1;
	a = Math.floor(a * 100) / 100;
	dummyContext.fillStyle = 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ' )';
	//str = (String) dummyContext.fillStyle;
	return dummyContext.fillStyle;
}
var shapeMons = 5;

function roughSizeOfObject(object) {

	var objectList = [];
	var stack = [object];
	var bytes = 0;

	while (stack.length) {
		var value = stack.pop();

		if (typeof value === 'boolean') {
			bytes += 4;
		} else if (typeof value === 'string') {
			bytes += value.length * 2;
		} else if (typeof value === 'number') {
			bytes += 8;
		} else if (
			typeof value === 'object' && objectList.indexOf(value) === -1
		) {
			objectList.push(value);

			for (var i in value) {
				stack.push(value[i]);
			}
		}
	}
	return bytes;
}

function getColor(n, a) {


	let h = n * 5 + Math.floor((n * 5) / shapeMons) * 55 + Math.floor(n * 5 / 100) * 30;
	let s = 3 * 50 + n * 5 - Math.floor(n * 5 / 5); //Math.floor(n/10);
	let l = 65 - n * 5 * 5 + Math.floor(n * 5 / 5) * 25; //Math.floor(n/10);
	return hslToRgbString(h, s, l, a);

}
var shadowStyles = {
	// http://simurai.com/post/802968365/css3d-css3-3d-text
	"Stereoscopic": {
		color: "#000",
		background: "#fff",
		shadow: "-0.06em 0 0 red, 0.06em 0 0 cyan"
	},
	// http://line25.com/articles/using-css-text-shadow-to-create-cool-text-effects
	"Neon": {
		color: "#FFF",
		background: "green",
		shadow: "0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.5), 0 0 70px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.5), 0 0 100px rgba(255,255,255,0.5), 0 0 150px rgba(255,255,255,0.5)"
	},
	"Anaglyphic": {
		color: "rgba(0,0,255,0.5)",
		background: "#fff",
		shadow: "3px 3px 0 rgba(255,0,180,0.5)"
	},
	"Vintage Radio": {
		color: "#707070",
		background: "#ddd",
		shadow: "2px 2px 0px #eee, 4px 4px 0px #666"
	},
	"Inset": {
		color: "#222",
		background: "#444",
		shadow: "0px 10px 50px #777"
	},
	// meinen kopf
	"Shadow": {
		color: "#444",
		background: "#444",
		shadow: "0 0 11px #000"
	},
	"Shadow ;)": {
		background: "#ddd",
		shadow: "0 0 11px #000"
	},
	// http://pgwebdesign.net/blog/3d-css-shadow-text-tutorial
	"Shadow3D": {
		color: "rgba(255,255,0,1)",
		background: "rgba(0,0,0,0)",
		shadow: "1px -1px rgba(255,0,0,0.1), 2px -2px rgba(205,0,0,0.5), 3px -3px rgba(155,0,0,0.1), 4px -4px rgba(105,0,0,0.1)"
	}
};

function drawShadowEffects(txt, ct, style, x, y) {
	function parseShadow(shadows) {
		shadows = shadows.split(", ");
		var ret = [];
		for (var n = 0, length = shadows.length; n < length; n++) {
			var shadow = shadows[n].split(" ");
			var type = shadow[0].replace(parseFloat(shadow[0]), "");
			if (type == "em") {
				var obj = {
					x: 1 * parseFloat(shadow[0]),
					y: 1 * parseFloat(shadow[1])
				};
			} else {
				var obj = {
					x: parseFloat(shadow[0]),
					y: parseFloat(shadow[1])
				};
			}
			if (shadow[3]) {
				obj.blur = parseFloat(shadow[2]);
				obj.color = shadow[3];
			} else {
				obj.blur = 0;
				obj.color = shadow[2];
			}
			ret.push(obj);
		}
		return ret;
	};
	ct.save();
	/*ct.font = "60px Futura, Helvetica, sans-serif";*/
	// absolute position of the text (within a translation state)
	var offsetX = 50;
	var offsetY = 62;
	// gather information about the height of the font

	// loop through text-shadow based effects



	var style = shadowStyles[style];

	// parse text-shadows from css
	var shadows = parseShadow(style.shadow);
	// loop through the shadow collection
	ct.fillText(text, x, y);
	var n = shadows.length;
	while (n--) {
		var shadow = shadows[n];
		var totalWidth = wd + shadow.blur * 2;
		ct.save();
		ct.beginPath();
		ct.rect(x - shadow.blur, y - ht, wd * 2, ht * 1.5);
		ct.clip();
		if (shadow.blur) { // just run shadow (clip text)
			ct.shadowColor = shadow.color;
			ct.shadowOffsetX = shadow.x;
			ct.shadowOffsetY = shadow.y;
			ct.shadowBlur = shadow.blur;
			ct.fillText(text, x, y);
		} else { // just run pseudo-shadow
			ct.fillStyle = shadow.color;
			ct.fillText(text, x + (shadow.x || 0), y - (shadow.y || 0));
		}
		ct.restore();
	}
	// drawing the text in the foreground
	/*if (style.color) {
		ctx.fillStyle = style.color;
		ctx.fillText(text, offsetX+x, offsetY + y);
	}*/


	ct.restore();
};
var getTextHeight = function(font, size,str) {
	str = str || "Hg";	
	var text = $('<span>'+str+'</span>').css({
		fontFamily: font,
		fontSize: size
	});

	var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

	var div = $('<div></div>');
	div.append(text, block);

	var body = $('body');
	body.append(div);

	try {

		var result = {};

		block.css({
			verticalAlign: 'baseline'
		});
		result.ascent = block.offset().top - text.offset().top;

		block.css({
			verticalAlign: 'bottom'
		});
		result.height = block.offset().top - text.offset().top;

		result.descent = result.height - result.ascent;

	} finally {
		div.remove();
	}

	return result;
};

function getPosForI(i, col, row) {

	let round = Math.ceil(Math.sqrt(i + 1));
	let base = round - round % 2 + 1;
	let end = Math.pow(base, 2) - 1;
	let start = Math.pow(base - 2, 2);
	let shortSide = ((end - start + 1) / 2 - 2) / 2;
	let longSide = shortSide + 2;
	let shift = Math.ceil(base / 2) - 1;
	i -= start;
	if (i < shortSide) {
		col += (-1) * shift;
		row += (Math.floor(shortSide / 2) - i); //()
	} else if (i < shortSide * 2) {
		i -= shortSide;
		col += (+1) * shift;
		row += (Math.floor(shortSide / 2) - i); //()
	} else if (i < shortSide * 2 + longSide) {
		i -= shortSide * 2;
		col += (Math.floor(longSide / 2) - i); //() 
		row += (-1) * shift;
	} else if (i < shortSide * 2 + longSide * 2) {
		i -= (shortSide * 2 + longSide);
		col += (Math.floor(longSide / 2) - i); //() 
		row += (+1) * shift;
	}
	return {
		row: row,
		col: col
	};
}
function findSideToTurn(ang1, ang2) {


    let dif = ang1 - ang2;
    if (dif < 0) {
        dif += Math.PI * 2;
    }
    if (dif > Math.PI) {

        return -1;
    } else {

        return 1;
    }

}

function createSliderInputDiv(id,className,styles,props,attributes,key,variable,reload) {
	let div = createDiv(id,className,styles,props,attributes);
	div.innerHTML="";
	div.style.paddingBottom = "5%";
	let lab = createDiv(id,className+"lab",styles,props,attributes);
	lab.style.width = "100%";
	let slid = createSlider(id+"slider",className+"slider",styles,props,attributes);
	slid.style.width = "60%";
	slid.style.float = "left";
	
	let inp = createTextInput(id+"txt",className+"txt",styles,props,attributes);
	inp.style.width = "30%";
	inp.style.marginLeft = "5%";
	inp.style.marginBottom = "5%";
	inp.style.float = "right";
	
	slid.addEventListener("change", function(e) {
			let val = parseFloat(slid.value);
			if (!isNaN(val)) {
				inp.value = val;
				window["settings"][key][variable] = val; 
				
			}
		});
	slid.addEventListener("input", function(e) {
			let val = parseFloat(slid.value);
			if (!isNaN(val)) {
				inp.value = val;
				window["settings"][key][variable] = val; 
				
			}
		});
	inp.addEventListener("change",function(e) {
			let val = parseFloat(inp.value);
			if (!isNaN(val)) {
				slid.value = parseFloat(val);
				window["settings"][key][variable] = val; 
				
			}
		});
	inp.addEventListener("input", function(e) {
			let val = parseFloat(inp.value);
			if (!isNaN(val)) {
				slid.value = parseFloat(val);
				window["settings"][key][variable] = val; 
				
			}
		});
	div.appendChild(lab);
	div.appendChild(slid);
	div.appendChild(inp);
	return div;

}
function createCheckboxDiv(id,className,styles,props,attributes,options,variable) {
	let div = createDiv(id,className,styles,props,attributes);
	div.innerHTML="";
	div.style.paddingBottom = "5%";
	
	let lab = createDiv(id,className+"lab",styles,props,attributes);
	lab.style.width = "100%";
	div.appendChild(lab);
	let wd = 100 / (1+Object.keys(options).length) || 20;

	for (key in options)  {
		let checkBox = createDiv(id+key,className+"Opt",{
			width:wd+"%",
		});
		let str = options[key];
		checkBox.innerHTML = options[key];
		if (options[key] == window[variable]) {
			$(checkBox).addClass('checked')
		}
		checkBox.addEventListener("click",function() {
			$("."+className+"Opt").removeClass("checked");
			$(checkBox).addClass("checked");
			window[variable]=str;

		})/*
		div.appendChild(checkboxLab);*/
		div.appendChild(checkBox);
	}

	
	

	return div;

}
/*let startEndTime = createDoubleSlider(id+"slider0","slider",{
		left:0+"%",
		width:100+"%",
		top:"0%",
		position:"relative",
	},{
		min:0,
		max:1,
		step:0.001,
		value:0.5,
	})*/
function createDoubleSlider(id,className,styles,props,attributes) {
	let wrap = createDiv(id,"gainNode",styles);
	props.min = props.min || 0;
	props.max = props.max || 1;
	props.step = props.step || 0.01;
	let dif = props.max - props.min;

	for (let key in styles) {
		wrap.style[key] = styles[key];
	}
	for (let key in props) {
		wrap[key] = props[key];
	}
	for (let key in attributes) {
		wrap.setAttribute(key,attributes[key]);
	}

	styles.left = "0px";
	styles.width = "100%";
	styles.position = "absolute";
	styles.top = "0px";
	props.value = Math.floor((props.min + dif * 0.25) / props.step )* props.step;
	props.defaultValue = Math.floor((props.min + dif * 0.25) / props.step )* props.step;
	let inp1 = createSlider(id+"0",className,styles,props,attributes);
	props.value = Math.floor((props.min + dif * 0.75) / props.step )* props.step;
	props.defaultValue = Math.floor((props.min + dif * 0.75) / props.step )* props.step;
	let inp2 = createSlider(id+"1",className,styles,props,attributes);
	wrap.appendChild(inp1);
	wrap.appendChild(inp2);
	inp1.addEventListener("change",function() {
		if (inp1.value >= inp2.value) {
			if (inp1.value+0.01 <= inp1.max) {
				inp2.value=inp1.value+0.01;
			} else {
				inp1.value = inp1.max-0.01;
				inp2.value = inp2.max;
			}
		}
	})
	inp2.addEventListener("change",function() {
		if (inp1.value >= inp2.value) {
			if (inp2.value-0.01 >= inp2.min) {
				inp1.value=inp2.value-0.01;
			} else {
				inp2.value = inp1.min+0.01;
				inp1.value = inp2.min;
			}
		}
	})
	return wrap;
}
function createSlider(id,className,styles,props,attributes) {
	let inp = document.createElement("input");
	inp.type = "range";
	inp.id = id;
	inp.className = className;
	for (let key in styles) {
		inp.style[key] = styles[key];
	}
	for (let key in props) {
		inp[key] = props[key];
	}
	for (let key in attributes) {
		inp.setAttribute(key,attributes[key]);
	}
	return inp;

}

    function createRadioInput(id,className,styles,props,attributes) {
    	let div = documentElement.createDiv(id,className,styles,props,attributes);
    	for (let key in opts) {

    		let rad = document.createElement("input");
    		rad.id = id + key;
    		rad.type = "radio";
    		rad.value = key;
    		rad.name = id;
			
			div.appendChild(opt);
			let lab = document.createElement("label");
			lab.innerHTML = opts[key];
			lab.setAttribute("for",id+key)
			div.appendChild(lab);
    	}
    	
	for (let key in styles) {
		div.style[key] = styles[key];
	}
	for (let key in props) {
		div[key] = props[key];
	}
	for (let key in attributes) {
		div.setAttribute(key,attributes[key]);
	}
	return div;
    }
function createTextInput(id,className,styles,props,attributes) {
	let inp = document.createElement("input");
	inp.type = "number";
	inp.id = id;
	inp.className = className;
	for (let key in styles) {
		inp.style[key] = styles[key];
	}
	for (let key in props) {
		inp[key] = props[key];
	}
	for (let key in attributes) {
		inp.setAttribute(key,attributes[key]);
	}
	return inp;

}
function createCheckbox(id,className,styles,props,attribute) {
	let check = document.createElement("input");
	check.type = "checkbox";
	for (let key in styles) {
		check.style[key] = styles[key];
	}
	for (let key in props) {
		check[key] = props[key];
	}
	if (attribute) {
		check.addEventListener("change",function(e) {
			if (e.srcElement.checked) {
				window[attribute]=true; 
			} else {
				window[attribute]=false;
			}

		})
		
	}
	return check;
}
function createDropDown(id, className, opts, styles, props, attributes) {
	let sel = document.createElement("select");
	sel.id = id;
	sel.className = className;
	for (let key in opts) {
		let opt = document.createElement("option");
		opt.value = key;
		opt.innerHTML = opts[key]
		sel.appendChild(opt);
	}
	for (let key in styles) {
		sel.style[key] = styles[key];
	}
	for (let key in props) {
		sel[key] = props[key];
	}
	for (let key in attributes) {
		sel.setAttribute(key,attributes[key]);
	}
	return sel;
}
function createDiv(id, classNames, styles, props, attributes) {
	let div = document.createElement("div");
	div.id = id;
	div.className = classNames;
	for (let key in styles) {
		div.style[key] = styles[key];
	}
	for (let key in props) {
		div[key] = props[key];
	}
	for (let key in attributes) {
		div.setAttribute(key,attributes[key]);
	}
	return div;
}