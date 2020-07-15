export let StackTree = function () {
  this.objList = [];
};

StackTree.prototype.addObject = function (obj) {
  this.objList.push(obj);
  console.log("All objects", this.objList);
};

StackTree.prototype.getAll = function () {
  return this.objList;
};

export let FuncObject = function (id) {
  this.name;
  this.id = id;
  this.params = [];
  this.retval;
};

FuncObject.prototype.addParams = function (param) {
  this.params.push(param);
  console.log("PARAMAS", this.params);
};

FuncObject.prototype.getAll = function () {
  return this.params;
};

FuncObject.prototype.getType = function () {
  return "FuncObject";
};

FuncObject.prototype.setName = function (name) {
  this.name = name;
};

FuncObject.prototype.getReturnValue = function () {
  return this.retval;
};

FuncObject.prototype.setReturnValue = function (ret) {
  this.retval = ret;
};

export let DeclarationObject = function () {
  this.name;
  this.type;
  this.value;
};

DeclarationObject.prototype.definition = function (name, type, value) {
  this.name = name;
  this.type = type;
  this.value = value;
};
