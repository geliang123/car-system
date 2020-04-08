/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Form, Select, Input, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import eventObject from '~/config/eventSignal'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import '../../../less/normal.less'
import './style.less'
import { getStore } from '~/utils'

const FormItem = Form.Item
const Option = Select.Option
const typeList = [
  {
    id: 1,
    name: '无人值守语音'
  },
  {
    id: 2,
    name: '无人值守监控'
  },
  {
    id: 3,
    name: '宇视监控'
  }
]
const equipLocationList = [
  {
    id: 1,
    name: '出口'
  },
  {
    id: 2,
    name: '入口'
  }
]
@hot
class Add extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioList: [],
      type: this.props.data.type || 1
    }
    this.parkList = JSON.parse(getStore('parkList'))
  }

  componentDidMount() {
    this.props.form.resetFields()
    eventObject.accountEvent.add(this.save)
    this.getAudioList()
  }

  componentWillReceiveProps(nextProps) {
    this.getAudioList()
    this.setState({
      type: nextProps.type
    })
  }

  componentWillUnmount() {
    eventObject.accountEvent.remove(this.save)
  }

  getAudioList = () => {
    const url = `${urlCng.audioUrl}?type=1`
    fetch({
      url
    }).then(res => {
      if (res.code === 1) {
        this.setState({
          audioList: res.result
        })
      }
    })
  }

  save = () => {
    this.props.form.validateFields((err, values) => {
      const { op, data } = this.props
      let params = values
      if (op === 'equip') {
        params = Object.assign({}, values, {
          parkName: data.parkName,
          id: data.id
        })
      }
      if (op === 'edit') {
        params = Object.assign({}, values, {
          id: data.id
        })
      }
      if (!err) {
        fetch({
          url: urlCng.equipAdd,
          method: 'POST',
          data: params
        }).then(res => {
          if (res.code === 1) {
            this.props.updateData()
            message.success('操作成功')
          } else {
            message.error(res.msg)
          }
        })
      }
    })
  }

  onChange = e => {
    this.setState({
      type: e
    })
  }

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    const { audioList, type } = this.state
    let { data } = this.props
    if (!data) data = { type: 1 }
    return (
      <div id="Add">
        <Form onSubmit={this.handleSubmit} className="formName">
          <div>
            <FormItem {...formItemLayout} label="停车场">
              {getFieldDecorator('parkName', {
                initialValue: data.parkName
              })(<Input placeholder="请输入停车场" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="闸口名称">
              {getFieldDecorator('gateName', {
                initialValue: data.gateName
              })(<Input placeholder="请输入闸口名称" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备编号">
              {getFieldDecorator('code', {
                initialValue: data.code
              })(<Input placeholder="请输入设备编号" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备名称">
              {getFieldDecorator('name', {
                initialValue: data.code
              })(<Input placeholder="请输入设备名称" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备类型">
              {getFieldDecorator('type', {
                initialValue: data.type
              })(
                <Select onChange={this.onChange}>
                  {typeList.map((item, i) => (
                    <Option value={item.id} key={i}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="关联语音设备">
              {getFieldDecorator('audioEquipId', {
                initialValue: data.audioEquipId
              })(
                <Select disabled={type === 1}>
                  {audioList.map((item, i) => (
                    <Option value={item.id} key={i}>
                      {`${item.parkName}-${item.gateName}-${item.code}`}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </div>
          <div>
            <FormItem {...formItemLayout} label="远程停车场ID">
              {getFieldDecorator('remoteParkId', {
                initialValue: data.remoteParkId
              })(<Input placeholder="远程停车场ID" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="远程闸口ID">
              {getFieldDecorator('remoteGateId', {
                initialValue: data.remoteGateId
              })(<Input placeholder="远程闸口ID" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="IP">
              {getFieldDecorator('equipmentIP', {
                initialValue: data.equipmentIP
              })(<Input placeholder="请输入IP" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="端口号">
              {getFieldDecorator('equipmentPort', {
                initialValue: data.equipmentPort
              })(<Input placeholder="请输入端口号" allowClear />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备位置">
              {getFieldDecorator('inOutType', {
                initialValue: data.inOutType
              })(
                <Select>
                  {equipLocationList.map((item, i) => (
                    <Option value={item.id} key={i}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: data.remark
              })(<Input placeholder="请输入备注" allowClear />)}
            </FormItem>
          </div>
        </Form>
      </div>
    )
  }
}

const WrappedFormSet = Form.create()(Add)
export default WrappedFormSet
