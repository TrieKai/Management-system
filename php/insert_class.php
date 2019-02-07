<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['classID'])) {
	if ($_POST['classID'] != "") {
		$classID = $_POST['classID'];
		if (isset($_POST['className'])) {
			if ($_POST['className'] != "") {
				$className = $_POST['className'];
				$sql = "SELECT * FROM `class_all` WHERE `class_name`='" . $className . "'";
				$result = mysqli_query($conn, $sql);
				if (mysqli_num_rows($result) > 0) {
					echo "類別名稱：&nbsp;".$className."</br>類別名稱重複";
				} else {
					$query = "INSERT INTO `class_all` (`class_id`, `id_father`, `class_name`)
						 VALUES (NULL, '" . $classID . "', '" . $className . "')";
					$result = mysqli_query($conn, $query);
					echo "類別名稱：&nbsp;".$className."</br>新增成功";
				}
			} else {
				echo "className is null";
			}
		} else {
			echo "className is not exist";
		}
	} else {
		if (isset($_POST['className'])) {
			if ($_POST['className'] != "") {
				$className = $_POST['className'];
				$sql = "SELECT * FROM `class_all` WHERE `class_name`='" . $className . "'";
				$result = mysqli_query($conn, $sql);
				if (mysqli_num_rows($result) > 0) {
					echo "類別名稱：&nbsp;".$className."</br>類別名稱重複";
				} else {
					$query = "INSERT INTO `class_all` (`class_id`, `id_father`, `class_name`) 
				VALUES (NULL, NULL, '" . $className . "')";
					$result = mysqli_query($conn, $query);
					echo "類別名稱：&nbsp;".$className."</br>新增成功";
				}
			}
		}
	}
} else {
	echo "classID is not exist";
}
?>

