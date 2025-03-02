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

//================================APLICATION================================//


///////////DEFINING FUNCTIONS/////////////////
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
  

  ///////////LOGIN BTN/////////////////
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
  

  
  ///////////TRANSFER BTN/////////////////
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
      inputTransferTo.value = inputTransferAmount.value = "" 
    }
  })

   ///////////LOAN BTN/////////////////
   btnLoan.addEventListener('click', function(e){
    e.preventDefault()
    const amount = Number(inputLoanAmount.value)
    //check if the amount is at least grater than 10% of any depoist
    if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.10)) currentAccount.movements.push(amount)
    updateUI(currentAccount)
    inputLoanAmount.value = ''
   })
  
  ///////////CLOSE BTN/////////////////
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
    inputClosePin.value = inputCloseUsername.value = ""
    labelWelcome.textContent = "Log in to get started"
})



////////// Learning ///////////

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

//const lastBigM = movements.indexOf(movements.findLast(mov => mov >= 2000))
const lastBigM = movements.findLastIndex(mov => Math.abs(mov) >= 2000)
//const str = `Your last large move was ${movements.length - lastBigM -1} moves ago`


// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

GOOD LUCK 😀
*/


const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];


//const recommendedFood = weight ** 0.75 * 28
//if(current > (recommended * 0.90) && current < (recommended * 1.10)) console.log('Recomended amount')
const recommended = function() {
  if(this.curFood > (this.recFood * 0.90) && this.curFood < (this.recFood * 1.10)) return true
  else return false
}

dogs.map(dog => dog.recFood = dog.weight ** 0.75 * 28)

const SarahsDog = dogs.find(dog => dog.owners.includes('Sarah'))
const ownersTooMuch = dogs.filter(dog => dog.curFood > dog.recFood * 1.1).flatMap(dog => dog.owners)
const ownersTooLittle = dogs.filter(dog => dog.curFood < dog.recFood * 0.9).flatMap(dog => dog.owners)

const ownersMuchAndLittle = `${ownersTooMuch.join(' ')}'s dogs eat too much! and ${ownersTooLittle.join(' ')}'s dogs eat too much!` 
console.log(ownersMuchAndLittle)
console.log(recommended.call(SarahsDog))

console.log(dogs.some(dog => dog.curFood === dog.recFood))
console.log(dogs.every(dog => recommended.call(dog)))
const okayDogs = dogs.filter(dog => recommended.call(dog))