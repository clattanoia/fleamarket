import Taro, { memo, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtImagePicker }  from 'taro-ui'
import client from '../../../graphql-client'
import {userInfoQuery} from '../../../query/login'

import './index.scss'

interface InProps {
  onSetVal: (key,value) => void
}

function PublishImages(props: InProps) {

  const [files,setFiles] = useState([])

  const getUser = () => {
    client.query({query:userInfoQuery, variables: {id:'16cef194-266c-4920-9348-993d5c3a8771'}})
  }

  getUser()

  const onChange = (files) => {
    // console.log(files)
    const len = files.length
    // FileSystemManager.readfile()
    Taro.getImageInfo({
      src: files[len-1].url,
      success: function () {
        // console.log(res)
      }
    })
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
        multiple={false}
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
