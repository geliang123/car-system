/* eslint-disable new-cap */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
import { hot } from 'react-hot-loader/root'
import React, { Component } from 'react'

import '../../../less/normal.less'
import './style.less'
import { message } from 'antd'
import Title from '~/component/Title'
import urlCng from '~/config/url'
import { getStore, setStore } from '~/utils'
import fetch from '~/utils/fetch'
import RightComponent from './RightComponent'
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
@hot
class LivecallDeatil extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    const { location } = this.props
    const callDetailId =
      (location &&
        location.state &&
        location.state.data &&
        location.state.data.id) ||
      getStore('callDetailId')
    setStore('callDetailId', callDetailId)
    if (callDetailId) {
      this.getDetail(callDetailId)
      console.log(location.state.data)
      this.deviceId = location.state.data.audioDeviceId
      this.playVideo(962025,912043,true)

      this.timer=setTimeout(()=>{
        global.dhWeb.startTalk(this.deviceId);
      },3000)
    }
    this.videoView = new mainClass()
    this.videoView.devicetype = '1'
    const loginJsonMap = {
      szIPAddr: '192.168.1.14',
      dwPort: '80',
      szUserName: 'admin',
      szPassword: '123456',
      dwLoginProto: 0
    }
    const loginJsonstring = JSON.stringify(loginJsonMap)
    this.videoView.login(loginJsonstring)
    this.videoView.getChannellist()
  }

  componentWillUnmount() {
    if(this.timer) clearTimeout(this.timer)
  }

  playVideo=(videoDeviceId,audioDeviceId,isTalk)=>{
    
    closeAll();
    var html = '<div class="videoboxDiv" ondblclick="launchFullscreen(this)">'+
           '<video id="play_'+912043+'" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>'+$('#device_'+audioDeviceId).text()+'</span>'+
           '<img class="loading" src="./image/loading.gif"/>'+
         '</div>';
   $('.videoDiv').append(html);
   global.dhWeb.playDeviceAudio(912043);
    $('.selectVideo').parent().css("zIndex","2");
    var video = document.getElementById("play_"+912043);
    global.dhWeb.playRT(video,912043,sessionStorage.getItem('loginHandle'),isTalk);
    if(isTalk){
      if($("#talk").hasClass("talking")) return;
     $('#talk').addClass("talking");
     $(".talking").css("background","#aaa");
      //播放联动
     var parentId = $("#device_"+audioDeviceId).attr('parentId');
     var groupDevices = $('li[parentId = '+parentId+']');
     global.dhWeb.playRT($('#play_962065')[0],962025,sessionStorage.getItem('loginHandle'),false);
    //  for(var i =0; i<groupDevices.length;i++){
    //    var deviceId = groupDevices[i].id.split("_")[1];
    //    if($('#play_'+deviceId)[0]) continue;
    //    var iconClassName = getIconClassName($('#device_'+deviceId));
    //    if(!iconClassName) continue;
    //    var status = iconClassName.split('_');
    //    if(status[0] == 'alarm') continue;
    //    if(status[1] == 'Offline') continue;
    //    var html = '<div class="videoboxDiv linkDiv" >'+
    //            '<video id="play_'+deviceId+'"></video><span>'+$('#device_'+deviceId).text()+'</span>'+
    //            '<img class="loading" src="./image/loading.gif"/>'+
    //          '</div>';
    //    $('.videoDiv').append(html);

    //  }
    }
  }
  closeAll=()=>{
    global.dhWeb.stopRT(this.deviceId,sessionStorage.getItem('loginHandle'));
  }
  goback = () => {
    this.props.history.goBack()
  }

  dropChange = (e, key) => {
    this.setState({
      [key]: e
    })
  }

  getDetail = id => {
    const url = `${urlCng.callDetail}?id=${id}`
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          data: res.result
        })
      }
    })
  }

  // 更新
  updateList = (item, status) => {
    fetch({
      url: urlCng.callUpdate,
      method: 'POST',
      data: { id: item.id, status }
    }).then(res => {
      if (res.code === 1) {
        message.success('操作成功')
        this.setState({
          data: res.result
        })
      } else {
        message.error(res.msg)
      }
    })
  }

  changeValue = (e, key) => {
    this.setState({
      [key]: e.target.value
    })
  }

  getShow = () => {
    const { data } = this.state
    if (!data.carImgUrl) {
      return <div className="car-img videoDiv" />
    }
    return (
      <div className="no-img">
        <img src={require('../../../images/home/no-img.png')} />
      </div>
    )
  }

  render() {
    const { data } = this.state

    return (
      <div className="panel">
        <div id="LiveCallDeatail">
          <Title title="事件处理" />
          <div className="wrap-content">
            {/* 右边内容 */}
            <div className="left">
              <div className="ocxStyle">
                <div id="playerContainer" />        
              </div>
              <div class= "videoDiv"></div>
            </div>
            {/* 左边内容 */}
            <RightComponent data={data} />
          </div>
        </div>
      </div>
    )
  }
}

export default LivecallDeatil
