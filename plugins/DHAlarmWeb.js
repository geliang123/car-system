var DHAlarm = DHAlarm || {}
const DHAlarmWeb = function() {
  this.localStream = null
  this.pc = null
  this.webrtcWs = null // webrtc websocket
  this.alarmWs = null // 报警服务器websocket
  this.audioWs = {} // 发送对讲音频websocket
  this.deviceAudioWs = {} // 接收设备音频websocket
  this.started = false // 是否开始
  this.webrtcSocketOpened = false
  this.alarmSocketOpened = false
  this.clientid = null
  this.roomid = null
  this.onStreamCallBack = null // 视频流回调 webrtc
  this.alarmUrl = null // 报警服务器websocket地址
  this.webrtcUrl = null // webrtc websocket地址
  this.onAlarmMessage = null // 报警信息回调
  this.onLoging = null // 登录回调
  this.onDeviceList = null // 设备列表回调
  this.onNotify = null // 设备通知回调
  this.onPlayRT = null // 播放回调
  this.onDeviceMove = null // 设备移除回调
  this.onParseMsgError = null // 解析回调数据异常回调
  this.uname = null
  this.pwd = null
  this.isLogin = false
  this.loginHandle = null
  this.deviceId = null
  this.context = null // audiocontext
  this.recorder = null
  this.wfs = {}
  DHAlarm.wrc = this
  this.player = {}
  this.bufferPool = {}
  this.isDeviceAudioPlay = {}
  this.onAlarmServerClosed = null
  this.keepAliveInterval = null
  // test
  this.count = null

  this.dataWsPort = 8088
  this.mediaWsPort = 8088
  // if(sessionStorage.getItem('webrtcUrl') && !this.webrtcSocketOpened){
  // this.webrtcUrl = sessionStorage.getItem('webrtcUrl');
  // this.alarmUrl = sessionStorage.getItem('alarmUrl');
  // this.openWebrtcSocket();
  // this.openAlarmSocket();
  // }
}

