<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['content_id'])) {//deleteId是否存在
	if ($_POST['content_id'] != "") {//deleteId是否空值
		$temp = $_POST['content_id'];
		$tempClean = preg_replace("/[A-Zb-z]/", "", $temp);
		$content_id = explode("a", $tempClean);
		echo($content_id);
		$good="";
		$bad="";
		for ($x = 0; $x < count($content_id); $x++) {
			$query = "DELETE FROM `content` WHERE `content_id`='" .$content_id[$x] . "'";
			$result = mysqli_query($conn, $query);
			if (!$result) {
				$bad+="刪除失敗 id:" .$content_id[$x] ;
			} else {
				$good+= "已刪除id:".$content_id[$x];
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