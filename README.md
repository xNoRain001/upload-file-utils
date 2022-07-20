## 介绍

上传文件的工具库。

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
 * @param {boolean} [options.generateHash=false] - 是否根据文件内容生成唯一的
 *  hash，用于文件去重，默认值为 false，使用本身的文件名。
 * @param {Function} options.beforeStart - 开始上传前的钩子
 * @param {Function} options.onProgress - 上传中的钩子，接收 loaded 和 total 两个
 *  参数，loaded 表示已上传的大小，total 表示文件的总大小。
 * @param {Function} options.finished - 上传成功的钩子
 * @param {Function} options.failed - 上传失败的钩子
 * @param {Function} options.finally - 上传结束的钩子，无论成功或失败都会执行。
 */
const uploader = new Uploader()

this.$refs.uploadFileBtn.addEventListener('change', (e) => {
  uploader.formData({
    url: 'http://127.0.0.1:3000/upload-file',
    sucStatus: 200,
    files: e.target.files,
    beforeStart () {
      console.log('beforeStart')
    },
    onProgress (loaded, total) {
      console.log('onProgress', loaded, total)
    },
    finished (value) {
      console.log('finished', value)
    },
    failed (reason) {
      console.log('failed', reason)
    },
    finally () {
      console.log('finally')
    },
  })
})
```

### base64

```javascript
/**
 * 以 base64 格式上传图片，只需选择图片即可，内部会帮你转为 base64 格式，配置项和
 * formData 一致，
 */
const uploader = new Uploader()

this.$refs.uploadImgBtn.addEventListener('change', (e) => {
  uploader.base64(/* options */)
})
```
