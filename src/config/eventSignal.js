import Signal from 'signals'

const eventObject = {
  accountEvent: new Signal(), // 时间段
  webSocketEvent: new Signal(),
  clearSetInternal: new Signal(),
}
export default eventObject
