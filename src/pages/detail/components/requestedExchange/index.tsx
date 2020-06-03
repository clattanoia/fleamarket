import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

export default function RequestedExchange() {
  return (
    <View className="requested-exchange-list">
      <View className="list-title">
        <Text>求易货 —— 我发起的置换</Text>
      </View>
      <View className="list-wrapper">
        <View className="list-item">
          <Image src="" />
          <View className="item-content">
            <View className="title">标题</View>
            <View className="info">
              <View>
                <View className="price">
                  <Text>888</Text>
                </View>
                <View className="view-count">
                  <Text>浏览次数：9999</Text>
                </View>
              </View>
              <View className="status-action">
                <Text>候选中</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
