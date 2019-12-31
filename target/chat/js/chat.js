// OUT Messages codes
var joinMemberMsgCode = 1;
var broadcastMsgCode = 2;

// IN Messages codes
var membersListMsgCode = 3;
var messageMsgCode = 4;

// Inizializzazione wsURI
var wsEndpoint = "wschat";
var pathArray = window.location.pathname.split('/');
var wsUri = "ws://" + document.location.host + "/" + pathArray[1] + "/"
    + wsEndpoint;

// Listener che si attiva al termine del caricamento del DOM
document.addEventListener("DOMContentLoaded", function() {
  init();
}, false);

function init() {
  if (!window.WebSocket) {
    alert("WebSockets non supportati dal browser");
  }
  $("membri").innerHTML = "";

  // alert("AA");
}

// sostituisco il simbolo $ con la stringa dopo return
function $() {
  return document.getElementById(arguments[0]);
}
// sostituisco il simbolo $F con la stringa dopo return
function $F() {
  return document.getElementById(arguments[0]).value;
}

// -------------------------------------------------
function getKeyCode(ev) {
  if (window.event)
    return window.event.keyCode;
  return ev.keyCode;
}

function play(sound) {
  // java.awt.Toolkit.getDefaultToolkit().beep();
  var snd = new Audio(sound);
  snd.play();
}

function chat(text) {
  // if (text !== null && text.length > 0 ) {
  // var jsonStr = "{'header':{'id':" + broadcastMsgCode + "},
  // 'body':{'data':'" + room._username + ": " + text + "'}}";
  var jsonStr = "{'header':{'id':" + broadcastMsgCode + "}, 'body':{'peer':'"
      + room._username + "','msg':'" + text + "','data'=''}}";
  console.log(jsonStr);
  room._send(jsonStr);
  // room._send(room._username,text);
  // }
}
/*
 * function clearChat() { $("membroChat").innerHTML = "Non Registrato";
 * $('join').className = ""; $('joined').className = "hidden";
 * $("username").value = ""; $('username').focus(); $('chat').innerHTML = "";
 * $("members").innerHTML = ""; $("phrase").value = ""; }
 * 
 * function closeChat() { room._closeWebSocket(); //clearChat();
 * $("membri").innerHTML = ""; }
 */

var room = {

  join : function(name) {
    if (name !== null && name.length > 0) {
      this._username = name;
      this._ws = new WebSocket(wsUri);
      this._ws.onopen = this._onopen;
      this._ws.onmessage = this._onmessage;
      this._ws.onclose = this._onclose;
    } else {
      $('username').focus();
    }
  },

  _onopen : function() {
    // $('join').className='hidden';
    // $('joined').className='';
    // $('phrase').focus();
    var jsonStr = "{'header':{'id':" + joinMemberMsgCode
        + "}, 'body':{'peer':'" + room._username
        + "','msg':'','data':''}}";
    // alert(jsonStr);
    room._send(jsonStr);
    // $("membroChat").innerHTML = room._username;
  },

  _send : function(message) {
    // user = user.replace(':','_');
    if (this._ws)
      this._ws.send(message);
  },

  _onmessage : function(m) {
    if (typeof m.data === "string") {
      console.log("Ricevuto un msg string ", m.data)
      var msg = eval("(" + m.data + ")");
      // var msg = JSON.parse(m.data);
      console.log("MESSAGGIO: " + msg);
      if (msg.header.id === membersListMsgCode) {
        console.log("Ricevuto Lista Membri: " + m.data);
        room._showMembersList(msg.body.data);
      } else {
        if (msg.body.peer !== room._username) {
          document.querySelector('#testo').innerHTML += "<p class='right'>"
              + msg.body.peer + ": " + msg.body.msg + "</p>";
          // room._showMessage(msg.body.data);
        }
      }
    } else {
      console.log("Ricevuto un msg non string ", m, " ", m.data)
    }
  },

  _showMembersList : function(m) {
    if (m) {
      console.log("MEMBRI: " + m);
      // play("WindowsDing.wav");
      // $("membri").innerHTML = m;
      document.querySelector('#membri').innerHTML = m;
    }
  },

  /*
   * _showMessage: function(m) { if (m) { //play("WindowsDing.wav");
   * 
   * var c = m.indexOf(':'); var from = m.substring(0, c); var text =
   * m.substring(c + 1);
   * 
   * var chat = $("chat"); var spanFrom = document.createElement('span');
   * spanFrom.className = 'from'; spanFrom.innerHTML = from + ':&nbsp;'; var
   * spanText = document.createElement('span'); spanText.className = 'text';
   * spanText.innerHTML = text; var lineBreak = document.createElement('br');
   * chat.appendChild(spanFrom); chat.appendChild(spanText);
   * chat.appendChild(lineBreak); chat.scrollTop = chat.scrollHeight -
   * chat.clientHeight; } },
   */
  _closeWebSocket : function(m) {
    this._ws.close();
  },

  _onclose : function(m) {
    room._closeWebSocket();
    chiudi();
    // clearChat();
  }
};

