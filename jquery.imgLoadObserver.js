/*!
 * $.ImgLoadObserver
 * https://github.com/Takazudo/jQuery.ImgLoadObserver
 * version 0.2.0 (2010/11/15)
 * Copyright (c) 2010 Takeshi Takatsudo (takazudo[at]gmail.com)
 * MIT license
 *
=============================================================================
 depends on
-----------------------------------------------------------------------------
 * jQuery 1.4.4
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

	var o = this.options = $.extend({}, this.options, options);

	this._observer = $({});

	if(!$.isArray(o.paths)){
		$.error('$.ImgLoadObserver needs paths:[Array].');
	}else{
		this._paths = o.paths;
	}

	this._imgs = [];
	this._count = o.paths.length;

	this.onLoadStart(o.onLoadStart);
	this.onOneLoad(o.onOneLoad);
	this.onAllLoad(o.onAllLoad);

};
$.ImgLoadObserver.prototype = {

	options: {
		paths: null, // needs to be given array or img paths
		onLoadStart: null, // function. imgs load start callback
		onAllLoad: null, // function. all imgs load callback
		onOneLoad: null, // function. one imgs load callback
		finishDelay: 200 // delay to fire allLoadHandler
	},

	_observer: null, // a jQuery object to store events

	_paths: null, // array to store received paths
	_imgs: null, // array to store created imgs

	_loadCompleted: false, // flag

	_count: 0,

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

	/* trigger wrapper */

	_fireLoadStart: function(){
		this._observer.trigger('loadstart');
		return this;
	},
	_fireOneLoad: function(img){
		this._observer.trigger('oneload', [img]);
		return this;
	},
	_fireAllLoad: function(){
		var self = this;
		setTimeout(function(){
			self._observer.trigger('allload');
		}, self.options.finishDelay);
		return self;
	},

	/* bind wrapper */

	onLoadStart: function(fn){
		if(!$.isFunction(fn)){ return this; }
		this._observer.bind('loadstart', fn);
		return this;
	},
	onOneLoad: function(fn){
		if(!$.isFunction(fn)){ return this; }
		this._observer.bind('oneload', fn);
		return this;
	},
	onAllLoad: function(fn){
		if(!$.isFunction(fn)){ return this; }
		this._observer.bind('allload', fn);
		return this;
	},

	/* misc */

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
