<?php
include ('fun_cn2db.php');
$conn = fun_cn2db();
header('Content-Type: text/html; charset=utf-8');

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
if (isset($_POST['class'])) {
	if ($_POST['class'] != "") {
		$classCode = $_POST['class'];
		switch ($classCode) {
			case 1 :
				if (isset($_POST['father'])) {
					if ($_POST['father'] != "") {
						$class_id = $_POST['father'];
						$class_id = split('[,.-]', $class_id);
						$cnt = count($class_id);
						for ($x = 0; $x < $cnt; $x++) {
							$sql_class = "SELECT * FROM class_all WHERE id_father is NULL AND class_id='" .$class_id[$x]. "'";
							$result_class = mysqli_query($conn, $sql_class);
							if (mysqli_num_rows($result_class) > 0) {
								while ($row = mysqli_fetch_assoc($result_class)) {
									$sql_childclass = "SELECT * FROM class_all WHERE id_father ='" . $row['class_id'] . "'";
									$result_childclass = mysqli_query($conn, $sql_childclass);
									echo '<tr style="width:100%;"><td style="background: antiquewhite;width:90%; ">
											<textarea id="'.$row["class_id"].'"  rows="1"  readonly style="border-style: none; background-color:transparent; font-size: 42px; width: 95%;">'
											 . $row["class_name"] . 
											 '</textarea>
											</td>
											<td style="background: antiquewhite;vertical-align: middle;">
												<input class="bLarger"   type="checkbox" id="father'. $row['class_id'] . '" name="fatherclass'. $row['class_id'] . '" value="'. $row['class_id'] . '" onclick="checkAll('.$row["class_id"].')">
											</td>
											</tr>';
									if (mysqli_num_rows($result_childclass) > 0) {
										while ($childrow = mysqli_fetch_assoc($result_childclass)) {
											echo '<tr>
													<td style="width:500px;">
													<div>
													<textarea id=" '.$childrow["class_id"].' "  rows="1"  readonly style="border-style: none; background-color:transparent; font-size: 25px;width: 95%;">'
														 . $childrow["class_name"] . 
													'</textarea>
													</div>
													</td>
													<td style="vertical-align: middle;">
														<input class="bLarger" type="checkbox" id="child'. $childrow['class_id'] . '" name="childclass'.$row["class_id"].'" value="'. $childrow['class_id'] . '" onclick="checkChild('.$row["class_id"].')">
													</td>
												  </tr>';
										}
									}
								}
							} 
						}

					}
				}
				break;
				
			case 2 :
				$sql_class = "SELECT * FROM class_all WHERE id_father is NULL";
				$result_class = mysqli_query($conn, $sql_class);
				if (mysqli_num_rows($result_class) > 0) {
					while ($row = mysqli_fetch_assoc($result_class)) {
						echo '<div style="width: 100%;">
								<label class="myam-btn am-btn-success" style="width: 100%; text-align: left; word-break: break-all;">
									<table>
										<tr>
											<td>
											<input class="bLarger" type="checkbox" id="checkBoxFather'. $row['class_id'] .'" name="doc-js-btn" value="'. $row['class_id'] . '" onclick="clickCheck('.$row["class_id"].')" >
											</td><td>&nbsp;</td>'
									    	.'<td>'. $row["class_name"] .' </td>
								    	</tr>
								    </table>
								</label>
							  </div>';
					}
				} 
				break;
				
//			case 3 :
//				if (isset($_POST['father'])) {
//					if ($_POST['father'] != "") {
//						$class_id = $_POST['father'];
//						$class_id = split('[,.-]', $class_id);
//						$cnt = count($class_id);
////						echo $cnt . " ";
//						for ($x = 0; $x < $cnt; $x++) {
////							echo $class_id[$x];
//							$sql_class = "SELECT * FROM class_all WHERE id_father is NULL AND class_id='" .$class_id[$x]. "'";
//							$result_class = mysqli_query($conn, $sql_class);
//							if (mysqli_num_rows($result_class) > 0) {
//								while ($row = mysqli_fetch_assoc($result_class)) {
//									$sql_childclass = "SELECT * FROM class_all WHERE id_father ='" . $row['class_id'] . "'";
//									$result_childclass = mysqli_query($conn, $sql_childclass);
//									echo '<tr><td style="background: antiquewhite;"><font size="7">' . $row["class_name"] . '</font></td>
//											</tr>';
//
//									if (mysqli_num_rows($result_childclass) > 0) {
//										while ($childrow = mysqli_fetch_assoc($result_childclass)) {
//											echo '<tr>
//													<td>
//														<font size="5">' . $childrow["class_name"] .  '</font>
//													</td>
//													
//												  </tr>';
//										}
//									}
//								}
//							} 
//						}
//
//					}
//				}
//				break;
		}
	}
}
?>