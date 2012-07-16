/*---------------------------------------------------------
Класс CList
(for JavaScript)
Версия 2.0
----------------
Milk3D
07.02.2009

Конструктор:
  Не принимает ни какие параметры

Методы класса:
bool    add(str)		-	добовлять можно не только строки, но и объекты любого другова типа
bool    del(ind)       -    Delete
bool    clin()
int     getIndex(str)
bool    insertBefore(str,ind)
bool    rev()          -    Reverse

Пример:
var l1=new CList();
l1.add("a");
l1.add("b");
l1.add("c");
l1.add("d");
//l1.clin();
l1.add("e");

for(var i=0;i<l1.length;i++)
{
 document.write(l1.array[i]);
}
*/
function CList(){
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
		ind=-1;
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
			buf=this.array[i];
			this.array[i]=this.array[this.length-i-1];
			this.array[this.length-i-1]=buf;
		}
		return true;
	}
}