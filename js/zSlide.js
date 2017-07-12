$.fn.zSlide = function (options) {
	$.fn.zSlide.defaults = {
		holder: 'ul',
		prevCell: '.prev',
		nextCell: '.next',
		listTrigger: false,
		easing: 'swing',
		startFun: null,
		endFun: null,
		interTime: 400,
		page: false,
		autoPlay: false,
		delayTime: 2500
	};
	return this.each(function() {
		var opts = $.extend({}, $.fn.zSlide.defaults, options);

		// 获取元素
		var self = $(this),
			holder = $(opts.holder, self),
			list = holder.children(),
			prev = $(opts.prevCell, self),
			next = $(opts.nextCell, self),
			listSize = list.length,

			listTrigger = opts.listTrigger,
			autoPlay = opts.autoPlay,
			timer = null,
			delayTime = opts.delayTime,

			page = opts.page,
			pager = null,
			pageList = null,
			pageHtml = '',

			width = self.width(),
			height = self.height(),
			startFun = opts.startFun,
			endFun = opts.endFun,
			interTime = opts.interTime,
			easing = opts.easing,

		// 索引值
			index = 0,
			zIndexs = 1,

		// 属性列表
			data = opts.data,
			trans = opts.trans || [{width: 0, height: 0, left: width / 2, top: height / 2, opacity: 0}],
			attr = $.merge(data, trans),
		// 属性列表的长度
			len = attr.length - 1,
			vis = len - 2;

		if (listSize < len) {
			self.hide();
			return;
		}

		// 临界点
		var breakpoint = Math.floor(len / 2);
		var zIndex, recombineArr;

		// 重组属性列表的顺序
		var recombine = function (index) {
			var fragment = $.makeArray(list);
			var handle = [];

			var size = fragment.length;
			var index = index;

			var breaking = breakpoint;

			while (breaking--) {
				index + 1 == size-- ?
					handle.push(fragment.shift()) && (index--) :
					handle.push(fragment.splice(index + 1, 1)[0]);
			}

			breaking = breakpoint;

			while (breaking--) {
				handle.splice(breakpoint, 0, index - 1 == -1 ?
					fragment.pop() :
					fragment.splice((index--) - 1, 1)[0]);
			}

			handle.unshift(fragment.splice(index, 1)[0]);

			return {
				front: handle,
				behind: fragment
			};
		}

		var createPage = function () {
			for (var i = 0; i < listSize; i++) {
				pageHtml += '<li></li>';
			}
			pager = $('<ol>');
			pager.html(pageHtml).appendTo(self);
			pagerList = pager.children();

			pagerList.click(function () {
				if (index == $(this).index()) return;
				index = $(this).index();
				play();
			});

		};

		page && createPage();

		// 动画效果
		var play = function (isStatic) {
			page && pagerList && pagerList.eq(index).addClass('on').siblings().removeClass('on');
			!isStatic && startFun && startFun(index, list);
			zIndex = breakpoint;
			recombineArr = recombine(index);
			list.eq(index).css({zIndex: zIndexs++});
			$(recombineArr.front).each(function (i) {
				$(this).stop().animate(attr[i], interTime, easing, function () {
					(i == len - 1) && !isStatic && endFun && endFun(index);
				});
				// zIndex--;
			});

			$(recombineArr.behind).stop().animate(attr[len], interTime, easing);

			isStatic && $(recombineArr.front).add($(recombineArr.behind)).finish();
		};

		// 初始化
		self.css({position: 'relative'});
		list.css({position: 'absolute'});
		play(true);

		// 左切换
		next.click(function () {
			index ++;
			if (index == listSize) {
				index = 0;
			}
			play();
		});

		// 右切换
		prev.click(function () {
			index --;
			if (index == -1) {
				index = listSize - 1;
			}
			play();
		});

		// 列表切换
		listTrigger && list.click(function () {
			if (index == $(this).index()) return;
			index = $(this).index();
			play();
		});

		// 自动切换
		var autoPlayFun = function () {
			clearInterval(timer);
			timer = setInterval(function () {
				index ++;
				if (index == listSize) {
					index = 0;
				}
				play();
			}, delayTime);
		}
		self.hover(function () {
			clearInterval(timer);
		}, function () {
			autoPlay && autoPlayFun();
		});
		autoPlay && autoPlayFun();

	});
};
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) { return jQuery.easing[jQuery.easing.def](x, t, b, c, d); },
	easeInQuad: function (x, t, b, c, d) {return c*(t/=d)*t + b;},
	easeOutQuad: function (x, t, b, c, d) {return -c *(t/=d)*(t-2) + b},
	easeInOutQuad: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t + b;return -c/2 * ((--t)*(t-2) - 1) + b},
	easeInCubic: function (x, t, b, c, d) {return c*(t/=d)*t*t + b},
	easeOutCubic: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b},
	easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b},
	easeInQuart: function (x, t, b, c, d) {return c*(t/=d)*t*t*t + b},
	easeOutQuart: function (x, t, b, c, d) {return -c * ((t=t/d-1)*t*t*t - 1) + b},
	easeInOutQuart: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t + b;return -c/2 * ((t-=2)*t*t*t - 2) + b},
	easeInQuint: function (x, t, b, c, d) {return c*(t/=d)*t*t*t*t + b},
	easeOutQuint: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t*t*t + 1) + b},
	easeInOutQuint: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;return c/2*((t-=2)*t*t*t*t + 2) + b},
	easeInSine: function (x, t, b, c, d) {return -c * Math.cos(t/d * (Math.PI/2)) + c + b},
	easeOutSine: function (x, t, b, c, d) {return c * Math.sin(t/d * (Math.PI/2)) + b},
	easeInOutSine: function (x, t, b, c, d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b},
	easeInExpo: function (x, t, b, c, d) {return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b},
	easeOutExpo: function (x, t, b, c, d) {return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b},
	easeInOutExpo: function (x, t, b, c, d) {if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;return c/2 * (-Math.pow(2, -10 * --t) + 2) + b},
	easeInCirc: function (x, t, b, c, d) {return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b},
	easeOutCirc: function (x, t, b, c, d) {return c * Math.sqrt(1 - (t=t/d-1)*t) + b},
	easeInOutCirc: function (x, t, b, c, d) {if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b},
	easeInElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b},
	easeOutElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b},
	easeInOutElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b},
	easeInBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158;return c*(t/=d)*t*((s+1)*t - s) + b},
	easeOutBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158;return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b},
	easeInOutBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b},
	easeInBounce: function (x, t, b, c, d) {return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b},
	easeOutBounce: function (x, t, b, c, d) {if ((t/=d) < (1/2.75)) {	return c*(7.5625*t*t) + b;} else if (t < (2/2.75)) {	return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;} else if (t < (2.5/2.75)) {	return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else {	return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}},
	easeInOutBounce: function (x, t, b, c, d) {if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;}
});