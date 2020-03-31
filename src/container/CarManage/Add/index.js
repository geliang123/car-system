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
              {getFieldDecorator('parkName', {
                initialValue: data.parkName
              })(<Input placeholder="请输入停车场" allowClear />)}
            </FormItem>
          ) : null}
          {op === 'edit' ? (
            <FormItem {...formItemLayout} label="停车场">
              {getFieldDecorator('parkName', {
                initialValue: data.parkName
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

          <FormItem {...formItemLayout} label="设备编号">
            {getFieldDecorator('code', {
              initialValue: data.code
            })(<Input placeholder="请输入设备编号" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="对应IP">
            {getFieldDecorator('detailInfo', {
              initialValue: data.detailInfo
            })(<Input placeholder="请输入对应IP" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="闸口">
            {getFieldDecorator('address', {
              initialValue: data.address
            })(<Input placeholder="请输入闸口" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              initialValue: data.remark
            })(<Input placeholder="请输入备注" allowClear />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const WrappedFormSet = Form.create()(Add)
export default WrappedFormSet
