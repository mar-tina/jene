import {
  createObjectOnCondition,
  addStmtToFunctionObject,
  checkIfAlreadyExists,
  addLoopToFunctionObject,
} from "../utils.js";
import { globalProvider } from "../provider.js";

export function handleDragStartLoop(e, self) {
  var loop = {
    name: "loop",
    id: e.target.id,
  };
  e.dataTransfer.setData("module", JSON.stringify(loop));
  console.log("is a drag", e.target.id);
}

// Unnecessary. will merge with above function
export function handleDragStartStmt(e, self) {
  var item = {
    name: "stmt",
    id: e.target.id,
  };
  e.dataTransfer.setData("module", JSON.stringify(item));
  console.log("is a drag", e.target.id);
}

export function handleDropOnFunc(e, self) {
  e.preventDefault();
  e.stopPropagation();
  let data = JSON.parse(e.dataTransfer.getData("module"));
  let existingObj = checkIfAlreadyExists(data.id);
  if (existingObj) {
    addStmtToFunctionObject(e.target.id, self.state.components, existingObj);
  } else {
    let obj = createObjectOnCondition(data.name);
    addStmtToFunctionObject(e.target.id, self.state.components, obj);
  }

  // update ctx provider to trigger page refresh
  globalProvider.providers.globalCtx.proxyObject.components =
    self.state.components;
  console.log(self);
}
