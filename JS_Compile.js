"use strict";
this.GLOBALTHIS = "SUMIT_SHARMA";






//###############Memoize cache a function
console.log("#####################Memoize####################");
function myMemoize(fn) {
  const cache = {};
  return function (...args) {
    //slicing to make new array instead of modifying
    const key = JSON.stringify(args.slice().sort()); //not be desirable for non-commutative functions like subtraction (a - b !== b - a)
    if (key in cache) return cache[key];
    const val = fn(...args);
    cache[key] = val;
    return val;
  };
}

function myMemoize2(fn, context) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args.slice().sort()); //not be desirable for non-commutative functions like subtraction (a - b !== b - a)
    if (key in cache) return cache[key];
    const val = fn.apply(context || this, args);
    cache[key] = val;
    return val;
  };
}
function myadd(a, b) {
  console.log(this);
  console.log("Computing...", a, b);
  return a + b;
}

const memoizedAdd = myMemoize2(myadd, this);
console.log(memoizedAdd(2, 3));
console.log(memoizedAdd(2, 3));










// #####################CURRYING
console.log("#####################CURRYING####################");
// breaking down a function that takes multiple arguments into a chain of functions, each accepting one argument.

//simple currying
function currAdd(a) {
  return function (b) {
    return (c) => {
      return a + b + c;
    };
  };
}

//infinite currying
function infCurrAdd(a) {
  return function (b) {
    if (b) return infCurrAdd(a + b);
    return a;
  };
}
console.log(infCurrAdd(2)(9)());

//######################QUESTION IMPLEMEMNT CALC
console.log(
  "#####################QUESTION IMPLEMEMNT CALC####################"
);

const calc = {
  total: 0,
  add: function (a) {
    this.total += a;
    return this;
  },
  multiply(a) {
    this.total *= a;
    return this;
  },
  substract: function (a) {
    this.total -= a;
    return this;
  },
  divide: (a) => {
    //arrow function
    console.log(this); //gloal this
    calc.total /= a;
    return calc;
  },
  divide2: function (a) {
    //arrow inside regular function
    const fn = () => {
      //if we use normal funtion here it will give error bcz this will be undefined inside it see divide 3
      this.total /= a;
    };
    fn(); // Now `this` refers to `calc`
    return this;
  },
  divide3: function (a) {
    //arrow inside arrow function
    function fn() {
      this.total /= a;
    }
    fn.call(this);
    return this;
  },
};

const res = calc.add(5).multiply(10).substract(5).divide3(5);
console.log(res.total);












//######################VAR is function scope where as const and let is block scope
console.log("#####################Scope let var const####################");

// Lexical Scoping:
// In JavaScript, variables are lexically scoped.
// This means that the scope of a variable is determined by where it is defined, not where it is called.
// When a function is created, it "remembers" the scope in which it was defined, even if it is executed outside that scope.
// A closure is created whenever a function is defined within another function, and the inner function has access to variables from the outer function.

// Closure Examples
// 1.)
function outerFunction() {
  let outerVariable = "I am from the outer function";

  function innerFunction() {
    console.log(outerVariable); // innerFunction has access to outerVariable
  }

  return innerFunction; // Returning the inner function, creating a closure
}

// 2.) Closure with parameter here multiplier is closured
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

//3.)
function scope() {
  // for (var i = 0; i < 10; i++) {
  //     const a = i;
  //     setTimeout(() => console.log(a), i * 1000);
  // }

  for (var i = 0; i < 10; i++) {
    (function (i) {
      setTimeout(() => console.log(i), i * 1000);
    })(i);
  }
}
// scope()











//###################### How Hoisting Works #####################
console.log("#####################Hoisting####################");
// Function Declarations: Hoisted completely (both the function name and the body).
// Variable Declarations: Only the declaration (var), not the initialization (the value assigned).
// let and const Variables: Hoisted, but they remain in a temporal dead zone until they are initialized. You cannot access them before their declaration line.

// 1.) Hoisting of Function Declarations
// greetA();  // This will work even though the function is called before its declaration.
function greetA() {
  console.log("Hello, world!");
}

// 2.) Hoisting of Function Expressions
// Function expressions, including arrow functions, are not hoisted in the same way that function declarations are.
// They are treated like variables, meaning only the variable declaration is hoisted, not the function definition.
// myFunction();  // TypeError: myFunction is not a function
var myFunction = function () {
  console.log("This is a function expression.");
};

