const filter = (callback, array) => {
  let returnArr = [];

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i])) {
      returnArr.push(array[i]);
    }
  }

  return returnArr;
};

const arr = [1, 2, 3, 4, 5, 6];

const filteredArr = filter(
  (v) => {
    if (v > 2) {
      return true;
    }
  },

  arr
);

const req = {
    url : "1",
    method: "post",
    headers : {

    },
    body: {

    }
}

req.headers["request_id"] = "1111111"


console.log(req)