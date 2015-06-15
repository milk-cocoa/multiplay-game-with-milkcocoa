function ReplicaObject(mlkccagameDataStore, _id, _params) {
	var self = this;
	this.id = _id;
	this.params = _params;
	this.onUpdateHandler = null;
	this.onDestroyHandlers = [];
	this.alive = true;
	this.timer = setTimeout(function() {
		self.alive = false;
		self.fireOnDestroyHandlers();
	}, 1000 * 26);
}

ReplicaObject.prototype.getId = function() {
	return this.id;
}

ReplicaObject.prototype.getParams = function() {
	return this.params;
}

ReplicaObject.prototype.isAlive = function() {
	return this.alive;
}

ReplicaObject.prototype._update = function(params) {
	if(this.onUpdateHandler) {
		this.onUpdateHandler(params);
	}
}

ReplicaObject.prototype.onUpdate = function(handler) {
	this.onUpdateHandler = handler;
}
ReplicaObject.prototype.destroy = function() {
	this.alive = false;
	this.fireOnDestroyHandlers();
}

ReplicaObject.prototype.onDestroyHandler = function(handler) {
	this.onDestroyHandlers.push(handler);
}

ReplicaObject.prototype.fireOnDestroyHandlers = function() {
	this.onDestroyHandlers.forEach(function(h) {
		h();
	});
}

ReplicaObject.prototype.recvPing = function() {
	var self = this;
	clearTimeout(this.timer);
	this.timer = setTimeout(function() {
		self.destroy();
	}, 1000 * 26);
}

module.exports = ReplicaObject;