// webrtc
/*
//连接类
var PeerConnection = window.PeerConnection || window.webkitPeerConnection
		|| window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

//RTC候选对象
var RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var mediaConstraints = {
	optional: [],
	mandatory: {
		OfferToReceiveAudio: true,
		OfferToReceiveVideo: true
	}
};

DHAlarmWeb.prototype.getUserMedia = function() {
	 console.log("获取用户媒体");
	 navigator.mediaDevices.getUserMedia({
		"audio" : true,
		"video" : true
		}).catch(function(error) {
          if (error.name !== 'NotFoundError') {
            throw error;
          }
          return navigator.mediaDevices.enumerateDevices()
              .then(function(devices) {
                var cam = devices.find(function(device) {
                  return device.kind === 'videoinput';
                });
                var mic = devices.find(function(device) {
                  return device.kind === 'audioinput';
                });
                var constraints = {
                  video: cam && mediaConstraints.video,
                  audio: mic && mediaConstraints.audio
                };
                return navigator.mediaDevices.getUserMedia(constraints);
              });
        })
        .then(function(stream) {
          this.onUserMediaSuccess(stream);
        }.bind(this)).catch(function(error) {
          this.onUserMediaError(error);
        }.bind(this));
}
DHAlarmWeb.prototype.onUserMediaSuccess = function(stream) {
	console.log("onUserMediaSuccess");
	this.localStream = stream;

	//if (this.is_initiator)
	//this.maybeStart();
};
DHAlarmWeb.prototype.onUserMediaError = function(error) {
	console.log("onUserMediaError:"+error);
};

DHAlarmWeb.prototype.startPlay = function() {
	//this.getUserMedia();
	//this.join();
}

// 开始连接
DHAlarmWeb.prototype.maybeStart = function() {
	if (!this.started) {
		this.createPeerConnection();
		this.started = true;
	}
	if(this.localStream && this.pc){
		console.log("addStream");
		this.pc.addStream(this.localStream);
	}
	//if (this.is_initiator)
	this.doOffer();
}
 // 开始通话
DHAlarmWeb.prototype.doOffer = function() {
	console.log("createOffer");
	if(this.pc)
	this.pc.createOffer(mediaConstraints).then(this.setLocalAndSendMessage.bind(this), function(error) {
		console.log('createOffer Failure callback: ' + error);
  });
}
// 响应
DHAlarmWeb.prototype.doAnswer = function() {
	this.pc.createAnswer().then(this.setLocalAndSendMessage.bind(this), function(error) {
		console.log('createAnswer Failure callback: ' + error);
  });
}

DHAlarmWeb.prototype.setLocalAndSendMessage = function(sessionDescription) {
	this.pc.setLocalDescription(sessionDescription);
	console.log(sessionDescription);
	var sendMsg = new Object();
	sendMsg.msg = JSON.stringify(sessionDescription);
	sendMsg.cmd = 'send';
	this.sendWebrtcMessage(sendMsg);
}


DHAlarmWeb.prototype.createPeerConnection = function() {
	console.log("创建PeerConnection");
	var server = {
                "iceServers" : [ {
                    "url" : "stun:stun.l.google.com:19302"
                } ]
            };
    this.pc = new PeerConnection(server);
	this.pc.onicecandidate = this.onIceCandidate.bind(this);
	this.pc.onconnecting = this.onSessionConnecting.bind(this);
	this.pc.onopen = this.onSessionOpened.bind(this);
	this.pc.ontrack = this.onRemoteStreamAdded.bind(this);
	this.pc.onremovestream = this.onRemoteStreamRemoved.bind(this);

};
// 发送信息
DHAlarmWeb.prototype.sendWebrtcMessage = function(message) {
	var msgJson = JSON.stringify(message);
	this.webrtcWs.send(msgJson);
}
//注册
DHAlarmWeb.prototype.register = function() {
	 var registerMessage = {
		  cmd: 'register',
		  roomid: this.roomid,
		  clientid: this.clientid
    };
	this.sendWebrtcMessage(registerMessage);
}
// var hangingGet;
//注册
// DHAlarmWeb.prototype.join = function() {
	 // try {
            // hangingGet = new XMLHttpRequest();
            // hangingGet.onreadystatechange = this.hangingGetCallback.bind(this);
           // // hangingGet.ontimeout = onHangingGetTimeout;
            // hangingGet.open("POST", "https://192.168.68.150" +"/join/"+this.roomid, true);
            // hangingGet.send();
        // } catch (e) {
            // trace("error" + e.description);
        // }
// }
// DHAlarmWeb.prototype.hangingGetCallback=function() {
        // try {
            // if (hangingGet.readyState == 4) {
                // if (hangingGet.status == 200) {
                    // console.log(hangingGet.responseText);
					// var data = JSON.parse(hangingGet.responseText);
					// if(data.result == 'SUCCESS'){
						// this.is_initiator = data.params.is_initiator;
						// this.clientid = data.params.clientid;

						// this.register();
					// }
                // }
            // }
        // } catch (e) {
            // trace("error: " + e.description);
        // }
    // }
DHAlarmWeb.prototype.processSignalingMessage = function(message) {
	var jsonMsg = JSON.parse(message);
	var msg;
	try {
		msg = JSON.parse(jsonMsg.msg);
	}catch(e) {
		msg = jsonMsg.msg;
	}
	console.log(msg);

	if (msg.type === "offer") {
		if (!this.started)
		this.maybeStart();
		 if (this.pc && this.pc.signalingState !== 'stable') {
			 console.log('ERROR: remote offer received in unexpected state: ' + this.pc.signalingState);
			 return;
		 }
		this.pc.setRemoteDescription(new RTCSessionDescription(msg));
		this.doAnswer();
	} else if (msg.type === "answer" && this.started) {
		if (this.pc && this.pc.signalingState !== 'have-local-offer') {
			 console.log('ERROR: remote answer received in unexpected state: ' + this.pc.signalingState);
			 return;
		 }
		console.log("answer setRemoteDescription");
		this.pc.setRemoteDescription(new RTCSessionDescription(msg));
	} else if (msg.type === "candidate" && this.started) {
		var candidate = new RTCIceCandidate({
			sdpMLineIndex : msg.label,
			candidate : msg.candidate
		});
		this.pc.addIceCandidate(candidate);
	} else if (msg.type === "bye"&& this.started) {
		this.onRemoteClose();
	} else if (msg.type === "nowaiting") {
		this.onRemoteClose();
	}else if(msg === "success"){
		if (!this.started)
		this.maybeStart();
	}
}
 // 打开websocket
DHAlarmWeb.prototype.openWebrtcSocket = function() {
	console.log("openWebrtcSocket");

	this.webrtcWs = new WebSocket(this.webrtcUrl);
	this.webrtcWs.onopen = this.onWebrtcSocketOpened.bind(this);
	this.webrtcWs.onmessage = this.onWebRtcSocketMessage.bind(this);
	this.webrtcWs.onclose = this.onWebrtcSocketClosed.bind(this);
	this.webrtcWs.onerror = this.onWebrtcSocketError.bind(this);
}
// websocket打开
DHAlarmWeb.prototype.onWebrtcSocketOpened = function() {
	console.log("onWebrtcSocketOpened");
	if(!this.webrtcSocketOpened){
		this.register();
	}
	this.webrtcSocketOpened = true;

}

// websocket收到消息
DHAlarmWeb.prototype.onWebRtcSocketMessage = function(message) {
	console.log("onWebRtcSocketMessagee: " + message.data);

	this.processSignalingMessage(message.data);//建立视频连接
}

// websocket异常
DHAlarmWeb.prototype.onWebrtcSocketError = function(event) {
	console.log("onWebrtcSocketError: "+ JSON.stringify(event));

	//alert("websocket异常");
}

	// websocket关闭
DHAlarmWeb.prototype.onWebrtcSocketClosed = function() {
	console.log("onWebrtcSocketClosed");
	this.webrtcSocketOpened = false;
	setTimeout(function(){
		DHAlarm.wrc.openWebrtcSocket();
	},1000*5);
}
   // 远程视频关闭
DHAlarmWeb.prototype.onRemoteClose = function() {
	this.started = false;
	this.pc.close();
}
var sendCandidate = false;
DHAlarmWeb.prototype.onIceCandidate = function(event) {
	console.log("onIceCandidate");
	if (event.candidate) {
		var candidate = {
			sdpMLineIndex: event.candidate.sdpMLineIndex,
			sdpMid: event.candidate.sdpMid,
			candidate: event.candidate.candidate
		};
		 var message = {
			type: 'candidate',
			label: event.candidate.sdpMLineIndex,
			id: event.candidate.sdpMid,
			candidate: event.candidate.candidate
		};
		var sendMsg = {};
		sendMsg.msg = JSON.stringify(message);
		if(!sendCandidate){
			this.sendWebrtcMessage(sendMsg);
			sendCandidate = true;
		}

	} else {
	  console.log("End of candidates.");
	}
};
DHAlarmWeb.prototype.onSessionConnecting = function(message) {
   console.log("开始连接");
};
DHAlarmWeb.prototype.onSessionOpened = function(message) {
 console.log("连接打开");
};
// 远程视频添加
DHAlarmWeb.prototype.onRemoteStreamAdded = function(event) {
  console.log("远程视频添加");
  if(this.onStreamCallBack){
	  this.onStreamCallBack(event.streams[0]);
  }
};
//远程视频移除
DHAlarmWeb.prototype.onRemoteStreamRemoved = function(event) {
   console.log("远程视频移除");
   console.log(event);
};
//视频挂断
DHAlarmWeb.prototype.handup = function(event) {
   var sendMsg = {
		cmd: 'send',
		msg: JSON.stringify({type: 'bye'})
	}
	this.sendWebrtcMessage(sendMsg);
	if(this.pc){
		this.pc.close();
	}
	this.started = false;
	if(this.localStream){
		this.localStream.getTracks()[1].stop();
	}
}; */
window.onbeforeunload = function() {}

