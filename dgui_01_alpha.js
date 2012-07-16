
//Глобальные переменные
gui_frame_id = 0;
gui_order = 0;

gui_object_id=0;//Id объектов
GUIObjects=new Object();//Ссылки на объекты через id

gui_drag = false;
gui_drop = false;

//MouseX = 0;
//MouseY = 0;

//Константы
//DGUI_SPEED_MOVE = 20;
DGUI_BROWSER = DGetBrowser();
DGUI_DRAG_ZINDEX=1000;//zIndex фрейма при drag
DGUI_EMPTY_FUNCTIONS=function(){};



////////////////КЛАССЫ////////////////////

/////////////////ВСПОМОГАТЕЛЬЫЕ ФУНКЦИИ//////////////////
//Функция запрещает кэширование в Opera
function DCacheOff(){return "?rnd="+Math.random();}
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
function DList(){
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
	if(!interval||interval<=0)
		this.interval=1000;
	else
		this.interval=interval;
	gui_object_id++;
	this.id="timer_"+gui_object_id;
	GUIObjects[this.id]=this;
	
	this.enabled=false;
	
	this.process=function()
	{
		if(this.enabled==true){
			setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
			this.onTimer();
		}
	}
	this.start=function()
	{
		this.enabled=true;
		this.onTimerStart();
		setTimeout("GUIObjects['"+this.id+"'].process()", this.interval);
	}
	this.stop=function()
	{
		this.enabled=false;
		this.onTimerStop();
	}
	
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
function DSizeEl(ent, width, height, inc){
	if(!inc) inc = "px";
	ent.style.width = width + inc;
	ent.style.height = height + inc;
}

//Изменение видимости фрейма
function DHideEl(ent){ent.style.display = "none";}
function DShowEl(ent){ent.style.display = "block";}
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
function DColorFrame(ent, color){ent.style.backgroundColor = color;}//<---------------!!!!
function DColorText(ent, color){ent.style.color = color;}
//Изменение положения фрейма
function DPositionEl(ent, x, y){
	ent.style.left = x+"px";
	ent.style.top = y+"px";
}
//Движение фрейма
function DMoveEl(ent, movex, movey){
	x = movex + ent.DGetXFrame();
	y = movey + ent.DGetYFrame();
	DPositionEl(ent, x, y);
}

function DImageToEl(ent,image_src, repeat_bool){
	var repeat=(repeat_bool)?"repeat":"no-repeat";
	ent.style.backgroundImage = "url(" + image_src + ")";
	ent.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
}

//---------------24.01.2009------------
//Устанавливаем className для фрейма
function DSetClassName(ent,className){ent.className = className;}
//Получаем className фрейма
function DGetClassName(ent){return ent.className;}
//Устанавливает стиль
function DSetStyle(ent, style){
	for(name in style){
		switch(name){
			case "x": ent.style["left"]=style["x"]; break;
			case "y": ent.style["top"]=style["y"]; break;
			default: ent.style[name]=style[name];		
		}
	}
}
//Возвращает значение однго из свойств стиля
function DGetStyle(ent, name){return ent.style[name];}

/////////////////БАЗОВЫЕ ФУНКЦИИ И КЛАССЫ//////////////////

//Создание основы окна (фрейм)
function DCreateFrame(style){
	ent = document.createElement("div");
    ent.act = true;
    ent.alpha = 1.0;
	ent.mouseover = false;
    
    gui_frame_id++;
    ent.id = "frame_" + gui_frame_id;
    
    gui_order++;
    
    ent.style.zIndex = gui_order;//Нужно ли это?
    ent.style.position = "absolute";
	
    ent.style.left = "0px";
    ent.style.top = "0px";

	ent.style.display = "block";
	ent.style.overflow = "visible";
	if(style)
		DSetStyle(ent, style);
	
	document.body.appendChild(ent);
	//Значение X координаты фрейма
	ent.DGetX = function(){return parseInt(this.style.left);};
	//Значение Y координаты фрейма
	ent.DGetY = function(){return parseInt(this.style.top);};
	//Значение ширины/длины фрейма
	ent.DGetWidth = function(){return parseInt(this.style.width);};
	//Значение высоты фрейма
	ent.DGetHeight = function(){return parseInt(this.style.height);};
	//Устанавливаем X координату фрейма
	ent.DSetX = function(x){this.style.left = x;};
	//Устанавливаем Y координату фрейма
	ent.DSetY = function(y){this.style.top = y;};
	//Устанавливаем значение ширины/длины фрейма
	ent.DSetWidth = function(width){this.style.width = width;};
	//Устанавливаем значение высоты фрейма
	ent.DSetHeight = function(height){this.style.height = height;};
	//Значение по оси Z фрейма
	ent.DGetZ = function(){return parseInt(this.style.zIndex);};
	////Устанавливаем значение по оси Z фрейма
	ent.DSetZ = function(zindex){this.style.zIndex = zindex;};
	ent.DGetAlpha = function(){return parseInt(this.style.alpha);};//<----------------!!!
	
	ent.alpha=100;
	//Расположение фрейма относительно другого фрейма
	ent.DAlignToFrame = function(frm_parent, align){
		if(align == "center")
		{
			frm_parent.align = "center";
			this.DPosition(frm_parent.DGetWidth()/2 - this.DGetWidth()/2,
				frm_parent.DGetHeight()/2 - this.DGetHeight()/2);
			return(true);
		}
		if(align == "center_up")
		{
			frm_parent.align = "center";
			this.DPosition(frm_parent.DGetWidth()/2 - this.DGetWidth()/2, 10);
			return(true);
		}
	};
	
	//Изменение размера фрейма
	ent.DSize = function(width, height, inc){
		if(!inc) inc = "px";
		this.style.width = width + inc;
		this.style.height = height + inc;
	};
	ent.DPosition = function(x, y){this.style.left = x+"px";this.style.top = y+"px";};
	//Изменение видимости фрейма
	ent.DHide = function(){
		this.act = false;//<------------------------------!!!!
		this.style.display = "none";
	};
	ent.DShow = function(){
		this.act = true;//<------------------------------!!!!
		this.style.display = "block";
	};
	//Прозрачность фрейма
	ent.DAlpha = function(alpha){
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
	ent.DColor = function(color){
		if (!this.input) this.style.backgroundColor = color;
		if (this.input) this.input.style.backgroundColor = color;//--------несовсем то что надо
	};
	ent.DColorText = function(color){
		if (!this.input) this.style.color = color;
		if (this.input) this.input.style.color = color;//--------несовсем то что надо
	};
	//Движение фрейма
	ent.DMove = function(movex, movey){
		x = movex + this.DGetXFrame();
		y = movey + this.DGetYFrame();
		this.DPosition(x, y);
	};
	ent.DImage = function(image_src, repeat_bool){
		var repeat=(repeat_bool)?"repeat":"no-repeat";
		this.style.backgroundImage = "url(" + image_src + ")";
		this.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
	};
	//---------------24.01.2009------------
	//Устанавливаем className для фрейма
	ent.DSetClassName = function(className){this.className = className;};
	//Получаем className фрейма
	ent.DGetClassName = function(){return this.className;};
	//-------------------------------------
	ent.DDrag = DDragFrame;
	ent.DDrop = DDropFrame;
	ent.DDelDrag = DDelDragFrame;
	ent.DDelDrop = DDelDropFrame;
	
	ent.DGetStyle = function(name){return this.style[name];};
	//Пораметр style это объект
	ent.DSetStyle = function(style){
		for(name in style){
			switch(name){
				case "x": this.style["left"]=style["x"]; break;
				case "y": this.style["top"]=style["y"]; break;
				default: this.style[name]=style[name]; break;	
			}
		}
	};
	//Установка HTML текста в фрейм
	ent.DHTML = function(html_text){return this.innerHTML = html_text;};
	return ent;
}

//Задаёт фрейму Drag свойства
function DDragFrame(options){//met,logo
//met = none, never, drag, drag_logo;
	//constraint
	//this.dragMethod = "none";//Milk: Я изменил значение этого пораметра, на режм перетаскивания смотри функцию DDragFrame
	//this.dragLogo = false;
	this.OnStartDrag = DGUI_EMPTY_FUNCTIONS;
	this.OnStopDrag = DGUI_EMPTY_FUNCTIONS;
	this.OnDrag = DGUI_EMPTY_FUNCTIONS;

	if(options){
		this.dragMethod=options.method||"none";
		this.dragLogo=options.logo||false;
		this.dragAxis=options.axis||"both";//horizontal,vertical
		
		if(options.OnStartDrag)
			this.OnStartDrag = options.OnStartDrag;
		if(options.OnStopDrag)
			this.OnStopDrag = options.OnStopDrag;
		if(options.OnDrag)
			this.OnDrag = options.OnDrag;
	}
	
	this.zIndexBuf;//Хранит значение zIndex фрейма на время его перемещения


	if (this.dragMethod == "none"){
		this.onmousedown = function(e){};
	}

	if (this.dragMethod == "never"){//milk: Эта опция не совсем корректно работает, жду подтверждения идеи и тогда будем
	//думать что сделать. Не корректность заключается в том что при этом блокируется событие OnClick, хотя это не проверенно
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
		gui_drag[0].OnStopDrag(); //Cобытие OnStopDrag
		gui_drag = false;
		}
	}
	
	document.onmousemove = function(e){
	if(gui_drag){
		e = e || event;
		var MouseX = e.clientX;//e.x || 
		var MouseY = e.clientY;//e.y || 
       
		if(gui_drag[3]=="start"){
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
			gui_drag[0].OnStartDrag();//Событие OnStartDrag
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
  
		gui_drag[0].OnDrag();//Событие OnDrag

		if(e.stopPropagation) e.stopPropagation();else e.cancelBubble = true;
		if(e.preventDefault) e.preventDefault();else e.returnValue = false;
	}
	}
}
function DDelDragFrame(){
	
	this.onmousedown = function(){};
		
	delete this.dragMethod;
	delete this.dragLogo;
	delete this.zIndexBuf;

	delete this.OnStartDrag;
	delete this.OnStopDrag;
	delete this.OnDrag;
}
//Задаёт фрейму Drag свойства
function DDropFrame(options){
	//this.dropStatus="notHover";
	//this.dropOptions=options;
	this.onStartHover=function(drag_frame){};
	this.onHover=function(drag_frame){};
	this.onStopHover=function(drag_frame){};
	this.onDrop=function(drag_frame){};
	if(options){
		this.acceptFrames=options.acceptFrames;
		this.acceptClasses=options.acceptClasses;
		this.acceptId=options.acceptId;
	}

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
	};
	
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
}
function DDelDropFrame(){
	
	this.onmouseover = function(){};
	this.onmouseout=function(){}
	
	delete this.onStartHover;
	delete this.onHover;
	delete this.onStopHover;
	delete this.onDrop;
		
	delete this.acceptFrames;
	delete this.acceptClasses;
	delete this.acceptId;
}



//////////////////// ТЕКСТ //////////////////////////////
function DCreateText(text, style){

	//x , y, size, text, color, color_frame
	var a_tmp = document.createElement('a');
	if(style&&style.fontSize) a_tmp.style.fontSize = style.fontSize;
	a_tmp.innerHTML = text;
    document.body.appendChild( a_tmp );
	
    var width = a_tmp.offsetWidth;
	var height = a_tmp.offsetHeight;
	

    document.body.removeChild( a_tmp );

	txt = DCreateFrame(style);
	txt.DSize(width,height);
	txt.innerHTML = text;

	txt.DSetText = DSetText;
	txt.DGetText = DGetText;

	return txt;
}

//Создание блока для текста
function DCreateTextBlock(text, style){
	//x, y, width, height, size, text, color, color_frame
	txt = DCreateFrame(style);
	txt.innerHTML = text;

	txt.DSetText = DSetText;
	txt.DGetText = DGetText;

	return txt;
}

function DSetText(texts){
	this.innerHTML = texts;
}

function DGetText(){
	return this.innerHTML;
}
//////////////////// РИСУНКИ //////////////////////////////
function DCreateImage(src, style){
	//x, y, image_src
	frm = DCreateFrame();
	
	frm.img = document.createElement('img');
	frm.img.src = src;
    frm.appendChild( frm.img );
	
    var width = frm.img.offsetWidth;
	var height = frm.img.offsetHeight;

	frm.style.width = width;
	frm.style.height = height;
	
	if(style)
		frm.DSetStyle(style);
	
	frm.DSizeImage = DSizeImage;
	
	return frm;
}


function DSizeImage(width, height){
	this.img.width = width;
	this.img.height = height;
	
	this.style.width = width;
	this.style.height = height;
}


//////////////////// КНОПКИ //////////////////////////////
function DCreateButton(options){
	var x=options.x||0;
    var y=options.y||0;
	var width=options.width||30;
	var height=options.height||15;

	var btn = DCreateFrame({width:width,height:height});
	
	btn.onMouseOver=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseOut=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseMove=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseDown=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseUp=DGUI_EMPTY_FUNCTIONS;
	btn.onClick=DGUI_EMPTY_FUNCTIONS;
	
	btn.onMouseOverEf=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseOutEf=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseMoveEf=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseDownEf=DGUI_EMPTY_FUNCTIONS;
	btn.onMouseUpEf=DGUI_EMPTY_FUNCTIONS;
	btn.onClickEf=DGUI_EMPTY_FUNCTIONS;
	
	if(options){
		if(options.onMouseOver)btn.onMouseOver=options.onMouseOver;
		if(options.onMouseOut)btn.onMouseOut=options.onMouseOut;
		if(options.onMouseMove)btn.onMouseMove=options.onMouseMove;
		if(options.onMouseDown)btn.onMouseDown=options.onMouseDown;
		if(options.onMouseUp)btn.onMouseUp=options.onMouseUp;
		if(options.onClick)btn.onClick=options.onClick;
			
		if(options.onMouseOverEf)btn.onMouseOverEf=options.onMouseOverEf;
		if(options.onMouseOutEf)btn.onMouseOutEf=options.onMouseOutEf;
		if(options.onMouseMoveEf)btn.onMouseMoveEf=options.onMouseMoveEf;
		if(options.onMouseDownEf)btn.onMouseDownEf=options.onMouseDownEf;
		if(options.onMouseUpEf)btn.onMouseUpEf=options.onMouseUpEf;
		if(options.onClickEf)options.onClickEf;
		
		if(options.id) btn.id=options.id;
	}
	
    btn.firstLayer = DCreateFrame({width:width,height:height});
    btn.firstLayer.id=btn.id+"_firstLayer";
    btn.secondLayer = DCreateFrame({width:width,height:height});
    btn.secondLayer.id=btn.id+"_secondLayer";
    btn.thirdLayer = DCreateFrame({width:width,height:height});
    btn.thirdLayer.id=btn.id+"_thirdLayer";
	
	
	btn.appendChild(btn.firstLayer);
	btn.appendChild(btn.secondLayer);
	btn.appendChild(btn.thirdLayer);
	
	btn.DPosition(x,y);
	btn.active = 0;
	btn.style.cursor = "pointer";
	

	
	if(options){
		if(options.img_first)
			btn.firstLayer.DImage(options.img_first, false);//img_none
		if(options.img_second)
			btn.secondLayer.DImage(options.img_second, false);//img_over

		if(options.text){
			var fontSize = options.fontSize||12;

			btn.txt = DCreateText(options.text,{fontSize:fontSize});

			btn.appendChild(btn.txt);	
			btn.txt.DColorText("#eeeeee");
			btn.txt.DPosition(width/2 - btn.txt.DGetWidth()/2, height/2 - btn.txt.DGetHeight()/2);
			//btn.txt.dragMethod = "none";
		}
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

function DCreateHSButton(options){
	var but=DCreateButton(options);
	but.secondLayer.DHide();
	but.onMouseOverEf=function(e){
		this.firstLayer.DHide();
		this.secondLayer.DShow();
	}
	but.onMouseOutEf = function(e){
		this.firstLayer.DShow();
		this.secondLayer.DHide();
	}
	return but;
}

function DCreateAlphaButton(options){
    but=DCreateButton(options);
    
    if(!options.speed) options.speed = 3;

   but.ef_d_second=DCreateEffect(but.secondLayer,{effect:"alpha_down", to:0,speed:options.speed});
    but.ef_a_second=DCreateEffect(but.secondLayer,{effect:"alpha_up", to:100,speed:options.speed});
    
    but.secondLayer.DAlpha(0);
    
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

function DCreateInputText(options){//x,y, length, start_text, type, margin
    var edit_txt = DCreateFrame({width:options.width, height:options.height});
    edit_txt.DPosition(options.x,options.y);
    edit_txt.type = "edit";
    
    if (options.type == "text")
    {
        edit_txt.input = document.createElement('input');
        edit_txt.input.type = "text";
    }
    if (options.type == "text_block")
    {
        edit_txt.input = document.createElement('textarea');
    }
    
    if(!options.margin) margin = 0;
    
    edit_txt.input.value = options.start_text;
    edit_txt.input.size = options.length;
    edit_txt.input.style.color = "#eeeeee";
    edit_txt.input.style.backgroundColor = "transparent";
    edit_txt.input.style.borderWidth = 0;
    edit_txt.input.style.width = options.width;
    edit_txt.input.style.height = options.height;
        
    edit_txt.appendChild( edit_txt.input );
   // edit_txt.DSize(edit_txt.input.offsetWidth + options.margin*2, edit_txt.input.offsetHeight + options.margin*2);
    
    edit_txt.DSize(options.width, options.height);
  //  edit_txt.input.style.marginLeft = options.margin+5;//---------???Milk: Нужно ли это???
    if(options.margin) edit_txt.input.style.marginTop = options.margin;
    
    edit_txt.DGetValue = DGetValueInputText;
    edit_txt.DSetValue = DSetValueInputText;
    
    edit_txt.input.onblur = function() {};

   return edit_txt;

}

function DGetValueInputText(){
	return 	this.input.value;
}

function DSetValueInputText(value){
	this.input.value = value;
}

//////////////////// ВСПОМОГАТЕЛЬНАЯ КОНСОЛЬ //////////////////////////////
function DCreateConsole(){
	
win_consol = DCreateFrame({width:259,height:39+373});
	win_consol.DDrag("drag");
	win_consol.DImage("engine/images/win_consol_up.png");
win_consol.console_label = DCreateText("КОНСОЛЬ",{fontSize:18,color:"#ffffff"});
win_consol.console_label.style.fontFamily = "Arial";
win_consol.appendChild(win_consol.console_label);
win_consol.console_label.DAlignToFrame(win_consol,"center_up");

win_consol.console_body = DCreateFrame({width:259,height:373});
	win_consol.console_body.DPosition(0,38);
	win_consol.console_body.DImage("engine/images/win_consol.png");
	win_consol.console_body.DAlpha(80);
	
win_consol.appendChild(win_consol.console_body);

	win_consol.console_body.style.fontFamily = "Arial";
	win_consol.console_body.align = "left";
	win_consol.console_body.style.paddingLeft = "10px";
	win_consol.console_body.style.paddingTop = "10px";
	win_consol.console_body.style.color = "#eee";
	win_consol.DPosition(10,10);

    win_consol.DAddTextLine = function(text_line){
		this.console_body.innerHTML += text_line;
		return(true);
	}
	win_consol.DClear = function(){
		this.console_body.innerHTML = "";
	}
	return win_consol;
}
//////////////////// ЭФФЕКТЫ /////////////////
function DCreateEffect(ent,options){
    ef=new DTimer(40);
    ef.ent=ent;
    ef.effect = options.effect||"move";

    switch(ef.effect){
    case "alpha_down":ef.to=0; ef.speed=2;
            if(options.to)
                ef.to=options.to;
            if(options.speed)
                ef.speed=options.speed;
    break;
    case "alpha_up":ef.to=100; ef.speed=2;
            if(options.to)
                ef.to=options.to;
            if(options.speed)
                ef.speed=options.speed;
    break;   
    case "show":break; 
    case "hide":break; 
    
    default: if(options){ef.movex = options.movex; ef.movey = options.movey; }
    }
 
    
    ef.onEffectStart=function(){};
    ef.onEffectStop=function(){};
     if(options.onEffectStart) ef.onEffectStart=options.onEffectStart;    
    if(options.onEffectStop)  ef.onEffectStop=options.onEffectStop;      
       
       
    ef.onTimerStart=function(){
        this.onEffectStart();
    }
    
    ef.onTimer=function(){
        
        switch(this.effect)
        {
            case "move" :
                this.ent.DPosition(this.movex + this.ent.DGetX(), this.movey + this.ent.DGetY());
            break;
            case "alpha_down":
                if(this.ent.alpha>this.speed+this.to){
                    this.ent.alpha-=this.speed;
                    this.ent.DAlpha(this.ent.alpha);
                }
                else{
                    this.stop();
                    this.ent.DAlpha(this.to);
                }
            break;
            case "alpha_up":
                if(this.ent.alpha<this.to-this.speed){
                    this.ent.alpha+=this.speed;
                    this.ent.DAlpha(this.ent.alpha);
                }
                else{
                    this.stop();
                    this.ent.DAlpha(this.to);
                }
            break; 
            case "show": this.stop; this.ent.DShow(); 
            break;
            case "hide": this.ent.DHide(); this.stop;
            break;
            
            default: return false;
        }
    }
    ef.onTimerStop=function(){
        this.onEffectStop();
    }
    return ef;
}
/////////////////////////// AJAX //////////////////////////////
//ст.65
//http://msdn.microsoft.com/en-us/library/ms760305(VS.85).aspx
//http://ru.wikipedia.org/wiki/XMLHttpRequest
function DHttpRequest(options){
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
	
	xmlHttp.onSend=function(){};
	xmlHttp.onProcess=function(){};
	xmlHttp.onSuccess=function(){};
	xmlHttp.onStateChange=function(){};
	xmlHttp.onError=function(){};
	
	xmlHttp.method="GET";
	xmlHttp.content=null;
	xmlHttp.async=true;
	if(options){
		if(options.url) xmlHttp.url=options.url;
		if(options.method) xmlHttp.method=options.method;
		if(options.content) xmlHttp.content=options.content;
		if(options.async) xmlHttp.async=options.async;
		
		if(options.onSend) xmlHttp.onSend=options.onSend;
		if(options.onProcess) xmlHttp.onProcess=options.onProcess;
		if(options.onSuccess) xmlHttp.onSuccess=options.onSuccess;
		if(options.onStateChange) xmlHttp.onStateChange=options.onStateChange;
		if(options.onError) xmlHttp.onError=options.onError;
	}

	xmlHttp.DSend=function(options){
		try{
			
			if(options){
				if(options.url) this.url=options.url;
				if(options.method) this.method=options.method;
				if(options.content) this.content=options.content;
				if(options.async) this.async=options.async;
			}
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
			if(ob.transport.status == 200)
			{
				ob.onSuccess(ob.transport);
			}
			else
			{
				ob.onError("Возникли проблемы во время получения данных: " +
					ob.transport.statusText);
			}
			break;
	}
}
//DForma
function DForma(options){
	var form = document.createElement("form");
	form.onSend=function(){};
	form.onSuccess=function(){};
	if(options){
		if(options.action)
			form.action=options.action;
		form.method=options.method||"POST";
		if(options.onSend)
			form.onSend=options.onSend;
		if(options.onSuccess)
			form.onSuccess=options.onSuccess;
	}
	form.enctype="multipart/form-data";
	
	form.DSubmit=function(){
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
		
		this.submit();
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
	var element = document.createElement("script");
	element.type = "text/javascript";
	element.src = src;
	gui_object_id++;
	element.id = "script_"+gui_object_id;
	document.getElementsByTagName("head")[0].appendChild(element);
}
//DScriptUpload Загрузка js скриптов
function DScriptUpload(options){
	var ob = DHttpRequest(options);
	ob.run=true;
	ob.onScriptDone=DGUI_EMPTY_FUNCTIONS;
	ob.onSuccessUpload=DGUI_EMPTY_FUNCTIONS;
	
	if(options){
		if(options.onScriptDone) ob.onScriptDone=options.onScriptDone;
		if(options.onSuccessUpload) ob.onSuccessUpload=options.onSuccessUpload;
		if(options.run) ob.run=options.run;
	}
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
	if(arguments.length==0)
		return false;


	var ob = DScriptUpload({url:arguments[0]});
	ob.ArrayOfURL=arguments;
	ob.amount=arguments.length;
	ob.TextOfAllScripts="";
	ob.enable=true;
	ob.num=0;
	
	for(var i=1;i<=ob.amount;i++){
		ob["onSuccessUpload"+i]=DGUI_EMPTY_FUNCTIONS;
		ob["onScriptDone"+i]=DGUI_EMPTY_FUNCTIONS;
	}
	ob.onDone=DGUI_EMPTY_FUNCTIONS;
	
	ob.onSuccessUpload=function(TextOfScript){
		this.num++;
		this.TextOfAllScripts+=TextOfScript;
		eval("this.onSuccessUpload"+this.num+"();");
	};
	
	ob.onScriptDone=function(){
		eval("this.onScriptDone"+this.num+"();");
		if(this.num==this.amount&&this.enable){
			this.onDone(this.TextOfAllScripts);
		}
		else{
			this.DSend({url:this.ArrayOfURL[this.num]});
		}
	};
	return ob;
}
//--------------------ImageArray-----------------
function ImageArray(){
	var ob=new Object();
	ob.loader=new Image();
	ob.num=-1;
	ob.image=new Array();
	ob.DAdd=function(src){
		ob.num++;
		this.loader.src=src;
		ob.image[ob.num]=src;
		return ob.num;
	}
	
	for(var i=0;i<arguments.length;i++){
		ob.DAdd(arguments[i]);
	}
	return ob;
}
//--------------------ImageList-----------------
function ImageList(){
	var ob = new Object();
	ob.image = new Object();
	ob.loader = new Image();
	ob.DAdd = function(id,url){
		this.loader.src=src;
		ob.image[id]=src;
	};
	return ob;
}

//////////////////////ТАБ-БЛОК////////////////////////////////////////////

//Создание таб-блока
function DCreateTabBlock(options)
{
    var tab_window = DCreateFrame(options);
    tab_window.DSetStyle({overflow:"hidden"});
    
    tab_window.effect = options.effect||"standart";
    tab_window.tab = {};
    tab_window.cols = 0;
    tab_window.tabStart = Object();
    tab_window.tabStop = Object();
    
    tab_window.DActive = DActiveTab;
    tab_window.DAddTab = DAddTabInBlock; 
    
    tab_window.typeButton = options.typeButton||"standart"; //standart, alpha, user
    
    return tab_window;
}

//Добавление нового таба
function DAddTabInBlock(content, position_tab, options) 
{
    
    this.cols = this.cols+1;
    
    var tmp_x,tmp_y;
    if(!position_tab) position_tab="top";
    switch(position_tab){
        case "top":
            this.tcols++;
            tmp_x = this.DGetX();
            tmp_y = this.DGetY() - options.height;
            if (this.tcols > 1) {for(var xx=1;xx<this.tcols;xx++) {tmp_x += this.tab[xx].DGetWidth();}}
        break;
        case "left":
            this.lcols++;
            tmp_x = this.DGetX() - options.width;
            tmp_y = this.DGetY();
            if (this.lcols > 1) {for(var yy=1;yy<this.lcols;yy++) {tmp_y += this.tab[yy].DGetHeight();}}
        break;
        case "bottom":
            this.bcols++;
            tmp_x = this.DGetX();
            tmp_y = this.DGetY() + this.DGetHeight();
            if (this.bcols > 1) {for(var xx=1;xx<this.bcols;xx++) {tmp_x += this.tab[xx].DGetWidth();}}
        break;
        case "right":
            this.rcols++;
            tmp_x = this.DGetX() + this.DGetWidth();
            tmp_y = this.DGetY();
            if (this.rcols > 1) {for(var yy=1;yy<this.rcols;yy++) {tmp_y += this.tab[yy].DGetHeight();}}
        break;
    }
 
    switch(this.typeButton)
    {
    case "user": this.tab[this.cols] = this.userTypeButton; break;
    case "alpha": this.tab[this.cols] = DCreateAlphaButton(options); break;
    case "standart": this.tab[this.cols] = DCreateHSButton(options); break;
    }
    this.tab[this.cols].DSetStyle({x:tmp_x, y:tmp_y});

    this.tab[this.cols].content = content; 
    this.tab[this.cols].content.DHide();
    this.appendChild(this.tab[this.cols].content);

        switch(this.effect)
        {
        case "alpha":
            this.tab[this.cols].ef_a = DCreateEffect(this.tab[this.cols].content,{
            effect:"alpha_up",
            to:100,
            speed:10,
            onEffectStart:function(){this.ent.DAlpha(0); this.ent.DShow();}});
    
            this.tab[this.cols].ef_d = DCreateEffect(this.tab[this.cols].content,{
            effect:"alpha_down",
            to:0,
            speed:10,
            onEffectStop:function(){this.ent.DHide();}});
        break;
        case "standart":
            this.tab[this.cols].ef_a = DCreateEffect(this.tab[this.cols].content,{effect:"show"});
            this.tab[this.cols].ef_d = DCreateEffect(this.tab[this.cols].content,{effect:"hide"});
        break;
        }
    return this.tab[this.cols];
}

//Выбор активного таба
function DActiveTab(tab)
{
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
//////////////////////// LIST //////////////////////////////////
function DCreateList(options){
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
	var listBody = DCreateFrame({
		x:50,
		y:50,
		width:200,
		height:300,
		overflow: "auto",
		backgroundColor:"#ffffff",
		border: "2px solid black"
	});
	
	listBody.logo = DCreateFrame({
		width:50,
		height:20,
		backgroundColor:"#33aacc",
		border: "1px solid black"
	});
	listBody.itemStyle = new DStyle({
		width:180,
		height:20,
		position:"relative",
		backgroundColor:"#eeeeff",
		border: "1px solid #33aacc"
	});
	listBody.supStyle = new DStyle({
			width:180,
			height:2,
			position:"relative",
			backgroundColor:"#ffffff",
			fontSize: "1px"
	});
	listBody.supStyleHover = new DStyle({
			width:180,
			height:2,
			position:"relative",
			backgroundColor:"#dddddd",
			fontSize: "1px"
	});
	listBody.modify=true;
	listBody.axis="vertical";
	//listBody.logo.innerHTML="Item";
	if(options){
		if(options.listBodyStyle) listBody.DSetStyle(options.listBodyStyle);
		
		if(options.itemStyle) listBody.itemStyle=options.itemStyle;
		if(options.supStyle) listBody.supStyle=options.supStyle;
		if(options.supStyleHover) listBody.supStyleHover=options.supStyleHover;
		
		if(options.logo){
			listBody.removeChild(listBody.logo);
			listBody.logo=logo;
		}
		if(options.logoText) listBody.logo.innerHTML=logoText;
		if(options.logoStyle) listBody.logo.DSetStyle(options.logoStyle);
		
		if(options.axis) listBody.axis=options.axis;
	}
	
	listBody.items=new DList();
	listBody.sup=new DList();
	
	listBody.listAddSup=function(){
		var sup = DCreateFrame(this.supStyle);
		/*
		sup.DDrop();
		sup.acceptFrames = this.items.array;
		
		sup.onStartHover=function(){
			this.DSetStyle({backgroundColor:"#dddddd",height:2});
		};
		sup.onStopHover=function(){
			this.DSetStyle({backgroundColor:"#ffffff",height:2});
		};
		*/
		this.sup.add(sup);
		this.appendChild(sup);
	}
	
	listBody.DAdd = function(text){
		if(this.items.length==0)
			this.listAddSup();
		var item = DCreateFrame(this.itemStyle);
		item.innerHTML=text;
		item.DDrag({method:"drag_logo",logo:this.logo});

		item.DDrop();
		item.acceptFrames = this.items.array;
		item.onHover=function(ent,e){
			//var index=this.parentNode.items.getIndex(this);
			//f1.innerHTML=index;
			if(this.parentNode.axis=="vertical"){
				var k=e.offsetY||e.layerY;
				var lim=this.DGetHeight();
			}
			else{
				var k=e.offsetX||e.layerX;
				var lim=this.DGetWidth();
			}
			if(k<=(lim/2)){
				this.previousSibling.DSetStyle(this.parentNode.supStyleHover);
				this.nextSibling.DSetStyle(this.parentNode.supStyle);
			}
			else{
				this.nextSibling.DSetStyle(this.parentNode.supStyleHover);
				this.previousSibling.DSetStyle(this.parentNode.supStyle);
			}
		};
		item.onStopHover=function(){
			this.previousSibling.DSetStyle(this.parentNode.supStyle);
			this.nextSibling.DSetStyle(this.parentNode.supStyle);
			//var index=this.parentNode.items.getIndex(this);
			//this.parentNode.sup.array[index+1].DSetStyle({backgroundColor:"#ffffff",height:2});
			//this.parentNode.sup.array[index].DSetStyle({backgroundColor:"#ffffff",height:2});
		};
		item.onDrop=function(ent,e){
			var from=this.parentNode.items.getIndex(ent);
			var to=this.parentNode.items.getIndex(this);
			if(this.parentNode.axis=="vertical"){
				var k=e.offsetY||e.layerY;
				var lim=this.DGetHeight();
			}
			else{
				var k=e.offsetX||e.layerX;
				var lim=this.DGetWidth();
			}
			if(to<from){
				if(k>=(lim/2))
					to++;
			}
			else{
				if(k<=(lim/2))
					to--;
			}
			//f1.innerHTML=to+" - "+from;
			this.parentNode.DReplaceItem(from,to);
		};
		item.onclick=function(){
			//f1.innerHTML=this.id+" - "+this.parentNode.items.getIndex(this);
		};
		this.items.add(item);
		this.appendChild(item);
		
		this.listAddSup();
		return item;
	};
	listBody.DReplaceItem=function(ind,to){
		if(ind==to)
			return true;
		var ent_ind=this.items.array[ind];
		var ent_to=this.items.array[to];
		//f1.innerHTML=ent_ind.id+" - "+ent_to.id;
		if(to<ind){
			this.insertBefore(ent_ind.previousSibling,ent_to.previousSibling);
			this.insertBefore(ent_ind,ent_to.previousSibling);
		}
		else{
			this.insertBefore(ent_ind.previousSibling,ent_to.nextSibling);
			this.insertBefore(ent_ind,ent_to.nextSibling.nextSibling);
		}
		this.items.replace(ind,to);
		
	};
	return listBody;
}
///////////////////////////////// Slider ////////////////////////////////////
function DSlider(options){
	//content
	//trackStyle,handlesStyle,max,min,value,axis(horizontal or vertical),smooth
	//events
	//onSliderValueChange, onStartDragHandles, onStopDragHandles
	//Лучше использовать trackStyle для задачи длинны.
	var track = DCreateFrame({
				x:320,
				y:100,
				width:300,
				height:20//,
				//overflow: "auto",
				//backgroundColor:"#eeeeee"
			});
	track.handles = DCreateFrame({
				x:0,
				y:0,
				width:15,
				height:20//,
				//overflow: "auto",
				//backgroundColor:"#ffbbbb"
			});
			
	track.min=0;
	track.max=100;
	track.value=track.min;
	track.axis="horizontal";
	track.smooth=true;
	track.modify=true;
	track.onSliderValueChange=DGUI_EMPTY_FUNCTIONS;
	track.onStartDragHandles=DGUI_EMPTY_FUNCTIONS;
	track.onStopDragHandles=DGUI_EMPTY_FUNCTIONS;
			
	if(options){
		if(options.min)
			track.min=options.min;
		if(options.max)
			track.max=options.max;
		if(options.value&&options.min>=track.min&&options.min<=track.max)
			track.value=options.value;
		if(options.axis)
			track.axis=options.axis;
		if(options.smooth==false)
			track.smooth=options.smooth;

		if(options.trackStyle)
			track.DSetStyle(options.trackStyle);
		if(options.handlesStyle)
			track.handles.DSetStyle(options.handlesStyle);
		
		if(options.onSliderValueChange)
			track.onSliderValueChange=options.onSliderValueChange;
		if(options.onStartDragHandles)
			track.onStartDragHandles=options.onStartDragHandles;
		if(options.onStopDragHandles)
			track.onStopDragHandles=options.onStopDragHandles;
		if(options.id) track.id=options.id;
	}
	track.handles.id=track.id+"_handles";
	track.interval=track.max-track.min;
	
	track.DDrag({method:"never"});
	
	track.handles.DDrag({method:"drag",axis:track.axis});
	track.handles.OnDrag=function(){
		if(this.parentNode.axis=="horizontal"){
			var length = this.parentNode.DGetWidth()-this.DGetWidth();
			if(this.DGetX()>=length)
				this.DSetX(length);
			if(this.DGetX()<=0)
				this.DSetX(0);

			var di=length/(this.parentNode.interval*2);
			var value=this.parentNode.min+Math.floor((this.DGetX()+di)/length*this.parentNode.interval);
			
			if(this.parentNode.value!=value){
				this.parentNode.value=value;
				this.parentNode.onSliderValueChange(value);
			}
			if(this.parentNode.smooth==false)
				this.parentNode.setSliderValue(value);
		}
		if(this.parentNode.axis=="vertical"){
			var length = this.parentNode.DGetHeight()-this.DGetHeight();
			if(this.DGetY()>=length)
				this.DSetY(length);
			if(this.DGetY()<=0)
				this.DSetY(0);

			var di=length/(this.parentNode.interval*2);
			var value=this.parentNode.min+Math.floor((this.DGetY()+di)/length*this.parentNode.interval);
			
			if(this.parentNode.value!=value){
				this.parentNode.value=value;
				this.parentNode.onSliderValueChange(value);
			}
			
			if(this.parentNode.smooth==false)
				this.parentNode.setSliderValue(value);
		}
	}
	track.handles.onStartDrag=function(){
		this.parentNode.onStartDragHandles(this.parentNode.value);
	}
	track.handles.onStopDrag=function(){
		this.parentNode.onStopDragHandles(this.parentNode.value);
	}
	track.appendChild(track.handles);
	
	track.setSliderValue=function(value){
		if(value<this.min||value>this.max){
			return false;
		}
		var v=value-this.min;
		if(this.axis=="horizontal"){
			var length=this.DGetWidth()-this.handles.DGetWidth();
			var x=Math.floor(length*v/this.interval);//-this.handles.DGetWidth()/2
			this.handles.DSetX(x);
		}
		if(this.axis=="vertical"){
			var length=this.DGetHeight()-this.handles.DGetHeight();
			var y=Math.floor(length*v/this.interval);//-this.handles.DGetHeight()/2
			this.handles.DSetY(y);
		}
		this.value=value;
		return true;
	};
	track.DSetInterval=function(min,max){
		if(min>=max)
			return false;
		this.min=min;
		this.max=max;
		this.interval=this.max-this.min;
		return true;
	};
	track.DSetLength=function(length){
		if(this.axis=="horizontal")
			this.DSetWidth(length);
		else
			this.DSetHeight(length);
		this.setSliderValue(this.value);
		return true;
	};
	track.setSliderValue(track.value);
	return track;
}
//-------------------DScrollFrame------------------
function DScrollFrame(options){
	var style="default";//default,user
	var x=10;
	var y=10;
	var width=200;
	var height=300;
	var widthInner=300;
	var heightInner=400;
	
	//options
	if(options){
		if(options.style) style=options.style;
		if(options.x) x=options.x;
		if(options.y) y=options.y;
		if(options.width) width=options.width;
		if(options.height) height=options.height;
		if(options.widthInner) widthInner=options.widthInner;
		if(options.heightInner) heightInner=options.heightInner;
	}
	
	var bodyFrame = DCreateFrame({
		x:x,
		y:y,
		width:width,
		height:height
	});
	
	bodyFrame.widthScrolls=12;
	bodyFrame.intervalScrolls=10;
	bodyFrame.button=bodyFrame.widthScrolls;
	bodyFrame.heightHandles=0;
	bodyFrame.widthHandles=0;
	bodyFrame.buttonActive=false;
	//options
	if(options){
		if(options.widthScrolls) bodyFrame.widthScrolls=options.widthScrolls;
		if(options.intervalScrolls) bodyFrame.intervalScrolls=options.intervalScrolls;
		if(options.id) bodyFrame.id=options.id;
		if(options.button==false) bodyFrame.button=0;
		if(options.heightHandles) bodyFrame.heightHandles=options.heightHandles;
		if(options.widthHandles) bodyFrame.widthHandles=options.widthHandles;
	}
	
	bodyFrame.innerFrame = DCreateFrame({
		x:0,
		y:0,
		width:widthInner,
		height:heightInner,
		position:"relative"
	});
	bodyFrame.innerFrame.id=bodyFrame.id+"_innerFrame";
	bodyFrame.leftScroll=DSlider({
		id:bodyFrame.id+"_leftScroll",
		min:0,
		max:3,
		value:0,
		smooth:true,
		axis:"vertical"
	});
	bodyFrame.leftScroll.id=bodyFrame.id+"_leftScroll";
	bodyFrame.bottomScroll=DSlider({
		id:bodyFrame.id+"_bottomScroll",
		min:0,
		max:3,
		value:0,
		smooth:true
	});
	bodyFrame.bottomScroll.id=bodyFrame.id+"_bottomScroll";
	
	bodyFrame.windowFrame = DCreateFrame();
	bodyFrame.windowFrame.id=bodyFrame.id+"_windowFrame";
	
	bodyFrame.Scroller = DCreateFrame();
	bodyFrame.Scroller.id=bodyFrame.id+"_Scroller";
	
	if(bodyFrame.button){
		bodyFrame.TLButton=DCreateButton({
			id:bodyFrame.id+"_TLButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="TLButton";
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
		bodyFrame.appendChild(bodyFrame.TLButton);
		bodyFrame.BLButton=DCreateButton({
			id:bodyFrame.id+"_BLButton",
			width:bodyFrame.button,
			height:bodyFrame.button,
			onMouseDown:function(){
				this.parentNode.buttonActive="BLButton";
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
		bodyFrame.appendChild(bodyFrame.BLButton);
		bodyFrame.LBButton=DCreateButton({
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
		bodyFrame.RBButton=DCreateButton({
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
			if(but=="TLButton"){
				var value=this.leftScroll.value;
				if(value>this.leftScroll.min){
					value-=this.intervalScrolls;
					if(value<this.leftScroll.min)
						value=this.leftScroll.min;
					this.leftScroll.setSliderValue(value);
					this.innerFrame.DSetY((-1)*value);	
				}
				return true;
			}
			if(but=="BLButton"){
				var value=this.leftScroll.value;
				if(value<this.leftScroll.max){
					value+=this.intervalScrolls;
					if(value>this.leftScroll.max)
						value=this.leftScroll.max;
					this.leftScroll.setSliderValue(value);
					this.innerFrame.DSetY((-1)*value);
				}
				return true;
			}
			if(but=="LBButton"){
				var value=this.bottomScroll.value;
				if(value>this.bottomScroll.min){
					value-=this.intervalScrolls;
					if(value<this.bottomScroll.min)
						value=this.bottomScroll.min;
					this.bottomScroll.setSliderValue(value);
					this.innerFrame.DSetX((-1)*value);
				}
				return true;
			}
			if(but=="RBButton"){
				var value=this.bottomScroll.value;
				if(value<this.bottomScroll.max){
					value+=this.intervalScrolls;
					if(value>this.bottomScroll.max)
						value=this.bottomScroll.max
					this.bottomScroll.setSliderValue(value);
					this.innerFrame.DSetX((-1)*value);					
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
			},
		});
		bodyFrame.buttonTimer.parentScroll=bodyFrame;
	}

	
	//Default style
	if(style=="default"){
		bodyFrame.innerFrame.DSetStyle({
			backgroundColor:"#999999"
		});
		bodyFrame.leftScroll.DSetStyle({
			backgroundColor:"#bbbbbb"
		});
		bodyFrame.leftScroll.handles.DSetStyle({
			backgroundColor:"#ffff99"
		});
		bodyFrame.bottomScroll.DSetStyle({
			backgroundColor:"#bbbbbb"
		});
		bodyFrame.bottomScroll.handles.DSetStyle({
			backgroundColor:"#ff9999"
		});
		bodyFrame.windowFrame.DSetStyle({
			backgroundColor:"#99aacc"
		});
		bodyFrame.Scroller.DSetStyle({
			backgroundColor:"#ff7788"
		});
		if(bodyFrame.button){
			bodyFrame.TLButton.DSetStyle({
				backgroundColor:"#888888"
			});
			bodyFrame.BLButton.DSetStyle({
				backgroundColor:"#888888"
			});
			bodyFrame.LBButton.DSetStyle({
				backgroundColor:"#888888"
			});
			bodyFrame.RBButton.DSetStyle({
				backgroundColor:"#888888"
			});
		}
	}
	
	bodyFrame.DRefresh=function(){
		var leftScrollIs=0;
		var bottomScrollIs=0;
		if(this.innerFrame.DGetHeight()>this.DGetHeight())
			leftScrollIs=this.widthScrolls;
		if(this.innerFrame.DGetWidth()>this.DGetWidth()-leftScrollIs)
			bottomScrollIs=this.widthScrolls;
		if(this.innerFrame.DGetHeight()>this.DGetHeight()-bottomScrollIs)
			leftScrollIs=this.widthScrolls;
		
		this.windowFrame.DSetStyle({
			x:0,
			y:0,
			width:bodyFrame.DGetWidth()-leftScrollIs,
			height:bodyFrame.DGetHeight()-bottomScrollIs,
			overflow: "hidden"
		});
		
		
		if(leftScrollIs>0){
			this.leftScroll.DShow();
			if(this.button){
				this.TLButton.DShow();
				this.BLButton.DShow();
			}
		}
		else{
			this.leftScroll.DHide();
			if(this.button){
				this.TLButton.DHide();
				this.BLButton.DHide();
			}
		}
		
		if(bottomScrollIs>0){
			this.bottomScroll.DShow();
			if(this.button){
				this.LBButton.DShow();
				this.RBButton.DShow();
			}
		}
		else{
			this.bottomScroll.DHide();
			if(this.button){
				this.LBButton.DHide();
				this.RBButton.DHide();
			}
		}
		//info.innerHTML=leftScrollIs+"-"+bottomScrollIs+" - "+this.windowFrame.DGetHeight();
		
		if(bottomScrollIs>0&&leftScrollIs>0){
			this.Scroller.DShow();
			this.Scroller.DSetStyle({
				x:this.DGetWidth()-this.widthScrolls,
				y:this.DGetHeight()-this.widthScrolls,
				width:this.widthScrolls,
				height:this.widthScrolls
			});
		}
		else{
			this.Scroller.DHide();
		}
		//-------------leftScroll------------
		this.leftScroll.DSetStyle({
			x:this.DGetWidth()-this.widthScrolls,
			y:this.button,
			width:this.widthScrolls,
			height:this.DGetHeight()-2*this.button-bottomScrollIs
		});
		if(this.heightHandles<=0){
			var heightHandles=this.windowFrame.DGetHeight()/this.innerFrame.DGetHeight()*this.leftScroll.DGetHeight();
			if(heightHandles<10)
				heightHandles=10;
		}
		else{
			var heightHandles=this.heightHandles;
		}
		this.leftScroll.handles.DSetStyle({
			width:this.widthScrolls,
			height:heightHandles
		});
		//---------------bottomScroll-----------
		
		this.bottomScroll.DSetStyle({
			x:this.button,
			y:this.DGetHeight()-this.widthScrolls,
			width:this.DGetWidth()-2*this.button-leftScrollIs,
			height:this.widthScrolls
		});
		if(this.widthHandles<=0){
			var widthHandles=this.windowFrame.DGetWidth()/this.innerFrame.DGetWidth()*this.bottomScroll.DGetWidth();
			if(widthHandles<10)
				widthHandles=10;
		}
		else{
			var widthHandles=this.widthHandles;
		}
		this.bottomScroll.handles.DSetStyle({
			width:widthHandles,
			height:this.widthScrolls
		});
		
		//Set intrrvals for leftScroll and bottomScroll
		var max=this.innerFrame.DGetHeight()-this.windowFrame.DGetHeight();
		if(max!=Math.floor(max))
			max=Math.floor(max)+1;
		this.leftScroll.DSetInterval(0,max)
		max=this.innerFrame.DGetWidth()-this.windowFrame.DGetWidth();
		if(max!=Math.floor(max))
			max=Math.floor(max)+1;
		this.bottomScroll.DSetInterval(0,max);
		
		if(this.button){
			this.TLButton.DSetStyle({
				x:this.DGetWidth()-this.widthScrolls,
				y:0
			});
			this.BLButton.DSetStyle({
				x:this.DGetWidth()-this.widthScrolls,
				y:this.DGetHeight()-this.widthScrolls-bottomScrollIs
			});
			this.LBButton.DSetStyle({
				x:0,
				y:this.DGetHeight()-this.widthScrolls
			});
			this.RBButton.DSetStyle({
				x:this.DGetWidth()-this.widthScrolls-leftScrollIs,
				y:this.DGetHeight()-this.widthScrolls
			});
		}
	};
	
	bodyFrame.DSetPosOfInner=function(x,y){
		if(x>0||y>0)
			return false;
		this.innerFrame.DPosition(x,y);
		this.leftScroll.setSliderValue(x);
		this.bottomScroll.setSliderValue(y);
	}
	bodyFrame.DChangeSize=function(options){
		if(options.height){
			var dy=options.height-this.DGetHeight();
			if(((-1)*this.innerFrame.DGetY())>Math.abs(dy))
				this.innerFrame.DSetY(this.innerFrame.DGetY()+dy);
			else
				this.innerFrame.DSetY(0);
			this.leftScroll.setSliderValue((-1)*this.innerFrame.DGetY());
			this.DSetHeight(options.height);
		}
		if(options.width){
			var dx=options.width-this.DGetWidth();
			if(((-1)*this.innerFrame.DGetX())>Math.abs(dx))
				this.innerFrame.DSetX(this.innerFrame.DGetX()+dx);
			else
				this.innerFrame.DSetX(0);
			this.bottomScroll.setSliderValue((-1)*this.innerFrame.DGetX());
			this.DSetWidth(options.width);			
		}
		this.DRefresh();
	}
	bodyFrame.DRefresh();
	
	bodyFrame.leftScroll.onSliderValueChange=function(){
		if(this.value==this.max)
			this.parentNode.innerFrame.DSetY(
				(-1)*(this.parentNode.innerFrame.DGetHeight()-this.parentNode.windowFrame.DGetHeight()));
		else
			this.parentNode.innerFrame.DSetY(this.value*(-1));
		//info.innerHTML=this.parentNode.innerFrame.DGetY()+" - "+this.value;
		//DGetWidth
	}

	bodyFrame.bottomScroll.onSliderValueChange=function(){
		//info.innerHTML=f2.DGetY()+" - "+f2.DGetX()+" - "+this.value;
		if(this.value==this.max)
			this.parentNode.innerFrame.DSetX(
				(-1)*(this.parentNode.innerFrame.DGetWidth()-this.parentNode.windowFrame.DGetWidth()));
		else
			this.parentNode.innerFrame.DSetX(this.value*(-1));
	}
		
	bodyFrame.appendChild(bodyFrame.windowFrame);
	bodyFrame.windowFrame.appendChild(bodyFrame.innerFrame);
	bodyFrame.appendChild(bodyFrame.leftScroll);
	bodyFrame.appendChild(bodyFrame.bottomScroll);
	bodyFrame.appendChild(bodyFrame.Scroller);
	return bodyFrame;
}
////////////////////////////Sound/////////////////////////////
function DSWFFrame(src_swfframe, style){
var width=0;
var height=0;
if(style){
	if(style.width)width = style.width;
	if(style.height)height = style.width;
}

var swf = '<object id="swfFrame" width='+width+' height='+height+' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http:download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"><param name="movie" value='+src_swfframe+' /><param name="wmode" value="opaque"><param name="allowScriptAccess" value="sameDomain"/><embed src='+src_swfframe+' name="swfFrame" wmode="opaque" align="middle" play="true" loop="false" quality="high" allowScriptAccess="sameDomain"  width='+width+' height='+height+' scale="exactfit" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"></embed></object>';

var frm = DCreateFrame(style);
    frm.innerHTML = swf;
    
    if (navigator.appName.indexOf("Microsoft") != -1) {
        frm.swf = window["swfFrame"]
    }
    else {
        frm.swf = document["swfFrame"]
    }

  return frm;
}

function DSoundObject(){
if (navigator.appName.indexOf("Microsoft") != -1) {
        return window["DSound"]
    }
    else {
        return document["DSound"]
    }
}

//JS -> FLASH
//snd_obj.DOpen(src_load)
//snd_obj.DPlay()
//snd_obj.DPause()
//snd_obj.DStop()
//snd_obj.DOnProgress()
//snd_obj.DOnComplete()
//snd_obj.DOnError();
//snd_obj.DGetStatus();
//snd_obj.DGetPosition();
//snd_obj.DGetVolume();
//snd_obj.DSetVolume(value);
//snd_obj.DGetPan();
//snd_obj.DSetPan(value);
//snd_obj.DGetUrl();
//snd_obj.DRepeat("true");
//snd_obj.DGetRepeat();