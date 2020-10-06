// Example of async execution ordering /////////////////////////////////////////
async function asyncFunc() {
  console.log("asyncFunc()"); // (A)
  return "abc";
}

asyncFunc().then((res) => console.log(`Resolved: ${res}`)); // (B)

console.log("main thread"); // (C)

// Ans: A -> C -> B

////////////////////////////////////////////////////////////////////////////////
