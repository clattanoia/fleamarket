import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ExchangeInfo } from '../../../../interfaces/detail'

interface ReceivedExchangeProps {
  exchanges: ExchangeInfo[];
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { exchanges = []} = props

  return (
    <View className="received-exchange">
      {exchanges.map(exchange => {
        const title = exchange?.goods?.title
        return <View>{title}</View>
      })}
    </View>
  )
}
