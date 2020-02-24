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
    setFiles(files)
    props.onSetVal('img',files)
  }
  const onFail = (mes) => {
    // console.log(mes)
    throw(mes)
  }
  const onImageClick = (index, file) => {
    // console.log(index, file)
    throw({index,file})
  }

  return (
    <View className="publish_images">
      <AtImagePicker
        files={files}
        onChange={onChange}
        onFail={onFail}
        onImageClick={onImageClick}
      />
    </View>
  )

}


export default memo(PublishImages)
