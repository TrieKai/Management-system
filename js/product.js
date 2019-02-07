var pic_flag = 0;
var doc_flag = 0;
var viewChange = false;

function loadData(url, cfunc, data) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == 4 && xhttp.status == 200) {
			cfunc(xhttp);
		}
	};
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(data);
}

function selectClassFather(xhttp) { //下拉式選單查詢父類別
	document.getElementById("class_father").innerHTML = xhttp.responseText;
}

function selectClassChild(xhttp) { //下拉式選單查詢子類別
	document.getElementById("class_child").innerHTML = xhttp.responseText;
}

function selectClassProduct(xhttp) { //下拉式選單查詢商品
	document.getElementById("product").innerHTML = xhttp.responseText;
}

function selectProduct(xhttp) { //取得product的ID 同時查詢出產品資訊
	var data = xhttp.responseText;
	load(data);
}

function deletePicture(xhttp) {
	var $alert = xhttp.responseText;
	window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
	messageModal('刪除成功', 0.8);
}

function deleteDoc(xhttp) {
	var $alert = xhttp.responseText;
	window.setTimeout(partReload(), 0);
	messageModal('刪除成功', 0.8);
}

function editDoc(xhttp) {
	var dataText = xhttp.responseText;
	if(dataText != '[]' && dataText != '') {
		var productText = JSON.parse(dataText);
		document.getElementById('textID').value = productText.dataText[0].content;
		window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
	} else {
		console.log("error:" + dataText);
	}
}

function editPic(xhttp) {
	var dataPic = xhttp.responseText;
	//	console.log(dataPic);
	if(dataPic != '[]' && dataPic != '') {
		window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
	} else {
		console.log("error:" + dataPic);
	}
}

function InsertDoc(xhttp) {
	var $alert = xhttp.responseText;
	//	alert($alert);
	window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
	messageModal('新增成功', 0.8);
}

function deleteText(xhttp) {
	window.setTimeout(partReload(), 0);
	messageModal('刪除成功', 0.8);
}

function reload(xhttp) {
	var data = xhttp.responseText;
	load(data);
}

function messageModal(messagetext, second) {
	var time = second * 1000;
	document.getElementById("showMessage").innerHTML = messagetext; //訊息
	$('#messageModal').modal('open'); //開啟messageModal
	setTimeout("$('#messageModal').modal('close')", time); //一段時間後關閉messageModal
}

//利用跨域請求，向PHP請求資料，找尋父類別
loadData("php/selection.php", selectClassFather, "class=1");
//選項卡滑動
$('#doc-my-tabs').tabs();
// 設置參數
$('select').selected({
	maxHeight: '300px',
	placeholder: '點擊選擇'
});

