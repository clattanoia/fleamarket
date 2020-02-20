import Taro, { memo, useState } from '@tarojs/taro'
import { View ,Text} from '@tarojs/components'
import { AtInput,AtTextarea }  from 'taro-ui'

import './index.scss'

interface InProps {
  onSetVal: (key,value) => void
}

function PublishInfo(props: InProps) {

  const [title,setTitle] = useState('')
  const [price,setPrice] = useState('')
  const [detail,setDetail] = useState('')

  const handleChangeTitle = (value) => {
    setTitle(value)
    props.onSetVal('title',value)
    return value
  }

  const validPrice = (val) => {
    const reg = /[^\d.]/g
    const numVal = val.replace(reg,'')
    const numValArr = numVal.split('.')
    const isFloat = numValArr.length > 1
    const intergeNum = numValArr[0]
    let intergeStr = ''
    if(intergeNum.substr(0,1) === '0' && intergeNum.length > 1 ){
      intergeStr = intergeNum.substr(1,10)
    } else {
      intergeStr = intergeNum.toString().substr(0,9)
    }
    if(!isFloat){
      return intergeStr
    }
    const floatNum = numValArr[1].substr(0,2)
    return `${intergeStr}.${floatNum}`
  }

  const handleChangePrice = (value) => {
    const realVal = validPrice(value)
    setPrice(realVal)
    props.onSetVal('price',realVal)
    return realVal
  }

  const handleChangeDetail = (event) => {
    const value = event.target.value
    setDetail(value)
    props.onSetVal('detail',value)
  }

  return (
    <View className="publish_info">
      <View className='form_line'>
        <Text className='form_line_label'>*</Text>
        <View className='form_line_content'>
          <AtInput
            name='title'
            title=''
            type='text'
            placeholder='请输入标题'
            value={title}
            onChange={handleChangeTitle}
            maxLength={100}
          />
        </View>
      </View>
      <View className='form_line'>
        <Text className='form_line_label'>*</Text>
        <View className='form_line_content'>
          <AtInput
            name='price'
            title=''
            type='text'
            placeholder='请输入期望价格'
            value={price}
            onChange={handleChangePrice}
          >
            <Text>￥</Text>
          </AtInput>
        </View>
      </View>
      <View className='form_line'>
        <Text className='form_line_label'>*</Text>
        <View className='form_line_content'>
          <AtTextarea
            value={detail}
            onChange={handleChangeDetail}
            maxLength={500}
            placeholder='请输入详情'
            height={260}
          />
        </View>
      </View>
    </View>
  )

}


export default memo(PublishInfo)
