import Taro, { memo, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtImagePicker }  from 'taro-ui'

import './index.scss'

interface InProps {
  onSetVal: (key,value) => void
}

function PublishImages(props: InProps) {

  const [files,setFiles] = useState([])

  const onChange = (files) => {
    // console.log(files)
    // const len = files.length
    // FileSystemManager.readfile()
    // const imgUrl = files[len-1].url
    setFiles(files)
    props.onSetVal('imgUrls',files)

  }
  const onFail = (mes) => {
    // console.log(mes)
    throw(mes)
  }
  const onImageClick = (index, file) => {
    // const {qiniuToken} = props
    // console.log(qiniuToken)
    // console.log(index, file)
    throw({index,file})
    // Taro.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success (res) {
    //     // tempFilePath可以作为img标签的src属性显示图片
    //     const tempFilePaths = res.tempFilePaths
    //     console.log(res)
    //     console.log(tempFilePaths)
    //   }
    // })
    //   Taro.uploadFile({
    //     url: 'http://q67pnvkzx.bkt.clouddn.com',
    //     name: 'file.jpg',
    //     filePath: file.url,
    //     header: {
    //       "Content-Type": "multipart/form-data"
    //     },
    //    formData: {
    //      token: qiniuToken,
    //    },
    //    success: function(res) {
    //      let data = JSON.parse(res.data)

  //      console.log('qiniu');
  //      console.log(res);
  //      console.log(data);
  //      // to do ...
  //    },
  //    fail: function(res) {
  //      console.log(res)
  //    }
  //  });
  }

  return (
    <View className="publish_images">
      <AtImagePicker
        multiple={false}
        showAddBtn={files.length<10}
        length={4}
        count={10}
        files={files}
        onChange={onChange}
        onFail={onFail}
        onImageClick={onImageClick}
      />
    </View>
  )

}


export default memo(PublishImages)
