
$(document).ready(function() {
  var socket=io();

$('.modal').modal();

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


  $('#btn_login').click(function() {
    Materialize.toast('Comprobando sus credenciales espere...',3000,'rounded');

    var usuario=$('#in_usuario').val();
    var pass=$('#in_password').val();
    socket.emit('DoLogIn',{user:usuario, pass:pass});
  });

  $('#menu').click(function() {
    socket.emit('DoLogOut');

 });

socket.on('error_login',function() {
  Materialize.toast('Usuario o contrasena incorrecta',10000,'rounded');
})
socket.on('show_login',function() {
  $('#div_login').show(300);
  $('#div_bienvenido').hide(300);
})
socket.on('set_cookie',function(data) {
  document.cookie=data;
  console.log('cookie set: ',data);
})
socket.on('auth',function(data) {
   Materialize.Toast.removeAll();
   Materialize.toast('Bienvenido de vuelta '+data,10000,'rounded');
  $('#div_login').hide(300);
  $('#div_bienvenido').show(300);
 $('.tap-target').tapTarget('open');
 setTimeout(function(){
   $('.tap-target').tapTarget('close');
 }, 2000);
})

});
