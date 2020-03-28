/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Form, Select, Input, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import eventObject from '~/config/eventSignal'
import fetch from '~/utils/fetch'
import urlCng from '~/config/url'
import accountArr from '~/config/dropData'
import '../../../less/normal.less'
import './style.less'
import { getStore } from '~/utils'

const FormItem = Form.Item
const Option = Select.Option

@hot
class Add extends Component {
  constructor(props) {
    super(props)
    this.parkList = JSON.parse(getStore('parkList'))
  }

  componentDidMount() {
    this.props.form.resetFields()
    eventObject.accountEvent.add(this.save)
  }

  componentWillUnmount() {
    eventObject.accountEvent.remove(this.save)
  }

  save = () => {
    this.props.form.validateFields((err, values) => {
      const { op, data } = this.props
      const params =
        op === 'edit' ? Object.assign({}, values, { id: data.id }) : values

      if (!err) {
        fetch({
          url: urlCng.accountAdd,
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

  render() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const { getFieldDecorator } = this.props.form
    let { data } = this.props
    const { op } = this.props
    if (!data) data = {}
    return (
      <div id="Add">
        <Form onSubmit={this.handleSubmit}>
          {op === 'add' ? (
            <FormItem {...formItemLayout} label="停车场">
              {getFieldDecorator('userName', {
                initialValue: data.userName
              })(<Input placeholder="请输入停车场" allowClear />)}
            </FormItem>
          ) : null}
          {op === 'edit' ? (
            <FormItem {...formItemLayout} label="请选择停车场">
              {getFieldDecorator('roleId', {
                initialValue: data.roleId || accountArr[0].id
              })(
                <Select>
                  {this.parkList.map((item, i) => (
                    <Option value={item.id} key={i}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
          {op === 'edit' ? (
            <FormItem {...formItemLayout} label="设备">
              {getFieldDecorator('realName', {
                initialValue: data.realName
              })(<Input placeholder="请输入设备名" allowClear />)}
            </FormItem>
          ) : null}

          {op === 'equip' ? (
            <FormItem {...formItemLayout} label="设备编号">
              {getFieldDecorator('email', {
                initialValue: data.email
              })(<Input placeholder="请输入设备编号" allowClear />)}
            </FormItem>
          ) : null}
          {op === 'equip' ? (
            <FormItem {...formItemLayout} label="对应IP">
              {getFieldDecorator('email', {
                initialValue: data.email
              })(<Input placeholder="请输入对应IP" allowClear />)}
            </FormItem>
          ) : null}
          {op === 'edit' || op === 'equip' ? (
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('tel', {
                initialValue: data.tel
              })(<Input placeholder="请输入备注" allowClear />)}
            </FormItem>
          ) : null}
        </Form>
      </div>
    )
  }
}

const WrappedFormSet = Form.create()(Add)
export default WrappedFormSet
