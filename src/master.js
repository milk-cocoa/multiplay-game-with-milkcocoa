function MasterObject(baseDS, _id, _params) {
	this.id = _id;
	this.params = _params;
	this.onUpdateHandler = null;
	this.baseDS = baseDS;
	console.log(this.baseDS);
	this.baseDS.set(this.id, this.params);
	this.saveTimer = null;
	this.updateCount = 0;
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

//データの更新を行う
//10秒間はデータを保存しない
MasterObject.prototype.update = function(_params) {
	var self = this;
	for(var key in _params) this.params[key] = _params[key];
	this.baseDS.send({
		id : this.id,
		value : _params
	});
	if(this.saveTimer) clearTimeout(this.saveTimer);
	this.saveTimer = setTimeout(function() {
		self.save();
		this.updateCount = 0;
	}, 5000);
	this.updateCount++;
	if(this.updateCount > 12) {
		this.updateCount = 0;
		self.save();
		if(this.saveTimer) clearTimeout(this.saveTimer);
	}
}

MasterObject.prototype.save = function() {
	console.log('save');
	this.baseDS.set(this.id, this.params);
}

MasterObject.prototype.onUpdate = function(handler) {
	this.onUpdateHandler = handler;
}

module.exports = MasterObject;