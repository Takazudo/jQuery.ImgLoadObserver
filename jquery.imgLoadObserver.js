/*
 * $.ImgLoadObserver
 *
 * version 0.1.1 (2010/09/02)
 * Copyright (c) 2010 Takeshi Takatsudo (takazudo[at]gmail.com)
 * MIT license
 *
=============================================================================
 depends on
-----------------------------------------------------------------------------
 * jQuery 1.4.2
 *
=============================================================================
 how to use
-----------------------------------------------------------------------------
 *
 * not documented yet.
 *
 */
(function($){ // start $=jQuery encapsulation

/**
 * $.ImgLoadObserver
 */
$.ImgLoadObserver = function(options){

	var o = this.options = $.extend({
		paths: null, // needs to be given array or img paths
		onLoadStart: null, // function. imgs load start callback
		onAllLoad: null, // function. all imgs load callback
		onOneLoad: null, // function. one imgs load callback
		finishDelay: 200 // delay to fire allLoadHandler
	}, options);
	
	if(o.paths){
		this._paths = o.paths;
	
	}else{
		return this;
	}
	this._imgs = [];
	this._count = o.paths.length;

	this._callbacks_loadStart = $.isArray(o.onLoadStart) ? o.onLoadStart : [];
	this._callbacks_oneLoad = $.isArray(o.onOneLoad) ? o.onOneLoad : [];
	this._callbacks_allLoad = $.isArray(o.onAllLoad) ? o.onAllLoad : [];

	$.isFunction(o.onLoadStart) && this.onLoadStart(o.onLoadStart);
	$.isFunction(o.onOneLoad) && this.onOneLoad(o.onOneLoad);
	$.isFunction(o.onAllLoad) && this.onAllLoad(o.onAllLoad);

};
$.ImgLoadObserver.prototype = {
	options: null,
	_imgs: null,
	_count: 0,
	_paths: null,
	_callbacks_loadStart: null,
	_callbacks_oneLoad: null,
	_callbacks_allLoad: null,
	_loadCompleted: false,
	load: function(){
		var self = this;
		self._fireLoadStart();
		if(self._loadCompleted){
			// if alread completed, fire soon
			self._fireAllLoad();
			return this;
		}
		$.each(this._paths, function(){
			var fn = function(){
				self._decrease(img);
			};
			var img = $('<img />',{
				src: this,
				load: fn,
				error: fn
			});
			self._imgs.push(img);
		});
		return this;
	},
	_decrease: function(img){
		this._count --;
		this._fireOneLoad(img);
		if(this._count===0){
			this._loadCompleted = true;
			this._fireAllLoad();
		}
		return this;
	},
	_fireLoadStart: function(){
		$.each(this._callbacks_loadStart, function(){
			this();
		});
		return this;
	},
	_fireOneLoad: function(img){
		$.each(this._callbacks_oneLoad, function(){
			this(img);
		});
		return this;
	},
	_fireAllLoad: function(){
		var self = this;
		setTimeout(function(){
			$.each(self._callbacks_allLoad, function(){
				this();
			});
		}, self.options.finishDelay);
		return self;
	},
	onLoadStart: function(fn){
		this._callbacks_loadStart.push(fn);
		return this;
	},
	onOneLoad: function(fn){
		this._callbacks_oneLoad.push(fn);
		return this;
	},
	onAllLoad: function(fn){
		this._callbacks_allLoad.push(fn);
		return this;
	},
	getTotal: function(){
		return this._paths.length;
	},
	getLoadedImgsSize: function(){
		return this.getTotal() - this._count;
	},
	getLoadedPercentage: function(){
		return Math.ceil(this.getLoadedImgsSize() / this.getTotal() * 100);
	},
	getPaths: function(){
		return this._paths;
	},
	getImgs: function(){
		return this._imgs;
	}
};

})(jQuery); // end $=jQuery encapsulation
