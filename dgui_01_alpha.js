
//Глобальные переменные
gui_frame_id = 0;
gui_order = 0;

gui_drag = false;
gui_drag_counter = 0;//milk: Что делает эта пременная? (25.01.08)
gui_drop = false;

MouseX = 0;
MouseY = 0;

GUI=new Object();

//Константы
DGUI_SPEED_MOVE = 20;
DGUI_BROWSER = DGetBrowser();
DGUI_DRAG_ZINDEX=1000;//zIndex фрейма при drag



////////////////КЛАССЫ////////////////////

/////////////////ВСПОМОГАТЕЛЬЫЕ ФУНКЦИИ//////////////////

//Получение типа используемого браузера
function DGetBrowser()
{
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


/////////////////БАЗОВЫЕ ФУНКЦИИ//////////////////



//Создание основы окна (фрейм)
function DCreateFrame(width, height, color)
{
	ent = document.createElement("div");
    ent.act = true;
    ent.color;
    ent.alpha = 1.0;
	ent.mouseover = false;
	
	ent.dragMethod = "none";//Milk: Я изменил значение этого пораметра, на режм перетаскивания смотри функцию DDragFrame
	ent.dragLogo = false;
	ent.zIndexBuf;//Хранит значение zIndex фрейма на время его перемещения
    
	
	ent.color = color;
    
    gui_frame_id++;
    ent.id = "frame_" + gui_frame_id;
    
    gui_order++;
    
    ent.style.zIndex = gui_order;
    ent.style.position = "absolute";
	ent.style.width = width + "px";
    ent.style.height = height + "px"; 
    ent.style.backgroundColor = color;
    ent.style.left = "0px";
    ent.style.top = "0px";

		//её старое насвание DOnMouseFrame
	ent.style.display = "block";
	ent.style.overflow = "visible";
	
	GUI[ent.id]=ent;
		
	document.body.appendChild(ent);
	
	ent.DGetX = DGetXFrame;
	ent.DGetY = DGetYFrame;
	ent.DGetWidth = DGetWidthFrame;
	ent.DGetHeight = DGetHeightFrame;
	ent.DSetX = DSetXFrame;
	ent.DSetY = DSetYFrame;
	ent.DSetWidth = DSetWidthFrame;
	ent.DSetHeight = DSetHeightFrame;
	ent.DGetZ = DGetZFrame;
	ent.DSetZ = DSetZFrame;
	
	
	ent.DSize = DSizeFrame;
	ent.DPosition = DPositionFrame;
	ent.DHide = DHideFrame;
	ent.DAlpha = DAlphaFrame;
	ent.DColor = DColorFrame;
	ent.DMove = DMoveFrame;
	ent.DImage = DImageToFrame;
	//---------------24.01.2009------------
	ent.DSetClassName = DSetClassName;
	ent.DGetClassName = DGetClassName;
	//-------------------------------------
	ent.DDrag = DDragFrame;
	ent.DDrop = DDropFrame;
	return ent;
}


//Значение X координаты фрейма
function DGetXFrame(){
	return 	parseInt(this.style.left);
}
//Значение Y координаты фрейма
function DGetYFrame(){
	return 	parseInt(this.style.top);
}
//Значение ширины/длины фрейма
function DGetWidthFrame(){
	return 	parseInt(this.style.width);
}
//Значение высоты фрейма
function DGetHeightFrame(){
	return 	parseInt(this.style.height);
}
//Значение по оси Z фрейма
function DGetZFrame(){
	return 	parseInt(this.style.zIndex);
}
//Устанавливаем X координату фрейма
function DSetXFrame(x){
	this.style.left = x;
}
//Устанавливаем Y координату фрейма
function DSetYFrame(y){
	this.style.top = y;
}
//Значение ширины/длины фрейма
function DSetWidthFrame(width){
	this.style.width = width;
}
//Значение высоты фрейма
function DSetHeightFrame(height){
	this.style.height = height;
}
//Значение по оси Z фрейма
function DSetZFrame(zindex){
	this.style.zIndex = zindex;
}

//Изменение размера фрейма
function DSizeFrame(width, height, inc){
	this.style.width = width + inc;
	this.style.height = height + inc;
}

//Изменение видимости фрейма
function DHideFrame(bool){
	if(bool == "undefened") bool = true;
	
	if(bool == true){
		this.act = false;
		this.style.display = "none";
	}
	else{
		this.act = true;
		this.style.display = "block";
	}
}

//Прозрачность фрейма
function DAlphaFrame(alpha){
	alpha_ = alpha/100.0;
	//Для Opera, Mozilla
	this.style.opacity = alpha_;
	//Для IE
	this.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
}

//Цвет фрейма
function DColorFrame(color){
	this.style.backgroundColor = color;
}

//Изменение положения фрейма
function DPositionFrame(x, y){
	this.style.left = x+"px";
	this.style.top = y+"px";
}

//Движение фрейма
function DMoveFrame(movex, movey){
	x = movex + this.DGetXFrame();
	y = movey + this.DGetYFrame();
	this.DPositionFrame(x, y);
}

function DImageToFrame(image_src, repeat_bool)
{
	var repeat = "no-repeat";
	if(!repeat_bool) repeat = "no-repeat";
	if(repeat_bool) repeat = "repeat";

	this.style.backgroundImage = "url(" + image_src + ")";
	this.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
}

//---------------24.01.2009------------
//Устанавливаем className для фрейма
function DSetClassName(className)
{
	this.className = className;
}
//Получаем className фрейма
function DGetClassName()
{
	return this.className;
}

//Задаёт фрейму Drag свойства
function DDragFrame(met,logo){//760
	//met = none, never, drag;
	
	//Убрать обьявления этих событий из DCreateFrame <-------------- !!!!!!
	this.OnStartDrag = function(){};
	this.OnStopDrag = function(){};
	this.OnDrag = function(){};

	if(!logo)
	  logo=false;
	
	this.dragMethod=met;
	this.dragLogo=logo;
	
	if (this.dragMethod == "none"){
		this.onmousedown = function(e){};
	}
	
	if (this.dragMethod == "never"){//milk: Эта опция не совсем корректно работает, жду подтверждения идеи и тогда будем
		//думать что сделать. Не корректность заключается в том что при этом блокируется событие OnClick, хотя это не проверенно
		this.onmousedown = function(e){
			e = e||event;	
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
 			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		};
	}
	
	if(this.dragMethod == "drag"){
		this.onmousedown = function(e){
			e = e||event;	
			gui_drag = [ this, (e.x || e.clientX)-parseInt(this.style.left), 
				(e.y||e.clientY)-parseInt(this.style.top),"start"];
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
			gui_drag = [ this, (e.x || e.clientX)-parseInt(this.style.left), 
				(e.y||e.clientY)-parseInt(this.style.top),"start"];
			
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
				
				if(gui_drop){
					gui_drop[0].onStopHover(gui_drag[0]); // Cобытие onStopHover
					gui_drop[0].onDrop(gui_drag[0]); //Cобытие onDrop
					gui_drop=false;
				}
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
		  MouseX = e.x || e.clientX;
		  MouseY = e.y || e.clientY;
   	    
		  if(gui_drag[3]=="start"){
			
			if(gui_drag[0].dragMethod=="drag_logo"){//Для типа drag_logo
			  if(gui_drag[0].dragLogo!=false){
				gui_drag[0].dragLogo.style.display = "block";
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
			if(gui_drop){
				gui_drop[0].onHover(gui_drag[0]);//событие onHover
			}
		  }
		  if(gui_drag[0].dragMethod=="drag"){
			gui_drag[0].style.left = MouseX - gui_drag[1] + "px";
			gui_drag[0].style.top = MouseY - gui_drag[2] + "px";
		  }
		  
		  gui_drag[0].OnDrag();//Событие OnDrag
	
		  if(e.stopPropagation) e.stopPropagation();	else e.cancelBubble = true;
		  if(e.preventDefault) e.preventDefault();	else e.returnValue = false;
		}
	}
}

//Задаёт фрейму Drag свойства
function DDropFrame(options){
	//this.dropStatus="notHover";
	this.dropOptions=options;
	this.onStartHover=function(drag_frame){};
	this.onHover=function(drag_frame){};
	this.onStopHover=function(drag_frame){};
	this.onDrop=function(drag_frame){};
	if(options){
		this.acceptFrames=options.acceptFrames;
		this.acceptClasses=options.acceptClasses;
		this.acceptId=options.acceptId;
	}
	
	this.onmouseover=function(e){
		if(gui_drag){
			accept=false;
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
			
			if(accept){
				e = e || event;
				gui_drop=[this];
				this.onStartHover(gui_drag[0]); //Cобытие onStartHover
				if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
				if(e.preventDefault) e.preventDefault(); else e.returnValue = false;	
			}
		
		}
	};
	this.onmouseout=function(e){
		if(gui_drop){
			e = e || event;
			gui_drop=false;
			this.onStopHover(gui_drag[0]); //Cобытие onStopHover
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		}
	};
}

function DParentFrame(frm, parent_frm){
	parent_frm.appendChild(frm);
}

//////////////////// ТЕКСТ //////////////////////////////
function DCreateText(x , y, size, text, color, color_frame)
{
    var a_tmp = document.createElement('a');
    a_tmp.style.fontSize = size;
    a_tmp.innerHTML = text;
    document.body.appendChild( a_tmp );
    var width = a_tmp.offsetWidth;
    var height = a_tmp.offsetHeight;
    document.body.removeChild( a_tmp );
    
    txt = DCreateFrame(width, height, color_frame);
    txt.DColor(color);
    txt.DPosition(x, y);
    txt.style.fontSize = size + "px";
    txt.innerHTML = text;

    txt.DSetText = DSetText;
    txt.DGetText = DGetText;

    return txt;
}

function DSetText(texts)
{
    this.innerHTML = texts;
}

function DGetText()
{
    return this.innerHTML;
}

//Создание блока для текста
function DCreateTextBlock(x, y, width, height, size, text, color, color_frame)
{
    txt = DCreateFrame(width, height, color_frame);
    txt.DColorText(color);
    txt.DPosition(x, y);
    txt.style.fontSize = size + "px";
    txt.innerHTML = text;

    txt.DSetText = DSetText;
    txt.DGetText = DGetText;

    return txt;
}

