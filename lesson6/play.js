// WITH CLOSURE:
// var box = {
//   x: 25,
//   y: 42,
//   z: 12,
//   logVolume: function() {
//     var self = this;
//     return function() {
//       console.log(self.x * self.y * self.z);
//     };
//   }
// };

// var fn = box.logVolume();
// setTimeout(fn, 2000);

// WITH CLOSURE AGAIN:
// var box = {
//   x: 25,
//   y: 42,
//   z: 12,
//   logVolume: function() {
//     return function() {
//       console.log(this.x * this.y * this.z);
//     }.bind(this);
//   }
// };

// var boundFn = box.logVolume();

// setTimeout(boundFn, 2000);

// WITH FUNCTION WRAPPER:
// var box = {
//   x: 25,
//   y: 42,
//   z: 12,
//   logVolume: function() {
//     console.log(this.x * this.y * this.z);
//   }
// };

// function callFn() {
//   box.logVolume();
// }

// setTimeout(callFn, 2000);

// WITH BIND:
// var box = {
//   x: 25,
//   y: 42,
//   z: 12,
//   logVolume: function() {
//     console.log(this.x * this.y * this.z);
//   }
// };

// var boundFn = box.logVolume.bind(box);
// setTimeout(boundFn, 2000);