/** *********************************************************** */
// 报警服务器信息处理
/** *********************************************************** */

// 打开websocket
DHAlarmWeb.prototype.openAlarmSocket = function() {
  console.log('openAlarmSocket')

  this.alarmWs = new WebSocket(this.alarmUrl)
  this.alarmWs.onopen = this.onAlarmSocketOpened.bind(this)
  this.alarmWs.onmessage = this.onAlarmSocketMessage.bind(this)
  this.alarmWs.onclose = this.onAlarmSocketClosed.bind(this)
  this.alarmWs.onerror = this.onAlarmSocketError.bind(this)
}
// websocket打开
DHAlarmWeb.prototype.onAlarmSocketOpened = function() {
  this.alarmSocketOpened = true
  console.log('onAlarmSocketOpened')
  this.registerAlarm()
}
DHAlarmWeb.prototype.registerAlarm = function() {
  const registerMessage = {
    cmd: 'register',
    msg: ''
  }
  this.alarmWs.send(JSON.stringify(registerMessage))
}
// websocket收到消息
DHAlarmWeb.prototype.onAlarmSocketMessage = function(message) {
  try {
    const data = JSON.parse(message.data)
    sessionStorage.setItem('clientid', data.clientid)
    if (data.clientid) {
      this.clientid = data.clientid
    }
  } catch (e) {
    console.log(message)
  }
  this.processAlarmMessage(message.data)
}
// websocket异常
DHAlarmWeb.prototype.onAlarmSocketError = function(event) {
  console.log(`onAlarmSocketError: ${JSON.stringify(event)}`)
}
// websocket关闭
DHAlarmWeb.prototype.onAlarmSocketClosed = function() {
  this.alarmSocketOpened = false
  console.log('onAlarmSocketClosed')
  if (this.onAlarmServerClosed) {
    this.onAlarmServerClosed()
  }
}
// 发送信息
DHAlarmWeb.prototype.sendAlarmMessage = function(message) {
  const msgJson = JSON.stringify(message)
  if (this.alarmWs && this.alarmWs.readyState === WebSocket.OPEN) {
    this.alarmWs.send(msgJson)
  }
}
// 发送信息回调
DHAlarmWeb.prototype.sendAlarmMessageCallBack = function(message, callback) {
  const msgJson = JSON.stringify(message)
  this.alarmWs.send(msgJson)
}
// 处理信息
DHAlarmWeb.prototype.processAlarmMessage = function(message) {
  if (this.onAlarmMessage) {
    this.onAlarmMessage(message)
  }
  try {
    var data = JSON.parse(message)
    const msg = JSON.parse(data.msg)
    if (msg.method == 'eventManager.notify') {
      // 设备报警回调
      if (this.onNotify) {
        this.onNotify(msg)
      }
    } else if (msg.method == 'configManager.onDeviceList') {
      // 设备列表回调
      if (this.onDeviceList) {
        this.onDeviceList(msg)
      }
    } else if (msg.method == 'systemManager.onLogin') {
      // 登录回调
      if (msg.error == 'success') {
        this.keepAliveInterval = setInterval(() => {
          const sendMsg = {
            cmd: 'send',
            clientId: data.clientid,
            msg: JSON.stringify({
              method: 'systemManager.keepAlive',
              params: {
                loginHandle: msg.params.loginHandle
              }
            })
          }
          this.sendAlarmMessage(sendMsg)
        }, 10000)
      }
      if (this.onLogin) {
        this.onLogin(msg)
      }
    } else if (msg.method == 'systemManager.onPlayRT') {
      // 播放回调
      if (this.onPlayRT) {
        this.onPlayRT(msg)
      }
    } else if (msg.method == 'configManager.onDeviceMove') {
      // 设备移除
      if (this.onDeviceMove) {
        this.onDeviceMove(msg)
      }
    }
  } catch (e) {
    if (this.onParseMsgError) {
      this.onParseMsgError(data)
    }
    console.log(e)
  }
}

