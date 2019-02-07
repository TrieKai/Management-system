<?php
header('Access-Control-Allow-Origin:*');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['value'])) {
	if ($_POST['value'] != "") {
		$productId = $_POST['value'];
		$queryProduct = "SELECT * FROM `content` WHERE product_id=" . $productId;
		$resultProduct = mysqli_query($conn, $queryProduct);
		$returnData=[];
		while ($row = mysqli_fetch_assoc($resultProduct)) {
				$returnData[]=$row;
		}
		$return = json_encode($returnData);
			echo '{"data":'.$return.'}';
	} else {
		echo "No value";
	}
} else {
	echo "No exist";
}
?>