//取得product的ID 同時查詢出產品資訊
$selectProduct = $('#product');
$selectProduct.on('change', function() {
	$value = $(this).val();
	document.getElementById("grant").value = $value;
	document.getElementById("productId").value = $value;
	loadData("php/product_info.php", selectProduct, "value=" + $value);
});
//利用跨域請求，向PHP請求資料，找尋子類別
$selectedFather = $('#class_father');
$selectedFather.on('change', function() {
	var $value_01 = $(this).val()
	loadData("php/selection.php", selectClassChild, "class=2&value_01=" + $value_01);
});
//利用跨域請求，向PHP請求資料，找尋商品
var $selectedChild = $('#class_child');
$selectedChild.on('change', function() {
	var $value_02 = $(this).val();
	loadData("php/selection.php", selectClassProduct, "class=3&value_02=" + $value_02);
});
//上傳檔案名稱顯示
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	// files is a FileList of File objects. List some properties.
	var output = [];
	for(var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', f.name, '</strong> - ', f.size, ' bytes ', '</li>');
	}
	document.getElementById('file-list').innerHTML = '<ul>' + output.join('') + '</ul>';
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
//file upload using jquery serialization 全部上傳
document.getElementById('upload_file').addEventListener('submit', function(e) {
	e.preventDefault(); //攔截動作
	$.ajax({ //jQuery.ajax
		url: $(this).attr('action'), //this means upload_file form.
		type: $(this).attr('method'),
		data: new FormData(this), //FormData means form`s data value 將Form表單的資料打包送出  IE 7,8,9,10之後才支援
		contentType: false, //以下三個參數，傳送不是單純Form資料(EX：影像、檔案等)時必須加
		cache: false,
		processData: false,
		success: function(data) { //成功時執行
			$('#result').html(data);
			$('#doc-form-file').val(''); //清空檔名，防止上傳後不需重新選擇仍可上傳
			$('#file-list').html('');
			window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
		}
	});
});
//上傳圖片檔名顯示
$('#filePic').on('change', function() {
	var picNames = '';
	$.each(this.files, function() {
		picNames += '<span class="am-badge">' + this.name + '</span> ';
	});
	$('#picList').html(picNames);
});
//picture upload using jquery serialization 圖檔更新
document.getElementById('upload_picture').addEventListener('submit', function(e) {
	e.preventDefault(); //攔截動作
	$.ajax({ //jQuery.ajax
		url: $(this).attr('action'), //this means upload_file form.
		type: $(this).attr('method'),
		data: new FormData(this), //FormData means form`s data value 將Form表單的資料打包送出  IE 7,8,9,10之後才支援
		contentType: false, //以下三個參數，傳送不是單純Form資料(EX：影像、檔案等)時必須加
		cache: false,
		processData: false,
		success: function(data) { //成功時執行
			$('#picList').html(data);
			window.setTimeout(partReload(), 0); //頁面部分重洗(下半部全部重新select)
			//			$modal.modal('close');
		}
	});
});
//圖片彈出框
var $modal = $('#my-popup');
$("#picture").on('click', 'img', function() {
	var picture = $(this).attr("src")
	var conId = $(this).attr("alt")
	var picrureName = picture.split("/")[1];

	$('#my-popup-title textarea').val(picrureName);
	//	$('#my-popup-title').html('<a href="javascript: void(0)" class="am-close am-close-spin" data-am-modal-close>×</a>');
	$('#popPicture').attr("src", picture);
	$('#popPicture').attr("alt", conId);
	$('#contendId').attr("value", conId);
	$('#my-popup-title textarea').attr("id", conId);
	//	document.getElementById(conId).val = picrureName;
	$modal.modal('open');
});
//圖片檔名編輯
//dblclick:滑鼠連點二下物件
$("#my-popup-title").on('dblclick', 'textarea', function() {
	var picID = $(this).attr("id");
	console.log(picID);
	var picNameUnchanged = $("#popPicture").attr("src");
	console.log(picNameUnchanged);
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "3") //textarea元素的rows改為10

	var picflag = 0;
	$(this).on('blur', function(event) { //blur:物件失去焦點時 
		if(picflag == 0) {
			console.log(picID);
			var picNameContent = $(this).val();
			console.log(picNameContent);
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
			$(this).off('blur'); //移除blur這個監聽事件
			console.log("blur");
			picflag = 1;
		}
	});

	//keypress:按下並放開鍵盤按鍵後
	$("#my-popup-title").on('keypress', 'textarea', function(event) {
		if(event.keyCode == '13') {
			if(picflag == 0) {
				var picNameContent = $(this).val();
				$(this).attr("readonly", true);
				$(this).attr("rows", "1");
				loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
				//			picID = "";
				$("#my-popup-title").off('keypress'); //移除keypress這個監聽事件
				console.log("keypress");
				picflag = 1;
			}
		}
	});
});
//條列式圖片檔名編輯			
//dblclick:滑鼠連點二下物件
$("#picture").on('dblclick', 'textarea', function() {
	var picID2 = $(this).attr("id");
	picID = picID2.split("b")[0];
	console.log(picID);
	var picNameUnchanged = "GET/" + $(this).val();
	console.log(picNameUnchanged);
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "5") //textarea元素的rows改為10

	var picflag = 0;
	$(this).on('blur', function(event) { //blur:物件失去焦點時 
		if(picflag == 0) {
			console.log(picID);
			var picNameContent = $(this).val();
			console.log(picNameContent);
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
			$(this).off('blur'); //移除blur這個監聽事件
			picflag = 1;
			//			window.setTimeout(partReload(), 0);
		}
	});
	//keypress:按下並放開鍵盤按鍵後
	$("#picture").on('keypress', 'textarea', function(event) {
		if(event.keyCode == '13') {
			if(picflag == 0) {
				var picNameContent = $(this).val();
				$(this).attr("readonly", true);
				$(this).attr("rows", "1");
				console.log(picNameContent);
				console.log(picNameUnchanged);
				loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
				$("#picture").off('keypress'); //移除keypress這個監聽事件
				picflag = 1;

			}
			//			window.setTimeout(partReload(), 10);
		}
	});

});
//圖片刪除核取方塊
var pic_checked = new Array();
$('#picture').on("change", "input", function() {
	var checkedOut = [];
	$("#picture input").each(function() {
		if(this.checked == true) {
			checkedOut.push(this.id);
		}
	});
	pic_checked = checkedOut;
	console.log(pic_checked);
});
//圖片刪除按鈕和彈出窗
$('#delete').
on('click', function() {
	if(pic_checked.length == 0) {
		messageModal('請選擇項目', 0.8);
	} else {
		$('#picDeleteConfirm').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				var temp = "";
				for(var c = 0; c < pic_checked.length; c++) {
					if(pic_checked[pic_checked.length - 1]) {
						temp += pic_checked[c]
					}
				}
				loadData("php/pic_delete.php", deleteText, "content_id=" + temp)
				pic_checked = [];
			},
			onCancel: function() {
				messageModal('取消刪除', 0.8);
			}
		});
	}

});
//循環下載pic
var downLoadPictureNum = 0;

