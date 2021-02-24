<?php
	require 'config.php';

	if(isset($_POST["getNotifCount"])){
		$id = $_POST['id'];
		$counter = 0;

		$sql = mysqli_query($con,"SELECT * FROM `notifications` where `User_Id` = '$id'");

		if($sql){
			while($row=mysqli_fetch_assoc($sql)){
				$counter++;
			}

			echo $counter;
		}
		else{
			echo "Error Sql 1";
		}
	}

	if(isset($_POST["addNotif"])){
		$id = $_POST['id'];
		$data = $_POST['data'];
		$dataType = $_POST['dataType'];
		date_default_timezone_set("Asia/Manila");
		$date = date("Y-m-d h:i:sa");

		$sql = mysqli_query($con,"INSERT INTO `notifications`(`User_Id`, `Notif_Data`, `Date`, `Notification_Type`) VALUES ('$id','$data', '$date', '$dataType')");

		if($sql){
			echo "Success";
		}
		else{
			echo "Error Sql";
		}
	}
?>