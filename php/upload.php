<?php
header('Content-Type: text/html; charset=utf-8');
include ('fun_cn2db.php');
$conn = fun_cn2db();
$uploaddir = '../GET/';
$myfile_array = $_FILES['myfile']['name'];	
$tmp_name_array = $_FILES['myfile']['tmp_name'];
//print_r($myfile_array);
$count = count($myfile_array);
//echo $count;
foreach ($myfile_array as $key => $value){
//	echo $key;
	$fileName = $value;
	$uploadfile = $uploaddir . $fileName;
	$arr_ext = array('jpg', 'jpeg', 'png', 'bmp', 'gif', 'tif', 'pcx', 'psd', 'tga', 'exif', 'fpx', 'svg', 'pod', 'cdr', 'dxf', 'ufo', 'eps','JPG', 'JPEG', 'PNG', 'BMP', 'GIF', 'TIF', 'PCX', 'PSD', 'TGA', 'EXIF', 'FPX', 'SVG', 'POD', 'CDR', 'DXF', 'UFO', 'EPS');
	$queryFile = "SELECT  `content`  FROM `content` WHERE `product_id`= '" . $_POST['product_id'] . "' AND  `content` = '" . $fileName . "'";
	$resultFile = mysqli_query($conn, $queryFile);
	$row = mysqli_fetch_row($resultFile);
////if (isset($_POST['send'])) {//判斷是否按下送出鈕, 且 $_POST['send'] 有值
$tmp_name = $tmp_name_array[$key];
//取得檔案暫存路徑
$extension = pathinfo($uploadfile, PATHINFO_EXTENSION);
//取得副檔名
if (!is_uploaded_file($tmp_name)) {//判斷使用者是否正常方式上傳   //是否選檔案
	echo "請先選取類別或上傳檔案!";
} else if ($row[0] != "") {
	$file = explode(".", $fileName);
	date_default_timezone_set('Asia/Taipei');
	$newName = $file[0] . "(" . date("y-m-d his") . ")";
	$fileName = $newName . "." . $file[1];
	$uploadfile = $uploaddir . $fileName;
}
if (move_uploaded_file($tmp_name, iconv("utf-8", "big5//ignore", $uploadfile))) {//檢查上傳狀態
	if (!in_array($extension, $arr_ext)) {//判斷 $extension 是否在 $arr_ext陣列裡
		if (isset($_POST['product_id'])) {//product_id是否存在
			if ($_POST['product_id'] != "") {//product_id是否空值
				$product_id = $_POST['product_id'];
				$query = "INSERT INTO `content` (`content_id`, `product_id`, `content_type`, `content`, `po_time`) 
	  				VALUES (NULL, '" . $product_id . "', 'document','" . $fileName . "', CURRENT_TIMESTAMP)";
				//輸入資料進資料庫
				$result = mysqli_query($conn, $query);
			} else {	die("請先選取類別或上傳檔案");
				//是否選類別
				//product_id dose not have value
			}
		} else {echo "product_id is not exist";
		}
		if($key+1==$count){
		echo "檔案上傳成功!";}
	} else {
		if (isset($_POST['product_id'])) {
			if ($_POST['product_id'] != "") {
				$product_id = $_POST['product_id'];
				$query = "INSERT INTO `content` (`content_id`, `product_id`, `content_type`, `content`, `po_time`) 
	  				VALUES (NULL, '" . $product_id . "', 'picture','" . $fileName . "', CURRENT_TIMESTAMP)";
				//輸入資料進資料庫
				$result = mysqli_query($conn, $query);
			} else { die("請先選取類別或上傳檔案");
				//product_id dose not have value

			}
		} else {echo "product_id is not exist";
		}
		if($key+1==$count){
		echo "檔案上傳成功!";}
	}
	//	echo "上傳成功";
} 
}
?>