/*
 * function init() { $('phrase').setAttribute('autocomplete','OFF');
 * $('username').setAttribute('autocomplete','OFF'); $('membroChat').innerHTML=
 * "Non Registrato"; $('joined').className = 'hidden';
 * 
 * $('username').focus(); $('joinB').onclick = function(event) {
 * room.join($F('username')); return false; };
 * 
 * $('sendB').onclick = function(event) { chat($F('phrase'));
 * $('phrase').value=''; $('phrase').focus(); return false; };
 * 
 * $('closeB').onclick = function(event) { closeChat(); return false; };
 * 
 * $('phrase').onkeyup = function(ev) { var keyc=getKeyCode(ev); if (keyc === 13 ||
 * keyc === 10) { chat($F('phrase')); $('phrase').value=''; return false; }
 * return true; };
 * 
 * $('username').onkeyup = function(ev) { var keyc=getKeyCode(ev); if (keyc ===
 * 13 || keyc === 10) { room.join($F('username')); return false; } return true; }; }
 */
// -------------------------------------------------
// /////////////////////////////////////////////////
function chiudi() {
  // closeChat();
  // clearChat();
  document.querySelector('#messaggio').style.visibility = 'hidden';
  document.querySelector('label[for="messaggio"]').style.visibility = 'hidden';
  document.querySelector('label[for="nome"]').style.visibility = 'hidden';
  document.querySelector('#nome').style.visibility = 'hidden';
  document.querySelector('#membri').innerHTML = "";
  document.querySelector('#nomeUtente').innerHTML = "";
  document.querySelector('#avatar').title = 'Fai clic per aprire la Chat';
  document.querySelector('#avatar').style.opacity = 0.3;
  document.querySelector('#testo').innerHTML = "";
  document.querySelector('#termina').innerHTML = '<span id="inizia" title="Fai clic per aprire la Chat"><a href="#nome" onclick="loggati()">Apri</a></span>';
  room._closeWebSocket();
}

function loggati() {
  document.querySelector('#nome').style.visibility = 'visible';
  document.querySelector('#nome').style.display = 'inline';
  document.querySelector('label[for="nome"]').style.display = 'inline';
  document.querySelector('#nome').value = '';
  document.querySelector('#nome').focus();
  document.querySelector('label[for="nome"]').style.visibility = 'visible';
  document.querySelector('#inizia').innerHTML = '<span id="termina" title="Fai clic per chiudere la Chat"><a href="#nome" onclick="chiudi()">Chiudi</a></span>';
  // document.querySelector('#avatar').innerHTML = '<span id="avatar"
  // title="Fai clic per chiudere la Chat"><a href="#"
  // onclick="chiudi()">f</a></span>';
  document.querySelector('#avatar').title = 'Fai clic per chiudere la Chat';
}

function inizia() {
  if (document.querySelector('#nome').value !== '') {
    document.querySelector('#nome').style.display = 'none';
    document.querySelector('label[for="nome"]').style.display = 'none';

    document.querySelector('#messaggio').style.display = 'inline';
    document.querySelector('label[for="messaggio"]').style.display = 'inline';

    document.querySelector('#messaggio').style.visibility = 'visible';
    document.querySelector('label[for="messaggio"]').style.visibility = 'visible';

    document.querySelector('#nomeUtente').innerHTML = document
        .querySelector('#nome').value;
    document.querySelector('#avatar').style.opacity = 1;
    document.querySelector('#inizia').title = 'Fai clic per terminare';

    room.join(document.querySelector('#nome').value);
    document.querySelector('#messaggio').focus();
  }
}

function scrivi() {
  if (document.querySelector('#messaggio').value !== '') {
    // alert(document.querySelector('#messaggio').value);
    document.querySelector('#testo').innerHTML += "<p class='left'>"
        + document.querySelector('#messaggio').value + "</p>";
    chat(document.querySelector('#messaggio').value);
    document.querySelector('#messaggio').value = "";
    document.querySelector('#messaggio').focus();
  }
}
