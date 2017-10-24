<?php
define('CLASSES_PATH', 'classes/');
require(CLASSES_PATH.'user.class.php');
extract($_REQUEST);

if( empty($acao) || empty($parametros) )
	die('Requisição invalida: faltando acao ou parametros');
$parametros = json_decode($parametros);

switch ($acao) {
	case 'login':
		$user = new user();
		$user->email = $parametros->email;
		$user->senha = $parametros->senha;
		$login_valido = $user->autenticar();
		if($login_valido){
			$resposta = array(
				'status_code' => 200,
				'msg' => 'OK',
				'dados_usuario' => array( 'id' => $user->id, 'nome' => $user->nome, 'email' => $user->email )
			);
			die(json_encode($resposta));
		}
		else{
			$resposta = array(
				'status_code' => 404,
				'msg' => 'Usuario nao encontrado  / Senha incorreta'
			);
			die(json_encode($resposta));
		}
		break;	
	case 'registrar':
		$user = new user();
		$user->nome = $parametros->nome;
		$user->email = $parametros->email;
		$user->senha = $parametros->senha;
		$registro_valido = $user->registrar();
		if($registro_valido){
			$resposta = array(
				'status_code' => 200,
				'msg' => 'Registrado com sucesso',
				'dados_usuario' => array( 'id' => $user->id, 'nome' => $user->nome, 'email' => $user->email )
			);
			die(json_encode($resposta));
		}
		else{
			$resposta = array(
				'status_code' => 400,
				'msg' => 'Email em uso'
			);
			die(json_encode($resposta));
		}
		break;
	default:
			die('default switch');
		break;
}

