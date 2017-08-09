// var foo = {};
// var bar = Object.create(foo);

// foo.a = 1;

// console.log(bar.a); // 1

// var foo = {};
// var bar = Object.create(foo);

// foo.a = 1;
// bar.a = 2;
// console.log(bar.a); // 2

var boo = {};
boo['myProp'] = 1;

var far = Object.create(boo);

// lots of code

far['myProp']; // 1

// no bc the property on boo could have been overridden by a property of far
// we can test this by using hasOwnProperty
