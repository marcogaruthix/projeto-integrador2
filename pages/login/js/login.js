//const storage = require('electron-storage');
init();

function init(){
  if(localStorage.getItem('user'))
    location.href = '../home_page/index.html';    
}

function webRequest(url, callback, type = 'GET') {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      callback(this.responseText);
    }
  };
  xhttp.open(type, url, true);
  xhttp.send();
}

function autenticarCallback(login){
  login = JSON.parse(login);
  console.warn(login);
  if(login.status_code == 200){
    email = document.getElementById('icon_email').value;
    senha = document.getElementById('icon_password').value;
    localStorage.setItem('user' , JSON.stringify({"id" : login.body.id, "email" : email, "name" : login.body.name, "password" : btoa(senha)} ));
    location.href = '../home_page/index.html';
  }
  else{
    document.getElementById('icon_password').value = "";
    alert("Credenciais invalidas");
  }
}

function autenticar(){
    email = document.getElementById('icon_email').value;
    senha = document.getElementById('icon_password').value;
    obj = {"email": email, "senha": senha};

    if(document.getElementsByClassName('invalid').length > 0 || senha.length == 0){
      alert('Campo(s) invalido(s)');
      return;
    }    
    url = 'http://localhost:8000/api/user/login?email=' + email + '&password=' + senha;
    webRequest(url, autenticarCallback, 'POST');
}

//getRequest(url, autenticar);