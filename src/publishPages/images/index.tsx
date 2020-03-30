import Taro, { memo, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtImagePicker }  from 'taro-ui'

import './index.scss'
import { MaxImageCount, MaxImageSize, ImageSuffix, ImageMaxWidthHeight } from '../../constants/publish'

interface InProps {
  onSetVal: (key, value) => void
  showErrorMessage: (name) => void
  imagesUrls: Array<Publish.InPickerImageFiles>
}


function PublishImages(props: InProps) {

  const [files, setFiles] = useState(props.imagesUrls || [])

  Taro.useEffect(() => {
    setFiles(props.imagesUrls)
  }, [props.imagesUrls])

  const showImgError = () => {
    props.showErrorMessage('images')
  }

  const getImgWidthHeight = async(url) => {
    const isWHRight = await new Promise((resolve) => {
      Taro.getImageInfo({
        src: url,
        success: (res) => {
          const { width, height } = res
          if(width>=ImageMaxWidthHeight || height >= ImageMaxWidthHeight){
            return resolve(false)
          }
          return resolve(true)
        },
      })
    })
    return isWHRight
  }

  const validImage = (files) => {
    const validFiles = files.filter((item) => {
      const { file, url, qiniuUrl, isWHRight } = item
      if(qiniuUrl) return true
      const { size } = file
      const isOversize = size > MaxImageSize
      const urlArr = url.split('.')
      const suffix = urlArr[urlArr.length-1].toLowerCase()
      const isRightType = ImageSuffix.includes(suffix)
      return !isOversize && isRightType && isWHRight
    })

    if(validFiles.length<files.length){
      showImgError()
    }
    return validFiles
  }

  const setImageWH = (files) => {
    return files.map((item) => {
      return new Promise(async(resolve, reject) => {
        const { file, qiniuUrl } = item
        if(qiniuUrl) return resolve(item)
        const { path } = file
        try {
          const isWHRight = await getImgWidthHeight(path)
          item.isWHRight = isWHRight
          return resolve(item)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  const validAllImage = async(files) => {
    const data = await Promise.all(setImageWH(files)).then((res) => {
      return Promise.resolve(res)
    }, (e) => Promise.reject(e || 'valid error'))

    const validFiles = validImage(data)

    return validFiles
  }

  const onChange = async(files, operationType) => {
    let currentFiles = operationType === 'add' ? (await validAllImage(files)) : files
    if(currentFiles.length > MaxImageCount){
      showImgError()
      currentFiles = files.slice(0, 10)
    }
    setFiles(currentFiles)
    props.onSetVal('imagesUrls', currentFiles)
  }
  const onFail = (mes) => {
    throw (mes)
  }

  return (
    <View className="publish_images">
      <AtImagePicker
        showAddBtn={files.length<10}
        length={4}
        count={MaxImageCount - files.length}
        files={files}
        onChange={onChange}
        onFail={onFail}
      />
    </View>
  )

}


export default memo(PublishImages)
