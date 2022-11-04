function featuresSelect(sectionID, targetID) {
  var resetElm = document
    .getElementById(sectionID)
    .getElementsByClassName("active");

  for (var i = 0; i < resetElm.length; i++) {
    resetElm[i].classList.remove("active");
  }

  var targetElm = document.getElementById(targetID);
  targetElm.classList.add("active");
}
