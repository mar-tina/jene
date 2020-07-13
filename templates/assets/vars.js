export function showVariables(items) {
  var arrayVariable = ["one", "two", "three"];
  var arrayLength = arrayVariable.length;
  var temp;

  for (var i = 0; i < items.length; i++) {
    temp = document.createElement("div");
    temp.className = "var-items";
    temp.contentEditable = true;
    temp.innerHTML = items[i].replace(",", " : ");
    document.getElementById("variables").appendChild(temp);
  }
}
