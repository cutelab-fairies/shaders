(function() {
	var entities = [];

	function messageReceived(chan, msg) {
		if (chan != "cat.maki.shaderController") return;
		try { var info = JSON.parse(msg); }
		catch(err) { return; }

		//console.log(JSON.stringify(info));

		if (typeof info.shaderUrl != "string") return;
		if (typeof info.version != "number") return;

		entities.forEach(function(entityID) {
			//Entities.editEntity(entityID, {locked: false});
			Entities.editEntity(entityID, {
				userData: JSON.stringify({
					ProceduralEntity: info
				})
			})
			//Entities.editEntity(entityID, {locked: true});
		});
	}

	this.preload = function(entityID) {
		Messages.subscribe("cat.maki.shaderController");
		Messages.messageReceived.connect(messageReceived);

		var s = 8192;

		[ // add shader entities
			{p:{x: 0, y: 0, z:-s}, d:{x:s, y:s, z:1}, s:"Front"},
			{p:{x: 0, y: 0, z: s}, d:{x:s, y:s, z:1}, s:"Back"},
			{p:{x:-s, y: 0, z: 0}, d:{x:1, y:s, z:s}, s:"Left"},
			{p:{x: s, y: 0, z: 0}, d:{x:1, y:s, z:s}, s:"Right"}, 
			{p:{x: 0, y:-s, z: 0}, d:{x:s, y:1, z:s}, s:"Bottom"}, 
			{p:{x: 0, y: s, z: 0}, d:{x:s, y:1, z:s}, s:"Top"}, 

		].forEach(function(entityDetails) {
			entities.push(Entities.addEntity({
				locked: false,
				type: "Box",
				shape: "Cube",
				name: "Shader "+entityDetails.s,
				position: entityDetails.p,
				dimensions: Vec3.multiply(entityDetails.d,2),
				canCastShadow: false,
				color: {red:0,green:0,blue:0},
				grab: {
					grabbable: false,
					grabFollowsController: false,
				},
				userData: "{}",
			}));
		});
	}

	this.unload = function() {
		Messages.unsubscribe("cat.maki.shaderController");
		Messages.messageReceived.disconnect(messageReceived);

		entities.forEach(function(entityID) {
			Entities.editEntity(entityID, {locked: false});
			Entities.deleteEntity(entityID);
		})
	}
})

//Messages.sendMessage("cat.maki.shaderController", JSON.stringify());