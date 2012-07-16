gui_effect_id=0;
Effects=new Object();

gui_object_id=0;
GUIObjects=new Object();

function DTimer(interval, options){
	if(!interval||interval<=0)
		this.interval=1000;
	else
		this.interval=interval;
	gui_object_id++;
	this.id="timer_"+gui_object_id;
	GUIObjects[this.id]=this;
	
	this.enabled=false;
	
	this.process=DTimerProcess;
	this.start=DTimerStart;
	this.stop=DTimerStop;
	
	//---События---
	this.onTimerStart=function(){};
	this.onTimer=function(){};
	this.onTimerStop=function(){};
		
	if(options){
		if(options.onTimerStart)
			this.onTimerStart=options.onTimerStart;	
		if(options.onTimer)
			this.onTimer=options.onTimer;
		if(options.onTimerStop)
			this.onTimerStop=options.onTimerStop;
	}
}

function DTimerProcess(){
	if(this.enabled==true){
		setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
		this.onTimer();
	}
}

function DTimerStart(){
	this.enabled=true;
	this.onTimerStart();
	setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
}

function DTimerStop(){
	this.enabled=false;
	this.onTimerStop();
}
//------------------------------------------------------------------------------------------

function DEffectDisappear(ent,options){
	ef=new DTimer(40);
	ef.ent=ent;
	ef.to=0;
	ef.speed=2;
	
	ef.onEffectStart=function(){};
	ef.onEffectStop=function(){};
		
	if(options){
		if(options.to)
			ef.to=options.to;
		if(options.interval)
			ef.interval=options.interval;
		if(options.speed)
			ef.speed=options.speed;
		if(options.onEffectStart)
			ef.onEffectStart=options.onEffectStart;	
		if(options.onEffectStop)
			ef.onEffectStop=options.onEffectStop;
	}
	
	ef.onTimerStart=function(){
		this.onEffectStart();
	}
	
	ef.onTimer=function(){
		if(this.ent.alpha>this.speed+this.to){
			this.ent.alpha-=this.speed;
			this.ent.DAlpha(this.ent.alpha);
		}
		else{
			this.stop();
			this.ent.DAlpha(this.to);
		}
	}
	
	ef.onTimerStop=function(){
		this.onEffectStop();
	}
	return ef;
}

function DEffectAppear(ent,options){
	ef=new DTimer(40);
	ef.ent=ent;
	ef.to=100;
	ef.speed=2;
	
	ef.onEffectStart=function(){};
	ef.onEffectStop=function(){};
		
	if(options){
		if(options.to)
			ef.to=options.to;
		if(options.interval)
			ef.interval=options.interval;
		if(options.speed)
			ef.speed=options.speed;
		if(options.onEffectStart)
			ef.onEffectStart=options.onEffectStart;	
		if(options.onEffectStop)
			ef.onEffectStop=options.onEffectStop;
	}
	
	ef.onTimerStart=function(){
		this.onEffectStart();
	}
	
	ef.onTimer=function(){
		if(this.ent.alpha<this.to-this.speed){
			this.ent.alpha+=this.speed;
			this.ent.DAlpha(this.ent.alpha);
		}
		else{
			this.stop();
			this.ent.DAlpha(this.to);
		}
	}
	
	ef.onTimerStop=function(){
		this.onEffectStop();
	}
	return ef;
}
//------------------------------------------------------------------------------------------
function DEffect(){
	//this.status="stop";
	gui_effect_id++;
	this.id="effect_"+gui_effect_id;
	Effects[this.id]=this;
	
	this.DStop=DEffectStop;
	//this.DAlphaAnimate=DAlphaAnimate;
}

function DEffectStop(){
	this.status="stop";
}

function Disappear(ent, delay){
	if(!delay) delay=20;
	ef = new DEffect();
	ef.ent=ent;
	ef.status="process";
	ef.DAlphaAnimate=DAlphaAnimate;
	
	msg.innerHTML+=ef.id+"-"+ef.ent.id+"-"+Effects[ef.id].id+"<br>";
	
	ef.DAlphaAnimate(ef.ent.alpha, 0, delay);
	return ef;
}

function Appear(ent, delay){
	if(!delay) delay=20;
	ef = new DEffect();
	ef.ent=ent;
	ef.status="process";
	ef.DAlphaAnimate=DAlphaAnimate;
	
	//msg.innerHTML+=ef.id+"-"+ef.ent.id+"-"+Effects[ef.id].id+"<br>";
	
	ef.DAlphaAnimate(ef.ent.alpha, 100, delay);
	return ef;
}

function DAlphaAnimate(alpha_from, alpha_to, delay){
	if(this.ent.alpha >= alpha_to && this.ent.alpha <= alpha_from)
	{
		//this.ent.innerHTML+="-d"+"<br>";
		if(this.status!="process"||this.ent.alpha <= alpha_to)
		{
			return true;
		}
		this.ent.alpha=this.ent.alpha-2;
		this.ent.DAlpha(this.ent.alpha);
		//setTimeout,setInterval
		setTimeout("Effects['"+this.id+"'].DAlphaAnimate("+alpha_from+", "+alpha_to+", "+delay+")", delay);
	}
	
	if(this.ent.alpha <= alpha_to && this.ent.alpha >= alpha_from) 
	{
		//this.ent.innerHTML+="-a"+"<br>";
		if(this.status!="process"||this.ent.alpha >= alpha_to)
		{
			return true;
		}
		this.ent.alpha=this.ent.alpha+2;
		this.ent.DAlpha(this.ent.alpha);
		setTimeout("Effects['"+this.id+"'].DAlphaAnimate("+alpha_from+", "+alpha_to+", "+delay+")", delay);
	}
}