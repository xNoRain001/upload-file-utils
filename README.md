## 介绍

上传文件的工具库，支持切片上传和断点续传。

## 下载

### npm

```
npm i upload-file-utils
```

### src

```html
<script src="../dist/upload-file-utils.js"></script>
```

## 使用

```javascript
// import Uploader from 'upload-file-utils'

const uploader = new Uploader()
```

## APIs

### formData

```javascript
/**
 * 以 FormData 形式上传文件或图片
 * 
 * @param {Object} options - 配置项
 * @param {FileList} options.files - input表单中选中的文件
 * @param {string} options.url - 要上传到的服务器地址
 * @param {(string|number)} options.sucStatus - 服务器返回的上传成功状态码
 * @param {boolean} [options.isGenHash=false] - 是否根据文件内容生成唯一的
 *  hash，用于文件去重，默认值为 false，使用本身的文件名。
 * @param {Function} [options.beforeStart=noop] - 开始上传前的钩子
 * @param {Function} [options.onProgress=noop] - 上传中的钩子，接收 loaded 和
 *  total 两个参数，loaded 表示已上传的大小，total 表示文件的总大小。
 * @param {Function} [options.finished=noop] - 上传成功的钩子
 * @param {Function} [options.failed=noop] - 上传失败的钩子
 * @param {Function} [options.finally=noop] - 上传结束的钩子，成功或失败都会执行。
 */
this.$refs.uploadFileBtn.addEventListener('click', () => {
  const files = this.$refs.fileInp.files
  
  uploader.formData({
    url: 'http://127.0.0.1:3000/upload-fiel',
    sucStatus: 200,
    isGenHash: true,
    files,
    beforeStart () {

      // do something...
      console.log('beforeStart')
    },
    onProgress (loaded, total) {

      // do something...
      console.log('onProgress', loaded, total)
    },
    finished (value) {

      // do something...
      console.log('finished', value)
    },
    failed (reason) {

      // do something...
      console.log('failed', reason)
    },
    finally () {

      // do something...
      console.log('finally')
    },
  })
})
```

### base64

```javascript
/**
 * 以 base64 格式上传图片，只需选择图片即可，内部会帮你转为 base64 格式。
 * 
 * @param {Object} options - 配置项
 * @param {FileList} options.files - input表单中选中的文件
 * @param {string} options.url - 要上传到的服务器地址
 * @param {(string|number)} options.sucStatus - 服务器返回的上传成功状态码
 * @param {boolean} [options.isGenHash=false] - 是否根据文件内容生成唯一的
 *  hash，用于文件去重，默认值为 false，使用本身的文件名。
 * @param {Function} [options.beforeStart=noop] - 开始上传前的钩子
 * @param {Function} [options.onProgress=noop] - 上传中的钩子，接收 loaded 和
 *  total 两个参数，loaded 表示已上传的大小，total 表示文件的总大小。
 * @param {Function} [options.finished=noop] - 上传成功的钩子
 * @param {Function} [options.failed=noop] - 上传失败的钩子
 * @param {Function} [options.finally=noop] - 上传结束的钩子，成功或失败都会执行。
 */
this.$refs.uploadFileBtn.addEventListener('click', () => {
  const files = this.$refs.fileInp.files
  
  uploader.base64(/* options */)
})
```

### slice

```javascript
/**
 * 切片上传和断点续传。
 * 切片上传：每个切片将被命名为 哈希值_递增的索引.后缀 的形式，如：
 * f41c5454c30ea37b8dcab8af6698872d_1.webp，服务器根据 hash 值创建临时目录保存切
 * 片，当所有切片上传完成时会向 mergeAPI 发 POST 请求，载荷中携带 hash 值和应有的切
 * 片数量 count，服务器通过临时目录下的文件数量判断有无遗漏，无遗漏则合并所有切片并删
 * 除临时目录。
 * 断点续传：上传文件前向 uploadedAPI 发请求获取已经上传的切片名称，保存在数组中，如：
 * [
 *   'f41c5454c30ea37b8dcab8af6698872d_1.webp',  
 *   'f41c5454c30ea37b8dcab8af6698872d_2.webp'
 * ]，那么本地生成的第一个和第二个切片将不会上传，从第三个切片开始上传。
 * 
 * @param {Object} options - 配置项
 * @param {string} options.url - 要上传到的服务器地址
 * @param {FileList} options.files - input表单中选中的文件
 * @param {(string|number)} options.sucStatus - 服务器返回的表示上传成功状态码
 * @param {string} options.uploadedAPI - 获取已经上传的切片的 API
 * @param {string} options.name - uploadedAPI 返回的保存着已经上传成功的切片集合的
 *  数组名。
 * @param {string} options.mergeAPI - 通知服务器合并切片的 API
 * @param {number} [options.sliceSize=10 * 1024 * 1024] - 每个切片的大小，默认为
 *  10MB
 * @param {number} [options.sliceLimit=100] - 允许的最大切片数量，默认为 100 个，
 *  如果文件按 sliceSize 切割后生成的切片数量大于 sliceLimit，将调整 sliceSize，从
 *  而保证切片数量不会超过 sliceLimit。
 * @param {Function} [options.beforeStart=noop] - 开始上传前的钩子
 * @param {Function} [options.onProgress=noop] - 上传中的钩子，接收 loaded 和
 *  total 两个参数，loaded 表示已上传的大小，total 表示文件的总大小。
 * @param {Function} [options.finished=noop] - 上传成功的钩子
 * @param {Function} [options.failed=noop] - 上传失败的钩子
 * @param {Function} [options.finally=noop] - 上传结束的钩子，成功或失败都会执行。
 */
this.$refs.uploadFileBtn.addEventListener('click', () => {
  const files = this.$refs.fileInp.files
  
  uploader.slice({
    url: 'http://127.0.0.1:3000/upload-file',
    files,
    sucStatus: 200,
    uploadedAPI: 'http://127.0.0.1:3000/upload-uploaded',
    name: 'fileList',
    mergeAPI: 'http://127.0.0.1:3000/upload-merge',
    sliceSize: 1 * 1024,
    sliceLimit: 10,
    beforeStart () {

      // do something...
      console.log('beforeStart')
    },
    onProgress (loaded, total) {

      // do something...
      console.log('onProgress', loaded, total)
    },
    finished (value) {

      // do something...
      console.log('finished', value)
    },
    failed (reason) {

      // do something...
      console.log('failed', reason)
    },
    finally () {

      // do something...
      console.log('finally')
    },
  })
})
```
