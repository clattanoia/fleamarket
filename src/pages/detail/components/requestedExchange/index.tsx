import Taro from '@tarojs/taro'
import { Text, Button } from '@tarojs/components'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { ExchangeStatusText, ProductType, ExchangeStatus } from '../../../../constants/enums'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeListItem from '../exchangeList/exchangeListItem'
import ExchangeList from '../exchangeList'

interface RequestedExchangeProps {
  exchanges: ExchangeInfo[];
}

export default function RequestedExchange(props: RequestedExchangeProps) {
  const { exchanges = []} = props

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { targetId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${targetId}&productType=${ProductType.GOODS}`,
    })
  }

  return (
    exchanges.length > 0 ? (
      <ExchangeList listTitle="求易货 —— 我发起的置换">
        {exchanges.map(exchange => {
          const status = exchange.status ?? ''

          return (
            <ExchangeListItem
              exchange={exchange}
              productClick={handleProductClick}
              key={exchange.id}
            >
              <Text>{ExchangeStatusText[status]}</Text>
              {
                status === ExchangeStatus.AGREED && <Button>取消</Button>
              }
              {
                status === ExchangeStatus.APPLIED && <Button>取消</Button>
              }
            </ExchangeListItem>
          )
        })}
      </ExchangeList>
    ) : null
  )
}
