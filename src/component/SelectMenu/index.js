import React from 'react'
import { Select } from 'antd'
import './style.less'

const Option = Select.Option
export default class SelectMenu extends React.Component {
  // 切换时的回调
  change = e => {
    this.props.change && this.props.change(e)
  }

  render() {
    const { data, defaultValue, style, className } = this.props
    if (!Array.isArray(data)) return null
    return (
      <Select
        showSearch
        style={style || { width: 210 }}
        className={className}
        value={defaultValue}
        optionFilterProp="children"
        onChange={value => this.change(value)}
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {data.map((item, i) => (
          <Option key={i} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    )
  }
}
