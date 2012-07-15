
//Глобальные переменные
gui_frame_id = 0;
gui_order = 0;

gui_drag = false;
gui_drag_counter = 0;

MouseX = 0;
MouseY = 0;

GUI=new Object();

//Константы
DGUI_SPEED_MOVE = 20;
DGUI_BROWSER = DGetBrowser();



////////////////КЛАССЫ////////////////////

//Класс фрема
function TFrame() 
{
    this.ent;
    this.act = true;
    this.color;
    this.alpha = 1.0;
	this.mouseover = false;
	
	this.DGetXFrame = DGetXFrame;
	this.DGetYFrame = DGetYFrame;
	this.DGetWidthFrame = DGetWidthFrame;
	this.DGetHeightFrame = DGetHeightFrame;
	this.DSetXFrame = DSetXFrame;
	this.DSetYFrame = DSetYFrame;
	this.DSetWidthFrame = DSetWidthFrame;
	this.DSetHeightFrame = DSetHeightFrame;
	this.DGetZFrame = DGetZFrame;
	this.DSetZFrame = DSetZFrame;
	
	
    this.DCreateFrame = DCreateFrame;
	this.DSizeFrame = DSizeFrame;
	this.DPositionFrame = DPositionFrame;
	this.DHideFrame = DHideFrame;
	this.DAlphaFrame = DAlphaFrame;
	this.DColorFrame = DColorFrame;
	this.DMoveFrame = DMoveFrame;
	this.DImageToFrame = DImageToFrame;
	//---------------24.01.2009------------
	this.DSetClassName = DSetClassName;
	this.DGetClassName = DGetClassName;
	//-------------------------------------
}

//Класс текста
function TText()
{
	this.frm = new TFrame;
	this.txt;
	this.text;
	this.color_text;
	this.color_fon;
	
	this.DCreateText = DCreateText;
}



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
    
    this.color = color;
    
    gui_frame_id++;
    this.id = "frame_" + gui_frame_id;
    
    gui_order++;
    

	this.ent = document.createElement("div");
    this.ent.id = this.id;
    this.ent.style.zIndex = gui_order;
    this.ent.style.position = "absolute";
	this.ent.style.width = width + "px";
    this.ent.style.height = height + "px"; 
    this.ent.style.backgroundColor = color;
    this.ent.style.left = "0px";
    this.ent.style.top = "0px";
	this.ent.drag = "none";//Milk: Я изменил значение этого пораметра, на режм перетаскивания смотри функцию DDragFrame
		//её старое насвание DOnMouseFrame
	this.ent.style.display = "block";
	this.ent.style.overflow = "visible";
	
	this.ent.onmousedown = function(e){
	//	e = e || event;
	//	alert(this.id+" - "+e.offsetX+" - "+e.offsetY);
	//	e.offsetX=parseInt(this.style.left)+e.offsetX;
	//	e.offsetY=parseInt(this.style.top)+e.offsetY;
	};
	
	this.OnStartDrag = function(){};
	this.OnStopDrag = function(){};
	this.OnDrag = function(){};
	GUI[this.id]=this;
	document.body.appendChild(this.ent);
}


//Значение X координаты фрейма
function DGetXFrame(){
	return 	parseInt(this.ent.style.left);
}
//Значение Y координаты фрейма
function DGetYFrame(){
	return 	parseInt(this.ent.style.top);
}
//Значение ширины/длины фрейма
function DGetWidthFrame(){
	return 	parseInt(this.ent.style.width);
}
//Значение высоты фрейма
function DGetHeightFrame(){
	return 	parseInt(this.ent.style.height);
}
//Значение по оси Z фрейма
function DGetZFrame(){
	return 	parseInt(this.ent.style.zIndex);
}
//Устанавливаем X координату фрейма
function DSetXFrame(x){
	this.ent.style.left = x;
}
//Устанавливаем Y координату фрейма
function DSetYFrame(y){
	this.ent.style.top = y;
}
//Значение ширины/длины фрейма
function DSetWidthFrame(width){
	this.ent.style.width = width;
}
//Значение высоты фрейма
function DSetHeightFrame(height){
	this.ent.style.height = height;
}
//Значение по оси Z фрейма
function DSetZFrame(zindex){
	this.ent.style.zIndex = zindex;
}

