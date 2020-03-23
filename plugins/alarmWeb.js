var dhWeb ;
$(function() {
	$('div.split-pane').splitPane();
	setVideoSize();	
	dhWeb = new DHAlarmWeb();
	dhWeb.setWebsocketPort({dataWsPort:8088,mediaWsPort:8088});
	if(localStorage.getItem("dhUname")){
		$('#uname').val(localStorage.getItem("dhUname"));
	}
	if(localStorage.getItem("dhPwd")){
		$('#pwd').val(localStorage.getItem("dhPwd"));
	}
	if(localStorage.getItem("dhPwd")){
		$('#serverIp').val(localStorage.getItem("dhServerIp"));
	}
	$('.videoDiv').height($('#top-component').height()-60);
	$(".videoDiv").resize(function(){
		setVideoSize();
	})
	$("#top-component").resize(function(){
		$('.videoDiv').height($('#top-component').height()-60);
	})
	$('#loginBtn').click(function(){
		dhWeb.login($('#uname').val(),$('#pwd').val(),$('#serverIp').val());
		localStorage.setItem("dhUname",$('#uname').val());
		localStorage.setItem("dhPwd",$('#pwd').val());
		localStorage.setItem("dhServerIp",$('#serverIp').val());
	});
	$('#logout').click(function(){
		dhWeb.logout(sessionStorage.getItem('loginHandle'));
		sessionStorage.setItem('loginHandle',null);
		$('.device li').remove();
		$('.deviceDiv').hide();
		$('.loginDiv').show();
		$(".videoboxDiv").remove();
		$(".talking").removeClass("talking");
		$("#talk").css("background","#1E78FF");
		$(".tr_notify").remove();
		setVideoSize();
	});
	$('#closeAll').click(function(){
	   for(var i=0;i<$('video').length;i++){
		    var id = $("video")[i].id;
		    var deviceId = id.split("_")[1];
			dhWeb.stopRT(deviceId,sessionStorage.getItem('loginHandle'));
	   }
		$(".videoboxDiv").remove();
		$(".talking").removeClass("talking");
		$("#talk").css("background","#1E78FF");
		$(".liSelected").removeClass('liSelected');
		setVideoSize();
		
	});
	$('#talk').click(function(){
		if(!$(".selectVideo")[0]) return;
		var id = $('.selectVideo')[0].id;
		var deviceId = id.split('_')[1];
		if($("#talk").hasClass("talking")) return;
		$('#talk').addClass("talking");
		dhWeb.startTalk(deviceId);
		$(".talking").css("background","#aaa");
		
	});
	$('#unlock').click(function(){
		if(!$(".selectVideo")[0]) return;
	    var id = $(".selectVideo")[0].id;
	    var deviceId = id.split("_")[1];
		if(!deviceId){
			alert("请先选择设备");
			return;
		}
		dhWeb.doControl(deviceId,sessionStorage.getItem('loginHandle'),1);
	});
	
	//回调处理
	dhWeb.onLogin = function(message){
		onLogin(message);
	} 
	dhWeb.onDeviceList = function(message){
		onDeviceList(message);
	} 
	dhWeb.onNotify = function(message){
		onNotify(message);
	} 
	dhWeb.onParseMsgError = function(message){
		console.log(message);
		if(message.error.indexOf("alarmServer offline") != -1){
			alert("报警服务器不在线");
		}
	} 
	dhWeb.onAlarmServerClosed = function(){
		$("#logout").click();
	}
	dhWeb.onPlayRT = function(data){
		if(data.error != "success"){
			$("#closeAll").click();
		}
	}
	dhWeb.onDeviceMove = function(data){
		var deviceList = data.params.list;
		for(var i in deviceList){
			var parentId = deviceList[i]['parentId'];
			var deviceId = deviceList[i]['deviceId'];
			$('#device_'+deviceId).attr("parentId", parentId);
		}
	}
});


