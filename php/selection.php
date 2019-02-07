<?php
header('Access-Control-Allow-Origin:*');
include ('fun_cn2db.php');
$conn = fun_cn2db();

//$get_father_id = 5;
//$get_child_id = 15;
//$get_product_id = 5;
if (isset($_POST['class'])) {
	if ($_POST['class'] != "") {
		$classcode = $_POST['class'];
		switch ($classcode) {
			case 1 :
				echo "<option value=\"NULL\">請選擇父類別</option>";
				$query = "SELECT class_id, id_father, class_name 
						FROM class_all 
						WHERE id_father IS NULL ";
				$class_father = mysqli_query($conn, $query);
				while ($row = mysqli_fetch_assoc($class_father)) {
					echo "<option value=\"" . $row["class_id"] . "\">" . $row["class_name"] . "</option>";
				}
				break;
			case 2 :
				if (isset($_POST['value_01'])) {
					if ($_POST['value_01'] != "") {
//						echo "<option value=\"NULL\">請選擇子類別</option>";
						$get_father_id = $_POST['value_01'];
						$query = "SELECT class_id, id_father, class_name 
						FROM class_all
						WHERE id_father IS NOT NULL AND id_father=" . $get_father_id;

						$class_chid = mysqli_query($conn, $query);

						while ($row = mysqli_fetch_assoc($class_chid)) {
							echo "<option value=\"" . $row["class_id"] . "\">" . $row["class_name"] . "</option>";
						}
					}
				}
				break;
			case 3 :
				if (isset($_POST['value_02'])) {
					if ($_POST['value_02'] != "") {
//						echo "<option value=\"NULL\">請選擇商品</option>";
						$get_child_id = $_POST['value_02'];
						$query = "SELECT product_id, class_id, product_name, revise_time 
						FROM production 
						WHERE class_id=" . $get_child_id;
						echo $query;
						$product = mysqli_query($conn, $query);
						while ($row = mysqli_fetch_assoc($product)) {
							echo "<option value=\"" . $row["product_id"] . "\">" . $row["product_name"] . "</option>";
						}
					} else {
						echo 'Wrong';
					}
				} else {
						echo 'Wrong';
					}
		}
	} else {
		echo "給我數值";
	}
} else {
	echo "未接到值";
}
?>
