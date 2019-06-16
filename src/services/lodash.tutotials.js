const _ = require("lodash");

const obj = {
  name: "hackagon",
  age: 24,
  email: undefined
}

const arr = _.chain(obj).toPairs().value().map(attr => {
  attr[1] = attr[1] ? attr[1] : ""
  return attr;
})

console.log(arr)
