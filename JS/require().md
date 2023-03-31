In JavaScript, require() is a function used to import modules, which are typically contained in separate files. In order to use require(), you need to be running JavaScript in an environment that supports CommonJS modules, such as Node.js.

Here's an example of how you can use require() to import a module:
```
// myModule.js
function helloWorld() {
  console.log("Hello, world!");
}
module.exports = helloWorld;
```

In another file, you can import the module using require():
```
//index.js
const helloWorld = require('./myModule');
helloWorld(); // logs "Hello, world!"
```

In this example, require('./myModule') imports the myModule.js file as a module, and assigns the helloWorld function to the helloWorld variable. We can then call the helloWorld function as usual.

Note that require() is a feature of CommonJS modules and is not available in all JavaScript environments. If you're using a different module system or running JavaScript in the browser, you may need to use a different syntax for importing modules.