// 3.) When variables are declared using var, only the declaration is hoisted, but not the assignment.
console.log(x); // undefined (not ReferenceError)
var x = 5;
console.log(x); // 5

// 4.) let and const declarations are hoisted,
// but they are placed in the temporal dead zone (TDZ) from the start of the block until the variable is initialized.
// Accessing the variable in the TDZ results in a ReferenceError.
//console.log(y);  // ReferenceError: Cannot access 'y' before initialization
let y = 10;

// 5.) Hoisting with Classes
// Classes in JavaScript behave similarly to variables declared with let and const.
// They are hoisted, but they cannot be accessed before their declaration due to the temporal dead zone.
// let person = new Person();  // ReferenceError: Cannot access 'Person' before initialization
class Person {
  constructor(name) {
    this.name = name;
  }
}














//######################Implicit vs explicit binding#####################
console.log(
  "#####################Implicit vs explicit binding####################"
);

// A.) Implicit Binding
// Implicit binding refers to the automatic setting of this based on the context in which a function is called
// — specifically, when a function is invoked as a method of an object.
// How It Works:
// When a function is called as a method of an object, JavaScript automatically sets the value of this to be that object.
// The value of this is implicitly bound to the object in the method call.

// 1.
const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function () {
    console.log(this.firstName + " " + this.lastName);
  },
};

person.fullName(); // Implicit binding: 'this' refers to 'person'

// 2. In this case, this inside the sayHello function does not refer to the person object
// because sayHello is a nested function, and it is not directly called as a method of person.
const person2 = {
  firstName: "Jane",
  lastName: "Smith",
  greet: function () {
    const sayHello = function () {
      console.log(this.firstName); // 'this' refers to the global object or undefined in strict mode
    };
    sayHello();
  },
};

// person2.greet();  // undefined in strict mode or global object in non-strict mode

// B.) Explicit Binding
// Explicit binding occurs when the value of this is set explicitly using one of the call(), apply(), or bind() methods.
// These methods allow you to manually control the value of this.

// 1.CAll
function greetE1() {
  console.log("Hello, " + this.name);
}

const person3 = {
  name: "Alice",
};

greetE1.call(person3); // Explicit binding with 'call'

// 2.Apply
function greetE2(city, country) {
  console.log("Hello, " + this.name + " from " + city + ", " + country);
}

const person4 = {
  name: "Bob",
};

greetE2.apply(person4, ["New York", "USA"]); // Explicit binding with 'apply'

// 3.Bind
function greetE3(city, country) {
  console.log("Hello, " + this.name + " from " + city + ", " + country);
}

const person5 = {
  name: "Charlie",
};

const greetCharlie = greetE3.bind(person5, "Los Angeles", "USA"); // Explicit binding with 'bind'
greetCharlie(); // Invokes the new function

// C. this in Arrow Functions
// One key distinction to note when dealing with this binding is that arrow functions
// behave differently than regular functions in terms of this.
// Arrow functions do not have their own this; instead, they inherit this from the surrounding lexical context.

const person6 = {
  name: "David",
  greet: function () {
    const sayHello = () => {
      console.log("Hello, " + this.name); // 'this' is inherited from greet()
    };
    sayHello();
  },
};

person6.greet(); // "Hello, David"


















//######################POLYPHILLS#####################
console.log("#####################POLYPHILLS####################");

//FILTER
Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  let result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback.apply(thisArg, [this[i], i, this])) {
      result.push(this[i]);
    }
  }
  return result;
};

let ress = [1, 2, 3, 4, 5].myFilter(
    function (value, index) {
      console.log(this);
      return value > 2;
    },
    { currThis: "filterthis" }
);
console.log(ress);


//MAP
Array.prototype.myMap = function (callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result[i] = callback.call(thisArg, this[i], i, this);
    }
    return result;
};


//REDUCE
Array.prototype.myReduce = function (callback, initialValue=0) {
    let acc = initialValue;
    for (let i = 0; i < this.length; i++) {
        acc = callback(acc, this[i], i, this);
    }
    return acc;
};

let a = [1,2,3,4,5].myReduce((prev, curr, index, arr)=>prev+curr,0);
console.log(a);


const myPromise1 = new Promise((resolve, reject)=>{
    // resolve('myPromise1 resolved');
    reject('myPromise1 rejected')
})

