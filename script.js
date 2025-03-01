'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Felipe Arnt',
  movements: [430, 1000, 700, 50, 90, 8000],
  interestRate: 1,
  pin: 4200,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


containerMovements.innerHTML = ''

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
// Test data
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1
const movementsUSD = movements.map(mov => mov = eurToUsd)

// calc all the deposits in usd
const allDepositsUSD = function(movements){
  return movements.filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov,0)
}

const biggestMove = movements.reduce(function(acc, cur, i) {
  if(cur > acc) acc = cur
  return acc
}, movements[0])

//Display movements
const displayMovements = function(movements) {
movements.forEach(function(mov, i) {
  const type = mov > 0 ? 'deposit' : 'withdrawal'
  const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>
        `
        containerMovements.insertAdjacentHTML('afterbegin', html)
});
}

//Create usernames
const createUsernames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner
    .toLocaleLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('')
  })
};
createUsernames(accounts)

// calc and display balance
const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`
}

//calc and display all summary
const displaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes}€`
  
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)}€`
  
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit* acc.interestRate) / 100)
  .filter(int => int >= 1)
  .reduce((acc, int) => acc + int,0)
labelSumInterest.textContent = `${interest}€` 
}

//Call Displays 
const updateUI = function(acc){
displayMovements(acc.movements)
calcDisplayBalance(acc)
displaySummary(acc)}

//defines curent Account active
let currentAccount

// LOGIN button+
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();
  
currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)
console.log(currentAccount)
if(currentAccount?.pin === Number(inputLoginPin.value)) {
    //show 
    containerApp.style.opacity = 100
    //clear input field
    inputLoginPin.value = inputLoginUsername.value = " "
    
    updateUI(currentAccount)

    // welcome messages
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`
  }
})

btnTransfer.addEventListener('click', function(e){ 
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value)
  if (amount > 0 && currentAccount.balance >= amount && reciverAcc?.username) {

    //Transfer
    currentAccount.movements.push(-amount)
    reciverAcc.movements.push(amount)

    //uptade the UI
    updateUI(currentAccount)
    // blank the input forms
    inputTransferTo.value = inputTransferAmount.value = " " 
  }
})

btnClose.addEventListener('click', function(e){
  e.preventDefault()

  //check credentials 
  if((inputCloseUsername.value === currentAccount.username)&&(Number(inputClosePin.value) === currentAccount.pin)) {
    //search index of the deleted acc
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    //Hide UI
    containerApp.style.opacity = 0
    //Delete Acount
    accounts.splice(index, 1)
  }
  inputCloseTo.value = inputCloseAmount.value = " "
  labelWelcome.textContent = "Log in to get started"
})