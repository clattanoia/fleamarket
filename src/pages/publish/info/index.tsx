// import Taro, { Component } from '@tarojs/taro'
import Taro, { memo, useState } from '@tarojs/taro'
import { View ,Text} from '@tarojs/components'
import { AtInput,AtTextarea }  from 'taro-ui'

import './index.scss'

interface InProps {
  setVal: (key,value) => void
}

function PublishInfo(props: InProps) {

  const [title,setTitle] = useState('')
  const [price,setPrice] = useState('')
  const [detail,setDetail] = useState('')

  const handleChangeTitle = (value) => {
    setTitle(value)
    props.setVal('title',value)
    return value
  }

  const handleChangePrice = (value) => {
    setPrice(value)
    props.setVal('price',value)
    return value
  }

  const handleChangeDetail = (event) => {
    const value = event.target.value
    setDetail(value)
    props.setVal('detail',value)
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
            type='number'
            placeholder='请输入期望价格'
            value={price}
            onChange={handleChangePrice}
          />
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
