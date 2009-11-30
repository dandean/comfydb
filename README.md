# ComfyDB: an easy, unified and powerful localStorage/sessionStorage API #

ComfyDB uses the new localStorage and sessionStorage API to enable you to store persistent data with your
web applications. ComfyDB exposes a **robust functional API** for individual data stores on top of the rather limited
[native key/value pair API](http://dev.w3.org/html5/webstorage/).

ComfyDB goes a step further to **ensure the integrity of your data**. The native browser API stores all values as
strings, so ComfyDB passes everything you save through a JSON filter, ensuring that when put data in, you will get it
back in the correct data-type.

**ComfyDB is supported in all major browsers**, including Safari 4, Firefox 3.5 and IE8. If a browser supports
localStorage, it can run ComfyDB.

## Simple examples: ##

### Create a new data store for a user, then store some of their data: ###

<pre>
var db = new ComfyDB("user:dan");
db.save("lives", 3)
  .save("score", 5532)
  .save("golden-sword", true)
  .save("arrows", 25)
  .save("gold-coins", 3000)
  .save("gold-pants", true);
</pre>

### Get some data about our user: ###

<pre>
var lives = db.get("lives");
console.log(lives);
// --> 3
</pre>

### Remove data about our user: ###

<pre>
db.remove("gold-pants");
</pre>

### Find all user properties which match specific criteria ###

<pre>
var gold = db.findAll(function(prop) {
	return prop.key.match(/gold/i);
});
console.log(gold);
// --> [{key: "golden-sword", value: true}, {key: "gold-coins", value: 3000}]
</pre>

## More Information ##

**Check out the [source](http://github.com/dandean/comfydb/blob/master/src/comfydb.js) for more specific usage information.**

**ComfyDB** is built on [prototype.js](http://www.prototypejs.org/), and implements
[Enumerable](http://api.prototypejs.org/language/enumerable.html), so every method available to Enumerable is at your
disposal for quickly and easily working with your data.