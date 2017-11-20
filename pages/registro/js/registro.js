var HOST = 'http://faculdade.adversithink.com/api/';

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

function registrarCallback(registro){
  registro = JSON.parse(registro);
  console.warn(registro);
  if(registro.status_code == 200){
    nome = document.getElementById('icon_prefix').value;
    email = document.getElementById('icon_email').value;
    password = document.getElementById('icon_password').value;
    localStorage.setItem('user', JSON.stringify({"id" : registro.body.id, "name" : nome, "email" : email, "password" : btoa(password)}) );

    document.getElementById('icon_prefix').value = "";
    document.getElementById('icon_email').value = "";
    document.getElementById('icon_password').value = "";
    alert("Registrado com sucesso!");   
    location.href="../home_page/index.html";
  }
  else
    alert(registro.msg)
}

function registrar(){
    nome = document.getElementById('icon_prefix').value;
    email = document.getElementById('icon_email').value;
    senha = document.getElementById('icon_password').value;
    obj = {"nome": nome, "email": email, "senha": senha};

    if(document.getElementsByClassName('invalid').length > 0 || senha.length == 0 || nome.length == 0){
      alert('Campo(s) invalido(s)');
      return;
    }    
    url = HOST + 'user/create?email=' + email + '&password=' + senha + '&name=' + nome;
    webRequest(url, registrarCallback, 'POST');
}

//getRequest(url, autenticar);