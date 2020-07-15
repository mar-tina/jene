export function showVariables(items, retval) {
  var temp;
  var varscontainer = document.getElementById("variables");
  varscontainer.innerHTML = "";
  varscontainer.innerHTML = "Variables";

  for (var i = 0; i < items.length; i++) {
    temp = document.createElement("div");
    temp.className = "var-items";
    temp.contentEditable = true;
    temp.innerHTML = items[i].replace(",", " : ");
    document.getElementById("variables").appendChild(temp);
  }

  var retDiv = document.createElement("div");
  retDiv.innerHTML = "Return : " + retval;
  document.getElementById("variables").appendChild(retDiv);
}
