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
  this.declarations = [];
  this.params = [];
  this.retval;
  this.ktype = "func";
};

FuncObject.prototype.addParams = function (param) {
  this.params.push(param);
};

FuncObject.prototype.getAll = function () {
  return this.params;
};

FuncObject.prototype.getTypeOf = function () {
  return this.ktype;
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

export let DeclarationObject = function (id) {
  this.id = id;
  this.name;
  this.type;
  this.value;
  this.ktype = "stmt";
};

DeclarationObject.prototype.definition = function (name, type, value) {
  this.name = name;
  this.type = type;
  this.value = value;
};

DeclarationObject.prototype.getTypeOf = function () {
  return this.ktype;
};

export let LoopObject = function (id) {
  this.id = id;
  this.name;
  this.loopValue;
  this.arg;
  this.index;
  this.ktype = "loop";
};

LoopObject.prototype.getTypeOf = function () {
  return this.ktype;
};
