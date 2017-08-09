var prot = {};
var foo = Object.create(prot);

console.log(Object.getPrototypeOf(foo) === prot);
console.log(prot.isPrototypeOf(foo));

console.log(Object.prototype.isPrototypeOf(foo)); // true, bc the default object prototype is on the prototype chain

var bar = Object.create(Object.prototype);
console.log(Object.prototype.isPrototypeOf(bar));
