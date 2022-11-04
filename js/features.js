function featuresSelect(sectionID, targetID,thumbID,scrollID,bgID,imgID) {
  var resetElm = document
    .getElementById(sectionID)
    .getElementsByClassName("active");

  for (var i = 0; i < resetElm.length; i++) {
    resetElm[i].classList.remove("active");
  }

  var targetElm = document.getElementById(targetID);
  targetElm.classList.add("active");

  var resetThumb =document
    .getElementById(scrollID)
    .getElementsByClassName("blue");
    for (var i = 0; i < resetThumb.length; i++) {
      resetThumb[i].classList.remove("blue");
    }
  
    var targetElm = document.getElementById(thumbID);
    targetElm.classList.add("blue"); 
    

    var resetImg =document
    .getElementById(bgID)
    .getElementsByClassName("screenshot");
    for (var i = 0; i < resetImg.length; i++) {
      resetImg[i].classList.remove("screenshot");
    }
  
    var targetElm = document.getElementById(imgID);
    targetElm.classList.add("screenshot"); 
      
}


function mobileScroll(id) {
  
  document.getElementById(id).scrollIntoView({block: "nearest"});
  



}