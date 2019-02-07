<?php
function fun_cn2db() {
	$dbServer = 'localhost';
	$dbUserName = 'f011368';
	$dbPassword = 'cTdF55Nz';
	$dbDatabase = 'rce_s10';
	$mysqli = mysqli_connect($dbServer, $dbUserName, $dbPassword, $dbDatabase);
	mysqli_set_charset($mysqli, 'utf8');
	return $mysqli;
}
?>