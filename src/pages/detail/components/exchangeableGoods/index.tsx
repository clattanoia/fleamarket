import { Text, View } from '@tarojs/components'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'
import Taro from '@tarojs/taro'
import { AtButton, AtFloatLayout } from 'taro-ui'
import { ProductInfoDetail } from '../../../../interfaces/detail'
import './index.scss'

type ExchangeableGoodsProps = {
  visible: boolean;
  goods: ProductInfoDetail[];
  onClose: BaseEventOrigFunction<void>;
}

export default function ExchangeableGoods(props: ExchangeableGoodsProps) {
  const { visible, onClose } = props
  return (
    <AtFloatLayout isOpened={visible} onClose={onClose}>
      <View className="exchangeable-goods">
        <View className="title">
          <Text></Text>
        </View>
        <View className="list"></View>
        <View className="btn">
          <AtButton type="primary" size="small" onClick={onClose}>
            关闭
          </AtButton>
        </View>
      </View>
    </AtFloatLayout>
  )
}
