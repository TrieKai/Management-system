//xhr 傳送data function
function loadClassData(url, id, cfunc, data) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			cfunc(id, xhttp);
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(data);
}
//labelCheckBoxFather function labelCheckox資料放置
function labelCheckBoxFather(elementId, xhttp) {
	document.getElementById(elementId).innerHTML = xhttp.responseText;
	//移動footer位子
	if(labelchecked.length == 0) {
		footerPosition(elementId, 65);
	}
}
//reCheckLabelCheckBox function labelCheckox重新資料放置且再次打勾
function reCheckLabelCheckBox(elementId, xhttp) {
	document.getElementById(elementId).innerHTML = xhttp.responseText;
	//原本打勾的選項重新打勾
	for(i = 0; i < labelchecked.length; i++) {
		if($('[id="checkBoxFather' + labelchecked[i] + '"]').prop("checked") == false) {
			$('[id="checkBoxFather' + labelchecked[i] + '"]').prop("checked", true); //ID寫在class_selection.php中
			$('[id="checkBoxFather' + labelchecked[i] + '"]').parents("label").addClass("am-active"); //label變色
		}
	}
}
//sectionClassFather function 下拉是選單重新放值
function sectionClassFather(elementId, xhttp) {
	document.getElementById(elementId).innerHTML = xhttp.responseText; //在id=class_father form中顯示回傳值
}
//tableClass function 重新放table中的表格
function tableClass(elementId, xhttp) {
	document.getElementById(elementId).innerHTML = xhttp.responseText;
	if(labelchecked.length == 0) {
		footerPosition(elementId, 65);
	}
}
//createClass function //新增類別即顯示成功資訊以及重新載入資料且清空classNameOut
function createClass(elementId, xhttp) {
	document.getElementById("className").value = ""; //清除text中的值
	document.getElementById("echoMessage").innerHTML = ""; //消除警告訊息
	messageModal(xhttp.responseText, 0.8);
	
	classNameOut = "";
	load();
	checkLabel();
}
//classNameEdit function 放置class name以及重新載入
function classNameEdit(elementId, xhttp) {
	var dataText = xhttp.responseText;
	load();
	if(dataText != '[]' && dataText != '') {
		var productText = JSON.parse(dataText);
		document.getElementById(elementId).value = productText.dataText[0].class_name;
	} else {
		//console.log(dataText);
	}
	//console.log(dataText);
}
//訊息彈跳視窗function
function messageModal(messagetext, second) {
	var time = second * 1000;
	document.getElementById("showMessage").innerHTML = messagetext; //訊息
	$('#messageModal').modal('open'); //開啟messageModal
	setTimeout("$('#messageModal').modal('close')", time); //一段時間後關閉messageModal
}
//footer位子
function footerPosition(id, positionHeight) {
	document.getElementById(id).innerHTML = "<tr style=\"height:" + positionHeight + "vh ;\">&nbsp;</tr>";
}
//deleteClassTable function 刪除classTable重新載入和訊息以及清除checkOutArray
function deleteClassTable(elementId, xhttp) {
	load();
	checkLabel();
	messageModal("刪除成功", 0.8);
	checkOutArray.pop();
}
//load function 載入資料
function load() {
	loadClassData("php/selection.php", "classFather", sectionClassFather, "class=1");
	loadClassData("php/class_selection.php", "form", reCheckLabelCheckBox, "class=2")
}
//checkLabel function 重新載入table中的表格
function checkLabel() {
	loadClassData("php/class_selection.php", "table", tableClass, "class=1&father=" + labelchecked.join(' , '));
}
//catchLabelCheckBoxValue function lableCheckBox變色汲取值給labelchecked
function catchLabelCheckBoxValue() {
	var checked = [];
	$("#form input").each(function() {
		if(this.checked == true) {
			//console.log(this.value + '/' + this.checked);
			$(this).parents("label").addClass("am-active"); //label變色
			checked.push(this.value);
		} else {
			$(this).parents("label").removeClass("am-active"); //label變色
		}
	});
	labelchecked = checked;
}
//頁面刷新
load();
// 下拉選單參數
$('select').selected({
	placeholder: '點擊選擇',
	maxHeight: '200px',
	btnWidth: '400px'
});
//checkboxLabel的值
var labelchecked = [];
//原始clickcheck function
function clickCheck(classID) {
	var $cb = $('[name="doc-js-btn"]');
	var allCheckBox = [];
	catchLabelCheckBoxValue();
	//抓值且label變色
	loadClassData("php/class_selection.php", "table", labelCheckBoxFather, "class=1&father=" + labelchecked.join(' , '));
	//傳送並刷新
	//全選/全部選勾勾控制(All checkbox have been checked.The clickAll will been checked.)
	if($("#clickAll").prop("checked")) {
		$("#clickAll").prop("checked", false);
		$("#clickAll").parent("label").removeClass("am-active");
	} else {
		//to get how many elements
		$("#form input").each(function() {
			allCheckBox.push(this.value)
		});
		//chenge the checked stat of checkBox which is mean all checked
		if(labelchecked.length == allCheckBox.length) {
			$("#clickAll").prop("checked", true); //change checked stat of checkBox into true
			$("#clickAll").parent("label").addClass("am-active"); //label change color
		}
	}
}
//全選checkbox
$("#clickAll").click(function() {
	var $cb = $('[name="doc-js-btn"]');
	var checked = [];
	//控制全選和全不選
	if($("#clickAll").prop("checked")) {
		$("#clickAll").parent("label").addClass("am-active"); //label change color
		$("input[name='doc-js-btn']").each(function() {
			$(this).prop("checked", true); //change checked stat of checkBox into true
		});
	} else {
		$("#clickAll").parent("label").removeClass("am-active"); //label change color
		$("input[name='doc-js-btn']").each(function() {
			$(this).prop("checked", false); //change checked stat of checkBox into false
		});
	}
	catchLabelCheckBoxValue();
	loadClassData("php/class_selection.php", "table", labelCheckBoxFather, "class=1&father=" + labelchecked.join(' , '));

});
//checkbox的值(刪除)
var checkOutArray = [];
//父類別全選(刪除)
function checkAll(classID) {
	var $cb = $('[id="father' + classID + '"]');
	//console.log($cb.prop("checked"))
	if($cb.prop("checked")) {
		$('[name="childclass' + classID + '"]').each(function() {
			$(this).prop("checked", true);
		});
	} else {
		$('[name="childclass' + classID + '"]').each(function() {
			$(this).prop("checked", false);
		});
	}
	//重新抓值
	var checked = [];
	$("#table input").each(function() {
		if(this.checked == true) {
			//console.log(this.value + '/' + this.checked)
			checked.push(this.value);
		}
	});
	//console.log('复选框选中的是：', checked);
	checkOutArray = checked;
}
//子類別勾選(刪除)
function checkChild(fatherClass) {
	var $cb = $('[name="' + fatherClass + '"]');
	var $fatherClass = toString(fatherClass);
	var classCheck = [];
	var allCheckBox = [];
	var checked = [];
	$("#table input").each(function() {
		if(this.checked == true) {
			//console.log(this.value + '/' + this.checked)
			classCheck.push(this.value);
		}
	});
	//傳值
	checkOutArray = classCheck;
	//目前父類別中選了幾個子類別
	$('[name="childclass' + fatherClass + '"]').each(function() {
		if(this.checked == true) {
			//console.log(this.value + '/' + this.checked)
			checked.push(this.value);
		}
	});
	//全選/全部選勾勾控制(All checkbox have been checked.The clickAll will been checked.)
	//console.log($('[id="father'+fatherClass+'"]').prop("checked"));
	if($('[id="father' + fatherClass + '"]').prop("checked")) {
		$('[id="father' + fatherClass + '"]').prop("checked", false);
	} else {
		$('[name="childclass' + fatherClass + '"]').each(function() {
			allCheckBox.push(this.value);
		});
		//console.log(checked.length);
		//console.log(allCheckBox.length);
		if(checked.length == allCheckBox.length) {
			$('[id="father' + fatherClass + '"]').prop("checked", true);
		}
	}
}
//刪除功能
$('#doc-confirm-toggle').
on('click', function() {
	//判斷是否有選取東西
	if(checkOutArray.length == 0) {
		messageModal("請選擇要刪除的類別", 0.8);
	} else {
		$('#my-confirm').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				loadClassData("php/delete_class.php", "", deleteClassTable, "classId=" + checkOutArray)
			},
			//						closeOnConfirm: false,
			onCancel: function() {
				messageModal("取消刪除", 0.8);
			}
		});
	}
});
//取得classFather選單中的值並送至input元件中
var $value = 0;
$selectProduct = $('#classFather'); //監視的元件ID
$selectProduct.on('change', function() { //選單有變動時執行
	$value = $(this).val(); //取得value值
	document.getElementById("classID").value = $value; //送至input元件中
});
//新增按鈕顯示modal
$('#createClassBtn').on('click', function() {
	$('#createClassModal').modal('open') //開取modal
});
//class name to other function
var classNameOut;
//新增功能
$('#btnSubmit').on('click', function() {
	var classID = document.getElementById("classID").value;
	var className = document.getElementById("className").value;
	classNameOut = className;
	if(classID == "NULL") {
		classID = "";
	}
	//console.log(className);
	if(className != "") {
		if(className.length > 256) {
			messageModal("類別名稱過長，請重新命名", 0.8);
		} else {
			$('#createClassModal').modal('close') //關閉modal
			loadClassData("php/insert_class.php", "", createClass, "classID=" + classID + "&className=" + className);
		}
	} else {
		document.getElementById("echoMessage").innerHTML = "請輸入類別名稱"; //縣市警告訊息
	}
});
//類別編輯			
//dblclick:滑鼠連點二下物件
$("#table").on('dblclick', 'textarea', function() {
	var classID = $(this).attr("id")
		//console.log($(this).val());
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "2") //textarea元素的rows改為10
	$("#table").on('blur', '[id="' + classID + '"]', function(event) { //blur:物件失去焦點時 
		//console.log($(this).val());
		var classContent = $(this).val();
		$(this).attr("readonly", true);
		$(this).attr("rows", "1");
		loadClassData("php/edit_class.php", classID, classNameEdit, "classContent=" + classContent + "&classID=" + classID);
	});
	//keypress:按下並放開鍵盤按鍵後
	$("#table").on('keypress', '[id="' + classID + '"]', function(event) {
		if(event.keyCode == '13') {
			var classContent = $(this).val();
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			loadClassData("php/edit_class.php", classID, classNameEdit, "classContent=" + classContent + "&classID=" + classID);
		}
	});
});