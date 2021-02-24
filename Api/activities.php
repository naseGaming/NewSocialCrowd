<?php
	require 'config.php';

	if(isset($_POST["addActivity"])){
		$id = $_POST['id'];
		$data = $_POST['data'];
		date_default_timezone_set("Asia/Manila");
		$date = date("Y-m-d h:i:sa");

		$sql = mysqli_query($con,"INSERT INTO `activity_history`(`User_Id`, `Activity_Data`, `Activity_Date`) VALUES ('$id','$data','$date')");

		if($sql){
				echo "Success";
		}
		else{
			echo "Error Sql";
		}
	}

	if(isset($_POST["logout"])){
		$id = $_POST['id'];
		$status = "1";

		$sql = mysqli_query($con,"SELECT * FROM `users` where `Id` = '$id'");
		
		if($sql){
			while($row=mysqli_fetch_assoc($sql)){
				$status = $row['Status'];
			}
		}
		else{
			echo "Error Sql 1";
		}
		
		if($status == "1"){
			$sql2 = mysqli_query($con,"UPDATE users SET `Status` = '0' where `Id` = '$id' ");
			
			if($sql2){
				echo "Success";
			}
			else{
				echo "Error Sql 2";
			}
		}
		else{
			echo "Success";
		}
	}
?>