DHAlarmWeb.prototype.setWebsocketPort = function(option) {
  this.dataWsPort = option.dataWsPort
  this.mediaWsPort = option.mediaWsPort
}

// 登录
DHAlarmWeb.prototype.login = function(uname, pwd, ipAddr) {
  this.count = 0
  if (!ipAddr) {
    return
  }
  sessionStorage.setItem('serverAddr', ipAddr)
  this.alarmUrl = `wss://${ipAddr}:${this.dataWsPort}/ws`
  this.webrtcUrl = `wss://${ipAddr}:8089/ws`
  this.uname = uname
  this.pwd = pwd

  if (
    sessionStorage.getItem('alarmUrl') != this.alarmUrl ||
    !this.alarmSocketOpened
  ) {
    this.openAlarmSocket()
  }
  // if(sessionStorage.getItem('webrtcUrl') != this.webrtcUrl || !this.webrtcSocketOpened){
  // this.openWebrtcSocket();
  // }
  sessionStorage.setItem('dataWsPort', this.dataWsPort)
  sessionStorage.setItem('mediaWsPort', this.mediaWsPort)
  sessionStorage.setItem('alarmUrl', this.alarmUrl)
  sessionStorage.setItem('webrtcUrl', this.webrtcUrl)

  let time = 0
  var interval = setInterval(() => {
    if (DHAlarm.wrc.alarmSocketOpened) {
      clearInterval(interval)
      const msg = {
        method: 'systemManager.login',
        params: {
          userName: uname,
          password: pwd
        }
      }
      const sendMsg = {
        cmd: 'send',
        msg: JSON.stringify(msg)
      }
      DHAlarm.wrc.sendAlarmMessage(sendMsg)
    } else if (time > 5) {
      clearInterval(interval)
      const result = {
        method: 'systemManager.onLogin',
        error: 'login timeout'
      }
      const message = {
        clientid: '',
        error: 'fail',
        msg: JSON.stringify(result)
      }
      if (this.onAlarmMessage) {
        this.onAlarmMessage(JSON.stringify(message))
      }
    }
    time++
  }, 1000)
}

