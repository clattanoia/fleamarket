import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

function DetailPreload() {
  return (
    <View className="detail-preload">
      <View className="avatar-preload__container">
        <View className="avatar"></View>
        <View className="process-bar process-animation avatar-preload"></View>
      </View>
      <View className="price-preload__container">
        <View className="process-bar process-animation price-preload"></View>
      </View>
      <View className="description-preload__container">
        <View className="process-bar process-animation description-preload"></View>
        <View className="process-bar process-animation description-preload"></View>
        <View className="process-bar process-animation description-preload"></View>
        <View className="process-bar process-animation description-preload"></View>
      </View>
    </View>
  )
}

export default memo(DetailPreload)