function onNotify(data){
	var params = data.params;
	if(params.code == "DeviceStatus"){
		var did = params.deviceId;
		var iconClassName = getIconClassName($('#device_'+did));
		var type = iconClassName.split('_');
		var newIconClassName;
		if(params.action == "Offline"){
			newIconClassName = type[0]+"_Offline";
			$('#device_'+did).removeClass(iconClassName);
			$('#device_'+did).addClass(newIconClassName);
		}else if(params.action == "Normal"){
			newIconClassName = type[0]+"_Online";
			if($('#tr_'+did)){
				$('#tr_'+did).remove();
				$("#device_"+did).removeClass('dealing');
				if($("#play_"+did)[0]){
					$("#closeAll").click();
				}
			}
		}else if(params.action == "Start"){
			newIconClassName = type[0]+"_Online";
			var thStr = "<tr class='tr_notify' id='tr_"+did+"' ondblclick='ondbclick(this)'>"+
					"<td class = 'alarmName'>"+$('#device_'+did).text()+"</td>"+
					"<td class = 'alarmStatus'>正在呼叫</td>"
				"</tr>";
			$('#tr_'+did).remove();
			$("#device_"+did).removeClass('dealing');
			$("table").append(thStr);
			if($("#play_"+did)[0]){
			}
		}else if(params.action == "Dealing"){
			newIconClassName = type[0]+"_Online";
			$("#tr_"+did+" .alarmStatus").text("正在处理");
			$("#tr_"+did+" .alarmStatus").addClass('dealing');
			$("#device_"+did).addClass('dealing');
		}
		if(newIconClassName){
			$('#device_'+did).removeClass(iconClassName);
			$('#device_'+did).addClass(newIconClassName);
		}
	}
	
}
function getIconClassName(obj){
	if(obj.hasClass('alarm_Offline')){
		return 'alarm_Offline';
	}
	if(obj.hasClass('alarm_Online')){
		return 'alarm_Online';
	}
	if(obj.hasClass('linkage_Offline')){
		return 'linkage_Offline';
	}
	if(obj.hasClass('linkage_Online')){
		return 'linkage_Online';
	}else{
		return "";
	}
}
function onLogin(data){
	var params = data.params;
	if(data.error == "success"){
		sessionStorage.setItem('loginHandle',params.loginHandle);
		$('.loginDiv').hide();
		$('.deviceDiv').show();
		$('.showNameDiv p').text("用户名："+$('#uname').val());
	}else{
		alert("登录失败");
	}
}
function onDeviceList(data){
	var deviceList = data.params.list;
	var className;
	for(var i in deviceList){
		if(deviceList[i]['deviceType'] == "Alarm"){
			if(deviceList[i]['action'] == "Offline"){
				className = "alarm_Offline";
			}else{
				className = "alarm_Online";
			}
		}else{
			if(deviceList[i]['action'] == "Offline"){
				className = "linkage_Offline";
			}else{
				className = "linkage_Online";
			}
		}
		if($("#device_"+deviceList[i]['deviceId'])[0]) return;
		var deviceHtml = "<li class='"+className+"' ondblclick='dbClickDevice(this)' id='device_"+deviceList[i]['deviceId']+"' parentId="+deviceList[i]['parentId']+">"+deviceList[i]['deviceName']+"</li>";
		$('.device').append(deviceHtml);
	}
	
}
//设备列表双击事件
function dbClickDevice(obj){
	if($(obj).hasClass('dealing')){
		alert("正在处理中");
		return;
	}
	var iconClassName = getIconClassName($(obj));
	var status = iconClassName.split('_')[1];
	if(status == "Offline"){
		alert("设备不在线，无法观看");
		return;
	}
   $(".liSelected").removeClass('liSelected');
   $(obj).addClass("liSelected");
   var id = $(obj)[0].id;
   var deviceId = id.split("_")[1];
   playVideo(deviceId,false);
   
}
//播放视频
function playVideo(deviceId, isTalk){
	closeAll();
   if($('#play_'+deviceId)[0]) return;
   var html = '<div class="videoboxDiv" ondblclick="launchFullscreen(this)">'+
					'<video id="play_'+deviceId+'" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>'+$('#device_'+deviceId).text()+'</span>'+
					'<img class="loading" src="./image/loading.gif"/>'+
				'</div>';
	$('.videoDiv').append(html);
	if(!$(".selectVideo")[0]){
		$("#play_"+deviceId).addClass("selectVideo");
		dhWeb.playDeviceAudio(deviceId);
	}
   $('.selectVideo').parent().css("zIndex","2");
   var video = document.getElementById("play_"+deviceId);
   dhWeb.playRT(video,deviceId,sessionStorage.getItem('loginHandle'),isTalk);
   if(isTalk){
	   if($("#talk").hasClass("talking")) return;
		$('#talk').addClass("talking");
		$(".talking").css("background","#aaa");
		 //播放联动
		var parentId = $("#device_"+deviceId).attr('parentId');
		var groupDevices = $('li[parentId = '+parentId+']');
		for(var i =0; i<groupDevices.length;i++){
			var deviceId = groupDevices[i].id.split("_")[1];
			if($('#play_'+deviceId)[0]) continue;
			var iconClassName = getIconClassName($('#device_'+deviceId));
			if(!iconClassName) continue;
			var status = iconClassName.split('_');
			if(status[0] == 'alarm') continue;
			if(status[1] == 'Offline') continue;
			var html = '<div class="videoboxDiv linkDiv" ondblclick="launchFullscreen(this)">'+
							'<video id="play_'+deviceId+'" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>'+$('#device_'+deviceId).text()+'</span>'+
							'<img class="loading" src="./image/loading.gif"/>'+
						'</div>';
			$('.videoDiv').append(html);
			dhWeb.playRT($('#play_'+deviceId)[0],deviceId,sessionStorage.getItem('loginHandle'),false);
		}
   }
   setVideoSize();
}
function canplayVideo(obj){
	$(obj).siblings('.loading').hide();
}

