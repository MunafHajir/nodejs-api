const helloPromise = () => {
  const promise = new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < 10000; i++) {}
      resolve("hello");
    } catch (err) {
      reject("failed");
    }
  });
  return promise
};

const hello = async () => {
//    helloPromise().then(() => {}).catch(() => ;
  console.log(output);
};

hello();
