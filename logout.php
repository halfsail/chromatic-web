<?php
	//Session start
	session_start();

	//DESTROY TEH SESSIONZZZ
	if(session_destroy()) {
		header("Location: index.php");
	}
?>
