# ComfyDB: an easy, unified and powerful localStorage/sessionStorage API #

ComfyDB uses the HTML5 localStorage and sessionStorage API to enable you to store persistent data with your
web applications. ComfyDB exposes a **robust functional API** for individual data stores on top of the rather limited
[native key/value pair API](http://dev.w3.org/html5/webstorage/).

ComfyDB goes a step further to **ensure the integrity of your data**. The native browser API stores all data as type
string. ComfyDB passes everything you save through a JSON filter, ensuring that when put data in, you will get it
back in the correct data-type.

**N'Sync**: One of the great things about localStorage is that when you modify your data the "storage" event is fired
in every window. This notifies other instances of your application, which may be running in other tabs or windows, about
changes to your runtime application state. The sad sad sad part is that every browser implements this event differently.
ComfyDB takes care of the ugly parts and ensures that the correct event handlers are set up. ComfyDB uses
**feature detection rather than user-agent sniffing**, so ComfyDB will continue to work as expected as browsers
normalize their behavior.

**ComfyDB is supported in all major modern browsers**, including Safari 4, Chrome, Firefox 3.5 and IE8. If a browser
supports localStorage, it can run ComfyDB.

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
var gold = db.findAll(function(item) {
	return item.key.match(/gold/i);
});
console.log(gold);
// --> [{key: "golden-sword", value: true}, {key: "gold-coins", value: 3000}]
</pre>

## More Information ##

**Check out the [source](http://github.com/dandean/comfydb/blob/master/src/comfydb.js) for more specific usage information.**

**ComfyDB** is built on [prototype.js](http://www.prototypejs.org/), and implements
[Enumerable](http://api.prototypejs.org/language/enumerable.html), so every method available to Enumerable is at your
disposal for quickly and easily working with your data.