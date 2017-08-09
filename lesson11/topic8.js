// var a = 1;

// function Foo() {
//   this.a = 2;
//   this.bar = function() {
//     console.log(this.a);
//   };
//   this.bar();
// }

// var foo = new Foo(); // 2

// foo.bar(); // 2
// Foo(); // 2

// var obj = {};
// Foo.call(obj); // 2
// obj.bar(); // 2

// console.log(this.a); // 2

// var RECTANGLE = {
//   area: function() {
//     return this.width * this.height;
//   },
//   circumference: function() {
//     return 2 * (this.width + this.height);
//   }
// };

// function Rectangle(width, height) {
//   this.width = width;
//   this.height = height;
//   this.area = RECTANGLE.area.call(this);
//   this.circumference = RECTANGLE.circumference.call(this);
// }

// var rect1 = new Rectangle(2, 3);
// console.log(rect1.area); // error: cannot find method on RECTANGLE
// console.log(rect1.circumference); // error: cannot find method on RECTANGLE

// function Circle(radius) {
//   this.radius = radius;
// }

// Circle.prototype.area = function() {
//   return Math.PI * Math.pow(this.radius, 2);
// };

// var a = new Circle(3);
// var b = new Circle(4);

// console.log(a.area().toFixed(2)); // 28.27
// console.log(b.area().toFixed(2)); // 50.27

// function Ninja(){
//   this.swung = true;
// }

// var ninja = new Ninja();

// Ninja.prototype.swingSword = function(){
//   return this.swung;
// }

// console.log(ninja.swingSword()); // true

// function Ninja(){
//   this.swung = true;
// }

// var ninja = new Ninja();

// Ninja.prototype = {
//   swingSword: function() {
//     return this.swung;
//   }
// }

// console.log(ninja.swingSword()); // true

// function Ninja(){
//   this.swung = false;
// }

// var ninjaA = new Ninja();
// var ninjaB = new Ninja();

// // Add a swing method to the Ninja prototype which
// // returns itself and modifies swung

// Ninja.prototype.swing = function() {
//   this.swung = !this.swung;
//   return this;
// };

// console.log(ninjaA.swing().swung)      // this needs to be true
// console.log(ninjaB.swing().swung)      // this needs to be true

// var ninjaA = (function() {
//   function Ninja(){};
//   return new Ninja();
// })();

// // create a ninjaB object
// // var ninjaB = Object.create(ninjaA);
// var fn = ninjaA.constructor;
// var ninjaB = new fn();

// console.log(ninjaB.constructor === ninjaA.constructor)    // this should be true
