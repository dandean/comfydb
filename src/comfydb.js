/**
 *  class ComfyDB
 **/
var ComfyDB = Class.create(Enumerable, (function() {
	
	var STORAGE_EVENT_FIRED_ON_BODY = false,
	    STORAGE_EVENT_FIRED_ON_BODY_ELEMENT = false,
	    STORAGE_EVENT_FIRED_ON_DOCUMENT = false,
	    STORAGE_EVENT_HAS_KEY_NAME = false,
	    tempStorageKey = "__TEST_STORAGE_KEY_" + Math.round(Math.random() * 10000000);
	
	function onDocumentStorage(e) {
		STORAGE_EVENT_FIRED_ON_DOCUMENT = true;
		cleanup(e);
	}
	
	function onBodyElementStorage(e) {
		STORAGE_EVENT_FIRED_ON_BODY_ELEMENT = true;
		cleanup(e);
	}

	function onBodyStorage(e) {
		STORAGE_EVENT_FIRED_ON_BODY = true;
		cleanup(e);
	}
	
	function cleanup(e) {
		document.body.stopObserving("storage", onBodyStorage);
		document.body.onstorage = null;
		document.stopObserving("storage", onDocumentStorage);
		STORAGE_EVENT_HAS_KEY_NAME = (e && "key" in e && e.key == tempStorageKey);
		localStorage.removeItem(tempStorageKey);
	}
	
	function test() {
		document.body.observe("storage", onBodyStorage);
		document.body.onstorage = onBodyElementStorage;
		document.observe("storage", onDocumentStorage);
		localStorage.setItem(tempStorageKey, Math.random());
		document.fire("storage:tests:complete");
	}
	
	if (document.loaded) {
		test();
	} else {
		document.observe("dom:loaded", test);
	}
	
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
			
			var bindStorageEvent = function() {
				if (STORAGE_EVENT_FIRED_ON_BODY || STORAGE_EVENT_FIRED_ON_DOCUMENT) {
					// Firefox fires on the body, IE fires on the document.
					Event.observe(((STORAGE_EVENT_FIRED_ON_BODY) ? document.body : document), "storage", this.__onStorage.bind(this));
				} else if (STORAGE_EVENT_FIRED_ON_BODY_ELEMENT) {
					// WebKit requires event handler explicitly on the "BODY" element.
					document.body.onstorage = this.__onStorage.bind(this);
				}
			}.bind(this);

			if (document.loaded) {
				bindStorageEvent();
			} else {
				document.observe("storage:tests:complete", bindStorageEvent);
			}
		},
		
		__onStorage: function(e) {
			// If key is given, only mark data as dirty if necessary. Otherwise just mark it as dirty.
			// This means that browsers that support the "key" property will be much more efficient, others will
			// refresh their data a lot more -- when anything in the entire storage changes.
			if (!STORAGE_EVENT_HAS_KEY_NAME || STORAGE_EVENT_HAS_KEY_NAME && e.key == this.db._dbconfig.name) {
				this._dirty = true;
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
		 *  ComfyDB#refresh() -> this
		 **/
		refresh: function() {
			if (this.db && this.db._dbconfig && this.db._dbconfig.name) {
				this._dirty = false;
				this.db = this._storage.getItem(this.db._dbconfig.name).evalJSON();
			} else {
				throw 'ComfyDB, "Can not refresh data, invalid configuration"';
			}
			return this;
		},
		
		/**
		 *  ComfyDB#get(key) -> value
		 *  - key (String)
		 **/
		get: function(key) {
			if (this._dirty) this.refresh();
			return (key == "_dbconfig") ? undefined : this.db[key] ;
		},
		
		/**
		 *  ComfyDB#save(key, value) -> this
		 *  - key (String)
		 *  - value (Object)
		 *
		 *  Saves the key/value pair to the storage interface. If no arguments are given, the data present data
		 *  is resaved to the storage interface as is.
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