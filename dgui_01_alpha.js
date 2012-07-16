
//Глобальные переменные
gui_frame_id = 0;
gui_order = 0;

gui_object_id=0;//Id объектов
GUIObjects=new Object();//Ссылки на объекты через id

gui_drag = false;
gui_drag_counter = 0;//milk: Что делает эта пременная? (25.01.08)
gui_drop = false;

MouseX = 0;
MouseY = 0;

//Константы
DGUI_SPEED_MOVE = 20;
DGUI_BROWSER = DGetBrowser();
DGUI_DRAG_ZINDEX=1000;//zIndex фрейма при drag
DGUI_EMPTY_FUNCTIONS=function(){};



////////////////КЛАССЫ////////////////////

/////////////////ВСПОМОГАТЕЛЬЫЕ ФУНКЦИИ//////////////////
//List
function DList(){
    this.array = new Array();
    this.length = 0;

	this.add = function(str){
		this.array[this.length]=str;
		this.length++;
		return true;
	}
	this.del = function(ind){//Delete
		if(ind<0&&ind>=this.length){
			return false;
		}
		for(var i=ind;i<this.length-1;i++)
		{
			this.array[i]=this.array[i+1];
		}
		this.array[this.length-1]=0;
		this.length--;
		return true;
	}
	this.clin = function(){
		this.array=0;
		this.array=new Array();
		this.length=0;
		return true;
	}
	this.getIndex = function(str){
		var ind=-1;
		for(var i=0;i<this.length;i++)
		{
			if(this.array[i]==str){
				ind=i;
				break;
			}
		}
		return ind;
	}
	this.insertBefore = function(str,ind){
		if(ind<0&&ind>=this.length){
			return false;
		}
		for(var i=this.length-1;i>=ind;i--)
		{
			this.array[i+1]=this.array[i];
		}
		this.array[ind]=str;
		this.length++;
		return true;
	},
	this.rev = function(){//Reverse
		for(var i=0;i<this.length/2;i++)
		{
			var buf=this.array[i];
			this.array[i]=this.array[this.length-i-1];
			this.array[this.length-i-1]=buf;
		}
		return true;
	}
}

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

//Возвращает значение однго из свойств стиля
function DGetStyle(ent, name){
	return ent.style[name];
}
//Устанавливает стиль
function DSetStyle(ent, style){
	for(name in style){
		ent.style[name]=style[name];
	}
}
//Создаёт объект типа DStyle. style_1 = new DStyle({width:150, height:37});
function DStyle(style){
	for(name in style){
		this[name]=style[name];
	}
}
/////////////////БАЗОВЫЕ ФУНКЦИИ//////////////////

//Создание основы окна (фрейм)
function DCreateFrame(style)
{
	ent = document.createElement("div");
    ent.act = true;
    //ent.color;
    ent.alpha = 1.0;
	ent.mouseover = false;
    
	//ent.color = color;
    
    gui_frame_id++;
    ent.id = "frame_" + gui_frame_id;
    
    gui_order++;
    
    ent.style.zIndex = gui_order;//Нужно ли это?
    ent.style.position = "absolute";
	/*
	if(width)
		ent.style.width = width + "px";
	if(height)
		ent.style.height = height + "px";
	if(color)
		ent.style.backgroundColor = color;
	*/
	
    ent.style.left = "0px";
    ent.style.top = "0px";

	ent.style.display = "block";
	ent.style.overflow = "visible";
	if(style)
		DSetStyle(ent, style);
	
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
	ent.DGetAlpha = DGetAlphaFrame;
	
	ent.alpha=100;
	ent.DAlphaAnimate=DAlphaAnimate;
	
	ent.DAlignToFrame = DAlignToFrame;
	
	
	ent.DSize = DSizeFrame;
	ent.DPosition = DPositionFrame;
	ent.DHide = DHideFrame;
	ent.DShow = DShowFrame;
	ent.DAlpha = DAlphaFrame;
	ent.DColor = DColorFrame;
	ent.DColorText = DColorText;
	ent.DMove = DMoveFrame;
	ent.DImage = DImageToFrame;
	//---------------24.01.2009------------
	ent.DSetClassName = DSetClassName;
	ent.DGetClassName = DGetClassName;
	//-------------------------------------
	ent.DDrag = DDragFrame;
	ent.DDrop = DDropFrame;
	ent.DDelDrag = DDelDragFrame;
	ent.DDelDrop = DDelDropFrame;
	
	ent.DGetStyle = function(name){
		return this.style[name];
	}
	//Пораметр style это объект
	ent.DSetStyle = function(style){
		for(name in style){
			this.style[name]=style[name];
		}
	}

	return ent;
}


