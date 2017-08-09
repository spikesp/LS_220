function Vehicle() {

}

Vehicle.prototype.doors = 4;
Vehicle.prototype.wheels = 4;

var sedan = new Vehicle();
var coupe = new Vehicle();
coupe.doors = 2;

// console.log(sedan.hasOwnProperty('doors'));
// console.log(coupe.hasOwnProperty('doors'));

function Coupe() {

}

Coupe.prototype = new Vehicle();
Coupe.prototype.constructor = Coupe;

// console.log(new Coupe() instanceof Motorcycle);

function Motorcycle() {

}

Motorcycle.prototype = new Vehicle();
Motorcycle.prototype.constructor = Motorcycle;

// console.log(new Motorcycle() instanceof Motorcycle);

function Sedan() {

}

Sedan.prototype = Object.create(Vehicle.prototype);

console.log(new Sedan() instanceof Vehicle);

console.log(JSON.stringify({hello: 'hi'}));
