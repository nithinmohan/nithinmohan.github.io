var canvas=$("#canvas")[0];
canvas.width=$(window).width();
canvas.height=$(window).height();
var ctx=canvas.getContext('2d');
var canvasw=canvas.width;
var canvash=canvas.height;
$cos=Math.cos;
$sin=Math.sin;
$pi=Math.PI;
var colorsarray=["#ec483b","#046678","#48274f","#020229","#a20b2e","#3a9c61"];//line colors are selected from this array
var lineobjects=[];//stores all line objects

// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
var getindex=function(line)
{
	var i=0;
	for(var a in lineobjects)
	{
		if(lineobjects[a]==line)
			return i;
		i++;
	}
}
var cos=function(angle)
{
return $cos(angle/180*$pi);
}
var sin=function(angle)
{
return $sin(angle/180*$pi);
}
var drawline=function(startx,starty,length,angle,color)//draws a line with the given parameters
{
	/*var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	p = "rgba("+r+", "+g+", "+b+", 0.5)";
	var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
		gradient.addColorStop(0, "white");
		gradient.addColorStop(0.4, "white");
		gradient.addColorStop(0.4, p);
		gradient.addColorStop(1, "black");
		
		ctx.fillStyle = gradient;*/
		/*var grad= ctx.createLinearGradient(startx,starty,startx+cos(angle)*length,starty-sin(angle)*length);
		grad.addColorStop(0, color1);
		grad.addColorStop(0.5, color1);
		//grad.addColorStop(0.2, "");
		/*
		grad.addColorStop(0.4, "yellow");
		grad.addColorStop(0.6, "pink");
		grad.addColorStop(0.8, "violet");*/
		//grad.addColorStop(1, color2);

	ctx.strokeStyle = color;
	ctx.shadowColor = color;
      ctx.shadowBlur = 40;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
	ctx.beginPath();
	ctx.moveTo(startx,starty);
	ctx.lineCap="round";
	ctx.lineWidth=7;
	ctx.lineTo(startx+cos(angle)*length,starty-sin(angle)*length);
    ctx.stroke();
    var end={
    	x:startx+cos(angle)*length,
    	y:starty-sin(angle)*length
    }
    return end;
}//returns the end position of the drawn line
var endcondition=function(x,y)
{
	if(x<0 || x>canvasw)
		return 1;
	else if(y<0 || y>canvash)
		return 2;
	else if(((x-canvasw/2)*(x-canvasw/2)+(y-canvash/2)*(y-canvash/2))<225*225)
		return 3;
}//conditions for reflection
//for reflection we are ending the animation of the current line and we make a new line with the reflected angle
var line=Class.extend({
	 startx:0,
	 starty:0,
	 linelength:0,
	 angle:0,
	 maxlength:60,
	 speed:8,
	 endreached:false,
	 interval:null,
	 endx:0,
	 endy:0,
	 linecolor:0,
	 earlylimit:null,
	 safex:null,
	 safey:null,
	 changeangle:function(newang)
	 {
	 	this.angle=newang;
	 },
	init:function(constructor){
		if(!constructor)//for first time we want it to be created at random or at a specific point
		{
	this.startx=canvasw;//Math.random()*canvasw>>0;
	this.starty=canvash;//Math.random()*canvash>>0;
	//this.linelength=Math.random()*20+20;
	this.angle=Math.random()*360;
	/*var r = Math.random()*255>>0;
	var g = Math.random()*255>>0;
	var b = Math.random()*255>>0;
	var p = "rgba("+r+", "+g+", "+b+", 1)";*/
	//var p=Math.random()*6>>0;
	this.linecolor=colorsarray.pop();
	}
	else
	{
		this.startx=constructor.startx;
		this.starty=constructor.starty;
		//this.linelength=constructor.linelength;
		if(constructor.angle)
		this.angle=constructor.angle;
		this.linecolor=constructor.linecolor;
	}
	//this.interval=setInterval(function(){that.animate()},25);
	//
  //	alert("sdf");
	},
  
	 draw:function(){//draw function will draw the next frame of animation of a this line object
	//alert(this.starty);
	//ctx.clearRect(0,0,canvas.width,canvas.height);
    //console.log(this.startx,this.starty,this.length,this.angle,this.angle/180*$pi,this.arrayindex);
	var end;
	this.safex=this.endx;//these are to avoid trapping condition,new line has to be created at a point which is not an end condition,safex and safey will store the latest safe position
	this.safey=this.endy;
	//endreached variable are used to detect whether the line has encountered a boundary condition
	//startxa and starty are the back side of the line. we will check the endx and endy at each frame for boundary condition
	//if boundary condition has reached we will make end reached as true
	//there are basically three types of animation
	//1) it will grow till maxlength is reached, fixed start there, length will change
	//2) it will translate, fixed length there, start will change
	//3) it will end, length and start will change
	//a forth special case is there where end will reach even before line grows to max length
	//there we are waiting till what it would have taken to complete but with out changing anu=y values
	if(this.endreached&&(this.linelength<this.maxlength))
	{
		if(!this.earlylimit)
		{
			this.earlylimit=this.linelength;
		}
		this.startx+=cos(this.angle)*this.speed;
		this.starty-=sin(this.angle)*this.speed;
		this.linelength-=this.speed;
		end=drawline(this.startx,this.starty,this.earlylimit,this.angle,this.linecolor);
	}
	else if(this.endreached&&(this.linelength>=this.maxlength))
	{
		this.linelength-=this.speed;
		end=drawline(this.startx,this.starty,this.linelength,this.angle,this.linecolor);
	}
	else if(this.linelength>this.maxlength)
	{
		this.startx+=cos(this.angle)*this.speed;
		this.starty-=sin(this.angle)*this.speed;
		end=drawline(this.startx,this.starty,this.maxlength,this.angle,this.linecolor);
	}
	else
	{
		this.linelength+=this.speed;
		end=drawline(this.startx,this.starty,this.linelength,this.angle,this.linecolor);
	}
	this.endx=end.x;
	this.endy=end.y;
	var endstate=endcondition(end.x,end.y);
	if(endstate && this.endreached==false)
	{
		this.endreached=true;
		if(endstate==1)
		{
		var constructor={
			startx:this.safex,
			starty:this.safey,
			angle:180-this.angle,
			linecolor:this.linecolor
		}
	}
		else if(endstate==2)
		{
			var constructor={
			startx:this.safex,
			starty:this.safey,
			angle:360-this.angle,
			linecolor:this.linecolor
		}
		}
		else if(endstate==3)
		{
			var tangentangle=Math.atan2(canvasw/2-end.x,canvash/2-end.y)/$pi*180;
			var constructor=
			{
				startx:this.safex,
			starty:this.safey,
			angle:2*tangentangle-this.angle,
			linecolor:this.linecolor
			}
		}
		var line1=new line(constructor);
		lineobjects.push(line1);
		//console.log(getindex(line1));
		//console.log("*****"+this.arrayindex);
	}
	if(endstate==endcondition(this.startx,this.starty) && this.endreached==true)
	{
		lineobjects.splice(getindex(this),1);
		/*var constructor={
			startx:this.startx,
			starty:this.starty,
			angle:90-this.angle
		}
		var line1=new line(constructor,this.arrayindex);
		line1.animate();
		lineobjects[i]=line1;*/

	}//removes the line from array once the start also reaches the end condition,make sure it comes after the end has reached the end condition(using endreached flag)
}
})
var animate=function()
{
	requestAnimFrame(animate);
	//\ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.globalCompositeOperation = 'source-over';
	// decrease the alpha property to create more prominent trails
	ctx.globalAlpha=.15;
	ctx.fillStyle = '#e7e7e7';
	ctx.shadowColor = 'white';
	ctx.shadowBlur = 0;
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.fillRect( 0, 0, canvasw, canvash );
	ctx.globalAlpha=.9;
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	//ctx.globalCompositeOperation = 'lighter';
		//ctx.globalCompositeOperation = "lighter";
		

		for(var i in lineobjects)
		{
			lineobjects[i].draw();
		}
}
$('body').click(function(e){
	//alert("dsf");
	for(var i in lineobjects)
		{
			k=lineobjects[i];
			
			if(!k.endreached)
			{
				newangle=(Math.atan2((k.starty-e.pageY),(e.pageX-k.startx))/$pi*180);
			console.log(newangle);
				k.changeangle(newangle);
			}
		}
})
/*$('body').mousedown(function(e){
	//alert("dsf");
	for(var i in lineobjects)
		{
			k=lineobjects[i];
			
			if(!k.endreached)
			{
				newangle=(Math.random()*360);
			console.log(newangle);
				k.changeangle(newangle);
			}
		}
})*/
var gameloop=function()
{
for(i=0;i<6;i++)
{
 var line1=new line(null,i);
 lineobjects.push(line1);
}
	requestAnimFrame(animate);
}
gameloop();
/*ctx.beginPath();
    ctx.moveTo(25,25);
    ctx.lineTo(105,25);
    ctx.lineTo(25,105);
    ctx.fill()*/