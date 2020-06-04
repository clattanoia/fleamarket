import { Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { ExchangeStatusText, ProductType } from '../../../../constants/enums'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeList from '../exchangeList'
import ExchangeListItem from '../exchangeList/exchangeListItem'

interface ReceivedExchangeProps {
  exchanges: ExchangeInfo[];
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { exchanges = []} = props

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { sourceId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${sourceId}&productType=${ProductType.GOODS}`,
    })
  }

  return exchanges.length ? (
    <ExchangeList listTitle="求易货 —— TA发起的置换">
      {exchanges.map(exchange => {
        const status = exchange?.status

        return (
          <ExchangeListItem
            exchange={exchange}
            productClick={handleProductClick}
          >
            <Text>{status && ExchangeStatusText[status]}</Text>
          </ExchangeListItem>
        )
      })}
    </ExchangeList>
  ) : null
}
