/* eslint-disable import/prefer-default-export */
import { Modal } from 'antd'

export const showConfirm = (
  confirmCallback,
  content,
  title,
  size,
  cancelCallback
) => {
  const ref = Modal.confirm({
    content: content || '',
    title: title || '',
    width: size || 824,
    iconType: '',
    closable: true,
    maskClosable: false,
    onOk: confirmCallback,
    okText: '确认',
    cancelText: '取消',
    destroyOnClose: true,
    onCancel: cancelCallback,
    className: 'dialog-car'
  })
  return ref
}