function closeAll(){
	 for(var i=0;i<$('video').length;i++){
		var id = $("video")[i].id;
		var deviceId = id.split("_")[1];
		dhWeb.stopRT(deviceId,sessionStorage.getItem('loginHandle'));
   }
	$(".videoboxDiv").remove();
	$(".talking").removeClass("talking");
	$("#talk").css("background","#1E78FF");
	setVideoSize();
}
//table双击事件
function ondbclick(row){
	var id = $(row)[0].id;
	if($("#"+id+" .alarmStatus").hasClass('dealing')){
		alert("正在处理中");
	}else{
		var deviceId = id.split("_")[1];
		// if($(".selectVideo")[0].id){
			// dhWeb.stopRT($(".selectVideo")[0].id.split("_")[1],sessionStorage.getItem('loginHandle'));
		// }
		// $('.selectVideo').attr('id', "play_"+deviceId);
		 // var video = document.getElementById("play_"+deviceId);
		// dhWeb.playRT(video,deviceId,sessionStorage.getItem('loginHandle'));
		 playVideo(deviceId,true);
		
	}
}
//设置视频框宽和高
function setVideoSize(){
	var videoDivWidth = $('.videoDiv').width();
	var videoDivheight = $('.videoDiv').height();
	var tag = document.getElementsByTagName('video');
	if(tag.length == 1){
		$('.videoboxDiv').width(videoDivWidth-26);
		$('.videoboxDiv').height($('.videoDiv').height()-6);
	}else if(tag.length >=2 && tag.length <=4){
		$('.videoboxDiv').width(videoDivWidth*1/2-14);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/2)-6);
	}else if(tag.length >=5 && tag.length <=9 ){
		$('.videoboxDiv').width(videoDivWidth*1/3-12);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/3)-6);
	}else if(tag.length >=10 && tag.length <=16 ){
		$('.videoboxDiv').width(videoDivWidth*1/4-10);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/4)-6);
	}else{
		$('.videoboxDiv').width(videoDivWidth*1/4-10);
		$('.videoboxDiv').height(videoDivheight/4-4);
	}
}
//進入全屏
function launchFullscreen(element) 
{
	if(isFullscreen()){
		exitFullscreen();
		return;
	}
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.msRequestFullscreen){ 
		element.msRequestFullscreen(); 
	} else if(element.oRequestFullscreen){
		element.oRequestFullscreen();
	}
	else if(element.webkitRequestFullscreen)
	{
		$(element).find("video")[0].webkitRequestFullscreen(); 
	}
}

//退出全屏
function exitFullscreen()
{
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.oRequestFullscreen){
		document.oCancelFullScreen();
	}else if (document.webkitExitFullscreen){
		document.webkitExitFullscreen();
	}else{
		var docHtml = document.documentElement;
		var docBody = document.body;
		var videobox = document.getElementById('videobox');
		docHtml.style.cssText = "";
		docBody.style.cssText = "";
		videobox.style.cssText = "";
		document.IsFullScreen = false;
	}
}
function isFullscreen(){
	return document.fullscreenElement    ||
		   document.msFullscreenElement  ||
		   document.mozFullScreenElement ||
		   document.webkitFullscreenElement || false;
}

//视频框选中
function selectedVideo(obj){
    if($(obj).hasClass("selectVideo")) return;
    $(".selectVideo").removeClass("selectVideo");
    $(obj).addClass("selectVideo");
}
