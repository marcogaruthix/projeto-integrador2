<?php
class user{
	public $id;
	public $nome;
	public $email;
	public $senha;

	function autenticar(){
		require_once('connection.php');

		if(empty($this->email) || empty($this->senha))
			die('Erro ao autenticar: email ou senha nulo');
		$query = "SELECT * FROM usuarios WHERE email = '$this->email' AND senha = '$this->senha'";
		$result = $con->query($query);
		$rs = $result->fetch_assoc();
		$this->id = $rs['id'];
		$this->nome = $rs['nome'];
		if($result->num_rows > 0)
			return true;
		else 
			return false;
	}

	function registrar(){
		require_once('connection.php');

		if(empty($this->email) || empty($this->senha) || empty($this->nome))
			die('Erro ao registrar: email, senha ou nome nulo');
		$query = "SELECT * FROM usuarios WHERE email = '$this->email'";
		$result = $con->query($query);
		if($result->num_rows > 0){
			return false;
		}
		else{
			$query = "INSERT INTO usuarios (`nome`, `email`, `senha`) VALUES('$this->nome', '$this->email', '$this->senha')";
			$con->query($query);
			$this->id = $con->insert_id;
			return true;
		} 
	}
}