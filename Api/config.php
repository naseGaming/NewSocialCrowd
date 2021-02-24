<?php
	$serverHost = "localhost";
	$serverUsername = "root";
	$serverPassword = "";
	$serverName = "socialcrowd";
	
	$con = mysqli_connect($serverHost,$serverUsername,$serverPassword,$serverName);
	if(!$con){
		echo "Failed";
	}

?>