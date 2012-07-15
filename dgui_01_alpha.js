
//Глобальные переменные
gui_frame_id = 0;
gui_order = 0;

gui_drag = false;
gui_drag_counter = 0;

MouseX = 0;
MouseY = 0;
MouseX_old = 0;
MouseY_old = 0;

//Константы
gui_speed_move = 20;


////////////////КЛАССЫ////////////////////

//Класс фрема
function TFrame() 
{
    this.width;
    this.height;
    this.parent_frame;
    this.order = 0;
    this.ent;
    this.x = 0;
    this.y = 0;
    this.act = true;
    this.color;
    this.alpha = 1.0;
	this.mouseover = false;
	
    this.DCreateFrame = DCreateFrame;
	this.DSizeFrame = DSizeFrame;
	this.DPositionFrame = DPositionFrame;
	this.DHideFrame = DHideFrame;
	this.DAlphaFrame = DAlphaFrame;
	this.DColorFrame = DColorFrame;
	this.DMoveFrame = DMoveFrame;
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



/////////////////БАЗОВЫЕ ФУНКЦИИ//////////////////

//Создание основы окна (фрейм)
function DCreateFrame(width, height, color)
{
    
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
    this.color = color;
    
    gui_frame_id++;
    this.id = "frame_" + gui_frame_id;
    
    gui_order++;
    this.order = gui_order;
    
    this.ent = document.createElement("div");
    this.ent.id = this.id;
    this.ent.style.width = this.width + "px";
    this.ent.style.height = this.height + "px";
    this.ent.style.zIndex = this.order;
    this.ent.style.position = "absolute";
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
	this.parent_frm = document.body;
	document.body.appendChild(this.ent);
}

//Изменение размера фрейма
function DSizeFrame(width, height)
{
	this.width = width;
	this.height = height;
	
	this.ent.style.width = this.width;
	this.ent.style.height = this.height;
}

//Изменение видимости фрейма
function DHideFrame(bool)
{

	if(bool == true)
	{
		this.act = false;
		this.ent.style.display = "none";
	}
	else
	{
		this.act = true;
		this.ent.style.display = "block";
	}
}

//Прозрачность фрейма
function DAlphaFrame(alpha)
{
	this.alpha = alpha/100.0;
	//Для Opera, Mozilla
	this.ent.style.opacity = this.alpha;	
	//Для IE
	this.ent.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity="+alpha+")";
}

//Цвет фрейма
function DColorFrame(color)
{
	this.color = color;
	this.ent.style.backgroundColor = color;
}

//Изменение положения фрейма
function DPositionFrame(x, y)
{
	this.ent.style.left = x+"px";
	this.ent.style.top = y+"px";
	
	this.x = x;
	this.y = y;
}

//Движение фрейма
function DMoveFrame(movex, movey)
{
	x = movex + this.x;
	y = movey + this.y;
	this.DPositionFrame(x, y);
}

//Обработка drag-and-drop фрейма frm
function DDragFrame(frm, met)//старое насвание DOnMouseFrame
{
	//met = none, never, drag;
	el = document.getElementById(frm.id);
	
	el.drag=met;
	
	if (el.drag == "none")
	{
		el.onmousedown = function(e){};
		document.onmouseup = function(){};
		document.onmousemove = function(e){};
	}
	
	if (el.drag == "never"){//milk: Эта опция не совсем корректно работает, жду подтверждения идеи и тогда будем
		//думать что сделать. Не корректность заключается в том что при этом блокируется событие OnClick, хотя это не проверенно
		el.onmousedown = function(e){
			e = e||event;	
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
 			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		};
		document.onmouseup = function(){};
		document.onmousemove = function(e){};
	}
	
	if(el.drag == "drag"){
		el.onmousedown = function(e){
			e = e||event;	
			//alert(this.id+" - "+e.offsetX+" - "+e.offsetY);
			//gui_drag = [ this, document.body.scrollLeft+(e.x || e.clientX)-parseInt(this.style.left), 
			//	document.body.scrollLeft+(e.y || e.clientY)-parseInt(this.style.top)];
			gui_drag = [ this, (e.x || e.clientX)-parseInt(this.style.left), 
				(e.y||e.clientY)-parseInt(this.style.top)];
			//alert(this.id+" - "+gui_drag[1]+" - "+gui_drag[2]);
			if(e.stopPropagation) e.stopPropagation(); else e.cancelBubble = true;
 			if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
		}
	
		document.onmouseup = function(){
			gui_drag = false;
		}
	
		document.onmousemove = function(e){
			e = e || event;   
			
			//MouseX = document.body.scrollLeft + ( e.x || e.clientX );
			//MouseY = document.body.scrollTop + ( e.y || e.clientY );
			
			MouseX = e.x || e.clientX;
			MouseY = e.y || e.clientY;
   	    
			gui_drag[0].style.left = MouseX - gui_drag[1] + "px";
			gui_drag[0].style.top = MouseY - gui_drag[2] + "px";
	
			frm.x = MouseX - gui_drag[1];
			frm.y = MouseY - gui_drag[2];
		
			if(e.stopPropagation) e.stopPropagation();	else e.cancelBubble = true;
			if(e.preventDefault) e.preventDefault();	else e.returnValue = false;
	   }
	}
}

function DParentFrame(frm, parent_frm)
{
	//frm.ent=frm.parent_frm.removeChild(frm.ent);
	parent_frm.ent.appendChild(frm.ent);
	frm.parent_frm = parent_frm;
	//parent_frm.child_frm = frm;
}

/////////////////ОСНОВНЫЕ ФУНКЦИИ//////////////////

//Создание текста
function DCreateText(x ,y , size, text, ent_parent)
{
    var a_tmp = document.createElement('a');
    a_tmp.style.fontSize = size;
	a_tmp.innerHTML = text;
    document.body.appendChild( a_tmp );
    var width = a_tmp.offsetWidth;
	var height = a_tmp.offsetHeight;
    document.body.removeChild( a_tmp );
	
	this.frm.DCreateFrame(width, height,"#99ff99");
	this.frm.DPositionFrame(x, y);
	this.frm.ent.style.fontSize = size + "px";
	this.frm.ent.innerHTML = text;
}