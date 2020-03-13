/* eslint-disable array-callback-return */
import React, { Component } from 'react'
import { Form, Select, Input, message } from 'antd'
import { hot } from 'react-hot-loader/root'
import '../../../../less/normal.less'
import './style.less'

const FormItem = Form.Item
const Option = Select.Option
const accountArr = [
  {
    id: '1',
    displayName: '超级管理员'
  },
  {
    id: '2',
    displayName: '普通管理员'
  }
]
@hot
class Add extends Component {
  // constructor(props) {
  //   super(props)
  // }
  save = ref => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props
          .updateData(values)
          .then(response => {
            if (response.data.updateSimilarDaySetting.ok) {
              message.success('保存成功')
            } else {
              message.error('保存失败')
            }
            ref.destroy()
          })
          .catch(e => {
            console.error(e)
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
            {getFieldDecorator('account', {
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
            {getFieldDecorator('username', {
              initialValue: data.username
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              initialValue: data.password
            })(<Input type="password" placeholder="请输入密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name', {
              initialValue: data.name
            })(<Input placeholder="请输入姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="手机">
            {getFieldDecorator('phone', {
              initialValue: data.phone,
              rules: [
                {
                  pattern: /^1[34578]\d{9}$/,
                  message: '格式不正确'
                }
              ]
            })(<Input placeholder="请输入手机号" />)}
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
            })(<Input placeholder="请输入邮箱" />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const WrappedFormSet = Form.create()(Add)
export default WrappedFormSet
