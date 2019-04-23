var demo = document.getElementById("demo");

demo.innerHTML = "Hello JavaScript!";
var newNode = document.createElement("div");
var newContent = document.createTextNode("Added");
newNode.appendChild(newContent);
document.getElementsByTagName("body")[0].appendChild(newNode);
