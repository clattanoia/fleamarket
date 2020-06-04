import { Block, Button, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  ExchangeStatus,
  ExchangeStatusText,
  ProductType,
  Status,
} from '../../../../constants/enums'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeList from '../exchangeList'
import ExchangeListItem from '../exchangeList/exchangeListItem'

interface ReceivedExchangeProps {
  exchanges: ExchangeInfo[];
  isGoodsOwner: boolean;
  goodsStatus?: Status;
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { exchanges = [], isGoodsOwner, goodsStatus = Status.FOR_SALE } = props
  const disableOperations = goodsStatus !== Status.FOR_SALE

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
            key={exchange.id}
            exchange={exchange}
            productClick={handleProductClick}
            key={exchange.id}
          >
            {isGoodsOwner ? (
              status === ExchangeStatus.APPLIED ? (
                <Block>
                  <Button disabled={disableOperations}>同意</Button>
                  <Button disabled={disableOperations}>拒绝</Button>
                </Block>
              ) : (
                <Block>
                  <Text>{ExchangeStatusText[status]}</Text>
                  <Button disabled={disableOperations}>取消</Button>
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
