import { View } from '@tarojs/components'
import Taro, { useEffect, useState } from '@tarojs/taro'
import client from '../../../../graphql-client'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { receivedExchangesQuery } from '../../../../query/detail'

interface ReceivedExchangeProps {
  goodsId: string;
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { goodsId } = props
  const [exchanges, setExchanges] = useState<ExchangeInfo[]>([])

  useEffect(() => {
    if(!goodsId) return
    client
      .query<{
      receivedExchanges: ExchangeInfo[];
    }>({
      query: receivedExchangesQuery,
      variables: { targetId: goodsId },
    })
      .then(({ data }) => {
        const { receivedExchanges = []} = data
        setExchanges(receivedExchanges)
      })
  }, [goodsId])

  return (
    <View className="received-exchange">
      {exchanges.map(exchange => {
        const title = exchange?.goods?.title
        return <View>{title}</View>
      })}
    </View>
  )
}
