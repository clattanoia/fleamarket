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
    setFiles(files)
    props.onSetVal('imgUrls',files)
  }
  const onFail = (mes) => {
    throw(mes)
  }

  return (
    <View className="publish_images">
      <AtImagePicker
        showAddBtn={files.length<10}
        length={4}
        count={9}
        files={files}
        onChange={onChange}
        onFail={onFail}
      />
    </View>
  )

}


export default memo(PublishImages)
