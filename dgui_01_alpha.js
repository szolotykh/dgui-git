//Глобальные переменные
gui_frame_id=0;

gui_object_id=0;//Id объектов
GUIObjects=new Object();//Ссылки на объекты через id

gui_drag=false;
gui_drop=false;

//MouseX = 0;
//MouseY = 0;

//Константы
//DGUI_SPEED_MOVE = 20;
DGUI_BROWSER=DGetBrowser();
DGUI_DRAG_ZINDEX=1000;//zIndex фрейма при drag
DGUI_EMPTY_FUNCTIONS=function(){};

DGUIStyleObject={
	x: "left",
	y: "top",
	w: "width",
	h: "height",
	bColor: "backgroundColor",
	mTop: "marginTop",
	mBottom:"marginBottom",
	mLeft:"marginLeft",
	mRight:"marginRight"
};

////////////////КЛАССЫ////////////////////

/////////////////ВСПОМОГАТЕЛЬЫЕ ФУНКЦИИ//////////////////
//Функция запрещает кэширование в Opera
function DCacheOff(){return "rnd="+Math.random();}
//Получение типа используемого браузера
function DGetBrowser(){
	// Получим userAgent браузера и переведем его в нижний регистр
	var ua = navigator.userAgent.toLowerCase();
	var browser_tmp;
	
	// Определим Internet Explorer<span id="more-46"></span>
	if ((ua.indexOf("msie") != -1) && (ua.indexOf("opera") == -1) && (ua.indexOf("webtv") == -1)) browser_tmp = "IE";
	// Opera
	if(ua.indexOf("opera") != -1) browser_tmp = "Opera";
	// Gecko = Mozilla + Firefox + Netscape
	if(ua.indexOf("gecko") != -1) browser_tmp = "Gecko";
	// Safari, используется в MAC OS
	if( (ua.indexOf("safari") != -1)) browser_tmp = "Safari";
	// Konqueror, используется в UNIX-системах
	if(ua.indexOf("konqueror") != -1) browser_tmp = "Konqueror";
	
	return browser_tmp;
}
//////////////////ВСПОМОГАТЕЛЬНЫЕ КЛАССЫ////////////////////////
//DList
function DArray(){
    this.array = new Array();
    this.length = 0;

	this.add = function(str){
		this.array[this.length]=str;
		this.length++;
		return true;
	};
	this.del = function(ind){//Delete
		if(ind<0&&ind>=this.length)
			return false;
		for(var i=ind;i<this.length-1;i++){
			this.array[i]=this.array[i+1];
		}
		this.array[this.length-1]=0;
		this.length--;
		return true;
	};
	this.clin = function(){
		this.array=0;
		this.array=new Array();
		this.length=0;
		return true;
	};
	this.getIndex = function(str){
		var ind=-1;
		for(var i=0;i<this.length;i++){
			if(this.array[i]==str){
				ind=i;
				break;
			}
		}
		return ind;
	};
	this.insertBefore = function(str,ind){
		if(ind<0&&ind>=this.length)
			return false;
		for(var i=this.length-1;i>=ind;i--){
			this.array[i+1]=this.array[i];
		}
		this.array[ind]=str;
		this.length++;
		return true;
	};
	this.rev = function(){//Reverse
		for(var i=0;i<this.length/2;i++){
			var buf=this.array[i];
			this.array[i]=this.array[this.length-i-1];
			this.array[this.length-i-1]=buf;
		}
		return true;
	};
	this.replace=function(ind,to){
		if(to>=this.length||ind>=this.length)
			return false;
		if(ind==to)
			return true;
		var itemInd=this.array[ind];
		if(to<ind){
			for(var i=ind;i>to;i--){
				this.array[i]=this.array[i-1];
			}
		}
		if(to>ind){
			for(var i=ind;i<to;i++){
				this.array[i]=this.array[i+1];
			}
		}
		this.array[to]=itemInd;
	};
}
//Создаёт объект типа DStyle. style_1 = new DStyle({width:150, height:37});
function DStyle(style){
	for(name in style){
		this[name]=style[name];
	}
}
//TIMER
function DTimer(interval, options){
	if(!options)
		var options=new Object();
	if(!interval||interval<=0)
		this.interval=1000;
	else
		this.interval=interval;
	gui_object_id++;
	this.id="timer_"+gui_object_id;
	GUIObjects[this.id]=this;
	this.enabled=false;
	this.process=function(){
		if(this.enabled==true){
			setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
			this.onTimer();
		}
	}
	this.start=function(){
		this.enabled=true;
		this.onTimerStart();
		setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
	}
	this.stop=function(){
		this.enabled=false;
		this.onTimerStop();
	}
	//---События---
	this.onTimerStart=options.onTimerStart||DGUI_EMPTY_FUNCTIONS;
	this.onTimer=options.onTimer||DGUI_EMPTY_FUNCTIONS;
	this.onTimerStop=options.onTimerStop||DGUI_EMPTY_FUNCTIONS;
}
////////////////////////Функции для работы с HTML элементами///////////////////////////

//Значение X координаты элемента
function DGetX(ent){return 	parseInt(ent.style.left);}
//Значение Y координаты элемента
function DGetY(ent){return	parseInt(ent.style.top);}
//Значение ширины/длины фрейма
function DGetWidth(ent){return parseInt(ent.style.width);}
//Значение высоты фрейма
function DGetHeight(ent){return parseInt(ent.style.height);}
//Значение по оси Z фрейма
function DGetZ(ent){return parseInt(ent.style.zIndex);}
//Устанавливаем X координату фрейма
function DSetX(ent,x){ent.style.left = x;}
//Устанавливаем Y координату фрейма
function DSetY(ent,y){ent.style.top = y;}
//Значение ширины/длины фрейма
function DSetWidth(ent,width){ent.style.width = width;}
//Значение высоты фрейма
function DSetHeight(ent,height){ent.style.height = height;}
//Значение по оси Z фрейма
function DSetZ(ent,zindex){ent.style.zIndex = zindex;}

function DGetAlpha(ent){return 	parseInt(ent.style.alpha);}

//Изменение размера фрейма
function DSetSize(ent, width, height, inc){
	if(!inc) inc = "px";
	ent.style.width = width + inc;
	ent.style.height = height + inc;
}

//Изменение видимости фрейма
function DHide(ent){ent.style.display = "none";}
function DShow(ent){ent.style.display = "block";}
//Прозрачность фрейма
function DSetAlpha(ent, alpha){
	ent.alpha = alpha;
	alpha_ = alpha/100.0;
	//Для Opera, Mozilla
	ent.style.opacity = alpha_;
	//Для IE
	//this.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
	//Вариант для IE был рассширен
	//см. http://www.tigir.com/opacity.htm
	if(DGUI_BROWSER=="IE"){
	  var oAlpha = ent.filters['DXImageTransform.Microsoft.alpha'] || ents.filters.alpha;
	  if (oAlpha)
		oAlpha.opacity = alpha;
	  else 
		ent.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
	}
}

//Цвет фрейма
function DSetColor(ent, color){ent.style.backgroundColor = color;}
function DSetColorText(ent, color){ent.style.color = color;}
//Изменение положения фрейма
function DSetPosition(ent, x, y){ent.style.left = x+"px";ent.style.top = y+"px";}
//Движение фрейма
function DMove(ent, dx, dy){DSetPosition(ent, DGetX(ent)+dx, DGetY(ent)+dy);}

function DSetImageToElement(ent,image_src, repeat_bool){
	var repeat=(repeat_bool)?"repeat":"no-repeat";
	ent.style.backgroundImage = "url(" + image_src + ")";
	ent.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
}
//Устанавливаем className для фрейма
function DSetClassName(ent,className){ent.className = className;}
//Получаем className фрейма
function DGetClassName(ent){return ent.className;}
//Устанавливает стиль
function DSetStyle(ent, style){
	if(!style)
		return false;
	for(name in style){
		for(name in style){
			if(DGUIStyleObject[name])
				ent.style[DGUIStyleObject[name]]=style[name];
			else
				ent.style[name]=style[name];
		}
	}
}
//Возвращает значение однго из свойств стиля
function DGetStyle(ent, name){return ent.style[name];}

/////////////////БАЗОВЫЕ ФУНКЦИИ И КЛАССЫ//////////////////

