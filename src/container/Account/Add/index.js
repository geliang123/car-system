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

const FormItem = Form.Item
const Option = Select.Option

@hot
class Add extends Component {
  componentDidMount() {
    this.props.form.resetFields()
    eventObject.accountEvent.add(this.save)
  }

  componentWillUnmount() {
    eventObject.accountEvent.remove(this.save)
  }

  save = ref => {
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
          ref.destroy()
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
    if (!data) data = {}
    return (
      <div id="Add">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="账号角色">
            {getFieldDecorator('roleId', {
              initialValue: data.roleId || accountArr[0].id
            })(
              <Select>
                {accountArr.map((item, i) => (
                  <Option value={item.id} key={i}>
                    {item.displayName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用  户  名">
            {getFieldDecorator('userName', {
              initialValue: data.userName
            })(<Input placeholder="请输入用户名" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              initialValue: data.password,
              rules: [
                {
                  min: 4,
                  message: '密码不能少于4个字符'
                },
                {
                  max: 18,
                  message: '密码不能大于18个字符'
                }
              ]
            })(<Input type="password" placeholder="请输入密码" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('realName', {
              initialValue: data.realName
            })(<Input placeholder="请输入姓名" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机">
            {getFieldDecorator('tel', {
              initialValue: data.tel,
              rules: [
                {
                  pattern: /^1[34578]\d{9}$/,
                  message: '格式不正确'
                }
              ]
            })(<Input placeholder="请输入手机号" allowClear />)}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: data.email,
              rules: [
                {
                  required: true,
                  message: '必填'
                }
              ]
            })(<Input placeholder="请输入邮箱" allowClear />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const WrappedFormSet = Form.create()(Add)
export default WrappedFormSet
