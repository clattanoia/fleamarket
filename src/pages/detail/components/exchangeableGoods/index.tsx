import { Text, View, ScrollView } from '@tarojs/components'
import Taro, { useState, useEffect } from '@tarojs/taro'
import { AtButton, AtFloatLayout } from 'taro-ui'
import { ProductInfoDetail } from '../../../../interfaces/detail'

import ExchangeableGoodsItem from './exhangeableGoodsItem'

import './index.scss'

type ExchangeableGoodsProps = {
  visible: boolean;
  goods: ProductInfoDetail[];
  onConfirm: (id: string) => void;
}

export default function ExchangeableGoods(props: ExchangeableGoodsProps) {
  const { goods, visible, onConfirm } = props
  const [selectedGoods, setSelectedGoods] = useState('')

  const onGoodsItemClick = (goodsId: string): void => {
    setSelectedGoods(selectedGoods === goodsId ? '' : goodsId)
  }

  useEffect(() => {
    if(visible === true) {
      setSelectedGoods('')
    }
  }, [visible])

  return (
    <AtFloatLayout isOpened={visible}>
      <View className="exchangeable-goods">
        <View className="header">
          <View className="title">
            <Text>以货换货</Text>
          </View>
        </View>
        <ScrollView className="list" scrollY>
          {
            goods &&
            goods.map(
              (item: ProductInfoDetail) => <ExchangeableGoodsItem
                key={item.id}
                data={item}
                isSelected={selectedGoods === item.id}
                onClick={onGoodsItemClick}
              />,
            )
          }
        </ScrollView>
        <View className="footer">
          <AtButton
            disabled={!selectedGoods}
            type="secondary"
            size="normal"
            onClick={() => onConfirm(selectedGoods)}
          >
            确定
          </AtButton>
        </View>
      </View>
    </AtFloatLayout>
  )
}
