<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['classContent'])) {//textContent是否存在
	if ($_POST['classContent'] != "") {//textContent是否空值
		$classContent = $_POST['classContent'];
		$classID = $_POST['classID'];
		$query = "UPDATE `class_all` SET `class_name`='" . $classContent . "' WHERE `class_id`='" . $classID . "'";
		$resultContent = mysqli_query($conn, $query);
	    if($resultContent)	{
			 	$query1 = "SELECT * FROM `class_all` WHERE `class_id`=" . $classID;
				 $resultContent1 = mysqli_query($conn, $query1);
				 $returnData=[];
				 while ($row = mysqli_fetch_assoc($resultContent1)) {
						$returnData[]=$row;
				 }
				 	$return = json_encode($returnData);
					echo '{"dataText":'.$return.'}';
		 }else{
		 	echo "update failed";
		 }
	} else {
		echo "textContent dose not have value";
	}
} else {
	echo "textContent is not exist";
}
?>