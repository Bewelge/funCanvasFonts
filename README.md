# Fun Canvas Fonts

## Collection of Experimental Font Rendering Techniques on HTML5 Canvas

Currently features four different techniques of rendering Fonts on Canvas.

**Please note that these are quite experimental and often computationally demanding techniques. They might significantly slow down your App if used.**

 ### Dots
 
 ![dotImg](https://github.com/Bewelge/funCanvasFonts/blob/master/Dots.png?raw=true)
 
 
 ### Splits
 
 ![splitImg](https://github.com/Bewelge/funCanvasFonts/blob/master/Splits.png?raw=true)
 
 
 ### Jitter
 
 ![jitterImg](https://github.com/Bewelge/funCanvasFonts/blob/master/jitter.png?raw=true)
 
 
 ### SVG Path ( Uses OpenFont.js )
 
 ![SVGImg](https://github.com/Bewelge/funCanvasFonts/blob/master/SvgPath.png?raw=true)

### Hanging Letters

![hangingImg](https://github.com/Bewelge/funCanvasFonts/blob/master/hangin.png?raw=true)



## Usage:

### Dots:

Initiate with `initDots( text, opts)`

`text` - The text to write.

`opts` is an Object that can include:

* font: `Integer` - The font size (Integer)

* stroke:`Boolean` - Whether to stroke text or not

* fill: `Boolean` - Whether to fill text or not

* fillStyle: `Color`

* strokeStyle: `Color`

* lineWidth: `Float` - Width of Stroke

* radius: `Float` - radius of dots

* margin: `Float` - How close the dots are to one another

* parseColors: `Boolean` - Whether or not dots take color of underlying text (otherwise always black)

* gravity: `Float` - With how much force dots return to correct spot.

* mass: `Float` - Heaviness of dots

* mouseGravity: `Float` - Force of mouse

* randomSpeed: `Float` - Randomizes how much dots are affected by mouse / gravity

* randomSort: `Boolean` - sorts dots randomly (only noticeable if randomStart is `true`)

* randomStart: `Boolean` - whether dots start at random point 

* continuousSpawn: `Boolean` - Whether all dots spawn at once or not

* spawnSpeed: `Integer` - How many dots spawn per tick (only noticeable in connection with continuousSpawn)

* cacheImg: `Boolean` - Whether to save dots as Images (instead of rendering with context.rect() everytime)


### Splits

Initiate with `initSplits(text, opts)`

`text` - the text to render

`opts` - Object that can include:

* font: `Integer` - Fontsize

* fill: `color`

* splitSize: `Float` - How big the splits are.

* gravity: `Float` - With how much force splits return to correct spot.

* mass: `Float` - Heaviness of splits

* angMass: `Float` - Angular heaviness of splits

* mouseGravity: `Float` - Force of mouse

* randomSpeed: `Float` - Randomizes how much dots are affected by mouse / gravity

* randomSort: `Boolean` - sorts dots randomly (only noticeable if randomStart is `true`)

* randomStart: `Boolean` - whether dots start at random point 

* continuousSpawn: `Boolean` - Whether all dots spawn at once or not

* spawnSpeed: `Integer` - How many dots spawn per tick (only noticeable in connection with continuousSpawn)
