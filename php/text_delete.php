<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['deleteId'])) {//deleteId是否存在
	if ($_POST['deleteId'] != "") {//deleteId是否空值
		$temp = $_POST['deleteId'];
		$tempClean = preg_replace("/[A-Zb-z]/", "", $temp);
		$deleteId = explode("a", $tempClean);
		$good="";
		$bad="";
		for ($x = 0; $x < count($deleteId); $x++) {
			$query = "DELETE FROM `content` WHERE `content_id`='" .$deleteId[$x] . "'";
			$result = mysqli_query($conn, $query);
			if (!$result) {
				$bad+="刪除失敗 id:" .$deleteId[$x] ;
			} else {
				$good+= "已刪除id:".$deleteId[$x];
			}
		}
        echo $bad.$good;
	} else {
		echo "content_id dose not have value";
	}
} else {
	echo "content_id is not exist";
}
?>