import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { ExchangeStatusText } from '../../../../constants/enums'

interface RequestedExchangeProps {
  exchanges: ExchangeInfo[];
}

export default function RequestedExchange(props: RequestedExchangeProps) {
  const { exchanges = []} = props

  return (
    exchanges.length > 0 ?
      <View className="requested-exchange-list">
        <View className="list-title">
          <Text>求易货 —— 我发起的置换</Text>
        </View>
        <View className="list-wrapper">
          {
            exchanges.map(exchange => {
              const {
                title = '',
                coverUrl = '',
                price = '',
                readCount = '',
                id = '',
              } = exchange?.goods ?? {}
              const status = exchange?.status

              return (
                <View className="list-item" key={id}>
                  <Image src={coverUrl} />
                  <View className="item-content">
                    <View className="title">{title}</View>
                    <View className="info">
                      <View>
                        <View className="price">
                          <Text>{price}</Text>
                        </View>
                        <View className="view-count">
                          <Text>浏览次数：{readCount}</Text>
                        </View>
                      </View>
                      <View className="status-action">
                        <Text>{status && ExchangeStatusText[status]}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View> : null
  )
}