function downLoadPicture(downLoadPictureNum) {
	console.log(pic_checked[downLoadPictureNum])
	var $srce_pic = $('[id="' + pic_checked[downLoadPictureNum] + '"]').attr("alt");
	window.open("php/pic_download.php?srce=" + $srce_pic); //開新視窗的'同時'傳值給PHP
	console.log($srce_pic);
	console.log("success");
	circleDownLoadPicture();
}

function circleDownLoadPicture() {
	console.log(downLoadPictureNum);
	if(downLoadPictureNum < pic_checked.length) {
		setTimeout("downLoadPicture(" + downLoadPictureNum + ")", 100);
		downLoadPictureNum += 1;
	} else {
		downLoadPictureNum = 0;
	}
}
//圖片下載按鈕
$("#download").on('click', function() {
	circleDownLoadPicture();
});

//文字編輯按鈕			
//dblclick:滑鼠連點二下物件
$("#text").on('dblclick', 'textarea', function() {
	var textID = $(this).attr("id");
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "10") //textarea元素的rows改為10
	$("#text").on('blur', '[id="' + textID + '"]', function(event) { //blur:物件失去焦點時 
		//	$(this)).on('blur', function(event) {       //也可以寫成這樣(前面若放#id，他會找這個標籤裡面的innerHtml，不會找自己的屬性)
		var textContent = $(this).val();
		$(this).attr("readonly", true);
		$(this).attr("rows", "1");
		loadData("php/text_edit.php", editDoc, "textContent=" + textContent + "&textID=" + textID);
		$('#text').off('blur'); //移除id=text的blur監聽事件 (以免每啟動一次dblclick事件就會新增一個blur監聽事件--會有多個blur監聽事件)
		window.setTimeout(partReload(), 0);
	});
	//keypress:按下並放開鍵盤按鍵後
	$("#text").on('keypress', 'textarea', function(event) {
		if(event.keyCode == '13') {
			var textContent = $(this).val();
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			console.log(textID);
			loadData("php/text_edit.php", editDoc, "textContent=" + textContent + "&textID=" + textID);
			$("#text").off('keypress'); //移除id=text的keypress監聽事件
			//			document.getElementById('text').removeEventListener('keypress');
			window.setTimeout(partReload(), 0);
		}
	});

});
//新增文字的彈出窗
$('#doc-prompt-toggle').on('click', function() {
	$addText = document.getElementById("product").value;
	if($addText.length == 0) {
		messageModal('請選擇類別', 0.8);
	} else {
		$('#my-prompt').modal({
			relatedTarget: this,
			onConfirm: function() {
				$value = document.getElementById("product").value;
				var newText = $('#newtext').val();
				//			alert(newText);
				if(newText.length == 0) {
					messageModal('請輸入內容', 0.8);
				} else {
					loadData("php/text_insert.php", InsertDoc, "newText=" + newText + "&value=" + $value);
				}
			},
			onCancel: function() {}
		});
	}
});
//文字刪除核取方塊
var text_checked = new Array();
$('#text').on("change", "input", function() {
	var checkedOut = [];
	$("#text input").each(function() {
		if(this.checked == true) {
			checkedOut.push(this.id);
		}
	});
	text_checked = checkedOut;
});
//文字刪除按鈕和彈出窗
$('#textDelete').
on('click', function() {
	if(text_checked.length == 0) {
		messageModal('請選擇項目', 0.8);
	} else {
		$('#textDeleteConfirm').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				var temp = "";
				for(var c = 0; c < text_checked.length; c++) {
					if(text_checked[text_checked.length - 1]) {
						temp += text_checked[c]
					}
				}
				loadData("php/text_delete.php", deleteText, "deleteId=" + temp)
				text_checked = [];
			},
			onCancel: function() {
				messageModal('取消刪除', 0.8);
			}
		});
	}
});
//文件刪除核取方塊
var doc_checked = new Array();
$('#doc').on("click", "input", function() {
	var checkedOut = [];
	$("#doc input").each(function() {
		if(this.checked == true) {
			checkedOut.push(this.id);
		}
	});
	doc_checked = checkedOut;
	console.log(doc_checked);
});
for(var c = 0; c < doc_checked.length; c++) {
	if(doc_checked[doc_checked.length - 1]) {
		temp += doc_checked[c]
	}
}
//文件刪除按鈕和彈出窗
$('#doc_delete').
on('click', function() {
	if(doc_checked.length == 0) {
		messageModal('請選擇項目', 0.8);
	} else {
		$('#docDeleteConfirm').modal({
			relatedTarget: this,
			onConfirm: function(options) {
				var temp = "";
				for(var c = 0; c < doc_checked.length; c++) {
					if(doc_checked[doc_checked.length - 1]) {
						temp += doc_checked[c]
					}
				}
				console.log(temp);
				loadData("php/doc_delete.php", deleteText, "content_id=" + temp)
				console.log(doc_checked);
				console.log(temp);
				doc_checked = [];
			},
			onCancel: function() {
				messageModal('取消刪除', 0.8);
			}
		});
	}
});
//循環下載doc
var downLoadNum = 0;

