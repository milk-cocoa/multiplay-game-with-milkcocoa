function MasterObject(baseDS, _id, _params) {
	this.id = _id;
	this.params = _params;
	this.onUpdateHandler = null;
	this.baseDS = baseDS;
	console.log(this.baseDS);
	this.baseDS.set(this.id, this.params);
}

MasterObject.prototype.getId = function() {
	return this.id;
}

MasterObject.prototype.getParams = function() {
	return this.params;
}

MasterObject.prototype._update = function(_params) {
	for(var key in _params) this.params[key] = _params[key];
	if(this.onUpdateHandler) {
		this.onUpdateHandler(this.params);
	}
}

MasterObject.prototype.update = function(_params) {
	for(var key in _params) this.params[key] = _params[key];
	this.baseDS.set(this.id, _params);
}

MasterObject.prototype.onUpdate = function(handler) {
	this.onUpdateHandler = handler;
}

module.exports = MasterObject;