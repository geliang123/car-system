const path = require('path')
const glob = require('glob')

const getEntrys = () => {
  let ContainerName = process.argv[6]

  // 获取container下的所有文件目录
  let globPath = 'src/container/*/index.js'
  let files = !ContainerName
    ? glob.sync(globPath)
    : [`src/container/${ContainerName.replace('--', '')}/index.js`]
  let containers = []
  for (let i = 0; i < files.length; i++) {
    const direname = path.dirname(files[i])
    containers.push(direname.replace('src/container/', ''))
  }
  return containers
}

module.exports = getEntrys
