
$(document).ready(function() {
  var socket=io();
socket.on('connect', () => {
      console.log("Conectado: "+socket.id);
    });
socket.on('mensaje',(data) =>{

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
    var notification = new Notification(data);
  }
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(data);
        }
      });
    }
  });



});
