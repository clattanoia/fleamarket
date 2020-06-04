import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface ExchangeListProps {
  listTitle: string;
  children?: any;
}

export default function ExchangeList(props: ExchangeListProps) {
  const { listTitle, children } = props

  return (
    <View className="exchange-list">
      <View className="list-title">
        <Text>{listTitle}</Text>
      </View>
      <View className="list-wrapper">{children}</View>
    </View>
  )
}
