function createProduct(id, name, stock, price) {
  return {
    id: id,
    name: name,
    stock: stock,
    price: price,
    setPrice: function(price) {
      if (price < 0) throw 'Price must be non-negative';
      this.price = price;
    },
    describeProduct: function() {
      console.log('Name: '   + this.name);
      console.log('ID: '     + this.id);
      console.log('Price: $' + this.price);
      console.log('Stock: '  + this.stock);
    },
  };
}

var scissors = createProduct(0, 'Scissors', 8, 10);
var drill = createProduct(1, 'Cordless Drill', 15, 45);

scissors.describeProduct();
drill.describeProduct();
