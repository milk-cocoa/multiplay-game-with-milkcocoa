var MasterObject = require('./master');
var ReplicaObject = require('./replica');
var PingManager = require('./pingman');

function MilkcocoaGame(host, option) {
	var self = this;
    var milkcocoa = new MilkCocoa(host);
	this.option = option || {};
    this.baseDS = milkcocoa.dataStore(this.option.datastore || 'mlkccagame');
    this.pingManager = new PingManager(this.baseDS);
    this.onCreatedObjectHandler = null;
    this.masters = {};
    this.replicas = {};
    this.baseDS.on('send', function(sended) {
    	self.register(sended.value);
    });
}

MilkcocoaGame.prototype.register = function(setted) {
	var self = this;
	if(this.masters.hasOwnProperty(setted.id)) {
		this.masters[setted.id]._update(setted.value, setted.uuid);
	}else{
    	if(self.replicas.hasOwnProperty(setted.id)) {
    		self.replicas[setted.id]._update(setted.value);
    	}else{
    		var replicaObject = new ReplicaObject(self.baseDS, setted.id, setted.value);
    		self.replicas[replicaObject.getId()] = replicaObject;
    		self.pingManager.setRepl(replicaObject);
    		replicaObject.onDestroyHandler(function() {
	    		delete self.replicas[replicaObject.getId()];
    		});
	    	if(self.onCreatedObjectHandler) {
	    		self.onCreatedObjectHandler(replicaObject);
	    	}
    	}
	}
}

MilkcocoaGame.prototype.init = function() {
	var self = this;
    this.baseDS.stream().sort('desc').size(10).next(function(err, data) {
    	data.forEach(function(setted) {
	    	self.register(setted);
	    	if(self.masters.hasOwnProperty(setted.id)) {
	    		self.masters[setted.id]._update(setted.value);
	    	}
    	});
    });
}


/*
	create master object
*/
MilkcocoaGame.prototype.createObject = function(master_id, params) {
	if(this.replicas.hasOwnProperty(master_id)) {
		params = this.replicas[master_id].getParams();
		this.replicas[master_id].destroy();
		delete this.replicas[master_id];
	}
	this.pingManager.setId(master_id);
	var masterObject = new MasterObject(this.baseDS, master_id, params);
	this.masters[masterObject.getId()] = masterObject;
	return masterObject;
}


MilkcocoaGame.prototype.onCreatedObject = function(handler) {
    this.onCreatedObjectHandler = handler;
}

MilkcocoaGame.prototype.getNumOfRepls = function() {
	var count = 0;
	for(var key in this.replicas) {
		count++;
	}
	return count;
}

window.MultiPlayerGame = MilkcocoaGame;