DHAlarmWeb.prototype.logout = function(handle) {
  if (!handle) return
  const msg = {
    method: 'systemManager.logout',
    params: {
      loginHandle: parseInt(handle)
    }
  }
  const sendMsg = {
    cmd: 'send',
    msg: JSON.stringify(msg)
  }
  this.sendAlarmMessage(sendMsg)
  const registerMessage = {
    cmd: 'deregister',
    msg: ''
  }
  this.sendAlarmMessage(registerMessage)
  sessionStorage.setItem('clientId', null)
  clearInterval(this.keepAliveInterval)

  if (this.alarmWs) {
    this.alarmWs.close()
  }
  for (let i = 0; i < this.audioWs.length; i++) {
    if (this.audioWs[i]) {
      this.audioWs[i].close()
    }
    if (this.deviceAudioWs[i]) {
      this.deviceAudioWs[i].close()
    }
    if (this.player[i]) {
      this.player[i].destroy()
    }
  }
}
DHAlarmWeb.prototype.playRT = function(video, deviceId, loginHandle, isTalk) {
  if (!deviceId || !loginHandle) return
  const msg = {
    method: 'deviceManager.playRT',
    params: {
      deviceId: parseInt(deviceId),
      loginHandle: parseInt(loginHandle),
      preview: false
    }
  }
  const sendMsg = {
    cmd: 'send',
    msg: JSON.stringify(msg)
  }
  if (isTalk != false) {
    isTalk = true
  }
  this.sendAlarmMessage(sendMsg)
  this.openAudio(loginHandle, deviceId, isTalk)
  if (isTalk) {
    this.playDeviceAudio(deviceId)
  }
  this.openDeviceAudio(loginHandle, deviceId)
  this.playVideo(video, deviceId, loginHandle)
}
DHAlarmWeb.prototype.stopRT = function(deviceId, loginHandle) {
  if (!deviceId || !loginHandle) return
  const msg = {
    method: 'deviceManager.stopRT',
    params: {
      deviceId: parseInt(deviceId),
      loginHandle: parseInt(loginHandle)
    }
  }
  const sendMsg = {
    cmd: 'send',
    msg: JSON.stringify(msg)
  }
  this.sendAlarmMessage(sendMsg)
  this.closeAudio(deviceId)

  if (this.deviceAudioWs[deviceId]) {
    this.deviceAudioWs[deviceId].close()
  }
  if (this.player[deviceId]) {
    this.player[deviceId].destroy()
  }
  if (this.bufferPool[deviceId]) {
    this.bufferPool[deviceId].stopBuffering()
  }
  if (this.wfs[deviceId]) {
    this.wfs[deviceId].destroy()
  }
  this.deviceId = null
  sessionStorage.setItem('playDeviceId', null)
}

DHAlarmWeb.prototype.doControl = function(deviceId, loginHandle, doIndex) {
  const msg = {
    method: 'deviceManager.doControl',
    params: {
      deviceId: parseInt(deviceId),
      loginHandle: parseInt(loginHandle),
      index: parseInt(doIndex)
    }
  }
  const sendMsg = {
    cmd: 'send',
    msg: JSON.stringify(msg)
  }
  this.sendAlarmMessage(sendMsg)
}

