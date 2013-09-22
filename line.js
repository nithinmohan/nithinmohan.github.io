var canvas=$("#canvas")[0];
var ctx=canvas.getContext('2d');
var windowx=$("#canvas").width();
var windowy=$("#canvas").height();
$cos=Math.cos;
$sin=Math.sin;
$pi=Math.PI;
var lineobjects={};

var cos=function(angle)
{
return $cos(angle/180*$pi);
}
var sin=function(angle)
{
return $sin(angle/180*$pi);
}
var drawline=function(startx,starty,length,angle)
{
	ctx.beginPath();
	ctx.moveTo(startx,starty);
	ctx.lineTo(startx+cos(angle)*length,starty-sin(angle)*length);
    ctx.stroke();
    var end={
    	x:startx+cos(angle)*length,
    	y:starty-sin(angle)*length
    }
    return end;
}
var endcondition=function(x,y)
{
	if(x<0 || x>302)
		return 1;
	else if(y<0 || y>152)
		return 2;
}
var line=Class.extend({
	 startx:0,
	 starty:0,
	 linelength:0,
	 angle:0,
	 maxlength:60,
	 speed:2,
	 endreached:false,
	 interval:null,
	 arrayarrayindex:0,
	init:function(constructor,arrayindex){
		if(!constructor)
		{
	this.startx=Math.random()*windowx>>0;
	this.starty=Math.random()*windowy>>0;
	//this.linelength=Math.random()*20+20;
	this.angle=Math.random()*360;
	this.arrayindex=arrayindex;
	}
	else
	{
		this.startx=constructor.startx;
		this.starty=constructor.starty;
		//this.linelength=constructor.linelength;
		if(constructor.angle)
		this.angle=constructor.angle;
	}
	var that=this;
	this.interval=setInterval(function(){that.animate()},25);
	//
  //	alert("sdf");
	},
  
	 animate:function(){
	//alert(this.starty);
	//ctx.clearRect(0,0,canvas.width,canvas.height);
    console.log(this.startx,this.starty,this.length,this.angle,this.angle/180*$pi,this.arrayindex);
	var end;
	if(this.endreached)
	{
		this.startx+=cos(this.angle)*this.speed;
		this.starty-=sin(this.angle)*this.speed;
		this.linelength-=this.speed;
		end=drawline(this.startx,this.starty,this.linelength,this.angle);
	}
	else if(this.linelength>this.maxlength)
	{
		this.startx+=cos(this.angle)*this.speed;
		this.starty-=sin(this.angle)*this.speed;
		end=drawline(this.startx,this.starty,this.maxlength,this.angle);
	}
	else
	{
		this.linelength+=this.speed;
		end=drawline(this.startx,this.starty,this.linelength,this.angle);
	}
	var endstate=endcondition(end.x,end.y);
	if(endstate && this.endreached==false)
	{
		this.endreached=true;
		if(endstate==1)
		{
		var constructor={
			startx:end.x,
			starty:end.y,
			angle:180-this.angle
		}
	}
		else if(endstate==2)
		{
			var constructor={
			startx:end.x,
			starty:end.y,
			angle:360-this.angle
		}
		}
		var line1=new line(constructor,this.arrayindex);
		//console.log("*****"+this.arrayindex);
	}
	if(endstate==endcondition(this.startx,this.starty) && this.endreached==true)
	{
		clearInterval(this.interval);
		
		/*var constructor={
			startx:this.startx,
			starty:this.starty,
			angle:90-this.angle
		}
		var line1=new line(constructor,this.arrayindex);
		line1.animate();
		lineobjects[i]=line1;*/

	}
}
})
var gameloop=function()
{
	setInterval(function()
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
	},50)
for(i=0;i<50;i++)
{
 lineobjects[i]=new line(null,i);
}
}
gameloop();
/*ctx.beginPath();
    ctx.moveTo(25,25);
    ctx.lineTo(105,25);
    ctx.lineTo(25,105);
    ctx.fill()*/