const myPromise2 = new Promise((resolve, reject)=>{
    resolve('myPromise2 resolved');
    // reject('myPromise2 rejected')
})

const myPromise3 = 3;

// Promise.race
Promise.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        for (let promise of promises) {
            //dont use catch since it's slow and  it adds catch to extra microtaskqueue between which other promise can resolve
            Promise.resolve(promise).then(resolve,reject); // First settled promise wins

        }
    });
};

//Promise.any
Promise.myAny = function (promises) {
    return new Promise((resolve, reject) => {

        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }
    
        let errors = [];
        let rejectedCount = 0;
        let total = promises.length;

        if (total === 0) return reject(new AggregateError([], 'All promises rejected'));

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(resolve)
                .catch(err => {
                    errors[index] = err;
                    rejectedCount++;
                    if (rejectedCount === total) {
                        reject(new AggregateError(errors, 'All promises rejected'));
                    }
                });
        });
    });
};

//Promise.all
Promise.MyAll = function (promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        let results = [];
        let completed = 0;
        let total = promises.length;

        if (total === 0) return resolve([]); // Handle empty array

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;
                    if (completed === total) resolve(results);
                })
                .catch(reject); // Reject immediately if any promise fails
        });
    });
};

//Promise.allSettled
Promise.myAllSettled = function (promises) {
    return new Promise((resolve) => {
        if (!Array.isArray(promises)) {
            throw new TypeError('Argument must be an array');
        }

        let results = [];
        let completed = 0;
        let total = promises.length;

        if (total === 0) return resolve([]);

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(value => {
                    results[index] = { status: 'fulfilled', value };
                })
                .catch(reason => {
                    results[index] = { status: 'rejected', reason };
                })
                .finally(() => {
                    completed++;
                    if (completed === total) resolve(results);
                });
        });
    });
};















//######################ASYNC PROGRAMMING#####################
console.log("#####################ASYNC PROGRAMMING####################");

// 1.Callback   2.Promise   3. Async/Await

// 1. Callback
//Problems  -Callback hell      -Inversion  of control (relying on other function to call our function)

//2.) Promise

const prom = new Promise((resolve, reject) => {
  resolve("resolved by ss");
  // reject('rejected by ss')
});

prom
  .then((v) => {
    console.log(v);
    return "ss";
  })
  .then((v) => {
    console.log(v); //print "ss"
    return "from last then";
  })
  .catch((e) => {
    console.log(e);
    return "from error";
  })
  .then((v) => {
    console.log("Definitely called always", v);
  });

// Promise.all() -> runs multiple Promises in parallel and waits for all to complete.
// If any promise fails, the whole Promise.all() fails.
const p1 = new Promise((resolve) => setTimeout(() => resolve("One"), 2000));
const p2 = new Promise((_, reject) => setTimeout(() => reject("Error!"), 1000));

Promise.all([p1, p2])
  .then((results) => console.log(results))
  .catch((error) => console.log("Failed:", error));
// Output: "Failed: Error!" (after 1 second)

// Promise.allSettled() -> waits for all Promises to complete, regardless of success or failure.
const p11 = new Promise((resolve) =>
  setTimeout(() => resolve("Success"), 1000)
);
const p22 = new Promise((_, reject) =>
  setTimeout(() => reject("Failed"), 2000)
);

Promise.allSettled([p11, p22]).then((results) => console.log(results));
// [
//     { status: "fulfilled", value: "Success" },
//     { status: "rejected", reason: "Failed" }
// ]

// Promise.race() -> resolves/rejects as soon as any Promise finishes.
const p111 = new Promise((resolve) => setTimeout(() => resolve("First"), 2000));
const p211 = new Promise((_, reject) =>
  setTimeout(() => reject("Second"), 1000)
);

Promise.race([p111, p211])
  .then((result) => console.log(result))
  .catch((error) => console.log("Failed:", error));
// Output: "Failed: Second" (after 1 second)

// Promise.any() -> resolves as soon as any Promise is fulfilled (ignores rejections).
const p51 = new Promise((_, reject) =>
  setTimeout(() => reject("Error1"), 1000)
);
const p52 = new Promise((resolve) =>
  setTimeout(() => resolve("Success"), 2000)
);

Promise.any([p51, p52])
  .then((result) => console.log(result))
  .catch((error) => console.log(error.errors));
// Output: "Success" (after 2 seconds)

