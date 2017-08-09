// var shape = {
//   constructor: Triangle,
//   type: '',
//   getType: function() {
//     return this.type;
//   },
//   getPerimeter: function() {
//     return this.a + this.b + this.c;
//   },
// };

// function Triangle(a, b, c) {
//   this.type = 'triangle';
//   this.a = a;
//   this.b = b;
//   this.c = c;
// }

// Triangle.prototype = shape;

// var t = new Triangle(1, 2, 3);
// console.log(t.constructor);                 // Triangle(a, b, c)
// console.log(shape.isPrototypeOf(t));        // true
// console.log(t.getPerimeter());              // 6
// console.log(t.getType());                   // "triangle"

// function User(first, last) {
//   if (!(this instanceof User)) {
//     return new User(first, last);
//   }

//   this.name = first + ' ' + last;
// }

// // console.log(!(this instanceof User));

// var name = 'Jane Doe';
// var user1 = new User('John', 'Doe');
// var user2 = User('John', 'Doe');

// console.log(name);         // Jane Doe
// console.log(user1.name);   // John Doe
// console.log(user2.name);   // John Doe

// function createObject(obj) {
//   function F() {}
//   F.prototype = obj;
//   return new F();
// }

// var foo = {
//   a: 1
// };

// var bar = createObject(foo);
// console.log(foo.isPrototypeOf(bar));         // true

// Object.prototype.begetObject = function() {
//   function F() {};
//   F.prototype = this;
//   return new F();
// }

// var foo = {
//   a: 1
// };

// var bar = foo.begetObject();
// console.log(foo.isPrototypeOf(bar));         // true

// function neww(constructor, args) {
//   var obj = Object.create(constructor.prototype);
//   var returnVal = Person.apply(obj, args);
//   return returnVal || obj;
// }

// function Person(firstName, lastName) {
//   this.firstName = firstName;
//   this.lastName = lastName;
// }

// Person.prototype.greeting = function() {
//   console.log('Hello, ' + this.firstName + ' ' + this.lastName);
// }

// var john = neww(Person, ['John', 'Doe']);
// john.greeting();          // Hello, John Doe
// console.log(john.constructor);         // Person(firstName, lastName) {...}