//Изменение размера фрейма
function DSizeFrame(width, height, inc){
	this.ent.style.width = width + inc;
	this.ent.style.height = height + inc;
}

//Изменение видимости фрейма
function DHideFrame(bool){
	if(bool == "undefened") bool = true;
	
	if(bool == true){
		this.act = false;
		this.ent.style.display = "none";
	}
	else{
		this.act = true;
		this.ent.style.display = "block";
	}
}

//Прозрачность фрейма
function DAlphaFrame(alpha){
	alpha_ = alpha/100.0;
	//Для Opera, Mozilla
	this.ent.style.opacity = alpha_;
	//Для IE
	this.ent.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
}

//Цвет фрейма
function DColorFrame(color){
	this.ent.style.backgroundColor = color;
}

//Изменение положения фрейма
function DPositionFrame(x, y){
	this.ent.style.left = x+"px";
	this.ent.style.top = y+"px";
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

	this.ent.style.backgroundImage = "url(" + image_src + ")";
	this.ent.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
}

//---------------24.01.2009------------
//Устанавливаем className для фрейма
function DSetClassName(className)
{
	this.ent.className = className;
}
//Получаем className фрейма
function DGetClassName()
{
	return this.ent.className;
}
//-------------------------------------
//Обработка drag-and-drop фрейма frm
function DDragFrame(frm, met){//старое насвание DOnMouseFram{
	//met = none, never, drag;
	el = document.getElementById(frm.id);
	
	el.drag=met;
	
	if (el.drag == "none"){
		el.onmousedown = function(e){};
	}
	
	if (el.drag == "never"){//milk: Эта опция не совсем корректно работает, жду подтверждения идеи и тогда будем
		//думать что сделать. Не корректность заключается в том что при этом блокируется событие OnClick, хотя это не проверенно
		el.onmousedown = function(e){
			e = e||event;	
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
 			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		};
	}
	
	if(el.drag == "drag"){
		el.onmousedown = function(e){
			e = e||event;	
			gui_drag = [ this, (e.x || e.clientX)-parseInt(this.style.left), 
				(e.y||e.clientY)-parseInt(this.style.top),"start"];
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
 			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		}
	}
	
	//Milk: Инициализация этих 2х событий должна прохадить во время или после создания докумета,но до использования функции drag
	document.onmouseup = function(){
		if(gui_drag){
		    GUI[gui_drag[0].id].OnStopDrag();
			gui_drag = false;
		}
	}
	document.onmousemove = function(e){
		if(gui_drag){
		  e = e || event;
		  MouseX = e.x || e.clientX;
		  MouseY = e.y || e.clientY;
   	    
		  if(gui_drag[3]=="start"){
			gui_drag[3]=="process";
			GUI[gui_drag[0].id].OnStartDrag();
		  }
		
		  gui_drag[0].style.left = MouseX - gui_drag[1] + "px";
		  gui_drag[0].style.top = MouseY - gui_drag[2] + "px";
		  
		  GUI[gui_drag[0].id].OnDrag();
	
		  if(e.stopPropagation) e.stopPropagation();	else e.cancelBubble = true;
		  if(e.preventDefault) e.preventDefault();	else e.returnValue = false;
		}
	}
}

function DParentFrame(frm, parent_frm){
	parent_frm.ent.appendChild(frm.ent);
}




/////////////////ОСНОВНЫЕ ФУНКЦИИ//////////////////

//Создание текста
function DCreateText(x ,y , size, text, color, color_frame, ent_parent)
{
    //var a_tmp = document.createElement('a');
    //a_tmp.style.fontSize = size;
	//a_tmp.innerHTML = text;
    //document.body.appendChild( a_tmp );
    //var width = a_tmp.offsetWidth;
	//var height = a_tmp.offsetHeight;
    //document.body.removeChild( a_tmp );
	
	//this.frm.DCreateFrame(width, height, color_frame);
	this.frm.DCreateFrame(120, 40, color_frame);
	this.frm.ent.style.color = color;
	this.frm.DPositionFrame(x, y);
	this.frm.ent.style.fontSize = size + "px";
	this.frm.ent.innerHTML = text;
}