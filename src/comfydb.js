/**
 *  class ComfyDB
 **/
var ComfyDB = Class.create(Enumerable, (function() {

	// Saves and returns an instance
	function _save(instance) {
		instance._storage.setItem(instance.db._dbconfig.name, Object.toJSON(instance.db));
		return instance;
	}

	return {
		/**
		 *  new ComfyDB([name = "ComfyDB"][, description = "A comfy little database"][, useSessionStorage = false]);
		 **/
		initialize: function(name, description, useSessionStorage) {
			if (!window.localStorage) throw "ComfyDB, 'This browser does not support localStorage.'";
			this._storage = (useSessionStorage) ? sessionStorage : localStorage ;
			
			var conf = ComfyDB.Defaults.toObject();
			conf.name = name || conf.name;
			conf.description = description || conf.description;
			
			var data = this._storage.getItem(conf.name);
			if (data) {
				this.db = data.evalJSON();
			} else {
				this.db = {_dbconfig: conf};
				_save(this);
			}
		},
		
		/**
		 *  ComfyDB#_each(iterator) -> "undefined"
		 **/
		_each: function(iterator) {
			for (var key in this.db) {
				if (key == "_dbconfig") continue;
				iterator({key: key, value: this.db[key]});
			}
		},
		
		/**
		 *  ComfyDB#get(key) -> value
		 *  - key (String)
		 **/
		get: function(key) {
			return (key == "_dbconfig") ? undefined : this.db[key] ;
		},
		
		/**
		 *  ComfyDB#save(key, value) -> this
		 *  - key (String)
		 *  - value (Object)
		 **/
		save: function(key, value) {
			if (arguments.length > 0) this.db[key] = value;
			_save(this);
			return this;
		},
		
		/**
		 *  ComfyDB#remove(key) -> this
		 *  - key (String): Key associated with a value to remove from the database.
		 **/
		remove: function(key) {
			if (key in this.db) delete this.db[key];
			_save(this);
			return this;
		},
		
		/**
		 *  ComfyDB#clear() -> this
		 **/
		clear: function() {
			this.db = {_dbconfig: this.db._dbconfig};
			_save(this);
			return this;
		},
		
		toJSON: function() {
			return Object.toJSON(this.db);
		},
		
		toHTML: function() {
			var dl = new Element("dl");
			this.each(function(r) {
				dl.insert(new Element("dt").update(r.key));
				dl.insert(new Element("dd").update(r.value));
			});
			return dl;
			
		},
		
		toString: function() { return "[object ComfyDB]"; }
	};
})());

ComfyDB.Defaults = $H({
	name: "ComfyDB",
	description: "A comfy little database"
});

/**
 *  ComfyDB.Destroy(comfydb) -> "undefined"
 *  - comfydb(ComfyDB): The database to destroy.
 *
 *  Deletes a database from localStorage and empties out its internat db object.
 **/
ComfyDB.Destroy = function(comfydb) {
	if (comfydb._storage.getItem(comfydb.db._dbconfig.name)) {
		comfydb._storage.removeItem(comfydb.db._dbconfig.name);
		delete comfydb.db;
	}
};