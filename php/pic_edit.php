<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['picNameContent'])) {//textContent是否存在
	if ($_POST['picNameContent'] != "") {//textContent是否空值
	$picNameContent = $_POST['picNameContent'];
	$picNameUnchanged=$_POST['picNameUnchanged'];
	$picID = $_POST['picID'];
	$queryFile = "SELECT  `content`  FROM `content` WHERE `content`= '" . $picNameContent."'AND `content_id`!= '" . $picID."'  ";
	$resultFile = mysqli_query($conn, $queryFile);
	$row1 = mysqli_fetch_row($resultFile);
	
	
		if ($row1[0] != "") {
			$file = explode(".", $picNameContent);
			date_default_timezone_set('Asia/Taipei');
			$newName = $file[0] . "(" . date("y-m-d his") . ")";
			$picNameContent = $newName . "." . $file[1];
		}
		$picNameContent_2='../GET/'.$picNameContent;
		$picNameUnchanged_2='../'.$picNameUnchanged;
		rename(iconv("utf-8", "big5//ignore", $picNameUnchanged_2),iconv("utf-8", "big5//ignore", $picNameContent_2));
		
		$query = "UPDATE `content` SET `po_time` = CURRENT_TIME(), `content`='" . $picNameContent . "' WHERE `content_id`='" . $picID . "'";
		$resultContent = mysqli_query($conn, $query);
	    if($resultContent)	{
			 	$query1 = "SELECT * FROM `content` WHERE `content_id`=" . $picID;
				 $resultContent1 = mysqli_query($conn, $query1);
				 $returnData=[];
				 while ($row = mysqli_fetch_assoc($resultContent1)) {
						$returnData[]=$row;
				 }
				 	$return = json_encode($returnData);
					echo '{"dataPic":'.$return.'}';
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