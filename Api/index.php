<?php
	require 'config.php';
	require 'PHPMailer.php';
	require 'Exception.php';
	require 'SMTP.php';
	//php file for login
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	//login
	if(isset($_POST["loginMethod"])){
		$username = mysqli_real_escape_string($con, $_POST['user']);
	    $password = mysqli_real_escape_string($con, $_POST['pass']);
	    $code = mysqli_real_escape_string($con, $_POST['code']);

		$flag = false;
		$ip = false;
		$ipAdd = $_SERVER['REMOTE_ADDR'];  

		//checks if the username is existing in the database
		$sql = mysqli_query($con,"SELECT * FROM `users` where `Username` = '$username' ");

		if($sql){
			while($row = mysqli_fetch_assoc($sql)){
				$id = $row['Id'];
				$hash = $row['Password'];
				$status = $row['Status'];
				$first = $row['First_Name'];
				$last = $row['Last_Name'];
				$email = $row['Email'];

				$flag = true;
			}

			if(!$flag){
				echo "User";
			}
			else{
				//checks if the password matches
				if (password_verify($password, $hash)){
					//checks if the user is logged out
					if($status === 0){
						$sql3 = mysqli_query($con,"UPDATE `users` SET `Status` = '1' where `Id` = '$id' ");

						if($sql3){
							echo $id."/".$first."/".$last;
						}
						else{
							echo "Error Sql 3";
						}
					}
					else{
						//checks if the user device is already saved in the database
						$sql2 = mysqli_query($con,"SELECT * FROM `login_data` where `Users_Id` = '$id' ");

						if($sql2){
							while($row2 = mysqli_fetch_assoc($sql2)){
								$availAddress = $row2['Ip_Address'];
								$ip = true;
							}

							if($ip){
								if($ipAdd == $availAddress){
									$sql3 = mysqli_query($con,"UPDATE `users` SET `Status` = '1' where `Id` = '$id' ");

									if($sql3){
										echo $id."/".$first."/".$last;
									}
									else{
										echo "Error Sql 3";
									}
								}
								//if non existent forces user to verify if it really is him
								else{
									sendMail($email, $code);
									echo "Verify";
								}
							}
							else{
								sendMail($email, $code);
								echo "Verify";
							}
						}
						else{
							echo "Error Sql 2";
						}
					}
				}
				else{
					echo "Pass";
				}
			}
		}
		else{
			echo "Error Sql 1";
		}
	}
	//register
	else if(isset($_POST["registerMethod"])){
		$username = mysqli_real_escape_string($con, $_POST['user']);
	    $password = mysqli_real_escape_string($con, $_POST['pass']);
	    $first = mysqli_real_escape_string($con, $_POST['first']);
	    $mid = mysqli_real_escape_string($con, $_POST['mid']);
	    $last = mysqli_real_escape_string($con, $_POST['last']);
	    $email = mysqli_real_escape_string($con, $_POST['email']);
		$hashed_password = password_hash($password, PASSWORD_DEFAULT);
		$userFlag = false;
		$emailFlag = false;

		//checks if the username is already existing in the database
		$sql = mysqli_query($con,"SELECT * FROM `users` where `Username` = '$username' ");

		if($sql){
			while($row = mysqli_fetch_assoc($sql)){
				$userFlag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		//checks if the email is already existing in the database
		$sql2 = mysqli_query($con,"SELECT * FROM `users` where `Email` = '$email' ");

		if($sql2){
			while($row2 = mysqli_fetch_assoc($sql2)){
				$emailFlag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		if($userFlag){
			echo "User";
		}
		else{
			if($emailFlag){
				echo "Email";
			}
			else{
				//if both username and email is non existent in the database saves the credentials of the user
				$sql3 = mysqli_query($con,"INSERT INTO `users`(`Username`, `Password`, `First_Name`, `Middle_Name`, `Last_Name`, `Email`) VALUES ('$username','$hashed_password','$first','$mid','$last','$email')");
						
				if($sql3){
					echo "Go";
				}
				else{
					echo "Error Sql 3";
				}
			}
		}
	}
	//verify user
	else if(isset($_POST["verify"])){
		//php for verifying the user
		$username = $_POST['user'];
		//gets the ip address of the user
		$ipAdd = $_SERVER['REMOTE_ADDR'];  
		$flag = false;

		//checks if the username is existing in the database
		$sql = mysqli_query($con,"SELECT * FROM `users` where `Username` = '$username' ");


		if($sql){
			while($row = mysqli_fetch_assoc($sql)){
				$id = $row['Id'];
				$flag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		//if existing saves the ip address of the user for future verifications
		if($flag){
			$sql2 = mysqli_query($con,"INSERT INTO `login_data`(`Ip_Address`, `Users_Id`) VALUES ('$ipAdd','$id')");

			if($sql2){
				echo "Success";
			}
			else{
				echo "Error Sql 2";
			}
		}
	}
	else{
		echo "Permission to this file is denied";
	}

	//function for sending mail
	function sendMail($email, $code){
		$mail = new PHPMailer();

		//Enable SMTP debugging.
		$mail->SMTPDebug = 3;                               
		//Set PHPMailer to use SMTP.
		$mail->isSMTP();                    
		$mail->Host = "smtp.gmail.com";
		$mail->SMTPAuth = true;   
		$mail->Username = "socialcrowd2021@gmail.com";       
		$mail->Password = "pxreshmdkfltcddw";
		$mail->SMTPSecure = "tls";
		$mail->Port = 587;  

		$mail->setFrom("socialcrowd2021@gmail.com");

		$mail->addAddress($email);

		$mail->Subject = "Verify User";

		$mail->Body = "This is your code ".$code;

		if (!$mail->send())
		{
		}
		else{
		}
	}
?>