//Создание основы окна (фрейм)
function DFrame(style){
	ent=document.createElement("div");
    ent.act=true;
    ent.alpha=1.0;
	ent.mouseover=false;
    
    gui_frame_id++;
    ent.id="frame_"+gui_frame_id;
    
    ent.style.position="absolute";
	
    ent.style.left="0px";
    ent.style.top="0px";
	ent.style.display="block";
	ent.style.overflow="visible";
	if(style)
		DSetStyle(ent,style);
	
	document.body.appendChild(ent);
	//Значение X координаты фрейма
	ent.getX=function(){return parseInt(this.style.left);};
	//Значение Y координаты фрейма
	ent.getY=function(){return parseInt(this.style.top);};
	//Значение ширины/длины фрейма
	ent.getWidth = function(){return parseInt(this.style.width);};
	//Значение высоты фрейма
	ent.getHeight = function(){return parseInt(this.style.height);};
	//Устанавливаем X координату фрейма
	ent.setX=function(x){this.style.left=x;};
	//Устанавливаем Y координату фрейма
	ent.setY=function(y){this.style.top=y;};
	//Устанавливаем значение ширины/длины фрейма
	ent.setWidth = function(width){this.style.width = width;};
	//Устанавливаем значение высоты фрейма
	ent.setHeight = function(height){this.style.height = height;};
	//Значение по оси Z фрейма
	ent.getZ = function(){return parseInt(this.style.zIndex);};
	////Устанавливаем значение по оси Z фрейма
	ent.setZ = function(zindex){this.style.zIndex = zindex;};
	ent.getAlpha = function(){return parseInt(this.alpha);};
	
	ent.alpha=100;
	//Расположение фрейма относительно другого фрейма
	ent.setAlignToFrame = function(frm_parent, align){
		if(align == "center"){
			frm_parent.align = "center";
			this.setPosition(frm_parent.DGetWidth()/2 - this.getWidth()/2,
				frm_parent.getHeight()/2 - this.getHeight()/2);
			return(true);
		}
		if(align == "center_up"){
			frm_parent.align = "center";
			this.DPosition(frm_parent.getWidth()/2 - this.getWidth()/2, 10);
			return(true);
		}
	};
	
	//Изменение размера фрейма
	ent.setSize = function(width, height, inc){
		if(!inc) inc = "px";
		this.style.width = width + inc;
		this.style.height = height + inc;
	};
	ent.setPosition = function(x, y){this.style.left = x+"px";this.style.top = y+"px";};
	//Изменение видимости фрейма
	ent.hide = function(){
		this.act = false;//<------------------------------!!!!
		this.style.display = "none";
	};
	ent.show = function(){
		this.act = true;//<------------------------------!!!!
		this.style.display = "block";
	};
	//Прозрачность фрейма
	ent.setAlpha = function(alpha){
		this.alpha = alpha;
		alpha_ = alpha/100.0;
		//Для Opera, Mozilla
		this.style.opacity = alpha_;
		//Для IE
		//this.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
		//Вариант для IE был рассширен
		//см. http://www.tigir.com/opacity.htm
		if(DGUI_BROWSER=="IE"){
		  var oAlpha = this.filters['DXImageTransform.Microsoft.alpha'] || this.filters.alpha;
		  if (oAlpha)
			oAlpha.opacity = alpha;
		  else 
			this.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
		}
	};
	//Цвет фрейма
	ent.setColor = function(color){this.style.backgroundColor=color;};
	ent.setColorText = function(color){this.style.color=color;};
	//Движение фрейма
	ent.move = function(dx,dy){this.setPosition(this.getX()+dx,this.getY()+dy);};
	ent.setImage = function(image_src, repeat_bool){
		//"repeat" "no-repeat"
		this.style.backgroundImage="url("+image_src+")";
		this.style.backgroundRepeat=(repeat_bool)?"repeat":"no-repeat";
	};
	//Устанавливаем className для фрейма
	ent.setClassName = function(className){this.className = className;};
	//Получаем className фрейма
	ent.getClassName = function(){return this.className;};
	//Установка HTML текста в фрейм
	ent.setHTML = function(html_text){return this.innerHTML = html_text;};
	
	ent.getStyle = function(name){return this.style[name];};
	//Пораметр style это объект
	ent.setStyle=function(style){
		if(!style)
			return false;
		if(style.style){
			var ob=style.style;
			for(name in ob){
				if(DGUIStyleObject[name])
					this.style[DGUIStyleObject[name]]=ob[name];
				else
					this.style[name]=ob[name];
			}
		}
		if(style.children){
			//win_consol.addLine("1");
			var ob=style.children;
			for(name in ob){
				//win_consol.addLine(name);
				if(this[name]){
					//win_consol.addLine(name);
					this[name].setStyle(ob[name]);
					//win_consol.addLine(name);
				}
			}
			return;	
		}
		for(name in style){
			if(DGUIStyleObject[name])
				this.style[DGUIStyleObject[name]]=style[name];
			else
				this.style[name]=style[name];
		}
		return;
	}
	//Задаёт фрейму Drag свойства
	ent.setDrag = function(options){
		//met = none, never, drag, drag_logo;
		//constraint
		//this.dragMethod = "none";//Milk: Я изменил значение этого пораметра, на режм перетаскивания смотри функцию DDragFrame
		//this.dragLogo = false;
		if(!options)
			var options=new Object();
		
		if(options.method)
			this.dragMethod=options.method;	
		else
			return false;
		
		this.dragLogo=options.logo||false;
		this.dragAxis=options.axis||"both";//horizontal,vertical
		
		this.onStartDrag = options.onStartDrag||DGUI_EMPTY_FUNCTIONS;
		this.onStopDrag = options.onStopDrag||DGUI_EMPTY_FUNCTIONS;
		this.onDrag = options.onDrag||DGUI_EMPTY_FUNCTIONS;
		
		this.zIndexBuf;//Хранит значение zIndex фрейма на время его перемещения

		if (this.dragMethod == "never"){//milk: Эта опция не совсем корректно работает, жду подтверждения идеи и тогда будем
		//думать что сделать. Не корректность заключается в том что при этом блокируется событие onClick, хотя это не проверенно
			this.onmousedown = function(e){
			e = e||event;
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
			//if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
			};
		}

		if(this.dragMethod == "drag"){
			this.onmousedown = function(e){
			e = e||event;
			gui_drag = [ this, e.clientX-parseInt(this.style.left), 
				e.clientY-parseInt(this.style.top),"start"];
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
			}
		}


		if(this.dragMethod == "drag_logo"){
			this.dragLogo.style.zIndex=DGUI_DRAG_ZINDEX;
			this.dragLogo.style.display = "none";
			this.onmousedown = function(e){
				e = e||event;
				//gui_drag = [element, dx, dy, status];
				gui_drag = [ this, e.clientX-parseInt(this.style.left), 
					e.clientY-parseInt(this.style.top),"start"];

				if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
			}
		}

		if(this.dragMethod != "drag_logo"){
			this.dragLogo=false;
		}
	//Milk: Инициализация этих 2х событий должна прохадить во время или после создания докумета,но до использования функции drag
		document.onmouseup = function(){
			if(gui_drag){
				if(gui_drag[0].dragMethod=="drag_logo"){
					if(gui_drag[0].dragLogo!=false)//Для типа drag_logo
						gui_drag[0].dragLogo.style.display = "none";
		//			if(gui_drop){
		//				gui_drop[0].onStopHover(gui_drag[0]); // Cобытие onStopHover
		//				gui_drop[0].onDrop(gui_drag[0]); //Cобытие onDrop
		//				gui_drop=false;
		//			}
				}
				if(gui_drag[0].dragMethod=="drag"){
					gui_drag[0].style.zIndex=gui_drag[0].zIndexBuf;
				}
				gui_drag[0].onStopDrag(); //Cобытие onStopDrag
				gui_drag = false;
				}
		}
		
		document.onmousemove = function(e){
			if(gui_drag){
				e = e || event;
				var MouseX = e.clientX;//e.x || 
				var MouseY = e.clientY;//e.y || 
			   
				if(gui_drag[3]=="start"){
					gui_drag[0].onStartDrag();//Событие onStartDrag
					if(gui_drag[0].dragMethod=="drag_logo"){//Для типа drag_logo
						if(gui_drag[0].dragLogo!=false){
							gui_drag[0].dragLogo.style.display = "block";
							if(gui_drag[0].acceptFrames){
								if(gui_drag[0].acceptDrop()){
									gui_drop=[gui_drag[0]];
									gui_drag[0].onStartHover(gui_drag[0],e); //Cобытие onStartHover
								}						
							}
						}
					}
					if(gui_drag[0].dragMethod=="drag"){
						gui_drag[0].zIndexBuf=gui_drag[0].style.zIndex;
						gui_drag[0].style.zIndex=DGUI_DRAG_ZINDEX;
					}
					gui_drag[3]="process";
				}

				if(gui_drag[0].dragMethod=="drag_logo"){
					if(gui_drag[0].dragLogo!=false){
						gui_drag[0].dragLogo.style.left = (MouseX + 5) + "px";
						gui_drag[0].dragLogo.style.top = (MouseY + 5) + "px";
					}
					//if(gui_drop){
					//	gui_drop[0].onHover(gui_drag[0]);//событие onHover
					//}
				}
				if(gui_drag[0].dragMethod=="drag"){
					if(gui_drag[0].dragAxis!="vertical")
						gui_drag[0].style.left = MouseX - gui_drag[1] + "px";
					if(gui_drag[0].dragAxis!="horizontal")
						gui_drag[0].style.top = MouseY - gui_drag[2] + "px";
				}
		  
				gui_drag[0].onDrag();//Событие onDrag

				if(e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault();else e.returnValue = false;
			}
		}
	};
	ent.delDrag = function(){
		this.onmousedown = DGUI_EMPTY_FUNCTIONS;
			
		delete this.dragMethod;
		delete this.dragLogo;
		delete this.zIndexBuf;

		delete this.onStartDrag;
		delete this.onStopDrag;
		delete this.onDrag;
	};
	//Задаёт фрейму Drag свойства
	ent.setDrop = function(options){
		//this.dropStatus="notHover";
		//this.dropOptions=options;
		if(!options)
			var options=new Object();
		this.onStartHover=DGUI_EMPTY_FUNCTIONS;
		this.onHover=DGUI_EMPTY_FUNCTIONS;
		this.onStopHover=DGUI_EMPTY_FUNCTIONS;
		this.onDrop=DGUI_EMPTY_FUNCTIONS;
			
		if(options.acceptFrames)
			this.acceptFrames=options.acceptFrames;
		if(options.acceptClasses)
			this.acceptClasses=options.acceptClasses;
		if(options.acceptId)
			this.acceptId=options.acceptId;

		this.acceptDrop=function(){
			var accept=false;
			//проверка по объектам фрейм
			if(this.acceptFrames){
				if(this.acceptFrames.length==undefined){
					if(this.acceptFrames==gui_drag[0])
						accept=true;
				}else{
					for(var i=0;i<this.acceptFrames.length;i++){
						if(this.acceptFrames[i]==gui_drag[0]){
							accept=true;
							break;
						}
					}
				}
			}
			//проверка по слассам
			if(!accept&&this.acceptClasses){
				if(typeof(this.acceptClasses)=="string"){
					if(this.acceptClasses==gui_drag[0].className)
						accept=true;
				}else{
					for(var i=0;i<this.acceptClasses.length;i++){
						if(this.acceptClasses[i]==gui_drag[0].className){
							accept=true;
							break;
						}
					}
				}
			}
			//проверка по id
			if(!accept&&this.acceptId){
				if(typeof(this.acceptId)=="string"){
					if(this.acceptId==gui_drag[0].id)
						accept=true;
				}else{
					for(var i=0;i<this.acceptId.length;i++){
						if(this.acceptId[i]==gui_drag[0].id){
							accept=true;
							break;
						}
					}
				}
			}
			return accept;
		}
		
		this.onmouseover=function(e){
		if(gui_drag){
			if(this.acceptDrop()){
				e = e || event;
				gui_drop=[this];
				this.onStartHover(gui_drag[0],e); //Cобытие onStartHover
				
				if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
			}
		}
		}
		
		this.onmousemove=function(e){
			if(gui_drop){
				if(gui_drop[0]=this){
					e = e || event;
					gui_drop[0].onHover(gui_drag[0],e);//событие onHover				
				}
			}
		}
		this.onmouseout=function(e){
			if(gui_drop){
				e = e || event;
				gui_drop=false;
				this.onStopHover(gui_drag[0],e); //Cобытие onStopHover
				if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
			}
		}
		this.onmouseup = function(e){
			if(gui_drag[0].dragMethod=="drag_logo"){//какая то ошибка в листе
				if(gui_drop){
					e = e || event;
					gui_drop[0].onStopHover(gui_drag[0],e); // Cобытие onStopHover
					gui_drop[0].onDrop(gui_drag[0],e); //Cобытие onDrop
					gui_drop=false;
				}
			}
		}
	};
	ent.delDrop = function(){
		this.onmouseover = DGUI_EMPTY_FUNCTIONS;
		this.onmouseout=DGUI_EMPTY_FUNCTIONS;
		
		delete this.onStartHover;
		delete this.onHover;
		delete this.onStopHover;
		delete this.onDrop;
			
		delete this.acceptFrames;
		delete this.acceptClasses;
		delete this.acceptId;
	};
	return ent;
}
//////////////////// ТЕКСТ //////////////////////////////
function DText(text, style){
    //offsetWidth, offsetHeight
	var txt = DFrame(style);
	txt.innerHTML = text;

	txt.setText = function(texts){
		this.innerHTML = texts;
	};
	txt.getText = function(){
		return this.innerHTML;
	};
	return txt;
}

//////////////////// РИСУНКИ //////////////////////////////
function DImage(src, style){
	var frm = DFrame(style);
	frm.img = document.createElement('img');
	frm.img.src = src;
    frm.appendChild(frm.img);
	frm.sizeImage = function(width, height){
		this.img.width = width;
		this.img.height = height;
		this.style.width = width;
		this.style.height = height;
	}
	return frm;
}
function DButton(options){
	if(!options)
		var options=new Object();
	
	var x=options.x||0;
    var y=options.y||0;
	var width=options.width||30;
	var height=options.height||15;

	var btn = DFrame({w:width,h:height});
	btn.setPosition(x,y);
	if(options.mainStyle)
		btn.setStyle(options.mainStyle);
	
	btn.onMouseOver=options.onMouseOver||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseOut=options.onMouseOut||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseMove=options.onMouseMove||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseDown=options.onMouseDown||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseUp=options.onMouseUp||DGUI_EMPTY_FUNCTIONS;
	btn.onClick=options.onClick||DGUI_EMPTY_FUNCTIONS;
	
	btn.onMouseOverEf=options.onMouseOverEf||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseOutEf=options.onMouseOutEf||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseMoveEf=options.onMouseMoveEf||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseDownEf=options.onMouseDownEf||DGUI_EMPTY_FUNCTIONS;
	btn.onMouseUpEf=options.onMouseUpEf||DGUI_EMPTY_FUNCTIONS;
	btn.onClickEf=options.onClickEf||DGUI_EMPTY_FUNCTIONS;

	if(options.id) btn.id=options.id;
	
    btn.thirdLayer = DFrame({w:"100%",h:"100%"});
    btn.thirdLayer.id=btn.id+"_thirdLayer";		
    btn.secondLayer = DFrame({w:"100%",h:"100%"});
    btn.secondLayer.id=btn.id+"_secondLayer";
    btn.firstLayer = DFrame({w:"100%",h:"100%"});
    btn.firstLayer.id=btn.id+"_firstLayer";

	
	btn.appendChild(btn.thirdLayer);		
	btn.appendChild(btn.secondLayer);
	btn.appendChild(btn.firstLayer);
	
	btn.active = 0;
	btn.style.cursor = "pointer";
	
	if(options.firstStyle)
		btn.firstLayer.setStyle(options.firstStyle);
	if(options.secondStyle)
		btn.secondLayer.setStyle(options.secondStyle);
	if(options.thirdStyle)
		btn.thirdLayer.setStyle(options.thirdStyle);
	
	if(options.firstImg)
		btn.firstLayer.setImage(options.firstImg, false);
	if(options.secondImg)
		btn.secondLayer.setImage(options.secondImg, false);
	if(options.secondImg)
		btn.thirdLayer.setImage(options.thirdImg, false);
	if(options.text){
		btn.textLayer=DText(options.text);
		if(options.fontSize)
			btn.textLayer.style.fontSize=options.fontSize;
		btn.textLayer.setPosition((btn.offsetWidth-btn.textLayer.offsetWidth)/2,
			(btn.offsetHeight-btn.textLayer.offsetHeight)/2);
		if(options.textStyle)
			btn.textLayer.setStyle(options.textStyle);
		btn.textLayer.id=btn.id+"_text";
		btn.appendChild(btn.textLayer);	
		//btn.txt.dragMethod = "none";
	}

	btn.onmouseover = function(e){
		e = e||event;
		this.onMouseOverEf(e);
		this.onMouseOver(e);
		if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
	}
	
	btn.onmouseout=function(e){
		e = e||event;
		this.onMouseOutEf(e);
		this.onMouseOut(e);
		if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
	}
	btn.onmousemove=function(e){
		e = e||event;
		this.onMouseMoveEf(e);
		this.onMouseMove(e);
	}
	
	btn.onmousedown=function(e){
		e = e||event;
		this.onMouseDownEf(e);
		this.onMouseDown(e);
		if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
	}
	
	btn.onmouseup=function(e){
		e = e||event;
		this.onMouseUpEf(e);
		this.onMouseUp(e);
		if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
	}
	
	btn.onclick=function(e){
		e = e||event;
		this.onClickEf(e);
		this.onClick(e);
		if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
	}

	return btn;
}

function DHSButton(options){
	var but=DButton(options);
	but.secondLayer.hide();
	but.onMouseOverEf=function(e){
		this.firstLayer.hide();
		this.secondLayer.show();
	}
	but.onMouseOutEf = function(e){
		this.firstLayer.show();
		this.secondLayer.hide();
	}
	return but;
}

function DAlphaButton(options){
	if(!options)
		var options=new Object();
    var but=DButton(options);
	var speed=options.speed||3;
	
	but.ef_d_second=DEffectDisappear(but.secondLayer,{to:0,speed:speed});
    but.ef_a_second=DEffectAppear(but.secondLayer,{to:100,speed:speed});
    but.secondLayer.setAlpha(0);
    
    but.onMouseOverEf=function(e){
        this.ef_d_second.stop();
        this.ef_a_second.start();
    }
    but.onMouseOutEf = function(e){
        this.ef_a_second.stop();
        this.ef_d_second.start();
    }
    return but;
}
//////////////////// ПОЛЯ ВВОДА ТЕКСТА //////////////////////////////
function DInputText(options){
	//length, startText, type, cols, rows, mainStyle, inputStyle, activeStyle, startStyle, label, id
	//onFocus, onBlur
	if(!options)
		var options=new Object();
	var name;
	var type=(options.type)?options.type:"text";
	if(type!="text"&&type!="textarea")
		return false;
    var edit_txt = DFrame();
	edit_txt.onFocus=DGUI_EMPTY_FUNCTIONS;
	edit_txt.onBlur=DGUI_EMPTY_FUNCTIONS;
	if(options.id)
		edit_txt.id=options.id;
	if(options.mainStyle)
		edit_txt.setStyle(options.mainStyle);
    if(type=="text"){
		name=(options.name)?options.name:(edit_txt.id+"_inputName");
		try{
			edit_txt.input = document.createElement("<input name = "+name+">");
		}
        catch(e){
			edit_txt.input = document.createElement("input");
			edit_txt.input.name = name;
		}
		edit_txt.input.id=edit_txt.id+"_input";
        edit_txt.input.type="text";
    }
    if(type=="textarea"){
        edit_txt.input = document.createElement("textarea");
		name=(options.name)?options.name:(edit_txt.id+"_textareaName");
		edit_txt.input.id=edit_txt.id+"_textarea";
		if(options.cols)
			edit_txt.cols=options.cols;
		if(options.rows)
			edit_txt.rows=options.rows;
    }
	edit_txt.input.style.position="absolute";
	if(options.startText){
		edit_txt.input.value = options.startText;
		if(options.label){
			edit_txt.label=options.label;
			edit_txt.startText=options.startText;
		}
	}
	if(options.inputStyle){
		edit_txt.inputStyle=options.inputStyle;
		DSetStyle(edit_txt.input, options.inputStyle);
	}
	if(options.startText&&options.label&&options.startStyle&&options.inputStyle){
		edit_txt.startStyle=options.startStyle;
		DSetStyle(edit_txt.input, options.startStyle);
	}
	if(options.activeStyle){
		edit_txt.activeStyle=options.activeStyle;
	}
	edit_txt.input.onfocus = function(e){
		if(this.parentNode.inputStyle&&this.parentNode.activeStyle){
			DSetStyle(this, this.parentNode.activeStyle);
		}
		if(this.parentNode.label){
			if(this.value==this.parentNode.startText){
				this.value="";
			}
		}
		this.parentNode.onFocus(e);
	};
	edit_txt.input.onblur = function(e){
		if(this.parentNode.label){
			if(this.value==""){
				this.value=this.parentNode.startText;
				if(this.parentNode.startStyle){
					DSetStyle(this, this.parentNode.startStyle);
					this.parentNode.onBlur(e);
					return;
				}
			}
		}
		if(this.parentNode.inputStyle&&this.parentNode.activeStyle){
			DSetStyle(this, this.parentNode.inputStyle);
		}
		this.parentNode.onBlur(e);
	};
    edit_txt.appendChild(edit_txt.input);
    edit_txt.getValue = function(){
		return 	this.input.value;
	}
    edit_txt.setValue = function(value){
		this.input.value = value;
	}
	return edit_txt;
}

//////////////////// ВСПОМОГАТЕЛЬНАЯ КОНСОЛЬ //////////////////////////////
function DConsole(style){
	win_consol = DFrame({w:200,h:350,bColor:"#bbbbff",zIndex:500});
	if(style)
		win_consol.setStyle(style);
	win_consol.setDrag({method:"drag"});
	win_consol.style.overflow="auto";

    win_consol.addLine = function(text){
		this.innerHTML += text+"<br>";
		return(true);
	}
	win_consol.clin = function(){
		this.innerHTML="<b>КОНСОЛЬ<br>-------------------------------</b><br>";
	}
	win_consol.clin();
	return win_consol;
}
//////////////////// ЭФФЕКТЫ /////////////////
function DEffectDisappear(ent,options){
	if(!ent) return false;
	if(!options)
		var options=new Object();
	ef=new DTimer(40);
	ef.ent=ent;
	ef.to=options.to||0;
	ef.speed=options.speed||2;
	ef.interval=options.interval||40;
	if(ef.to<0||ef.to>100)
		ef.to=0;
	ef.onEffectStart=options.onEffectStart||DGUI_EMPTY_FUNCTIONS;
	ef.onEffect=options.onEffect||DGUI_EMPTY_FUNCTIONS;
	ef.onEffectStop=options.onEffectStop||DGUI_EMPTY_FUNCTIONS;
	
	ef.onTimerStart=function(){this.onEffectStart();}
	
	ef.onTimer=function(){
		if(this.ent.alpha>this.speed+this.to){
			this.ent.alpha-=this.speed;
			this.ent.setAlpha(this.ent.alpha);
		}
		else{
			this.stop();
			this.ent.setAlpha(this.to);
		}
		this.onEffect();
	}
	ef.onTimerStop=function(){this.onEffectStop();}
	return ef;
}

function DEffectAppear(ent,options){
	if(!ent) return false;
	if(!options)
		var options=new Object();
	ef=new DTimer(40);
	ef.ent=ent;
	ef.to=options.to||100;
	ef.speed=options.speed||2;
	ef.interval=options.interval||40;
	if(ef.to<0||ef.to>100)
		ef.to=100;
	ef.onEffectStart=options.onEffectStart||DGUI_EMPTY_FUNCTIONS;
	ef.onEffect=options.onEffect||DGUI_EMPTY_FUNCTIONS;
	ef.onEffectStop=options.onEffectStop||DGUI_EMPTY_FUNCTIONS;
	
	ef.onTimerStart=function(){this.onEffectStart();}
	
	ef.onTimer=function(){
		if(this.ent.alpha<this.to-this.speed){
			this.ent.alpha+=this.speed;
			this.ent.setAlpha(this.ent.alpha);
		}
		else{
			this.stop();
			this.ent.setAlpha(this.to);
		}
		this.onEffect();
	}
	ef.onTimerStop=function(){this.onEffectStop();}
	return ef;
}

function DEffectMove(ent,options){
	if(!ent) return false;
	if(!options)
		var options=new Object();
	ef=new DTimer(40);
	ef.ent=ent;
	ef.interval=options.interval||40;
	ef.speed=options.speed||2;
	ef.dx=options.dx||0;
	ef.dy=options.dy||0;
	
	ef.onEffectStart=options.onEffectStart||DGUI_EMPTY_FUNCTIONS;
	ef.onEffect=options.onEffect||DGUI_EMPTY_FUNCTIONS;
	ef.onEffectStop=options.onEffectStop||DGUI_EMPTY_FUNCTIONS;
	
	ef.onTimerStart=function(){
		this.onEffectStart();
		var s=Math.sqrt(this.dx*this.dx+this.dy*this.dy);
		if(s==0){
			this.stop();
			return;
		}
		this.speedX=this.speed*this.dx/s;
		this.speedY=this.speed*this.dy/s;
		
		this.toX=this.ent.getX()+this.dx;
		this.toY=this.ent.getY()+this.dy;
		
		this.x=this.ent.getX();
		this.y=this.ent.getY();
	}
	
	ef.onTimer=function(){
		if(Math.abs(this.toX-this.x)>Math.abs(this.speedX)){
			this.x+=this.speedX;
			this.y+=this.speedY;
			this.ent.setPosition(this.x,this.y);
		}
		else{
			this.ent.setPosition(this.toX,this.toY);
		}
		this.onEffect();
	}
	ef.onTimerStop=function(){this.onEffectStop();}
	return ef;
}
/////////////////////////// AJAX //////////////////////////////
//ст.65
//http://msdn.microsoft.com/en-us/library/ms760305(VS.85).aspx
//http://ru.wikipedia.org/wiki/XMLHttpRequest
function DHttpRequest(options){
	if(!options)
		var options=new Object();
	var xmlHttp=Object();
	try{
		xmlHttp.transport = new XMLHttpRequest();
	}
	catch(e){
		var XmlHttpVersions = new Array("MSXML2.XMLHTTP.6.0",
										"MSXML2.XMLHTTP.5.0",
										"MSXML2.XMLHTTP.4.0",
										"MSXML2.XMLHTTP.3.0",
										"MSXML2.XMLHTTP",
										"Microsoft.XMLHTTP");
		for(var i=0; i<XmlHttpVersions.length && !xmlHttp.transport; i++)
		{
			try{
				xmlHttp.transport = new ActiveXObject(XmlHttpVersions[i]);
			}
			catch(e){}
		}
	}
	if(!xmlHttp.transport)
		return false;//Ощибка создания обьекта XMLHttpRequest
	
	gui_object_id++;
	xmlHttp.id="HttpRequest_"+gui_object_id;
	GUIObjects[xmlHttp.id]=xmlHttp;
	
	xmlHttp.onSend=options.onSend||DGUI_EMPTY_FUNCTIONS;
	xmlHttp.onProcess=options.onProcess||DGUI_EMPTY_FUNCTIONS;
	xmlHttp.onSuccess=options.onSuccess||DGUI_EMPTY_FUNCTIONS;
	xmlHttp.onStateChange=options.onStateChange||DGUI_EMPTY_FUNCTIONS;
	xmlHttp.onError=options.onError||DGUI_EMPTY_FUNCTIONS;
	
	xmlHttp.method=options.method||"GET";
	xmlHttp.content=null;
	xmlHttp.async=true;
	if(options.url) xmlHttp.url=options.url;
	if(options.content) xmlHttp.content=options.content;
	if(options.async) xmlHttp.async=options.async;

	xmlHttp.send=function(options){
		try{
			if(!options)
				var options=new Object();
			if(options.url) this.url=options.url;
			if(options.method) this.method=options.method;
			if(options.content) this.content=options.content;
			if(options.async) this.async=options.async;
			this.transport.open(this.method,this.url,this.async);
			this.transport.onreadystatechange = new Function("DHttpRequestStateChange('"+this.id+"');");
			this.transport.send(this.content);
		}
		catch(e)
		{
			this.onError(e);
			//"Невозможно соединиться с сервером:\n" + e.toString()
		}
	};
	return xmlHttp;
}
//Вспомогательная ф-я обеспечивеющая обработку ртвета сервера.
function DHttpRequestStateChange(HttpRequest_id){
	var ob=GUIObjects[HttpRequest_id];
	ob.onStateChange(ob.transport);
	switch(ob.transport.readyState){
		case 2:
			ob.onSend(ob.transport);
			break;
		case 3:
			ob.onProcess(ob.transport);
			break;
		case 4:
			if(ob.transport.status == 200){
				ob.onSuccess(ob.transport);
			}
			else{
				ob.onError("Возникли проблемы во время получения данных: " +
					ob.transport.statusText);
			}
			break;
	}
}
//DForma
function DForm(options){
	if(!options)
		var options=new Object();
	var form = document.createElement("form");
	form.onSend=options.onSend||DGUI_EMPTY_FUNCTIONS
	form.onSuccess=options.onSuccess||DGUI_EMPTY_FUNCTIONS;
	if(options.action)
		form.action=options.action;
	form.method=options.method||"POST";
	form.enctype=options.enctype||"multipart/form-data";
	form.oldSubmit=form.submit;
	
	form.submit=function(){
		if(this.iframe)
			this.removeChild(this.iframe);
		gui_object_id++;
		var iframe_name="iframe_" + gui_object_id;
		try{
			this.iframe=document.createElement("<iframe name="+iframe_name+" onload='FormIframeOnLoad(this);'>");
		}
		catch(e){
			this.iframe=document.createElement("iframe");
			this.iframe.name="iframe_" + gui_object_id;
			this.iframe.onload=function(){FormIframeOnLoad(this);};
		}
		this.iframe.style.width=0;
		this.iframe.style.height=0;
		this.iframe.style.display="none";
		this.appendChild(this.iframe);
		this.target=iframe_name;
		this.onSend();
		this.oldSubmit();
	}
	return form;
}

function FormIframeOnLoad(iframe){
	var iframe_win;
	if(iframe.contentDocument)
		iframe_win = iframe.contentDocument;
	else
		if(iframe.contentWindow)
			iframe_win=iframe.contentWindow.document;
		else
			iframe_win=iframe.document;
	var response=new Object();
	response.responseText = iframe_win.body.innerHTML;
	var form = iframe.parentNode;
	form.onSuccess(response);
	//form.removeChild(iframe);
}

//Script-транспорт
function DAttachScript(src){
	if(!src)
		return false;
	var element = document.createElement("script");
	element.type = "text/javascript";
	element.src = src;
	gui_object_id++;
	element.id = "script_"+gui_object_id;
	document.getElementsByTagName("head")[0].appendChild(element);
	return true;
}
//DScriptUpload Загрузка js скриптов
function DScriptUpload(options){
	if(!options)
		var options=new Object();
	var ob = DHttpRequest(options);
	ob.run=true;
	ob.onScriptDone=options.onScriptDone||DGUI_EMPTY_FUNCTIONS;
	ob.onSuccessUpload=options.onSuccessUpload||DGUI_EMPTY_FUNCTIONS;
	if(options.run) ob.run=options.run;
	ob.onSuccess=function(transport){
		this.TextOfScript=transport.responseText;
		this.onSuccessUpload(this.TextOfScript);
		if(this.run){
			//this.TextOfScript+=" GUIObjects['"+this.id+"'].onScriptDone(GUIObjects['"+this.id+"'].TextOfScript);";
			eval(this.TextOfScript);
			this.onScriptDone(this.TextOfScript);
			//Milk 17.02.2009
			//Действительно ли вызов этого события происходит после выполнения загруженного скрипта?
			//Или всё таки нужно использовать метод с добавлением к скрипту стороннего кода см. выше.
		}
	};
	return ob;
}
//---- DMultiScriptUpload
function DMultiScriptUpload(){
	//if(arguments.length==0)
	//	return false;

	var ob = DScriptUpload();
	ob.ArrayOfURL=arguments;
	ob.amount=arguments.length;
	ob.TextOfAllScripts="";
	ob.enable=true;
	ob.num=0;
	
	for(var i=1;i<=ob.amount;i++){
		ob["onSend"+i]=DGUI_EMPTY_FUNCTIONS;
		ob["onSuccessUpload"+i]=DGUI_EMPTY_FUNCTIONS;
		ob["onScriptDone"+i]=DGUI_EMPTY_FUNCTIONS;
		ob["onError"+i]=DGUI_EMPTY_FUNCTIONS;
	}
	ob.onStart=DGUI_EMPTY_FUNCTIONS;
	ob.onDone=DGUI_EMPTY_FUNCTIONS;
	
	ob.start=function(){
		if(this.ArrayOfURL.length==0)
			return false;
		this.onStart();
		this.num=0;
		this.TextOfAllScripts="";
		this.send({url:this.ArrayOfURL[0]});
		return true;
	};
	ob.onSend=function(){
		this.num++;
		eval("this.onSend"+this.num+"();");
	};
	ob.onSend=function(){
		this.num++;//проверить!!!
		eval("this.onError"+this.num+"();");
	};
	ob.onSuccessUpload=function(TextOfScript){
		
		this.TextOfAllScripts=this.TextOfAllScripts+" "+TextOfScript;
		eval("this.onSuccessUpload"+this.num+"(TextOfScript);");
	};
	
	ob.onScriptDone=function(TextOfScript){
		eval("this.onScriptDone"+this.num+"(TextOfScript);");
		if(this.num==this.amount&&this.enable){
			this.onDone(this.TextOfAllScripts);
		}
		else{
			this.send({url:this.ArrayOfURL[this.num]});
		}
	};
	return ob;
}
function DLoadStyle(options){
	if(!options)
		var options=new Object();
	var ob = DHttpRequest(options);
	ob.onUploaded=options.onSuccessUpload||DGUI_EMPTY_FUNCTIONS;
	ob.onSuccess=function(transport){
		this.TextOfStyle=transport.responseText;
		eval(this.TextOfScript);
		this.onUploaded(this.TextOfStyle);
	};
	ob.send({url:options.url+DCacheOff()});
	return ob;
}
//--------------------ImageArray-----------------
function ImageArray(){
	var ob=new Object();
	ob.loader=new Image();
	ob.num=-1;
	ob.image=new Array();
	ob.add=function(src){
		ob.num++;
		this.loader.src=src;
		ob.image[ob.num]=src;
		return ob.num;
	}
	for(var i=0;i<arguments.length;i++){
		ob.add(arguments[i]);
	}
	return ob;
}
//--------------------ImageList-----------------
function ImageList(){
	var ob = new Object();
	ob.image = new Object();
	ob.loader = new Image();
	ob.add = function(id,url){
		this.loader.src=src;
		ob.image[id]=src;
		return true;
	};
	return ob;
}
//////////////////////ТАБ-БЛОК////////////////////////////////////////////
//Создание таб-блока
/*
function DTabBlock(options){
    var tab_window = DFrame(options);
    tab_window.setStyle({overflow:"hidden"});
    
    tab_window.effect = options.effect||"standart";
    tab_window.tab = {};
    tab_window.cols = 0;
    tab_window.tabStart = Object();
    tab_window.tabStop = Object();
    
    tab_window.active = DActiveTab;
    tab_window.addTab = addTabInBlock; 
    
    tab_window.typeButton = options.typeButton||"standart"; //standart, alpha, user
    
    return tab_window;
}

//Добавление нового таба
function DAddTabInBlock(content, position_tab, options){
    this.cols = this.cols+1;
    
    var tmp_x,tmp_y;
    if(!position_tab) position_tab="top";
    switch(position_tab){
        case "top":
            this.tcols++;
            tmp_x = this.getX();
            tmp_y = this.getY() - options.height;
            if (this.tcols > 1) {for(var xx=1;xx<this.tcols;xx++) {tmp_x += this.tab[xx].getWidth();}}
        break;
        case "left":
            this.lcols++;
            tmp_x = this.getX() - options.width;
            tmp_y = this.getY();
            if (this.lcols > 1) {for(var yy=1;yy<this.lcols;yy++) {tmp_y += this.tab[yy].getHeight();}}
        break;
        case "bottom":
            this.bcols++;
            tmp_x = this.getX();
            tmp_y = this.getY() + this.getHeight();
            if (this.bcols > 1) {for(var xx=1;xx<this.bcols;xx++) {tmp_x += this.tab[xx].getWidth();}}
        break;
        case "right":
            this.rcols++;
            tmp_x = this.getX() + this.getWidth();
            tmp_y = this.getY();
            if (this.rcols > 1) {for(var yy=1;yy<this.rcols;yy++) {tmp_y += this.tab[yy].getHeight();}}
        break;
    }
 
    switch(this.typeButton)
    {
		case "user": this.tab[this.cols] = this.userTypeButton; break;
		case "alpha": this.tab[this.cols] = DAlphaButton(options); break;
		case "standart": this.tab[this.cols] = DHSButton(options); break;
    }
    this.tab[this.cols].setStyle({x:tmp_x, y:tmp_y});

    this.tab[this.cols].content = content; 
    this.tab[this.cols].content.hide();
    this.appendChild(this.tab[this.cols].content);

        switch(this.effect){
        case "alpha":
            this.tab[this.cols].ef_a = DEffect(this.tab[this.cols].content,{
            effect:"alpha_up",
            to:100,
            speed:10,
            onEffectStart:function(){this.ent.DAlpha(0); this.ent.show();}});
    
            this.tab[this.cols].ef_d = DEffect(this.tab[this.cols].content,{
            effect:"alpha_down",
            to:0,
            speed:10,
            onEffectStop:function(){this.ent.DHide();}});
        break;
        case "standart":
            this.tab[this.cols].ef_a = DEffect(this.tab[this.cols].content,{effect:"show"});
            this.tab[this.cols].ef_d = DEffect(this.tab[this.cols].content,{effect:"hide"});
        break;
        }
    return this.tab[this.cols];
}

//Выбор активного таба
function DActiveTab(tab){
    if(this.tabStart) this.tabStop = this.tabStart;
    this.tabStart = tab;
    
    if(this.tabStart == this.tabStop) return false;
    try{
		this.tabStop.ef_a.stop();
		this.tabStop.ef_d.start();
    }
    catch(e){}
    
    this.tabStart.ef_d.stop();
    this.tabStart.ef_a.start();
}
*/
//////////////////////// LIST //////////////////////////////////
function DList(options){
/*
options:
	listBodyStyle
	logoStyle
	itemStyle
	supStyle
	supStyleHover
	
	logo
	logoText
	axis
*/
	if(!options)
		var options=new Object();
	
	var listBody = DFrame({
		width:200,
		height:300,
		overflow: "auto"
	});
	
	listBody.logo = DFrame({
		width:50,
		height:20
	});
	listBody.modify=false;
	listBody.axis="vertical";
	if(options.listBodyStyle) listBody.setStyle(options.listBodyStyle);
		
	if(options.itemStyle) listBody.itemStyle=options.itemStyle;
	if(options.supStyle) listBody.supStyle=options.supStyle;
	if(options.dividorStyle) listBody.dividorStyle=options.dividorStyle;
	if(options.dividorStyleHover) listBody.dividorStyleHover=options.dividorStyleHover;
	
	if(options.logo){
		listBody.removeChild(listBody.logo);
		listBody.logo=logo;
	}
	if(options.logoText) listBody.logo.innerHTML=logoText;
	if(options.logoStyle) listBody.logo.setStyle(options.logoStyle);
	
	if(options.axis) listBody.axis=options.axis;
	/*
	var last=true;
	if(options.last==false)
		last=false;
	if(last){
		listBody.last=DFrame({
			position:"relative"
		});
	}
	*/
	listBody.items=new DArray();
	listBody.sup=new DArray();
	
	listBody.listId=0;
	
	listBody.add = function(text,style){
		var sup = DFrame();
		sup.setStyle({
			position:"relative"
		});
		sup.setStyle(this.supStyle);
		sup.id=this.id+"_sup"+this.listId;
		sup.className=this.id+"_sup";
		this.appendChild(sup);
		
		sup.dividor = DFrame();
		sup.dividor.setStyle({
			width:180,
			height:2,
			position:"relative",
			fontSize: "1px"});
		sup.dividor.setStyle(this.dividorStyle);
		sup.dividor.id=this.id+"_dividor"+this.listId;
		sup.dividor.className=this.id+"_dividor";
		sup.dividor.setDrop();
		sup.dividor.acceptClasses = this.id+"_item";
		sup.dividor.onStartHover=function(){
			this.setStyle(this.parentNode.parentNode.dividorStyleHover);
		};
		sup.dividor.onStopHover=function(){
			this.setStyle(this.parentNode.parentNode.dividorStyle);
		};
		sup.appendChild(sup.dividor);
		
		sup.item = DFrame();
		sup.item.setStyle({
			width:180,
			height:20,
			position:"relative"});
		sup.item.setStyle(this.itemStyle);
		sup.item.innerHTML=text;
		sup.item.setDrag({method:"drag_logo",logo:this.logo});
		sup.item.setDrop();
		sup.item.acceptClasses = this.id+"_item";
		sup.item.id=this.id+"_item"+this.listId;
		sup.item.className=this.id+"_item";
		sup.item.onStartHover=function(){
			//this.previousSibling.setStyle(this.parentNode.parentNode.dividorStyleHover);
		};
		sup.item.onHover=function(ent,e){
			if(this.parentNode.parentNode.axis=="vertical"){
				var k=e.offsetY||e.layerY;
				var lim=this.getHeight();
			}
			else{
				var k=e.offsetX||e.layerX;
				var lim=this.getWidth();
			}
			if(k<=(lim/2)){
				try{
					this.parentNode.nextSibling.firstChild.setStyle(this.parentNode.parentNode.dividorStyle);
				}
				catch(e){};
				this.previousSibling.setStyle(this.parentNode.parentNode.dividorStyleHover);
			}
			else{
				try{
					this.parentNode.nextSibling.firstChild.setStyle(this.parentNode.parentNode.dividorStyleHover);
				}
				catch(e){}
				this.previousSibling.setStyle(this.parentNode.parentNode.dividorStyle);
			}
		};
		sup.item.onStopHover=function(){
			try{
				this.parentNode.nextSibling.firstChild.setStyle(this.parentNode.parentNode.dividorStyle);
			}
			catch(e){}
			this.previousSibling.setStyle(this.parentNode.parentNode.dividorStyle);
			f1.innerHTML="none";
		};
		sup.item.onDrop=function(ent,e){
			if(this.parentNode.parentNode.axis=="vertical"){
				var k=e.offsetY||e.layerY;
				var lim=this.getHeight();
			}
			else{
				var k=e.offsetX||e.layerX;
				var lim=this.getWidth();
			}
			if(k<=(lim/2)){
				this.parentNode.parentNode.insertBefore(ent.parentNode,this.parentNode);
			}
			else{
				try{
					this.parentNode.parentNode.insertBefore(ent.parentNode,this.parentNode.nextSibling);
				}
				catch(e){}
			}
		};
		sup.appendChild(sup.item);
		this.listId++;
	}
	listBody.getItem = function(ind){
		return ((ind in this.childNodes) && this.childNodes[ind].lastChild) || false;
	}
	listBody.getItems = function(){
		var array=new Array();
		for(var i=0;i<this.childNodes.length;i++)
			array[i]=this.childNodes[i].lastChild;
		return array;
	}
	return listBody;
}

function DSlider(options){
	//content
	//trackStyle,handlesStyle,max,min,value,axis(horizontal or vertical),smooth
	//events
	//onValueChange, onStartDragHandles, onStopDragHandles
	//Лучше использовать trackStyle для задачи длинны.
	if(!options)
		var options=new Object();
	var modify=true;
	var track = DFrame({
		x:320,
		y:100,
		width:300,
		height:20,
		fontSize:0
		//overflow: "auto",
		//backgroundColor:"#eeeeee"
	});
	track.handles = DFrame({
		x:0,
		y:0,
		width:15,
		height:20,
		fontSize:0
		//overflow: "auto",
		//backgroundColor:"#ffbbbb"
	});
	track.min=options.min||0;
	track.max=options.max||100;
	track.value=track.min;
	track.axis=options.axis||"horizontal";
	track.smooth=true;
	track.onValueChange=options.onValueChange||DGUI_EMPTY_FUNCTIONS;
	track.onStartDragHandles=options.onStartDragHandles||DGUI_EMPTY_FUNCTIONS;
	track.onStopDragHandles=options.onStopDragHandles||DGUI_EMPTY_FUNCTIONS;
			

	if(options.value&&options.min>=track.min&&options.min<=track.max)
		track.value=options.value;
	if(options.smooth==false)
		track.smooth=options.smooth;
	if(options.modify==false)
		modify=options.modify;
	if(options.id)
		track.id=options.id;
	if(options.trackStyle)
		track.setStyle(options.trackStyle);
	if(options.handlesStyle)
		track.handles.setStyle(options.handlesStyle);
		
	track.handles.id=track.id+"_handles";
	track.interval=track.max-track.min;
	
	track.setDrag({method:"never"});
	track.appendChild(track.handles);
	
	track.modifyOn=function(){
		this.handles.setDrag({method:"drag",axis:track.axis});
		this.handles.onDrag=function(){
			if(this.parentNode.axis=="horizontal"){
				var length = this.parentNode.getWidth()-this.getWidth();
				if(this.getX()>=length)
					this.setX(length);
				if(this.getX()<=0)
					this.setX(0);

				var di=length/(this.parentNode.interval*2);
				var value=this.parentNode.min+Math.floor((this.getX()+di)/length*this.parentNode.interval);
				
				if(this.parentNode.value!=value){
					this.parentNode.value=value;
					this.parentNode.onValueChange(value);
				}
				if(this.parentNode.smooth==false)
					this.parentNode.setValue(value);
			}
			if(this.parentNode.axis=="vertical"){
				var length = this.parentNode.getHeight()-this.getHeight();
				if(this.getY()>=length)
					this.setY(length);
				if(this.getY()<=0)
					this.setY(0);
				var di=length/(this.parentNode.interval*2);
				var value=this.parentNode.min+Math.floor((this.getY()+di)/length*this.parentNode.interval);
				
				if(this.parentNode.value!=value){
					this.parentNode.value=value;
					this.parentNode.onValueChange(value);
				}
				
				if(this.parentNode.smooth==false)
					this.parentNode.setValue(value);
			}
		}
		this.handles.onStartDrag=function(){
			this.parentNode.onStartDragHandles(this.parentNode.value);
		}
		this.handles.onStopDrag=function(){
			this.parentNode.onStopDragHandles(this.parentNode.value);
		}
	}
	track.modifyOff=function(){
		this.handles.delDrag();
	}
	track.setValue=function(value){
		if(value<this.min||value>this.max){
			return false;
		}
		var v=value-this.min;
		if(this.axis=="horizontal"){
			var length=this.getWidth()-this.handles.getWidth();
			var x=Math.floor(length*v/this.interval);//-this.handles.DGetWidth()/2
			this.handles.setX(x);
		}
		if(this.axis=="vertical"){
			var length=this.getHeight()-this.handles.getHeight();
			var y=Math.floor(length*v/this.interval);//-this.handles.DGetHeight()/2
			this.handles.setY(y);
		}
		this.value=value;
		return true;
	};
	track.setInterval=function(min,max){
		if(min>=max)
			return false;
		this.min=min;
		this.max=max;
		this.interval=this.max-this.min;
		return true;
	};
	track.setLength=function(length){
		if(this.axis=="horizontal")
			this.setWidth(length);
		else
			this.setHeight(length);
		this.setValue(this.value);
		return true;
	};
	if(modify==true)
		track.modifyOn();
	track.setValue(track.value);
	return track;
}

//-------------------DScrollFrame------------------
function DScrollFrame(options){
	if(!options)
		var options=new Object();
	var style=options.style||"default";//default,user
	var x=options.x||0;
	var y=options.y||0;
	var width=options.width||200;
	var height=options.height||300;
	var widthInner=options.widthInner||300;
	var heightInner=options.heightInner||400;

	var bodyFrame = DFrame({x:x,y:y,width:width,height:height});
	
	bodyFrame.widthScrolls=options.widthScrolls||12;
	bodyFrame.intervalScrolls=options.intervalScrolls||10;
	bodyFrame.button=bodyFrame.widthScrolls;
	bodyFrame.rightHandles=options.rightHandles||0;
	bodyFrame.bottomHandles=options.bottomHandles||0;
	bodyFrame.buttonActive=false;
	if(options.id) bodyFrame.id=options.id;
	if(options.button==false) bodyFrame.button=0;
		
	bodyFrame.innerFrame = DFrame({x:0,y:0,position:"relative"});
	
	bodyFrame.innerFrame.id=bodyFrame.id+"_innerFrame";
	bodyFrame.innerFrame.setHeight(heightInner);
	bodyFrame.innerFrame.setWidth(widthInner);
	
	bodyFrame.rightScroll=DSlider({
		id:bodyFrame.id+"_leftScroll",
		min:0,
		max:3,
		value:0,
		smooth:true,
		axis:"vertical"
	});
	bodyFrame.rightScroll.id=bodyFrame.id+"_leftScroll";
	bodyFrame.bottomScroll=DSlider({
		id:bodyFrame.id+"_bottomScroll",
		min:0,
		max:3,
		value:0,
		smooth:true
	});
	bodyFrame.bottomScroll.id=bodyFrame.id+"_bottomScroll";
	
	bodyFrame.windowFrame = DFrame();
	bodyFrame.windowFrame.id=bodyFrame.id+"_windowFrame";
	
	bodyFrame.square = DFrame();
	bodyFrame.square.id=bodyFrame.id+"_square";

	if(bodyFrame.button){
		bodyFrame.TRButton=DButton({
			id:bodyFrame.id+"_TRButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="TRButton";
				this.parentNode.buttonTimer.start();
			},
			onMouseUp:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			},
			onMouseOut:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			}
		});
		bodyFrame.appendChild(bodyFrame.TRButton);
		bodyFrame.BRButton=DButton({
			id:bodyFrame.id+"_BRButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="BRButton";
				this.parentNode.buttonTimer.start();
			},
			onMouseUp:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			},
			onMouseOut:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			}
		});
		bodyFrame.appendChild(bodyFrame.BRButton);
		bodyFrame.LBButton=DButton({
			id:bodyFrame.id+"_LBButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="LBButton";
				this.parentNode.buttonTimer.start();
			},
			onMouseUp:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			},
			onMouseOut:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			}
		});
		bodyFrame.appendChild(bodyFrame.LBButton);
		bodyFrame.RBButton=DButton({
			id:bodyFrame.id+"_RBButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="RBButton";
				this.parentNode.buttonTimer.start();
			},
			onMouseUp:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			},
			onMouseOut:function(){
				this.parentNode.buttonActive=false;
				this.parentNode.buttonTimer.stop();
			}
		});
		bodyFrame.appendChild(bodyFrame.RBButton);
		//onClickOnButton
		bodyFrame.onClickOnButton=function(but){
			this.intervalScrolls=10;
			if(but=="TRButton"){
				var value=this.rightScroll.value;
				if(value>this.rightScroll.min){
					value-=this.intervalScrolls;
					if(value<this.rightScroll.min)
						value=this.rightScroll.min;
					this.rightScroll.setValue(value);
					this.innerFrame.setY((-1)*value);	
				}
				return true;
			}
			if(but=="BRButton"){
				var value=this.rightScroll.value;
				if(value<this.rightScroll.max){
					value+=this.intervalScrolls;
					if(value>this.rightScroll.max)
						value=this.rightScroll.max;
					this.rightScroll.setValue(value);
					this.innerFrame.setY((-1)*value);
				}
				return true;
			}
			if(but=="LBButton"){
				var value=this.bottomScroll.value;
				if(value>this.bottomScroll.min){
					value-=this.intervalScrolls;
					if(value<this.bottomScroll.min)
						value=this.bottomScroll.min;
					this.bottomScroll.setValue(value);
					this.innerFrame.setX((-1)*value);
				}
				return true;
			}
			if(but=="RBButton"){
				var value=this.bottomScroll.value;
				if(value<this.bottomScroll.max){
					value+=this.intervalScrolls;
					if(value>this.bottomScroll.max)
						value=this.bottomScroll.max
					this.bottomScroll.setValue(value);
					this.innerFrame.setX((-1)*value);					
				}
				return true;
			}
		};
		bodyFrame.buttonTimer = new DTimer(50, {
			onTimerStart:function(){
				this.parentScroll.onClickOnButton(this.parentScroll.buttonActive);
			},
			onTimer:function(){
				this.parentScroll.onClickOnButton(this.parentScroll.buttonActive);
			}
		});
		bodyFrame.buttonTimer.parentScroll=bodyFrame;
	}
		
	//Default style
	if(style=="default"){
		bodyFrame.innerFrame.setStyle({
			bColor:"#999999"
		});
		bodyFrame.rightScroll.setStyle({
			bColor:"#bbbbbb"
		});
		bodyFrame.rightScroll.handles.setStyle({
			bColor:"#ffff99"
		});
		bodyFrame.bottomScroll.setStyle({
			bColor:"#bbbbbb"
		});
		bodyFrame.bottomScroll.handles.setStyle({
			bColor:"#ff9999"
		});
		bodyFrame.windowFrame.setStyle({
			bColor:"#99aacc"
		});
		bodyFrame.square.setStyle({
			bColor:"#ff7788"
		});
		if(bodyFrame.button){
			bodyFrame.TRButton.setStyle({
				bColor:"#888888"
			});
			bodyFrame.BRButton.setStyle({
				bColor:"#888888"
			});
			bodyFrame.LBButton.setStyle({
				bColor:"#888888"
			});
			bodyFrame.RBButton.setStyle({
				bColor:"#888888"
			});
		}
	}
	
	bodyFrame.refresh=function(){
		var rightScrollIs=0;
		var bottomScrollIs=0;
		if(this.innerFrame.offsetHeight>this.offsetHeight)
			rightScrollIs=this.widthScrolls;
		if(this.innerFrame.offsetWidth>this.offsetWidth-rightScrollIs)
			bottomScrollIs=this.widthScrolls;
		if(this.innerFrame.offsetHeight>this.offsetHeight-bottomScrollIs)
			rightScrollIs=this.widthScrolls;
		
		this.windowFrame.setStyle({
			x:0,
			y:0,
			width:bodyFrame.offsetWidth-rightScrollIs,
			height:bodyFrame.offsetHeight-bottomScrollIs,
			overflow: "hidden"
		});
		
		
		if(rightScrollIs>0){
			this.rightScroll.show();
			if(this.button){
				this.TRButton.show();
				this.BRButton.show();
			}
		}
		else{
			this.rightScroll.hide();
			if(this.button){
				this.TRButton.hide();
				this.BRButton.hide();
			}
		}
		
		if(bottomScrollIs>0){
			this.bottomScroll.show();
			if(this.button){
				this.LBButton.show();
				this.RBButton.show();
			}
		}
		else{
			this.bottomScroll.hide();
			if(this.button){
				this.LBButton.hide();
				this.RBButton.hide();
			}
		}
		//info.innerHTML=rightScrollIs+"-"+bottomScrollIs+" - "+this.windowFrame.offsetHeight;
		
		if(bottomScrollIs>0&&rightScrollIs>0){
			this.square.show();
			this.square.setStyle({
				x:this.offsetWidth-this.widthScrolls,
				y:this.offsetHeight-this.widthScrolls,
				w:this.widthScrolls,
				h:this.widthScrolls,
				fontSize:0
			});
		}
		else{
			this.square.hide();
		}
		//-------------rightScroll------------
		this.rightScroll.setStyle({
			x:this.offsetWidth-this.widthScrolls,
			y:this.button,
			w:this.widthScrolls,
			h:this.offsetHeight-2*this.button-bottomScrollIs
		});
		if(this.rightHandles<=0){
			var rightHandles=this.windowFrame.offsetHeight/this.innerFrame.offsetHeight*this.rightScroll.offsetHeight;
			if(rightHandles<10)
				rightHandles=10;
		}
		else{
			var rightHandles=this.rightHandles;
		}
		this.rightScroll.handles.setStyle({
			w:this.widthScrolls,
			h:rightHandles
		});
		//---------------bottomScroll-----------
		
		this.bottomScroll.setStyle({
			x:this.button,
			y:this.offsetHeight-this.widthScrolls,
			w:this.offsetWidth-2*this.button-rightScrollIs,
			h:this.widthScrolls
		});
		if(this.bottomHandles<=0){
			var bottomHandles=this.windowFrame.offsetWidth/this.innerFrame.offsetWidth*this.bottomScroll.offsetWidth;
			if(bottomHandles<10)
				bottomHandles=10;
		}
		else{
			var bottomHandles=this.bottomHandles;
		}
		this.bottomScroll.handles.setStyle({
			w:bottomHandles,
			h:this.widthScrolls
		});
		
		//Set intrrvals for rightScroll and bottomScroll
		var max=this.innerFrame.offsetHeight-this.windowFrame.offsetHeight;
		if(max!=Math.floor(max))
			max=Math.floor(max)+1;
		this.rightScroll.setInterval(0,max)
		max=this.innerFrame.offsetWidth-this.windowFrame.offsetWidth;
		if(max!=Math.floor(max))
			max=Math.floor(max)+1;
		this.bottomScroll.setInterval(0,max);
		
		if(this.button){
			this.TRButton.setStyle({
				x:this.offsetWidth-this.widthScrolls,
				y:0
			});
			this.BRButton.setStyle({
				x:this.offsetWidth-this.widthScrolls,
				y:this.offsetHeight-this.widthScrolls-bottomScrollIs
			});
			this.LBButton.setStyle({
				x:0,
				y:this.offsetHeight-this.widthScrolls
			});
			this.RBButton.setStyle({
				x:this.offsetWidth-this.widthScrolls-rightScrollIs,
				y:this.offsetHeight-this.widthScrolls
			});
		}
	};
	
	bodyFrame.setPosOfInner=function(x,y){
		if(x>0||y>0)
			return false;
		this.innerFrame.setPosition(x,y);
		this.rightScroll.setValue(x);
		this.bottomScroll.setValue(y);
	}
	bodyFrame.changeSize=function(options){
		if(options.height){
			var dy=options.height-this.offsetHeight;
			if(((-1)*this.innerFrame.getY())>Math.abs(dy))
				this.innerFrame.setY(this.innerFrame.getY()+dy);
			else
				this.innerFrame.setY(0);
			this.rightScroll.setValue((-1)*this.innerFrame.getY());
			this.fSetHeight(options.height);
		}
		if(options.width){
			var dx=options.width-this.offsetWidth;
			if(((-1)*this.innerFrame.getX())>Math.abs(dx))
				this.innerFrame.setX(this.innerFrame.getX()+dx);
			else
				this.innerFrame.setX(0);
			this.bottomScroll.setValue((-1)*this.innerFrame.getX());
			this.fSetWidth(options.width);			
		}
		this.refresh();
	}
	bodyFrame.refresh();
	
	bodyFrame.rightScroll.onValueChange=function(){
		if(this.value==this.max)
			this.parentNode.innerFrame.setY(
				(-1)*(this.parentNode.innerFrame.offsetHeight-this.parentNode.windowFrame.offsetHeight));
		else
			this.parentNode.innerFrame.setY(this.value*(-1));
		//info.innerHTML=this.parentNode.innerFrame.getY()+" - "+this.value;
		//DGetWidth
	}

	bodyFrame.bottomScroll.onValueChange=function(){
		//info.innerHTML=f2.getY()+" - "+f2.getX()+" - "+this.value;
		if(this.value==this.max)
			this.parentNode.innerFrame.setX(
				(-1)*(this.parentNode.innerFrame.offsetWidth-this.parentNode.windowFrame.offsetWidth));
		else
			this.parentNode.innerFrame.setX(this.value*(-1));
	}
		
	bodyFrame.appendChild(bodyFrame.windowFrame);
	bodyFrame.windowFrame.appendChild(bodyFrame.innerFrame);
	bodyFrame.appendChild(bodyFrame.rightScroll);
	bodyFrame.appendChild(bodyFrame.bottomScroll);
	bodyFrame.appendChild(bodyFrame.square);
	bodyFrame.fAppendChild=bodyFrame.appendChild;
	bodyFrame.appendChild=function(ent){
		bodyFrame.innerFrame.appendChild(ent);
	}
	bodyFrame.fSetWidth=bodyFrame.setWidth;
	bodyFrame.setWidth=function(width){
		this.changeSize({width:width});
	}
	bodyFrame.fSetHeight=bodyFrame.setHeight;
	bodyFrame.setHeight=function(height){
		this.changeSize({height:height});
	}
	return bodyFrame;
}
//-------------------------------------------------------------------------------
gui_windows_zIndex=1;
activeWindow=false;
function DWindow(options){
	if(!options)
		var options=new Object();
	//options
	//outer
	var x=options.x||0;
	var y=options.y||0;
	var width=options.width||400;
	var height=options.height||300;
	var topHeight=options.topHeight||20;
	var border=options.border||4;
	var area=options.area||"scrollFrame";
	var iconTop=options.iconTop||false;
	var textTop=options.textTop||false;
	var minimizeButton=options.minimizeButton||true;
	var maximizeButton=options.maximizeButton||true;
	var closeButton=options.closeButton||true;
	var resize=true;
	if(options.resize==false)
		resize=false;
	
	var zIndex=gui_windows_zIndex;
	gui_windows_zIndex++;

	var top = DFrame({
		x:x+border,
		y:y+border,
		width:width,
		height:topHeight,
		bColor:"#ff9999",
		zIndex:zIndex
	});
	top.border=border;
	top.minHeight=options.minHeight||60;
	top.minWidth=options.minWidth||100;
	//top.active=true;
	
	top.onSrartResize=options.onSrartResize||DGUI_EMPTY_FUNCTIONS;
	top.onResize=options.onResize||DGUI_EMPTY_FUNCTIONS;
	top.onStopResize=options.onStopResize||DGUI_EMPTY_FUNCTIONS;
	
	top.onStartMove=options.onStartMove||DGUI_EMPTY_FUNCTIONS;
	top.onMove=options.onMove||DGUI_EMPTY_FUNCTIONS;
	top.onStopMove=options.onStopMove||DGUI_EMPTY_FUNCTIONS;
	
	top.onActive=options.onActive||DGUI_EMPTY_FUNCTIONS;
	top.onPassive=options.onPassive||DGUI_EMPTY_FUNCTIONS;
	
	top.setDrag({method:"drag"});
	top.onDrag=function(){
		var x=this.getX();
		var y=this.getY();
		this.RBBorder.setPosition(x+this.area.offsetWidth,y+this.offsetHeight+this.area.offsetHeight);
		this.RTBorder.setPosition(x+this.area.offsetWidth,y-this.border);
		this.LTBorder.setPosition(x-this.border,y-this.border);
		this.LBBorder.setPosition(x-this.border,y+this.offsetHeight+this.area.offsetHeight);
		
		this.LBorder.setPosition(x-this.border,y);
		this.RBorder.setPosition(x+this.area.offsetWidth,y);
		this.TBorder.setPosition(x,y-this.border);
		this.BBorder.setPosition(x,y+this.offsetHeight+this.area.offsetHeight);
		this.onMove();
	};
	top.onclick=function(){this.changeZIndex();}
	top.onStartDrag=function(){this.changeZIndex(); this.onStartMove();}
	top.onStopDrag=function(){this.onStopMove();}
	
	if(iconTop){
		top.iconTop = document.createElement('img');
		top.iconTop.src = iconTop;
		top.iconTop.id = top.id+"_iconTop";
		top.iconTop.border=0;
		DSetStyle(top.iconTop,{
			styleFloat:"left",
			cssFloat:"left"
		});
		top.appendChild(top.iconTop);
	}
	if(textTop){
		top.textTop=DText(textTop,{
			x:0,
			y:0,
			w:width-(iconTop?topHeight:0)-(minimizeButton?topHeight:0)-(maximizeButton?topHeight:0)-(closeButton?topHeight:0),
			h:topHeight,
			overflow:"hidden",
			position:"relative",
			styleFloat:"left",
			cssFloat:"left",
			cursor:"default"
		});
		top.appendChild(top.textTop);
	}
	
	if(minimizeButton){
		top.minimizeButton=DHSButton({
			mainStyle:{
				id:top.id+"_minimizeButton",
				x:0,
				y:0,
				width:topHeight,
				height:topHeight,
				position:"relative",
				styleFloat:"left",
				cssFloat:"left"
			},
			firstStyle:{backgroundColor:"#55bb55"},
			secondStyle:{backgroundColor:"#bb5555", display:"none"},
			textStyle:{color:"#9999ff",fontSize:18},
			text:"m"
		});
		top.appendChild(top.minimizeButton);	
	}
	
	if(maximizeButton){
		top.maximizeButton=DHSButton({
			mainStyle:{
				id:top.id+"_maximizeButton",
				x:0,
				y:0,
				width:topHeight,
				height:topHeight,
				position:"relative",
				styleFloat:"left",
				cssFloat:"left"
			},
			firstStyle:{backgroundColor:"#99bb99"},
			secondStyle:{backgroundColor:"#bb5555", display:"none"},
			textStyle:{color:"#ff9999",fontSize:18},
			text:"b"
		});
		top.appendChild(top.maximizeButton);
	}
	
	if(closeButton){
		top.closeButton=DHSButton({
			mainStyle:{
				id:top.id+"_closeButton",
				x:0,
				y:0,
				width:topHeight,
				height:topHeight,
				position:"relative",
				styleFloat:"left",
				cssFloat:"left"
			},
			firstStyle:{backgroundColor:"#9999bb"},
			secondStyle:{backgroundColor:"#bb5555", display:"none"},
			textStyle:{color:"#ff9999",fontSize:18},
			text:"X",
			onClick:function(){
				this.parentWindow.hide();
			}
		});
		top.closeButton.parentWindow=top;
		top.appendChild(top.closeButton);
	}
	if(area=="scrollFrame"){
		top.area=DScrollFrame({
			id:top.id+"_main",
			x:0,
			y:topHeight,
			width:width,
			height:height,
			widthInner:300,
			heightInner:400,
			heightHandles:20,
			widthHandles:20,
			button:true
		});
	}
	else{
		top.area=DFrame({
			id:top.id+"_main",
			x:0,
			y:topHeight,
			width:width,
			height:height,
			bColor:"#aaaaee"
		});
	}
	
	top.area.setDrag({method:"never"});
	top.appendChild(top.area);
	
	//---RBBorder---
	top.RBBorder = DFrame({
		x:x+border+width,
		y:y+border+height+topHeight,
		w:border,
		h:border,
		cursor:"se-resize",
		overflow: "hidden",
		backgroundColor:"#99aacc",
		zIndex:zIndex});
	top.RBBorder.id=top.id+"_RBBorder";
	top.RBBorder.parentWindow=top;		
	top.RBBorder.onclick=function(){this.parentWindow.changeZIndex();}
	
	//---LTBorder---
	top.LTBorder = DFrame({
		x:x,
		y:y,
		w:border,
		h:border,
		cursor:"se-resize",
		overflow: "hidden",
		bColor:"#99aacc",
		zIndex:zIndex});
	top.LTBorder.id=top.id+"_LTBorder";
	top.LTBorder.parentWindow=top;	
	top.LTBorder.onclick=function(){this.parentWindow.changeZIndex();}
	
	//---RTBorder---
	top.RTBorder = DFrame({
		x:x+border+width,
		y:y,
		w:border,
		h:border,
		cursor:"sw-resize",
		overflow: "hidden",
		bColor:"#99aacc",
		zIndex:zIndex
	});
	top.RTBorder.id=top.id+"_RTBorder";
	top.RTBorder.parentWindow=top;
	top.RTBorder.onclick=function(){this.parentWindow.changeZIndex();}
	
	//---LBBorder---
	top.LBBorder = DFrame({
		x:x,
		y:y+border+height+topHeight,
		w:border,
		h:border,
		cursor:"sw-resize",
		overflow: "hidden",
		bColor:"#99aacc",
		zIndex:zIndex
	});
	top.LBBorder.id=top.id+"_LBBorder";
	top.LBBorder.parentWindow=top;	
	top.LBBorder.onclick=function(){this.parentWindow.changeZIndex();}

	//---LBorder---
	top.LBorder = DFrame({
		x:x,
		y:y+border,
		w:border,
		h:height+topHeight,
		cursor:"w-resize",
		overflow: "hidden",
		bColor:"#ccaaaa",
		zIndex:zIndex
	});
	top.LBorder.id=top.id+"_LBorder";
	top.LBorder.parentWindow=top;	
	top.LBorder.onclick=function(){this.parentWindow.changeZIndex();}
	
	//---RBorder---
	top.RBorder = DFrame({
		x:x+border+width,
		y:y+border,
		w:border,
		h:height+topHeight,
		cursor:"w-resize",
		overflow: "hidden",
		bColor:"#ccaaaa",
		zIndex:zIndex
	});
	top.RBorder.id=top.id+"_RBorder";
	top.RBorder.parentWindow=top;	
	top.RBorder.onclick=function(){this.parentWindow.changeZIndex();}

	//---TBorder---
	top.TBorder = DFrame({
		x:x+border,
		y:y,
		w:width,
		h:border,
		cursor:"n-resize",
		overflow: "hidden",
		bColor:"#ccaaaa",
		zIndex:zIndex
	});
	top.TBorder.id=top.id+"_TBorder";
	top.TBorder.parentWindow=top;	
	top.TBorder.onclick=function(){this.parentWindow.changeZIndex();}

	//---BBorder---
	top.BBorder=DFrame({
		x:x+border,
		y:y+border+height+topHeight,
		w:width,
		h:border,
		cursor:"s-resize",
		overflow: "hidden",
		bColor:"#ccaaaa",
		zIndex:zIndex
	});
	top.BBorder.id=top.id+"_BBorder";
	top.BBorder.parentWindow=top;
	top.BBorder.onclick=function(){this.parentWindow.changeZIndex();}
	//---------------------
	top.setResize=function(){
		//---RBBorder---
		this.RBBorder.setDrag({method:"drag"});
		this.RBBorder.onDrag=function(){
			var parent=this.parentWindow;
			var x = parent.getX();
			var y = parent.getY();
			var width = this.getX()-parent.getX();
			var height = this.getY()-parent.getY();
			if(width<parent.minWidth){
				width=parent.minWidth;
			}
			if(height<parent.minHeight+parent.getHeight()){
				height=parent.minHeight+parent.getHeight();
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		}
		this.RBBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.RBBorder.onStopDrag=function(){this.parentWindow.onStopResize();}
		
		//---LTBorder---
		this.LTBorder.setDrag({method:"drag"});
		this.LTBorder.onDrag=function(){
			var parent=this.parentWindow;
			var width = parent.getWidth()+(parent.getX()-this.getX()-parent.border);
			var height = parent.getHeight()+parent.area.getHeight()+(parent.getY()-this.getY()-parent.border);
			var x=this.getX()+parent.border;
			var y=this.getY()+parent.border;
			
			if(width<parent.minWidth){
				width=parent.minWidth;
				x = parent.getX();
			}
			if(height<parent.minHeight+parent.getHeight()){
				height=parent.minHeight+parent.getHeight();
				y = parent.getY();
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.LTBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.LTBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---RTBorder---
		this.RTBorder.setDrag({method:"drag"});
		this.RTBorder.onDrag=function(){
			var parent=this.parentWindow;
			var width = this.getX()-parent.getX();
			var height = parent.getHeight()+parent.area.getHeight()+(parent.getY()-this.getY()-parent.border);
			var x=this.getX()-width;
			var y=this.getY()+parent.border;
			
			if(width<parent.minWidth){
				width=parent.minWidth;
				x = parent.getX();
			}
			if(height<parent.minHeight+parent.getHeight()){
				height=parent.minHeight+parent.getHeight();
				y = parent.getY();
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.RTBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.RTBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---LBBorder---
		this.LBBorder.setDrag({method:"drag"});
		this.LBBorder.onDrag=function(){
			var parent=this.parentWindow;
			var width = parent.getWidth()+(parent.getX()-this.getX()-parent.border);
			var height = this.getY()-parent.getY();
			var x=this.getX()+parent.border;
			var y=this.getY()-height;
			if(width<parent.minWidth){
				width=parent.minWidth;
				x = parent.getX();
			}
			if(height<parent.minHeight+parent.getHeight()){
				height=parent.minHeight+parent.getHeight();
				y = parent.getY();
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.LBBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.LBBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---LBorder---
		this.LBorder.setDrag({method:"drag",axis:"horizontal"});
		this.LBorder.onDrag=function(){
			var parent=this.parentWindow;
			var width = parent.getWidth()+(parent.getX()-this.getX()-parent.border);
			if(width<parent.minWidth){
				this.setX(parent.getX()-parent.border);
				return;
			}
			var height = this.getHeight();
			var x=this.getX()+parent.border;
			var y=this.getY();
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.LBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.LBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---RBorder---
		this.RBorder.setDrag({method:"drag",axis:"horizontal"});
		this.RBorder.onDrag=function(){
			var parent=this.parentWindow;
			var width = this.getX()-parent.getX();
			var height = this.getHeight();
			var x=this.getX()-width;
			var y=this.getY();
			if(width<parent.minWidth){
				this.setX(parent.getX()+parent.minWidth);
				x = parent.getX();
				width=parent.minWidth;
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		}
		this.RBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.RBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---TBorder---
		this.TBorder.setDrag({method:"drag",axis:"vertical"});
		this.TBorder.onDrag=function(){
			var parent=this.parentWindow;
			var height = parent.getHeight()+parent.area.getHeight()+(parent.getY()-this.getY()-parent.border);
			if(height<parent.minHeight+parent.getHeight()){
				this.setY(parent.getY()-parent.border);
				return;
			}
			var width = this.getWidth();
			var x=this.getX();
			var y=this.getY()+parent.border;
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.TBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.TBorder.onStopDrag=function(){this.parentWindow.onStopResize();}

		//---BBorder---
		this.BBorder.setDrag({method:"drag",axis:"vertical"});
		this.BBorder.onDrag=function(){
			var parent=this.parentWindow;
			var height = this.getY()-parent.getY();
			var width = this.getWidth();
			var x=this.getX();
			var y=this.getY()-height;
			if(height<parent.minHeight+parent.getHeight()){
				this.setY(parent.getY()+parent.minHeight+parent.getHeight());
				y = parent.getY();
				height=parent.minHeight+parent.getHeight();
			}
			parent.refresh(x,y,width,height);
			parent.onResize();
		};
		this.BBorder.onStartDrag=function(){this.parentWindow.changeZIndex();this.parentWindow.onSrartResize();}
		this.BBorder.onStopDrag=function(){this.parentWindow.onStopResize();}
	}
	
	top.delResize=function(){
		this.RBBorder.delDrag();
		this.RTBorder.delDrag();
		this.LTBorder.delDrag();
		this.LBBorder.delDrag();
		this.TBorder.delDrag();
		this.BBorder.delDrag();
		this.LBorder.delDrag();
		this.RBorder.delDrag();
	}
	top.refresh=function(x,y,width,height){
		this.area.setWidth(width);
		this.area.setHeight(height-this.getHeight());
		this.setWidth(width);
		this.textTop.setWidth(width-(iconTop?topHeight:0)-(minimizeButton?topHeight:0)-(maximizeButton?topHeight:0)-(closeButton?topHeight:0));
		
		this.TBorder.setWidth(width);
		this.BBorder.setWidth(width);
		this.LBorder.setHeight(height);
		this.RBorder.setHeight(height);
		
		this.setPosition(x,y);
		
		this.LBorder.setPosition(x-this.border,y);
		this.RBorder.setPosition(x+width,y);
		this.TBorder.setPosition(x,y-this.border);
		this.BBorder.setPosition(x,y+height);
		
		this.RBBorder.setPosition(x+width,y+height);
		this.RTBorder.setPosition(x+width,y-this.border);
		this.LTBorder.setPosition(x-this.border,y-this.border);
		this.LBBorder.setPosition(x-this.border,y+height);
	}
	top.changeZIndex=function(){
		if(this.getZ()==gui_windows_zIndex-1)
			return;
		var zIndex=gui_windows_zIndex;
		gui_windows_zIndex++;
		this.setZ(zIndex);
		this.LBorder.setZ(zIndex);
		this.RBorder.setZ(zIndex);
		this.TBorder.setZ(zIndex);
		this.BBorder.setZ(zIndex);
		this.RBBorder.setZ(zIndex);
		this.RTBorder.setZ(zIndex);
		this.LTBorder.setZ(zIndex);
		this.LBBorder.setZ(zIndex);
		this.setActive();
	}
	top.setActive=function(){
		win_consol.addLine("a="+activeWindow.id+" n="+this.id);
		if(activeWindow==this)
			return;
		if(activeWindow)
			activeWindow.onPassive();
		activeWindow=this;
		this.onActive();
	}
	//переопределение методов
	top.fHide=top.hide;
	top.hide=function(){
		this.fHide();
		this.LBorder.hide();
		this.RBorder.hide();
		this.TBorder.hide();
		this.BBorder.hide();
		this.RBBorder.hide();
		this.RTBorder.hide();
		this.LTBorder.hide();
		this.LBBorder.hide();
	}
	top.fShow=top.show;
	top.show=function(){
		this.fShow();
		this.LBorder.show();
		this.RBorder.show();
		this.TBorder.show();
		this.BBorder.show();
		this.RBBorder.show();
		this.RTBorder.show();
		this.LTBorder.show();
		this.LBBorder.show();
		this.changeZIndex();
	}
	if(resize)
		top.setResize();
	return top;
}