DHAlarmWeb.prototype.playVideo = function(video, deviceId, loginHandle) {
  sessionStorage.setItem('playDeviceId', deviceId)
  sessionStorage.setItem('loginHandle', loginHandle)
  // if (Wfs.isSupported()) {
  this.wfs[deviceId] = new Wfs()
  this.wfs[deviceId].attachMedia(video, deviceId)
  // }
}
DHAlarmWeb.prototype.startTalk = function(deviceId) {
  this.sendAudio(deviceId)
}
DHAlarmWeb.prototype.registerTalk = function(deviceId) {
  const registerMessage = {
    cmd: 'register',
    clientid: this.clientid,
    loginHandle: parseInt(this.loginHandle),
    sessiontype: 'talk',
    deviceid: parseInt(deviceId),
    msg: ''
  }
  this.audioWs[deviceId].send(JSON.stringify(registerMessage))
}

DHAlarmWeb.prototype.openAudio = function(loginHandle, deviceId, isTalk) {
  this.loginHandle = loginHandle
  this.deviceId = deviceId
  this.audioWs[deviceId] = new WebSocket(
    `wss://${sessionStorage.getItem('serverAddr')}:${this.mediaWsPort}/ws`
  )

  this.audioWs[deviceId].onopen = function() {
    this.onAudioSocketOpened(deviceId)
  }.bind(this)
  this.audioWs[deviceId].onmessage = function(message) {
    this.onAudioSocketMessage(message, deviceId, isTalk)
  }.bind(this)
  this.audioWs[deviceId].onclose = function() {
    this.onAudioSocketClosed(deviceId)
  }.bind(this)
  this.audioWs[deviceId].onerror = function(event) {
    this.onAudioSocketError(event)
  }.bind(this)
}
// websocket打开
DHAlarmWeb.prototype.onAudioSocketOpened = function(deviceId) {
  console.log(`onAudioSocketOpened  did:${deviceId}`)
  this.registerTalk(deviceId)
}

// websocket收到消息
DHAlarmWeb.prototype.onAudioSocketMessage = function(
  message,
  deviceId,
  isTalk
) {
  // console.log("onAudioSocketMessage: " + message.data);
  const data = JSON.parse(message.data)
  if (data.error == 'success') {
    if (!isTalk) return
    this.sendAudio(deviceId)
  }
}
// websocket异常
DHAlarmWeb.prototype.onAudioSocketError = function(event) {
  console.log(`onAudioSocketError: ${JSON.stringify(event)}`)
}
// websocket关闭
DHAlarmWeb.prototype.onAudioSocketClosed = function(deviceId) {
  console.log(`onAudioSocketClosed  did:${deviceId}`)
}
// 发送音频数据
DHAlarmWeb.prototype.sendAudio = function(deviceId) {
  const arrBuffer = new ArrayBuffer(320)
  let sendBuffer = new DataView(arrBuffer)
  let sendBufferindex = 0
  if (navigator.getUserMedia) {
    navigator.getUserMedia(
      { audio: true },
      stream => {
        if (this.recorder) {
          this.recorder.disconnect()
        }
        this.context = new AudioContext()
        this.recorder = this.context.createScriptProcessor(1024, 1, 1)
        const audioInput = this.context.createMediaStreamSource(stream)
        audioInput.connect(this.recorder)
        this.recorder.connect(this.context.destination)
        this.recorder.onaudioprocess = function(e) {
          const buffer = e.inputBuffer.getChannelData(0)
          const arrayBuffer = this.context.createBuffer(
            1,
            1024,
            this.context.sampleRate
          )
          const nowBuffering = arrayBuffer.getChannelData(0)
          for (let i = 0; i < arrayBuffer.length; i++) {
            nowBuffering[i] = buffer[i]
          }
          const offctx = new OfflineAudioContext(
            1,
            parseInt((1024 * 8000) / this.context.sampleRate),
            8000
          )
          const source = offctx.createBufferSource()
          source.buffer = arrayBuffer
          source.connect(offctx.destination)
          source.start()
          offctx.startRendering().then(renderedBuffer => {
            const channetData = renderedBuffer.getChannelData(0)
            source.stop()
            let index = 0
            const length = channetData.length
            while (index < length) {
              const selectBuffer = channetData[index]
              const s = Math.max(-1, Math.min(1, selectBuffer))
              const point = s < 0 ? s * 0x8000 : s * 0x7fff
              if (sendBufferindex < 320) {
                sendBuffer.setInt16(sendBufferindex, point, true)
              } else {
                if (
                  this.audioWs[deviceId].readyState ==
                    this.audioWs[deviceId].CLOSING ||
                  this.audioWs[deviceId].readyState ==
                    this.audioWs[deviceId].CLOSED
                ) {
                  this.recorder.disconnect()
                  return
                }
                if (
                  this.audioWs[deviceId].readyState ==
                  this.audioWs[deviceId].CONNECTING
                ) {
                  return
                }
                this.audioWs[deviceId].send(new Int16Array(arrBuffer))

                sendBuffer = new DataView(arrBuffer)
                sendBufferindex = 0
                sendBuffer.setInt16(sendBufferindex, point, true)
              }
              index++
              sendBufferindex += 2
            }
          })
        }.bind(this)
      },
      e => {
        this.audioWs[deviceId].close()
        console.log(e)
      }
    )
  }
}
DHAlarmWeb.prototype.closeAudio = function(deviceId) {
  if (this.audioWs[deviceId]) {
    this.audioWs[deviceId].close()
  }
  if (!this.recorder) return
  this.recorder.disconnect()
}
DHAlarmWeb.prototype.registerDeviceAudio = function(deviceId) {
  const registerMessage = {
    cmd: 'register',
    clientid: this.clientid,
    loginHandle: parseInt(this.loginHandle),
    sessiontype: 'audio',
    deviceid: parseInt(deviceId),
    msg: ''
  }
  this.deviceAudioWs[deviceId].send(JSON.stringify(registerMessage))
}

