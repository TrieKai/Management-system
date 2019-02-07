<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();
$uploaddir = '../GET/';
$fileName = $_FILES['filePic']['name'];
$uploadfile = $uploaddir . $fileName;
$arr_ext = array('jpg', 'jpeg', 'png', 'bmp', 'gif', 'tif', 'pcx', 'psd', 'tga', 'exif', 'fpx', 'svg', 'pod', 'cdr', 'dxf', 'ufo', 'eps');
$queryFile = "SELECT  `content`  FROM `content` WHERE `product_id`= '" . $_POST['productId'] . "' AND  `content` = '" . $fileName . "'";
$resultFile = mysqli_query($conn, $queryFile);
$row = mysqli_fetch_row($resultFile);
if (isset($_POST['upload_pic'])) {//判斷是否按下送出鈕, 且 $_POST['upload_pic'] 有值
	$tmp_name = $_FILES['filePic']['tmp_name'];
	//取得檔案暫存路徑
	$extension = pathinfo($uploadfile, PATHINFO_EXTENSION);
	//取得副檔名
	if (!is_uploaded_file($tmp_name)) {//判斷使用者是否正常方式上傳
		echo "未選取上傳圖片!上傳失敗";		
	} else if ($row[0] != "") {
		$file = explode(".", $fileName);
		date_default_timezone_set('Asia/Taipei');
		$newName = $file[0] . "(" . date("y-m-d his") . ")";
		$fileName = $newName . "." . $file[1];
		$uploadfile = $uploaddir . basename($fileName);
	}
	if (move_uploaded_file($tmp_name, iconv("utf-8", "big5", $uploadfile))) {
		//檢查上傳狀態
		if (!in_array($extension, $arr_ext)) {//判斷 $extension 是否在 $arr_ext陣列裡
			echo "請選擇圖片!";
		} else {
			if (isset($_POST['content_id'])) {//content_id是否存在
				if ($_POST['content_id'] != "") {//content_id是否空值
					$content_id = $_POST['content_id'];
					$query = "UPDATE `content` SET `content`='" . $fileName . "' WHERE `content_id`='" . $content_id . "'";
					//更新資料進資料庫
					$result = mysqli_query($conn, $query);
					echo "圖片上傳成功!";
				} else {
					echo "上傳失敗";  //content_id dose not have value
				}
			} else {
				echo "上傳失敗"; //content_id is not exist
			}
		}
	} 
//	else {
//		echo "上傳失敗 ";
//	}
}
?>