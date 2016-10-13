/**
 * @author Administrator
 */

//命名空间  BH  namespace 
var BH = {};
//1 接口类  Class Interface ==>实例化N多个接口
	/**
	 * Interface Class
	 * 接口类需要2个参数吗？
	 * 参数1：接口的名字
	 * 参数2：接收方法名称的集合（数组）
	 */
	BH.Interface = function( name, methods ){
		//判断接口的参数个数
		if( arguments.length != 2){
			throw new Error(' this instace interface constructor arguments must be 2 length');
		}
		this.name = name;
		this.methods = [];//定义一个内置的空数组对象 等待接收methods里的元素 方法名称
		for( var i = 0, len = methods.length; i < len; i ++ ){
			if( typeof methods[i]!== 'string' ){
				throw Error('method name must  be string!');
			}
			
			this.methods.push( methods[i] );
		}
	}
	
	//3 检验接口里的方法
	//如果检验通过  不做任何操作  不通过 浏览器抛出error
	//这个方法目的就是检测接口的方法
	// Interface static method  
	BH.Interface.ensureImplements = function( object ){
		//如果检测方法接收的参数个数小于2，参数传递失败
		if( arguments.length < 2 ){
			throw new Error('interface.ensureImplements method constructor arguments must be >= 2');
		}
		//获得接口实例对象
		// 第一个参数是实例对象 没用  
		for( var i = 1, len = arguments.length; i < len; i ++ ){
			var instanceInterface = arguments[i];
			
			if( instanceInterface.constructor !== BH.Interface ){
				throw new Error('the arguments constructor not be Interface Class!');
			}
			//循环接口实例对象里面的每一个方法
			for( var j = 0; j <instanceInterface.methods.length; j++){
				//用一个临时变脸接受每一个方法的名字 注意是字符串 不是方法
				var methodName = instanceInterface.methods[j];
				//object[key]
				if( !object[methodName] || typeof object[methodName] !== 'function'){
					throw new Error('the mothod name [' + methodName + '] is not found');
				}
			}
		}
	}
	//EXTEND method  
	
	//实现只继承一次父类的原型对象  不继承父类的模板
			BH.extend = function( sub, sup ){
				//目的:只继承一次父类的原型对象
				//1 用一个空函数进行中转
				var F = new Function();//空函数  var F = function(){};  
				F.prototype = sup.prototype;//2 实现空函数的原型对象和父类的原型对象的转化
				sub.prototype = new F();// 3 原型继承
				// 子类的构造器是F 需要修改过来
				sub.prototype.constructor = sub;//4 还原子类的构造器
				// 保存一下父类的原型对象  方便解耦：降低耦合性    另一方面:可以轻松的获得父类的原型对象
				sub.superClass = sup.prototype;//自定义一个子类的静态属性  接受父类的原型对象
				//判断父类的原型对象的构造器(加保险)
				if( sup.prototype.constructor == Object.prototype.constructor ){
					sup.prototype.constructor = sup;
				}
				 
				
			}
			
			
			
	//单体模式
	//实现一个跨浏览器的事件处理程序	
	BH.EventUtil = {
		//元素  类型  事件的响应函数
		addHandler:function( element, type, handler){
			if( element.addEventListener ){//FF
				element.addEventListener( type, handler, false );//false代表冒泡流事件  *捕获流事件
			}else if( element.attachEvent ){//IE
				element.attachEvent('on'+ type, handler );
			}
		},
		removeHandler:function( element, type, handler){
			if( element.removeEventListener){
				element.removeEventListener( type, handler, false );
			}else if( element.detachEvent ){
				element.detachEvent('on'+type, handler );
			}
		}
	};
	
	
	Array.prototype.each = function( fn ){
				try{
					// 1. 目的 遍历数组中的每一项
					this.i || (this.i = 0);// 计数器 记录当前元素的遍历位置  增加的属性  var i = 0; 也可以  这样定义更严谨 解决冲突问题
					
					//2 严谨的判断 什么去走each的核心方法
					//当数组的长度大于0的时候 && 参数必须是个函数
					if( this.length > 0 && fn.constructor == Function /*构造函数*/){
						//循环遍历数组的每一项  尽量不要用for in  
						while( this.i < this.length ){
							
						    //获取数组的每一项 
							var e = this[this.i];//获取数组的每一项
							if( e && e.constructor == Array ){//是个数组
							   //如果是个数组就递归 
							   e.each( fn );
							}
							else{
								//如果不是数组  那就是一个单个元素 
								//var obj = true;//fn没有对象作用域  空的就可以  
								//这的目的就是为了执行把数组的当前元素传递给fn函数 并让函数执行
								fn.call( this, e );//apply 第一个参数是个对象 第二个参数是个数组
								//第一个参数传什么都可以  fn函数没有作用域的限制  只是为了显示以下当前元素 
							}
							this.i++;
						}
						this.i = null;//释放内存  垃圾回收机制回收变量
						
						
					}
				}catch(ex){
					// do something
				}
				return this;
			}