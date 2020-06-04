import { Block, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  ExchangeStatus,
  ExchangeStatusText,
  ProductType,
} from '../../../../constants/enums'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeList from '../exchangeList'
import ExchangeListItem from '../exchangeList/exchangeListItem'

interface ReceivedExchangeProps {
  exchanges: ExchangeInfo[];
  isGoodsOwner: boolean;
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { exchanges = [], isGoodsOwner } = props

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { sourceId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${sourceId}&productType=${ProductType.GOODS}`,
    })
  }

  return exchanges.length ? (
    <ExchangeList listTitle="求易货 —— TA发起的置换">
      {exchanges.map(exchange => {
        const status = exchange.status ?? ''

        return (
          <ExchangeListItem
            exchange={exchange}
            productClick={handleProductClick}
          >
            {isGoodsOwner ? (
              status === ExchangeStatus.APPLIED ? (
                <Block>
                  <Button>同意</Button>
                  <Button>拒绝</Button>
                </Block>
              ) : (
                <Block>
                  <Text>{ExchangeStatusText[status]}</Text>
                  <Button>取消</Button>
                </Block>
              )
            ) : (
              <Text>{ExchangeStatusText[status]}</Text>
            )}
          </ExchangeListItem>
        )
      })}
    </ExchangeList>
  ) : null
}
