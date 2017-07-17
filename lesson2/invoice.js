var invoices = {
  unpaid: [],
};

invoices.add = function(name, amount) {
  this.unpaid.push({
    name: name,
    amount: amount,
  });
};

invoices.totalDue = function() {
  return this.unpaid.reduce(function(total, invoice) {
    return total + invoice.amount;
  }, 0);
};

invoices.paid = [];
invoices.payInvoice = function(name) {
  var newUnpaid = [];
  var self = this;

  this.unpaid.forEach(function(invoice) {
    if (invoice.name === name) {
      self.paid.push(invoice);
    } else {
      newUnpaid.push(invoice);
    }
  });

  this.unpaid = newUnpaid;
}

invoices.totalPaid = function() {
  return this.paid.reduce(function(total, invoice) {
    return total + invoice.amount;
  }, 0);
}

invoices.add('Due North Development', 250);
invoices.add('Moonbeam Interactive', 187.50);
invoices.add('Slough Digital', 300);

invoices.payInvoice('Due North Development');
invoices.payInvoice('Slough Digital');

console.log(invoices.totalPaid());
console.log(invoices.totalDue());
