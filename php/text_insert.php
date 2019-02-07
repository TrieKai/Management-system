<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['newText'])) {//newText是否存在
	if ($_POST['newText'] != "") {//newText是否空值
		$newText = $_POST['newText'];
		$value = $_POST['value'];
		$query = "INSERT INTO `content`(`product_id`, `content_type`, `content`,`po_time` ) VALUES ('" . $value . "','text','" . $newText . "',CURRENT_TIME())";
		$resultContent = mysqli_query($conn, $query);
		echo "新增成功";
	} else {
		echo "新增失敗";
	}
} else {
	echo "新增失敗";
}
?>