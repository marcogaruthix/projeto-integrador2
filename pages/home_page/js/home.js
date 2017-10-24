//const storage = require('electron-storage');
init();

function init(){
  if(localStorage.getItem('user') == null){
    	location.href = '../login/index.html'; 
    	return;
    }   
    document.getElementById('display_name').innerHTML = ' Bem vindo(a), ' + JSON.parse( localStorage.getItem('user') ).name;
}

function logout(){
	localStorage.clear();
}