/**
 * @author Administrator
 */
//模拟jquery底层链式编程
			
			//块级作用域
			//1.程序启动的时候 块级作用域内的代码直接就执行了
			//2.内部的成员变量 外部无法访问  （除了不加var修饰的变量，即全局变量）
			 //alert('我执行了');
				//var a = 10; //外部无法访问
				//a=10;//外部可以访问 相当于 window.a = 10;
			(function(window,undefined){
				
				// $ jquery最常用的对象 返回给外界
				//大型程序开发  一般使用‘_’ 作为私用的变量 （规范）
				function _$( arguemnts ){
					//实现代码
					var idselector = /#\w+/;//\w 表示任何的字母和数字
					this.dom;//此属性 接受所得到的元素
					if( idselector.test(arguemnts[0])){//argumnts[0] = '#inp'
						this.dom = document.getElementById( arguemnts[0].substring(1));
					}else{
						throw new Error('arguments is Error!');
					}
				}
				//在Function 类上扩展出一个可以实现链式编程的方法
				Function.prototype.method = function(methodName, fn){//链式编程实现的模式
					
					this.prototype[methodName] = fn;
					
					return this;
				}//这是在方法的原型对象上加的方法
				
				// 在_$的原型对象上 加一些公共的方法
				_$.prototype = {
					constructor:_$,
					addEvent:function(type,fn){ 
					//给你得到的元素去注册事件
					if( window.addEventListener){
						this.dom.addEventListener(type,fn);
					}else if(window.attachEvent){//IE
						this.dom.attachEvent('on'+type, fn );
					}
					
					return this;
					},
					setStyle:function(prop,val){
						this.dom.style[prop] = val;
						return this;
						}
				};
				
				//window上下注册一个全局变量
				window.$ = _$; //与外界产生关系  在外部可以调用内置方法 这里只是一个引用 window.$ 代表_$本身
				//写一个准备的方法
				_$.onReady = function( fn ){
					//1 实例化出来  _$对象  真正的注册到window上 
					window.$ = function(){
						return new _$(arguments);// 实例化  window.$ 真真正正是 window内部提供的一个对象了
					}
					//2.执行传入进来的代码
					fn();
					
					//3 实现链式编程		
					_$.method('addEvent',function(){}).method('setStyle',function(){ });
					
					
				}
				
			})(window);// 程序的入口  window传入作用域中
			