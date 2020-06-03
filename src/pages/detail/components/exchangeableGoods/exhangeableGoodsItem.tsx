import Taro from '@tarojs/taro'
import { Text, View, Image } from '@tarojs/components'
import { ProductInfoDetail } from '../../../../interfaces/detail'

import './exchangeableGoodsItem.scss'

interface Props {
  data: ProductInfoDetail;
  onClick: Function;
}

export default function ExchangeableGoodsItem({ data, onClick }: Props) {
  const imageStyle = 'width: 110px; height: 110px; border: 1px solid #eeeeee; border-radius: 6px;'

  return (
    <View 
      className='item-container'
      onClick={() => onClick(data.id)}
    >
      <View className='left-content'>
        <Image
          style={imageStyle}
          src={data.coverUrl as string}
        />
      </View>
      <View className='right-content'>
        <View className='title'>
          {data.title}
        </View>
        <View>
          <View className='price'>
            <Text>{data.price}</Text>
          </View>
          <View className='read-count'>
            <Text>浏览次数：{data.readCount}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
