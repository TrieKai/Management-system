<?php
header('Access-Control-Allow-Origin:*');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['classId'])) {
	if ($_POST['classId'] != "") {
		$classId = $_POST['classId'];
		$classId = split('[,.-]', $classId);
		$failClass = array();
		$cnt = count($classId);
		if ($cnt > 0) {
			echo "123123";
			for ($x = 0; $x < $cnt; $x++) {
				$sql_class = "SELECT * FROM class_all WHERE class_id='" . $classId[$x] . "'";
				$result_class_1 = mysqli_query($conn, $sql_class);
				if (mysqli_num_rows($result_class_1) > 0) {
					while ($row = mysqli_fetch_assoc($result_class_1)) {
						echo " classId=" . $row["class_id"] . " className=" . $row["class_name"] . " is delete</br>";
					}
				}
				$sql_class = 'DELETE FROM `class_all` WHERE `class_all`.`class_id` = ' . $classId[$x];
				$result_class = mysqli_query($conn, $sql_class);
				if ($result_class) {
					echo " classId:" . $classId[$x] . " is successful</br>";
				} else {

					array_push($failClass, $classId[$x]);
					$cnt2 = count($failClass);
					echo $cnt;
					for ($fail = 0; $fail < $cnt2; $fail++) {
						echo " failClass:" . $failClass[$fail] . " is fail</br>";
					}
				}

				echo " " . $classId[$x];
			}
			if ($cnt2 > 0) {
				for ($s = 0; $s < $cnt2; $s++) {
					$sql_class = 'DELETE FROM `class_all` WHERE `class_all`.`class_id` = ' . $failClass[$s];
					$result_class = mysqli_query($conn, $sql_class);
					echo " classId:" . $failClass[$s] . " is successful</br>";
				}
			}

		}

	} else {
		echo "給我數值";

	}
} else {
	echo "未接到值";
}
?>
