var express = require('express');
var io = require('socket.io');
var cookie = require('cookie');
var bodyParser = require('body-parser')
var PORT = 80;
var app = express();
var session = new Object();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use('/', express.static(__dirname + '/html/'));
var server = app.listen(PORT);

var io = require('socket.io').listen(server);
var redis = require("redis"),
    client = redis.createClient();

io.use((socket, next) => {
  return next();
});


io.on('connection', function(socket) {
  //io.sockets.connected[cl].emit('mensaje','hola');

  var cookief =socket.handshake.headers.cookie;
  var cookies;
  if(socket.handshake.headers.cookie!=null)
  {
    console.log(socket.handshake.headers.cookie)
    cookies = cookie.parse(socket.handshake.headers.cookie);
    if(cookies.user_id!=null)
    {
      client.get(cookies.user_id, function (err, reply) {
        if(reply)
          {
            if(cookies.keyword==reply)
            {
              socket.emit('auth',cookies.user_id);
            }
          }
          else
          {
              console.log('Necesita volver a loggearse');
              socket.emit('show_login');
          }

      });
    }
    else
    {
      socket.emit('show_login');
    }
  }
  else
  {
    socket.emit('show_login');
    console.log('else show login')
  }




socket.on('DoLogIn',function DoLogIn(data) {
  //Si todo el inicio de sesion sale bien hacer esto
  var date = new Date();
  date.setTime(date.getTime()+(1*60*60*1000));
  var expires = "; expires="+date.toGMTString();
  socket.emit('set_cookie','user_id='+data.user+expires+'; path=/');
  socket.emit('set_cookie','keyword='+'algosinsentido'+expires+'; path=/');
  console.log('Usuario: ',data.user, 'ha iniciado sesion');
  client.set(data.user,'algosinsentido','EX',60);

  setTimeout(function(){
socket.emit('auth',data.user);
  }, 2500);


})
socket.on('DoLogOut',function DoLogIn() {
  console.log('Usuario: ',cookies.user_id, 'ha cerrado sesion');
  client.set(cookies.user_id,'1','EX',1);
  socket.emit('show_login');


})

    });









var servidorautenticado=app.listen(90);
var ioauth = require('socket.io').listen(servidorautenticado);

ioauth.on('connection',function(socket) {
  console.log('conectado al auth')

})
