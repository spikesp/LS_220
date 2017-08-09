// can't tell if it's an instance of a class
// methods are on every object

function createInvoice(services) {
  services = services || {};

  return {
    phone:    services.phone    || 3000,
    internet: services.internet || 5500,
    payments: [],
    total: function() {
      return this.phone + this.internet;
    },
    addPayment: function(payment) {
      this.payments.push(payment);
    },
    addPayments: function(payments) {
      payments.forEach(function(payment) {
        this.payments.push(payment);
      }, this);
    },
    paymentTotal: function() {
      return this.payments.reduce(function(sum, payment) {
        return sum + payment.total();
      }, 0);
    },
    amountDue: function() {
      return this.total() - this.paymentTotal();
    },
  }
}

function invoiceTotal(invoices) {
  var total = 0;
  for (var i = 0; i < invoices.length; i++) {
    total += invoices[i].total();
  }

  return total;
}

// var invoices = [];
// invoices.push(createInvoice());
// invoices.push(createInvoice({
//  internet: 6500
// }));

// invoices.push(createInvoice({
//  phone: 2000
// }));

// invoices.push(createInvoice({
//   phone: 1000,
//   internet: 4500
// }));

// console.log(invoiceTotal(invoices));             // 31000

function createPayment(services) {
  services = services || {};

  return {
    phone: services.phone || 0,
    internet: services.internet || 0,
    amount: services.amount,
    total: function() {
      return this.amount || (this.phone + this.internet);
    },
  }
}

function paymentTotal(payments) {
  var total = 0;
  for (var i = 0; i < payments.length; i++) {
    total += payments[i].total();
  }

  return total;
}

// var payments = [];
// payments.push(createPayment());
// payments.push(createPayment({
//   internet: 6500
// }));

// payments.push(createPayment({
//   phone: 2000
// }));

// payments.push(createPayment({
//   phone: 1000, internet: 4500
// }));

// payments.push(createPayment({
//   amount: 10000
// }));

// console.log(paymentTotal(payments));      // 24000

var invoice = createInvoice({
  phone: 1200,
  internet: 4000
});

var payment1 = createPayment({
  amount: 2000
});

var payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

var payment3 = createPayment({
  phone: 1000
});

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());       // this should return 0