DHAlarmWeb.prototype.openDeviceAudio = function(loginHandle, deviceId) {
  this.loginHandle = loginHandle
  this.deviceId = deviceId
  this.deviceAudioWs[deviceId] = new WebSocket(
    `wss://${sessionStorage.getItem('serverAddr')}:${this.mediaWsPort}/ws`
  )
  this.deviceAudioWs[deviceId].binaryType = 'arraybuffer'

  this.deviceAudioWs[deviceId].onopen = function() {
    this.onDeviceAudioSocketOpened(deviceId)
  }.bind(this)
  this.deviceAudioWs[deviceId].onmessage = function(message) {
    this.onDeviceAudioSocketMessage(message, deviceId)
  }.bind(this)
  this.deviceAudioWs[deviceId].onclose = function() {
    this.onDeviceAudioSocketClosed(deviceId)
  }.bind(this)
  this.deviceAudioWs[deviceId].onerror = function(event) {
    this.onDeviceAudioSocketError(event)
  }.bind(this)
}
// websocket打开
DHAlarmWeb.prototype.onDeviceAudioSocketOpened = function(deviceId) {
  console.log(`onDeviceAudioSocketOpened  did:${deviceId}`)
  this.registerDeviceAudio(deviceId)
}

// websocket收到消息
DHAlarmWeb.prototype.onDeviceAudioSocketMessage = function(message, deviceId) {
  // console.log("onDeviceAudioSocketMessage: " + message.data);
  if (typeof message.data == 'object') {
    if (!this.isDeviceAudioPlay || !this.isDeviceAudioPlay[deviceId]) return
    this.parseDeviceAudio(message.data, deviceId)
  } else {
    const data = JSON.parse(message.data)
    if (data.error == 'success') {
      this.player[deviceId] = new PCMPlayer({
        encoding: '16bitInt',
        channels: 1,
        sampleRate: 8000,
        flushingTime: 500
      })
      this.bufferPool[deviceId] = new DHBufferPool()
      this.bufferPool[deviceId].onFrame = function(arrayData) {
        this.feedData(arrayData, deviceId)
      }.bind(this)
      this.bufferPool[deviceId].startBuffering()
    }
  }
}
// websocket异常
DHAlarmWeb.prototype.onDeviceAudioSocketError = function(event) {
  console.log(`onDeviceAudioSocketError: ${JSON.stringify(event)}`)
}
// websocket关闭
DHAlarmWeb.prototype.onDeviceAudioSocketClosed = function(deviceId) {
  console.log(`onDeviceAudioSocketClosed  did:${deviceId}`)
}

DHAlarmWeb.prototype.parseDeviceAudio = function(data, deviceId) {
  const arrayData = new Int16Array(data)
  this.bufferPool[deviceId].addFrame(arrayData)
}

DHAlarmWeb.prototype.feedData = function(arrayData, deviceId) {
  this.player[deviceId].feed(arrayData)
  this.player[deviceId].volume(1)
}
// 播放设备音频
DHAlarmWeb.prototype.playDeviceAudio = function(deviceId) {
  this.isDeviceAudioPlay = {}
  this.isDeviceAudioPlay[deviceId] = true
}
