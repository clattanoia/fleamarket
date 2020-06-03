import { Text, View } from '@tarojs/components'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'
import Taro, { useState } from '@tarojs/taro'
import { AtButton, AtFloatLayout, AtIcon } from 'taro-ui'
import { ProductInfoDetail } from '../../../../interfaces/detail'

import ExchangeableGoodsItem from './exhangeableGoodsItem'

import './index.scss'

type ExchangeableGoodsProps = {
  visible: boolean;
  goods: ProductInfoDetail[];
  onClose: BaseEventOrigFunction<void>;
  onConfirm: BaseEventOrigFunction<void>;
}

export default function ExchangeableGoods(props: ExchangeableGoodsProps) {
  const { goods, visible, onClose, onConfirm } = props
  const [selectedGoods, setSelectedGoods] = useState('')

  const onGoodsItemClick = (goodsId: string): void => {
    setSelectedGoods(selectedGoods === goodsId ? '' : goodsId)
  }

  return (
    <AtFloatLayout isOpened={visible} onClose={onClose}>
      <View className="exchangeable-goods">
        <View className="header">
          <View className="title">
            <Text>以货换货</Text>
          </View>
          <View className="close">
            <AtIcon value="close" size="16" onClick={onClose}></AtIcon>
          </View>
        </View>
        <View className="list">
          {
            goods &&
            goods
              .sort((goodsA, goodsB) => {
                if(goodsA.createTime && goodsB.createTime) {
                  return Date.parse(goodsA.createTime - goodsB.createTime)
                }
                return 0
              })
              .map(
                (item: ProductInfoDetail) => <ExchangeableGoodsItem
                  key={item.id}
                  data={item}
                  isSelected={selectedGoods === item.id}
                  onClick={onGoodsItemClick}
                />,
              )
          }
        </View>
        <View className="footer">
          <AtButton type="secondary" size="small" onClick={onConfirm}>
            确定
          </AtButton>
        </View>
      </View>
    </AtFloatLayout>
  )
}
