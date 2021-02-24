<?php
	if(isset($_POST["getposts"])){
		$id = $_POST['id'];
		$data = $_POST['data'];
		$flag =  false;
		$reactCtr = 0;
		$agreeCtr = 0;
		$disagreeCtr = 0;
		$isReacted = false;
		$reaction = "";
		date_default_timezone_set("Asia/Manila");

		require 'friendList.php';

		$sql = mysqli_query($con,"SELECT * FROM `users` where `Id` = '$id'");

		if($sql){
			while($row=mysqli_fetch_assoc($sql)){
				$first = $row['First_Name'];
				$last = $row['Last_Name'];
				$flag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		$name = array($first, $last);

		if($flag){
			$sql2 = mysqli_query($con,"SELECT * FROM `posts` order by `POST_Id` desc");

			if($sql2){
				while($row2=mysqli_fetch_assoc($sql2)){
					$flag2 = false;
					$Post_Sender = $row2['Post_Sender'];
					$Post_Data = $row2['Post_Data'];
					$reactCtr = 0;
					$agreeCtr = 0;
					$disagreeCtr = 0;
					$isReacted = false;
					$post_id = $row2['Post_Id'];

					$Post_Data_Split = explode(" ", $Post_Data);
					$Post_Data_Split_Count = count($Post_Data_Split);

					for($i = 0; $i < $Post_Data_Split_Count; $i++){
						if($Post_Data_Split[$i] == "Joma"){
							$Post_Data_Split[$i] = "<mark>&nbsp;Joma&nbsp;</mark>";
						}
					}

					$Post_Data = implode(" ", $Post_Data_Split);
					$Post_Data = "<a>".$Post_Data."</a>";

					if($Post_Sender == $id){
						$flag2 = true;
						$first = $name[0];
						$last = $name[1];
					}

					if($data == "newsfeed"){
						if($listData == "full"){
							$listCounter = count($list);

							for($x = 1; $x < $listCounter; $x = $x + 3){
								if($list[$x] == $Post_Sender){
									$flag2 = true;
									$first = $list[$x+1];
									$last = $list[$x+2];
								}
							}
						}
					}


					if($flag2){
						$sql3 = mysqli_query($con,"SELECT * FROM `reactions` where `Post_Id` = '$post_id' order by `Reaction` desc");

						if($sql3){
							while($row3=mysqli_fetch_assoc($sql3)){
								$reactCtr++;

								if($row3['Reaction'] == "0"){
									$disagreeCtr++;
									$reaction = "Disagree";
								}
								else{
									$agreeCtr++;
									$reaction = "Agree";
								}

								if($row3['User_Id'] == $id){
									$isReacted = true;
								}
							}
						}
						else{
							echo "Error Sql 3";
						}

						if($isReacted){
							if($reaction == "Agree"){
								$agreeClass = "reactBtnAct";
								$disagreeClass = "reactBtn2";
							}
							else{
								$agreeClass = "reactBtn";
								$disagreeClass = "reactBtn2Act";
							}
						}
						else{
							$agreeClass = "reactBtn";
							$disagreeClass = "reactBtn2";
						}

						if($reactCtr > 0){
							echo "<div class = 'posts'>
								<div class = 'userName'>
									<img class = 'usersPicture' src = '/NewSocialCrowd/Design/Resources/Default.png' alt = '".$first."-".$last."' >
									<a class = 'aName' onClick = 'goProfile(this);' id = ".$row2["Post_Sender"].">".$first." ".$last."</a> 
									<button onClick = 'deletePost(this);' class = 'deleteBtn' id = ".$row2['Post_Id'].">
										<i class='fas fa-trash'></i>
									</button>
								</div>
								<div id = '".$row2['Post_Id']."-text' class = 'postData'>
									".$Post_Data."
								</div>";
							if($reaction == "Agree"){
								echo "<button id = 'agreeBtn' name = '".$row2['Post_Id']."' onClick = 'agreePost(this);' class = '".$agreeClass."' >
									<i id = 'reacts' class='fas fa-thumbs-up'></i> ".$agreeCtr."
								</button>
								<button id = 'disagreeBtn' name = '".$row2['Post_Id']."' onClick = 'disAgreePost(this);' class = '".$disagreeClass."' >
									<i id = 'reacts2' class='fas fa-thumbs-down'></i> ".$disagreeCtr."
								</button>";
							}
							else{
								echo "<button id = 'agreeBtn' name = '".$row2['Post_Id']."' onClick = 'agreePost(this);' class = '".$agreeClass."' >
									<i id = 'reacts' class='fas fa-thumbs-up'></i> ".$agreeCtr."
								</button>
								<button id = 'disagreeBtn' name = '".$row2['Post_Id']."' onClick = 'disAgreePost(this);' class = '".$disagreeClass."' >
									<i id = 'reacts2' class='fas fa-thumbs-down'></i> ".$disagreeCtr."
								</button>";
							}
							echo "<button id = 'replyBtn' class = 'replyBtn' >
									<i id = 'reacts2' class='fas fa-reply-all'></i>
								</button>
								<a class = 'postDate'>".$row2['Post_Date']."</a>
							</div>";
						}
						else{
							echo "<div class = 'posts'>
								<div class = 'userName'>
									<img class = 'usersPicture' src = '/NewSocialCrowd/Design/Resources/Default.png' alt = '".$first."-".$last."' >
									<a class = 'aName' onClick = 'goProfile(this);' id = ".$row2["Post_Sender"].">".$first." ".$last."</a> 
									<button onClick = 'deletePost(this);' class = 'deleteBtn' id = ".$row2['Post_Id'].">
										<i class='fas fa-trash'></i>
									</button>
								</div>
								<div id = '".$row2['Post_Id']."-text' class = 'postData'>
									".$Post_Data."
								</div>
								<a>
								<button id = 'agreeBtn' name = '".$row2['Post_Id']."' onClick = 'agreePost(this);' class = 'reactBtn' >
									<i id = 'reacts' class='fas fa-thumbs-up'></i></button>
								<button id = 'disagreeBtn' name = '".$row2['Post_Id']."' onClick = 'disAgreePost(this);' class = 'reactBtn2' >
									<i id = 'reacts2' class='fas fa-thumbs-down'></i>
								</button>
								<button id = 'replyBtn' class = 'replyBtn' >
									<i id = 'reacts2' class='fas fa-reply-all'></i>
								</button>
								<a class = 'postDate'>".$row2['Post_Date']."</a>
								</a>
							</div>";
						}
					}
				}
			}
			else{
				echo "Error Sql 2";
			}
		}
	}

	if(isset($_POST["newPost"])){
		require 'config.php';

		$id = $_POST['id'];
	    $data = mysqli_real_escape_string($con, $_POST['data']);
		$flag =  false;
		date_default_timezone_set("Asia/Manila");
		$date = date("Y-m-d h:i:sa");

		$sql = mysqli_query($con,"SELECT * FROM `users` where `Id` = '$id'");

		if($sql){
			while($row=mysqli_fetch_assoc($sql)){
				$flag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		if($flag){
			$sql2 = mysqli_query($con,"INSERT INTO `posts`(`Post_Sender`, `Post_Data`, `Post_Date`) VALUES ('$id','$data','$date')");

			if($sql2){
				echo "Success";
			}
			else{
				echo "Error Sql 2";
			}
		}
		else{
			echo "Logout";
		}
	}

	if(isset($_POST["deletePost"])){
		require 'config.php';

		$id = $_POST['id'];
		$flag =  false;

		$sql = mysqli_query($con,"DELETE FROM `posts` where `POST_Id` = '$id'");

		if($sql){
			echo "Success";
		}
		else{
			echo "Error Sql 1";
		}
	}

	if(isset($_POST["reactPost"])){
		require 'config.php';

		$postId = $_POST['postId'];
		$id = $_POST['id'];
		$reaction = $_POST['reaction'];
		$flag =  false;
		$reactId =  "";
		$isDifferent = true;

		$sql = mysqli_query($con,"SELECT * FROM `reactions` where `User_Id` = '$id' and `Post_Id` = '$postId' ");

		if($sql){
			while($row=mysqli_fetch_assoc($sql)){
				$reactId = $row['React_Id'];
				$existingReaction = $row['Reaction'];
				$flag = true;
			}
		}
		else{
			echo "Error Sql 1";
		}

		if($flag){
			if($existingReaction == $reaction){
				$sql2 = mysqli_query($con,"DELETE FROM `reactions` where `React_Id` = '$reactId'");

				if($sql2){
					echo "Deleted";
				}
				else{
					echo "Error Sql 2";
				}
			}
			else{
				$sql4 = mysqli_query($con,"UPDATE `reactions` SET `Reaction` = '$reaction' where `React_Id` = '$reactId' ");

				if($sql4){
					echo "Edited";
				}
				else{
					echo "Error Sql 4";
				}
			}
		}
		else{
			$sql3 = mysqli_query($con,"INSERT INTO `reactions`(`Reaction`, `Post_Id`, `User_Id`) VALUES ('$reaction','$postId','$id')");

			if($sql3){
				echo "Reacted";
			}
			else{
				echo "Error Sql 2";
			}
		}
	}
?>