function DAlphaAnimate(alpha_from, alpha_to, delay)
{
	if(this.alpha >= alpha_to && this.alpha <= alpha_from) 
	{
		if(this.alpha == alpha_to) return true;
				
		this.alpha=this.alpha-1;
		this.DAlpha(this.alpha);
		setInterval("document.getElementById('"+this.id+"').DAlphaAnimate("+alpha_from+", "+alpha_to+", "+delay+")", delay);
	}

	if(this.alpha <= alpha_to && this.alpha >= alpha_from) 
	{
		if(this.alpha == alpha_to) return true;
		
		this.alpha=this.alpha+1;
		this.DAlpha(this.alpha);
		setInterval("document.getElementById('"+this.id+"').DAlphaAnimate("+alpha_from+", "+alpha_to+", "+delay+")", delay);
	}	
	
	
	
}

//Расположение фрейма относительно другого фрейма
function DAlignToFrame(frm_parent, align)
{
	if(align == "center")
	{
		frm_parent.align = "center";
		this.DPosition(frm_parent.DGetWidth()/2 - this.DGetWidth()/2, frm_parent.DGetHeight()/2 - this.DGetHeight()/2);
		return(true);
	}
	if(align == "center_up")
	{
		frm_parent.align = "center";
		this.DPosition(frm_parent.DGetWidth()/2 - this.DGetWidth()/2, 10);
		return(true);
	}

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

function DGetAlphaFrame(){
	return 	parseInt(this.style.alpha);
}


//Изменение размера фрейма
function DSizeFrame(width, height, inc){
	if(!inc) inc = "px";
	this.style.width = width + inc;
	this.style.height = height + inc;
}

//Изменение видимости фрейма
function DHideFrame(){
	this.act = false;
	this.style.display = "none";
}
function DShowFrame(){
	this.act = true;
	this.style.display = "block";
}
//Прозрачность фрейма
function DAlphaFrame(alpha){
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
}

//Цвет фрейма
function DColorFrame(color){
	if (!this.input) this.style.backgroundColor = color;
	if (this.input) this.input.style.backgroundColor = color;//--------несовсем то что надо
	
}

function DColorText(color){
	if (!this.input) this.style.color = color;
	if (this.input) this.input.style.color = color;//--------несовсем то что надо
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

function DImageToFrame(image_src, repeat_bool){
	var repeat=(repeat_bool)?"repeat":"no-repeat";
	this.style.backgroundImage = "url(" + image_src + ")";
	this.style.backgroundRepeat = repeat; //-----"repeat" "no-repeat"
}

//---------------24.01.2009------------
//Устанавливаем className для фрейма
function DSetClassName(className){
	this.className = className;
}
//Получаем className фрейма
function DGetClassName(){
	return this.className;
}


//Задаёт фрейму Drag свойства
function DDragFrame(met,logo){
//met = none, never, drag, drag_logo;

	//this.dragMethod = "none";//Milk: Я изменил значение этого пораметра, на режм перетаскивания смотри функцию DDragFrame
	//this.dragLogo = false;
	this.zIndexBuf;//Хранит значение zIndex фрейма на время его перемещения
	
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
		//if(e.preventDefault) e.preventDefault(); else e.returnValue = false;
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
function DParentFrame(frm, parent_frm){//под вопросом
	parent_frm.appendChild(frm);
}



//////////////////// ТЕКСТ //////////////////////////////
function DCreateText(text, style)
{
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
function DCreateTextBlock(text, style)
{
	//x, y, width, height, size, text, color, color_frame
	txt = DCreateFrame(style);
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
	var x=options.x;//<-------------------------проверить!!!
	var y=options.y;
	var width=options.width||30;
	var height=options.height||15;

	btn = DCreateFrame({width:width,height:height});
	
	btn.onMouseOver=function(){};
	btn.onMouseOut=function(){};
	btn.onMouseMove=function(){};
	btn.onMouseDown=function(){};
	btn.onMouseUp=function(){};
	btn.onClick=function(){};
	
	btn.onMouseOverEf=function(){};
	btn.onMouseOutEf=function(){};
	btn.onMouseMoveEf=function(){};
	btn.onMouseDownEf=function(){};
	btn.onMouseUpEf=function(){};
	btn.onClickEf=function(){};
	
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
	}
	
	btn.secondLayer = DCreateFrame({width:width,height:height});
	btn.firstLayer = DCreateFrame({width:width,height:height});
	
	btn.appendChild(btn.firstLayer);
	btn.appendChild(btn.secondLayer);
	
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
	but=DCreateButton(options);
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
	//Milk: надо доделать задание свойств эффектам через options. 7.2.2009 
	but.ef_d_first=DEffectDisappear(but.firstLayer,{to:0,interval:20,speed:3});
	but.ef_a_first=DEffectAppear(but.firstLayer,{to:100,interval:20,speed:3});
	
	but.ef_d_second=DEffectDisappear(but.secondLayer,{to:0,interval:20,speed:3});
	but.ef_a_second=DEffectAppear(but.secondLayer,{to:100,interval:20,speed:3});
	
	but.secondLayer.DAlpha(0);
	
	but.onMouseOverEf=function(e){
		this.ef_d_second.stop();
		this.ef_a_second.start();
		
		this.ef_a_first.stop();
		this.ef_d_first.start();
	}
	but.onMouseOutEf = function(e){
		this.ef_a_second.stop();
		this.ef_d_second.start();
		
		this.ef_d_first.stop();
		this.ef_a_first.start();
	}
	return but;
}
//////////////////// ПОЛЯ ВВОДА ТЕКСТА //////////////////////////////

function DCreateInputText(x,y, length, start_text, type, margin)
{
	var edit_txt = DCreateFrame();
	edit_txt.DPosition(x,y);
	edit_txt.type = "edit";
	
	if (type == "text")
	{
		edit_txt.input = document.createElement('input');
		edit_txt.input.type = "text";
	}
	if (type == "text_block")
	{
		edit_txt.input = document.createElement('textarea');
	}
	
	if(!margin) margin = 0;
	
	edit_txt.input.value = start_text;
	edit_txt.input.size = length;
	edit_txt.input.style.color = "#eee";
	edit_txt.input.style.backgroundColor = "transparent";
	edit_txt.input.style.borderWidth = 0;
		
    edit_txt.appendChild( edit_txt.input );
	edit_txt.DSize(edit_txt.input.offsetWidth + margin*2, edit_txt.input.offsetHeight + margin*2);
	edit_txt.input.style.marginLeft = margin+5;//---------???Milk: Нужно ли это???
	edit_txt.input.style.marginTop = margin;
	
	edit_txt.input.size = length -3;// -3???
	
	edit_txt.DGetValue = DGetValueInputText;
	edit_txt.DSetValue = DSetValueInputText;

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
///////////////////// TIMER //////////////////
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
//////////////////// ЭФФЕКТЫ /////////////////
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
/////////////////////////// AJAX //////////////////////////////
//ст.65
//http://msdn.microsoft.com/en-us/library/ms760305(VS.85).aspx
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
			this.onError("Невозможно соединиться с сервером:\n" + e.toString());
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