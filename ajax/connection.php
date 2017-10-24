<?php
define('USER', 'marco_facul');
define('PASS', '142536');
define('HOST', '174.138.58.65');
define('DB', 'marco_facul');
$con = mysqli_connect(HOST, USER, PASS, DB);
if(!$con)
	die('Problemas de conexão com o banco de dados');