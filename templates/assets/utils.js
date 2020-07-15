// export async function makePOSTRequest(url = "", data = {}) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     method: "POST", // *GET, POST, PUT, DELETE, etc.
//     mode: "cors", // no-cors, *cors, same-origin
//     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: "same-origin", // include, *same-origin, omit
//     headers: {
//       "Content-Type": "application/json",
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: "follow", // manual, *follow, error
//     referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   });
//   return response.json(); // parses JSON response into native JavaScript objects
// }

import { FuncObject, DeclarationObject, LoopObject } from "./definition.js";

// document.getElementById("func").onclick = () => {
//   console.log("clicked");
//   var data = {
//     instructions: [
//       "pkg:home.go:main",
//       "f-start:sayHi:string:name,string salutation,string",
//       "declare:email:int:i*1",
//       "f-end",
//       "f-start:sayBye:string:name,string salutation,string",
//       "declare:friend:string:longtimefriend",
//       "f-end",
//     ],
//   };
//   makePOSTRequest("/serv", data).then((res) => console.log("RES", res));
// };

export function sanitize(string) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
}

export function getRandom(size) {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, size);
}

export let createObjectOnCondition = (cond) => {
  let ret;
  switch (cond) {
    case "func":
      ret = new FuncObject(getRandom(6));
      break;
    case "stmt":
      ret = new DeclarationObject(getRandom(6));
      break;
    case "loop":
      ret = new LoopObject(getRandom(6));
      break;
  }

  return ret;
};

export let addStmtToFunctionObject = (id, items, stmt) => {
  for (var i in items) {
    if (items[i].id == id) {
      items[i].declarations.push(stmt);
      break; //Stop this loop, we found it!
    }
    console.log("Item", items[i].id);
  }
};
