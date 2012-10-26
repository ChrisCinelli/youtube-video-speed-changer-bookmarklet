/*! 
 * Bookmarklet to change the speed (or playback rate) of YouTube Videos
 * but it should work on any other website with HTML5 video tags
 * 
 * Copyright(c) 2012 Chris Cinelli 
 * MIT Licensed. 
 * 
 * @author: Chris Cinelli
 * 
 * http://github.com/chriscinelli/youtube-video-speed-change-bookmarlet
 * 
 */

(function(document, window){
  var defaultSpeed = 100;
  var prefix       = "_yvscb_";
  var lsMemCnst    = prefix+"memory";
  var controlId    = prefix+"control";

  //Define a pseudo jquery (just for selction)
  function $(selector){ return document.querySelectorAll(selector);} 

  //I do not think that any browser that support playbackRate on video tag does not have localStorage... but anyway 
  function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }    

  //Speed is save in percentage (playbackRate * 100)
  var currSpeed = defaultSpeed;
  
  function getSpeed() {
    if (supports_html5_storage() && localStorage[lsMemCnst]){
      return localStorage[lsMemCnst];
    }
    return currSpeed;
  }
  
  function setSpeed(val) {
    if(supports_html5_storage()){
      currSpeed = localStorage[lsMemCnst] = val;
    } else {
      currSpeed = val;
    }
  }   

  var firstVideo = $("video")[0];
  if (!firstVideo){
    //Ugly alert, but seriusly, do we really want to implement a nice styled modal just for this?
    alert("This page does not have any HTML5 videos (this does not work with Flash videos)!");
    return;
  } 
  if (!firstVideo.playbackRate){
    alert("This browser does not support changes of playback rate on HTML5 videos! Try Google Chrome!");
    return;
  } 

  var body = $("body")[0];
  
  //If the element is already there, then remove it. Toggle effect.
  var oldElement = $("#"+controlId)[0];
  if(oldElement) {
      body.removeChild(oldElement);
      firstVideo.playbackRate = 1; //Also set back to normal the playback rate
      return;
  }
  
  //Design the element and attach it
  var controller = document.createElement('div');
  var stdStyle = ";background-color:#eee;border:1px solid #333;border-radius:3px;margin:2px";
  var boxStyle = stdStyle + ";padding:2px";
  var btnStyle = stdStyle + ";padding:2px 3px";
  controller.setAttribute("id",controlId);
  controller.innerHTML = '<div style="font:12px monospace;position:fixed;left:2px;top:2px;z-index:9999;box-shadow:1px 1px 4px #666'+boxStyle+'">'
                            +'<button class="plus" style="'+btnStyle+'">+</button>'
                            +'<input type="text" style="border:0;background-color:#eee;width:2em; ">%'
                            +'<button class="minus" style="'+btnStyle+'">-</button>'
                        +'</div>';

  body.appendChild(controller);
  
  var speedController = $("#"+controlId+" input")[0];
  
  //Accelerator to set the speed from the value of the input text
  function updateSpeed(){
    var s = speedController.value;
    
    firstVideo.playbackRate = s / 100.0;
    setSpeed(s);
  };
  
  //Everytime the speed change
  speedController.onchange = updateSpeed;
  
  //Attach events for the buttons 
  $("#"+controlId+" .minus")[0].onclick = function(){
    speedController.value = parseInt(speedController.value)-5;
    updateSpeed();
  }
  $("#"+controlId+" .plus")[0].onclick = function(){
    speedController.value = parseInt(speedController.value)+5;
    updateSpeed();
  }  
  
  //Intialize the speed to the last one or the default
  speedController.value = getSpeed();
  firstVideo.playbackRate = speedController.value / 100.0;
  
})(document, window);
