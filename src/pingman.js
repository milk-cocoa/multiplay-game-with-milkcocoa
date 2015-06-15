function PingManager(baseDS, option) {
	var self = this;
	this.id = null;
	this.option = option || {};
	this.option.ping_interval = this.option.ping_interval || (12 * 1000)
	this.handlers = {};
	this.replIds = {};
	var pingDS = baseDS.child('ping');
	pingDS.on('send', function(sended) {
		if(self.replIds[sended.value.id]) self.replIds[sended.value.id].recvPing();
	});
	setInterval(function() {
		if(self.id == null) return;
		pingDS.send({
			id : self.id
		});
	}, this.option.ping_interval);
}

PingManager.prototype.setId = function(id) {
	this.id = id;
}

PingManager.prototype.setRepl = function(_repl) {
	this.replIds[_repl.getId()] = _repl;
}

module.exports = PingManager;