function makeBank() {
  var accounts = [];

  return {
    openAccount: function() {
      var accountNumber = accounts.length + 101;
      var account = makeAccount(accountNumber);
      accounts.push(account);
      return account;
    },

    transfer: function(source, destination, amount) {
      return destination.deposit(source.withdraw(amount));
    },
  };
}

function makeAccount(accountNumber) {
  var balance = 0;
  var transactions = [];

  return account = {
    number: function() {
      return accountNumber;
    },

    balance: function() {
      return balance;
    },

    transactions: function() {
      return transactions.slice();
    },

    deposit: function(amount) {
      balance += amount;
      transactions.push({type: 'deposit', amount: amount});
      return amount;
    },

    withdraw: function(amount) {
      if (amount > balance) {
        amount = balance;
      }
      balance -= amount;
      transactions.push({type: 'withdraw', amount: amount});
      return amount;
    }
  };
}

// var account = makeAccount(101);

// console.log(account.balance());
// 0

// console.log(account.deposit(100));
// 100

// console.log(account.balance());
// 100

// console.log(account.withdraw(19));
// 19

// console.log(account.balance());
// 81

// console.log(account.withdraw(91));
// 81

// console.log(account.balance());
// 0

// console.log(account.deposit(23));
// 23

// console.log(account.transactions());
// [Object]

// account.transactions().push({type: 'deposit', amount: 5000,});
// console.log(account.transactions());

// console.log(account.transactions()[0]);
// Object {type: "deposit", amount: 23}

// var account = makeAccount();

// console.log(account.deposit(15));
// 15

// console.log(account.balance());
// 15

// var otherAccount = makeAccount();

// console.log(otherAccount.balance());
// 0

// var bank = makeBank();

// console.log(bank.accounts);
// []

// var bank = makeBank();
// var account = bank.openAccount();

// console.log(account.number);
// 101

// console.log(bank.accounts);
// [Object]

// console.log(bank.accounts[0]);
// Object {number: 101, balance: 0, transactions: Array[0]}

// var secondAccount = bank.openAccount();

// console.log(secondAccount.number);
// 102

// var bank = makeBank();
// var source = bank.openAccount();

// console.log(source.deposit(10));
// 10

// var destination = bank.openAccount();

// console.log(bank.transfer(source, destination, 7));
// 7

// console.log(source.balance);
// 3

// console.log(destination.balance);
// 7

// var bank = makeBank();
// var account = bank.openAccount();

// console.log(account.balance());
// 0
// console.log(account.deposit(17));
// 17

// var secondAccount = bank.openAccount();

// console.log(secondAccount.number());
// 102

// console.log(account.transactions());
// account.transactions().push({type: 'deposit', amount: 5000});
// console.log(account.transactions());

// [Object]

var bank = makeBank();
console.log(bank.transactions);
// undefined
console.log(bank.transactions());
// TypeError: makebank.account is not a function
