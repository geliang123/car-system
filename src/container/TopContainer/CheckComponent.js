import React, { Component, Fragment } from 'react'
import { Button } from 'antd'
import './check.less'

class CheckComponent extends Component {
  state = {
    checkDetail: false // 显示的是否为详情
  }

  check = () => {
    this.setState(
      {
        checkDetail: true
      },
      () => {
        this.repeat()
      }
    )
  }

  repeat = () => {
    // 检测浏览器
    this.countNumber(
      'browser',
      {
        time: 1000,
        num: 100,
        regulator: 50
      },
      true
    )
    this.checkoutVoice('voice1')
    this.checkoutVoice('voice2')

    // 检测ip
    this.countNumber(
      'ip',
      {
        time: 1000,
        num: 100,
        regulator: 40
      },
      true
    )
    // 检测扬声器 和麦克风
  }

  checkoutVoice = id => {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: true },
        () => {
          this.countNumber(
            id,
            {
              time: 1000,
              num: 100,
              regulator: 50
            },
            true
          )
        },
        () => {
          this.countNumber(
            id,
            {
              time: 2000,
              num: 100,
              regulator: 30
            },
            false
          )
        }
      )
    } else {
      this.countNumber(
        id,
        {
          time: 1500,
          num: 100,
          regulator: 50
        },
        false
      )
    }
  }

  countNumber = (targetEle, options, flag) => {
    // flag==false 检测失败

    options = options || {}

    const $this = document.getElementById(targetEle)

    const time = options.time || $this.data('time') // 总时间--毫秒为单位
    const finalNum = options.num || $this.data('value') // 要显示的真实数值
    const regulator = options.regulator || 100 // 调速器，改变regulator的数值可以调节数字改变的速度

    const step = finalNum / (time / regulator)
    let count = 0 // 计数器/* 每30ms增加的数值--*/
    let initial = 0

    const timer = setInterval(() => {
      count += step

      if (count >= finalNum) {
        clearInterval(timer)
        count = finalNum
      }
      // t未发生改变的话就直接返回
      // 避免调用text函数，提高DOM性能
      const t = Math.floor(count)
      if (t == initial) return

      initial = t

      if (initial === 100) {
        if (!flag) {
          $this.innerHTML = '异常'
          $this.style.color = '#FF4040'
          return
        }
        $this.innerHTML = '正常'
        $this.style.color = '#3CEA43'
      } else {
        $this.innerHTML = `扫描中(${initial}%)`
        $this.style.color = '#4098FF'
      }
    }, 30)
  }

  render() {
    const { checkDetail } = this.state
    return (
      <div id="checkPage">
        {!checkDetail ? (
          <Fragment>
            <img
              src={require('../../images/home/check-bg.png')}
              className="check-bg"
            />
            <div className="check-text">设备检测</div>
            <Button className="check-btn" onClick={this.check}>
              检测
            </Button>
          </Fragment>
        ) : (
          <div className="check-detail">
            <div className="check-title">客服端</div>
            <div className="check-box">
              <div className="check-item">
                <span>浏览器</span>
                <span className="status" id="browser" />
              </div>
              <div className="check-item">
                <span>网 络</span>
                <span className="status" id="ip" />
              </div>
              <div className="check-item">
                <span>麦克风</span>
                <span className="status" id="voice1" />
              </div>
              <div className="check-item">
                <span>扬声器</span>
                <span className="status" id="voice2" />
              </div>
            </div>
            <Button className="repeat-btn" onClick={this.repeat}>
              重新检测
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default CheckComponent