function downLoadDocument(downLoadNum) {
	var $srce_doc = $('[id="' + doc_checked[downLoadNum] + '"]').attr("alt");
	window.open("php/doc_download.php?srce_doc=" + $srce_doc); //開新視窗的'同時'傳值給PHP
	console.log($srce_doc);
	console.log("success");
	circleDownLoadDocument();
}

function circleDownLoadDocument() {
	if(downLoadNum < doc_checked.length) {
		setTimeout("downLoadDocument(" + downLoadNum + ")", 100);
		downLoadNum += 1;
	} else {
		downLoadNum = 0;
	}
}
//文件下載按鈕
$("#doc_download").on('click', function() {
	circleDownLoadDocument();
});
//頁面下半部分重洗
function partReload() {
	console.log('12354654879')
	$value = document.getElementById("product").value; //抓product_id(產品id)
	document.getElementById("grant").value = $value;
	loadData("php/product_info.php", reload, "value=" + $value);
}

//文件檔名編輯
//dblclick:滑鼠連點二下物件
$("#doc").on('dblclick', '.docDisplay', function() {
	console.log("rrr");
	var picID2 = $(this).attr("id");
	picID = picID2.split("c")[0];
	console.log(picID);
	var picNameUnchanged = $("#popPicture").attr("alt");
	console.log(picNameUnchanged);
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "3") //textarea元素的rows改為10

	var picflag = 0;
	$(this).on('blur', function(event) { //blur:物件失去焦點時 
		if(picflag == 0) {
			console.log(picID);
			var picNameContent = $(this).val();
			console.log(picNameContent);
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
			$(this).off('blur'); //移除blur這個監聽事件
			console.log("blur");
			picflag = 1;
		}
	});
});
//條列式檔案檔名編輯			
//dblclick:滑鼠連點二下物件
$("#doc").on('dblclick', '.docList', function() {
	console.log("abc");
	var picID2 = $(this).attr("id");
	picID = picID2.split("c")[0];
	console.log(picID);
	var picNameUnchanged = "GET/" + $(this).val();
	console.log(picNameUnchanged);
	$(this).attr("readonly", false) //去除textarea元素的readonly属性
	$(this).attr("rows", "5") //textarea元素的rows改為10

	var docflag = 0;
	$(this).on('blur', function(event) { //blur:物件失去焦點時 
		if(docflag == 0) {
			console.log(picID);
			var picNameContent = $(this).val();
			console.log(picNameContent);
			$(this).attr("readonly", true);
			$(this).attr("rows", "1");
			loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
			$(this).off('blur'); //移除blur這個監聽事件
			docflag = 1;
		}
	});
	//keypress:按下並放開鍵盤按鍵後
	$("#doc").on('keypress', '.docList', function(event) {
		if(docflag == 0) {
			if(event.keyCode == '13') {
				var picNameContent = $(this).val();
				$(this).attr("readonly", true);
				$(this).attr("rows", "1");
				loadData("php/pic_edit.php", editPic, "picNameContent=" + picNameContent + "&picID=" + picID + "&picNameUnchanged=" + picNameUnchanged);
				$("#doc").off('keypress'); //移除keypress這個監聽事件
				docflag = 1;
			}
		}
	});
});
//當圖片modal關閉時:
$('#my-popup').on('closed.modal.amui', function() {
	$('#filePic').val('');
	document.getElementById("picList").innerHTML = "";
	//	$(this).attr("readonly", true);
	//	$(this).attr("rows", "1");

});
//滑鼠指到圖片檔名
$("#picture").on('mouseover', 'h3', function() { //mouseover:當滑鼠移到目標上
	$(this).css("height", "100%");
});
//滑鼠移開圖片檔名
$("#picture").on('mouseout', 'h3', function() { //mouseout:當滑鼠從目標移開
	$(this).css("height", "37px");
});
//滑鼠指到文件檔名
$("#doc").on('mouseover', 'h3', function() {
	$(this).css("height", "100%");
});
//滑鼠移開文件檔名
$("#doc").on('mouseout', 'h3', function() {
	$(this).css("height", "37px");
});
var outData;
//檔案顯示方式
function docViewChange(data, flag, ViewChange) {
	if(data != '[]' && data != '') {
		var tempDoc = '';
		var listDocument = '';
		var product = JSON.parse(data);
		var textIndex = 1;
		var textTime = 1;
		if(flag == 0) {
			for(var i = 0; i < product.data.length; i++) {
				if(product.data[i].content_type == 'document') {
					var docName = product.data[i].content.split(".")[product.data[i].content.split(".").length - 1];
					//						console.log(docName);
					listDocument += '<tr><td class="listSmall"><input type="checkbox" class="textDel bLarger" alt="GET/' + product.data[i].content + '" id="' + product.data[i].content_id + 'a" value="doc_noDel" /></td><td class="listSmall">' + textIndex + '</td><td class="listLarge" ><textarea id="' + product.data[i].content_id + 'c"  rows="1" class="am-u-sm-12 docList" readonly>' + product.data[i].content + '</textarea></td><td class="listMid">' + docName + '</td><td class="listMid">' + product.data[i].po_time + '</td></tr>';
					textIndex += 1;
					textTime += 1;
				}
			}
			//			console.log(listDocument);
			document.getElementById("doc").innerHTML = '<table id="docTable" class="am-table am-table-striped am-table-hover tableHeader" ><thead><tr><th class="listSmall" ;>項目核取方塊</th><th class="listSmall">編號</th><th class="listLarge">檔名</th><th class="listMid">檔案類型</th><th class="listMid">修改時間</th><td class="blankSpace"></td></tr></thead></table><div class="am-scrollable-vertical divScrollBar" ><table class="tableList am-table am-table-striped am-table-hover"><tbody id="documentList">' + listDocument + '</tbody></table></div>';
			$('[id="doc"]').addClass('hiddenScrollBar');
			checkBoxChage();
			var ex1 = new tableSort('docTable', 'documentList', 1, 1, 999, 2, 999);
			if(ViewChange == true) {
				return flag = 1;
			}
		} else {
			for(var i = 0; i < product.data.length; i++) {
				if(product.data[i].content_type == 'document') {
					var extension = {
						pdf: "img/pdf.png",
						doc: "img/word.png",
						docx: "img/word.png",
						ppt: "img/ppt.png",
						pptx: "img/ppt.png",
						xls: "img/excel.png",
						xlsx: "img/excel.png",
						csv: "img/csv.png"
					};
					var str = product.data[i].content;
					var strSplit = str.split(".");
					var a = 1;
					for(var key in extension) {
						if(strSplit[strSplit.length - 1] == key) {
							a = 0;
							tempDoc += '<li align=center><img class="am-thumbnails" src="' + extension[key] + '"  / alt=" ' + product.data[i].content + ' " id=" ' + product.data[i].content_id + ' " ><h3 align=center class="am-thumbnail-caption"><table style="width:100%;"><td style="display: block;"><input type="checkbox" alt=" ' + product.data[i].content + ' " class="bMiddle" id="' + product.data[i].content_id + 'a" value="doc_noDel" /></td><td><textarea  class="docDisplay" rows="1" readonly="true" id="' + product.data[i].content_id + 'c">' + product.data[i].content + '</textarea></td></table></h3></li>';
						}
					}
					if(a != 0) {
						tempDoc += '<li align=center><img class="am-thumbnails" src="img/unknow.png"  / alt=" ' + product.data[i].content + ' " id=" ' + product.data[i].content_id + ' " ><h3 align=center class="am-thumbnail-caption"><table style="width:100%;"><td style="display: block;"><input type="checkbox" alt=" ' + product.data[i].content + ' " class="bMiddle" id="' + product.data[i].content_id + 'a" value="doc_noDel" /></td><td><textarea class="docDisplay" rows="1" readonly="true" id="' + product.data[i].content_id + 'c">' + product.data[i].content + '</textarea><td></table></h3></li>';
					}
				}
			}
			document.getElementById("doc").innerHTML = '<div id="docTextarea"><ul class="am-avg-sm-3 am-avg-md-4 am-avg-lg-5 am-thumbnails">' + tempDoc; + '</ul></div>';
			$('[id="doc"]').removeClass('hiddenScrollBar');
			checkBoxChage();
			if(ViewChange == true) {
				return flag = 0;
			}
		}
	} else {}
}
//圖片顯示方式
function picViewChange(data, flag, ViewChange) {
	if(data != '[]' && data != '') {
		var product = JSON.parse(data);
		var pictureIndex = 0;
		var textIndex = 1;
		var textTime = 1;
		var listPicture = '';
		var tempPicture = '';
		outData = data;
		if(flag == 0) {
			for(var i = 0; i < product.data.length; i++) {
				if(product.data[i].content_type == 'picture') {
					var picName = product.data[i].content.split(".")[product.data[i].content.split(".").length - 1];
					listPicture += '<tr><td class="listSmall"><input type="checkbox" class="textDel bLarger" alt="GET/' + product.data[i].content + '" id="' + product.data[i].content_id + 'a" value="pic_noDel" /></td><td class="listSmall">' + textIndex + '</td><td class="listLarge"><textarea id="' + product.data[i].content_id + 'b"  rows="1" class="am-u-sm-12" readonly>' + product.data[i].content + '</textarea></td><td class="listMid">' + picName + '</td><td class="listMid">' + product.data[i].po_time + '</td></tr>';
					textIndex += 1;
					textTime += 1;
				}
			}
			document.getElementById("picture").innerHTML = '<table id="picTable" class="am-table am-table-striped am-table-hover tableHeader" ><thead><tr><th class="listSmall">項目核取方塊</th><th class="listSmall">編號</th><th class="listLarge">檔名</th><th class="listMid">檔案類型</th><th class="listMid">修改時間</th><td class="blankSpace"></td></tr></thead></table><div class="am-scrollable-vertical divScrollBar"><table class="am-table am-table-striped am-table-hover" ><tbody id="pictureList">' + listPicture + '</tbody></table></div>';
			$('[id="picture"]').addClass('hiddenScrollBar');
			checkBoxChage();
			var ex1 = new tableSort('picTable', 'pictureList', 1, 1, 999, 2, 999);
			if(ViewChange == 1) {
				return flag = 1;
			}
		} else {
			if(data != '[]' && data != '') {
				for(var i = 0; i < product.data.length; i++) {
					if(product.data[i].content_type == 'picture') {
						tempPicture += '<li align=center><img class="am-thumbnails" src="GET/' + product.data[i].content + '"  alt=" ' + product.data[i].content_id + ' "/><h3 class="am-thumbnail-caption"><table style="width:100%;"><td style="display: block;"><input type="checkbox" class="bMiddle" alt="GET/' + product.data[i].content + '" id="' + product.data[i].content_id + 'a" value="pic_noDel" /></td><td>' + product.data[i].content + '</td></table></h3></li>';
						textIndex += 1;
						textTime += 1;
					}
				}
				document.getElementById("picture").innerHTML = '<ul class="am-avg-sm-3 am-avg-md-4 am-avg-lg-5 am-thumbnails">' + tempPicture + '</ul>';
				$('[id="picture"]').removeClass('hiddenScrollBar');
				checkBoxChage();
				if(ViewChange == 1) {
					return flag = 0;
				}
			}
		}
	} else {}
}
//load資料排版1
function load(data) {
	var tempText = '';
	if(data != '[]' && data != '') {
		var product = JSON.parse(data);
		var textIndex = 1;
		var textTime = 1;
		for(var i = 0; i < product.data.length; i++) {
			switch(product.data[i].content_type) {
				case 'text':
					tempText += '<tr><td width="1px"><input type="checkbox" class="textDel bLarger" id="' + product.data[i].content_id + 'a" value="noDel" ></td><td width="2px">' + textIndex + '</td><td width="80px"><textarea id="' + product.data[i].content_id + '"  rows="1" class="am-u-sm-12" readonly>' + product.data[i].content + '</textarea></td><td width="15px">' + product.data[i].po_time + '</td></tr>';
					textIndex += 1;
					textTime += 1;
					break;
			}
		}
	} else {}
	if(viewChange == true) {
		//		console.log(viewChange);
		viewChange = false;
		if(pic_flag == 1) {
			pic_flag = 0;
		} else {
			pic_flag = 1;
		}
		if(doc_flag == 1) {
			doc_flag = 0;
		} else {
			doc_flag = 1;
		}
	} else {
		//		console.log('false');
	}
	document.getElementById("text").innerHTML = tempText;
	picViewChange(data, pic_flag, viewChange);
	docViewChange(data, doc_flag, viewChange);
	//tableid  第几行是标签行，从第几行开始排序，第几行结束排序(999表示最后) 升序标签样式，降序标签样式  选中列样式
	var ex1 = new tableSort('tableID', 'text', 1, 1, 999, 2, 999);
}
//圖片顯示方式按鈕
$("#pic_list").on('click', function() {
	if(viewChange == false) {
		viewChange = true;
		if(pic_flag == 1) {
			pic_flag = 0;
		} else {
			pic_flag = 1;
		}
		if(doc_flag == 1) {
			doc_flag = 0;
		} else {
			doc_flag = 1;
		}
	} else {}
	pic_flag = picViewChange(outData, pic_flag, viewChange);
});
//檔案顯示方式按鈕
$("#doc_list").on('click', function() {
	if(viewChange == false) {
		viewChange = true;
		if(pic_flag == 1) {
			pic_flag = 0;
		} else {
			pic_flag = 1;
		}
		if(doc_flag == 1) {
			doc_flag = 0;
		} else {
			doc_flag = 1;
		}
	} else {}
	doc_flag = docViewChange(outData, doc_flag, viewChange);
});
//check打勾
function checkBoxChage() {
	$("#doc input").each(function() {
		for(i = 0; i < doc_checked.length; i++) {
			if(this.id == doc_checked[i]) {
				$(this).prop("checked", true);
			}
		}
	});
	$("#picture input").each(function() {
		for(i = 0; i < pic_checked.length; i++) {
			if(this.id == pic_checked[i]) {
				$(this).prop("checked", true);
			}
		}
	});
	$("#text input").each(function() {
		for(i = 0; i < text_checked.length; i++) {
			if(this.id == text_checked[i]) {
				$(this).prop("checked", true);
			}
		}
	});
}
//表格動態排序
function tableSort() {
	this.initialize.apply(this, arguments);
}
tableSort.prototype = {
	initialize: function(tableId, tableTagle, clickRow, startRow, endRow, starColumn, endColumn) {
		this.Table = document.getElementById(tableId);
		this.TableTag = document.getElementById(tableTagle);
		this.rowId = this.Table.rows;
		this.rows = this.TableTag.rows; //所有行
		this.Tags = this.rowId[clickRow - 1].cells; //标签td
		this.startRow = startRow;
		this.endRow = (endRow == 999 ? this.rows.length : endRow);
		this.starColumn = starColumn;
		this.endColumn = (endColumn == 999 ? this.rows.length : endColumn);
		this.T2Arr = this._td2Array(); //受影响的td二维数组
		this.setShow();
	},
	//标签切换
	setShow: function() {
		for(var Tag, i = (this.starColumn - 1); Tag = this.Tags[i]; i++) {
			Tag.index = i;
			addEventListener(Tag, 'click', Bind(Tag, statu));
		}
		var _this = this;
		var turn = 0;
		//昇冪OR降冪
		function statu() {
			for(var i = 0; i < _this.Tags.length; i++) {}
			if(turn == 0) {
				_this.startArray(0, this.index);
				turn = 1;
			} else {
				_this.startArray(1, this.index);
				turn = 0;
			}
		}
	},
	//开始排序  num 根据第几列排序  aord 逆序还是顺序
	startArray: function(aord, num) {
		var afterSort = this.sortMethod(this.T2Arr, aord, num); //排序后的二维数组传到排序方法中去
		this.array2Td(num, afterSort); //输出
	},
	//将受影响的行和列转换成二维数组
	_td2Array: function() {
		var arr = [];
		for(var i = (this.startRow - 1), l = 0; i < (this.endRow); i++, l++) {
			arr[l] = [];
			for(var n = 0; n < this.rows[i].cells.length; n++) {
				arr[l].push(this.rows[i].cells[n].innerHTML);
			}
		}
		return arr;
	},
	//根据排序后的二维数组来输出相应的行和列的 innerHTML
	array2Td: function(num, arr) {
		for(var i = 0; i < arr.length; i++) {
			for(var j = 0; j < arr[i].length; j++) {
				//					console.log(this.rows[i].cells[j]);
				this.rows[i].cells[j].innerHTML = arr[i][j];
			}
		}
		checkBoxChage();
	},
	//传进来一个二维数组，根据二维数组的子项中的w项排序，再返回排序后的二维数组
	sortMethod: function(arr, aord, w) {
		arr.sort(function(a, b) {
			x = killHTML(a[w]);
			y = killHTML(b[w]);
			x = x.replace(/,/g, '');
			y = y.replace(/,/g, '');
			switch(isNaN(x)) {
				case false:
					return Number(x) - Number(y);
					break;
				case true:
					return x.localeCompare(y);
					break;
			}
		});
		arr = aord == 0 ? arr : arr.reverse();
		return arr;
	}
}

function addEventListener(o, type, fn) {
	if(o.attachEvent) {
		o.attachEvent('on' + type, fn)
	} else if(o.addEventListener) {
		o.addEventListener(type, fn, false)
	} else {
		o['on' + type] = fn;
	}
}

var Bind = function(object, fun) {
		return function() {
			return fun.apply(object, arguments);
		}
	}
	//去掉所有的html标记
function killHTML(str) {
	return str.replace(/<[^>]+>/g, "");
}
//	var ex1 = new tableSort(tableId, tableTagle, clickRow, startRow, endRow, starColumn, endColumn);