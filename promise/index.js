// Ref: Ref: https://2ality.com/2016/10/async-function-tips.html

// Example of async execution ordering /////////////////////////////////////////

async function asyncFunc() {
  console.log("asyncFunc()"); // (A)
  return "abc";
}

asyncFunc().then((res) => console.log(`Resolved: ${res}`)); // (B)

console.log("main thread"); // (C)

// Ans: A -> C -> B

// Example of handling parallelism /////////////////////////////////////////////

// Sequential
async function foo() {
  const result1 = await asyncFunc1();
  const result2 = await asyncFunc2();
}

// Parallel
async function foo() {
  const [result1, result2] = await Promise.all([asyncFunc1(), asyncFunc2()]);
}

// Example of array of async calls /////////////////////////////////////////////

// Wrong 1
async function downloadContent(urls) {
  return urls.map(url => {
    // Wrong syntax! Need to be wrap in async func
    const content = await httpGet(url);
    return content;
  });
}

// Wrong 2
async function downloadContent(urls) {
  // It's now returning an array of Promises instead of values
  return urls.map(async (url) => {
    const content = await httpGet(url);
    return content;
  });
}

// Fix 1
async function downloadContent(urls) {
  const promiseArray = urls.map(async (url) => {
    const content = await httpGet(url);
    return content;
  });
  return await Promise.all(promiseArray);
}

// Fix 1.1
async function downloadContent(urls) {
  const promiseArray = urls.map(url => httpGet(url));
  return await Promise.all(promiseArray);
}

// Fix 1.2
async function downloadContent(urls) {
  const promiseArray = urls.map(url => httpGet(url));
  return Promise.all(promiseArray);
}

// Example of forEach of async calls ///////////////////////////////////////////

// Wrong 1
async function logContent(urls) {
  urls.forEach(url => {
    // Wrong syntax
    const content = await httpGet(url);
    console.log(content);
  });
}

// Wrong 2
async function logContent(urls) {
  urls.forEach(async url => {
    const content = await httpGet(url);
    console.log(content);
  });
  // Not finished here
}

// Fix 1
async function logContent(urls) {
  for (const url of urls) {
    const content = await httpGet(url);
    console.log(content);
  }
  // Yet it's not paralleled
}

// Fix 2
async function logContent(urls) {
  await Promise.all(urls.map(
    async url => {
      const content = await httpGet(url);
      console.log(content);
  }));
}
