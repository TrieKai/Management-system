<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['textContent'])) {//textContent是否存在
	if ($_POST['textContent'] != "") {//textContent是否空值
		$textContent = $_POST['textContent'];
		$textID = $_POST['textID'];
		$query = "UPDATE `content` SET `po_time` = CURRENT_TIME(), `content`='" . $textContent . "' WHERE `content_id`='" . $textID . "'";
		$resultContent = mysqli_query($conn, $query);
	    if($resultContent)	{
			 	$query1 = "SELECT * FROM `content` WHERE `content_id`=" . $textID;
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