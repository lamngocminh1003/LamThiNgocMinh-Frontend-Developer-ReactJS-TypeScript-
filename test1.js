const n = 5;

//Using a Loop (Iterative Approach)
const sum_to_n1 = (n) => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};
console.log("result sum_to_n1(n):", sum_to_n1(n));

//Using a Formula (Mathematical Approach)
const sum_to_n2 = (n) => {
  return (n * (n + 1)) / 2;
};
console.log("result sum_to_n2(n):", sum_to_n2(n));

//Using Recursion (Recursive Approach)
const sum_to_n3 = (n) => {
  if (n === 1) return 1;
  return n + sum_to_n3(n - 1);
};
console.log("result sum_to_n3(n):", sum_to_n3(n));

//Open terminal/cmd và run: node test1.js
