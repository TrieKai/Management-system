<?php
header('Access-Control-Allow-Origin:*');
include ('fun_cn2db.php');
$conn = fun_cn2db();

if (isset($_POST['classId'])) {
	if ($_POST['classId'] != "") {
		$classId = $_POST['classId'];
		$classId = split('[,.-]', $classId);
		$cnt = count($classId);
		$returnData_1=[];
		$returnData_2=[];
		for ($x = 0; $x < $cnt; $x++) {
			$queryFatherClass = "SELECT * FROM class_all WHERE id_father is NULL AND class_id='" . $classId[$x] . "'";
			$resultFatherClass = mysqli_query($conn, $queryFatherClass);
			if (mysqli_num_rows($resultFatherClass) > 0) {
				while ($row = mysqli_fetch_assoc($resultFatherClass)) {
					$returnData_1[]=$row;
					$queryChildClass = "SELECT * FROM class_all WHERE id_father ='" . $row['class_id'] . "'";
					$resultChildClass = mysqli_query($conn, $queryChildClass);
					if (mysqli_num_rows($resultChildClass) > 0) {
						while ($childrow = mysqli_fetch_assoc($resultChildClass)) {
							$returnData_2[]=$childrow;
						}
					}else{}
				}
				$return1 = json_encode($returnData_1);
				$return2 = json_encode($returnData_2);
				echo '[{"data1":'.$return1.'},{"data2":'.$return2.'}]';
			}else{echo "query successfully </br> 0 results";}
		}
	}else{echo "fatherClassId is Null";}
}else{echo "fatherClassId is not exist";}
?>
