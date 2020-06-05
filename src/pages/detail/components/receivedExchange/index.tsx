import { Block, Text } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'
import { AtButton, AtToast } from 'taro-ui'
import { DocumentNode } from 'graphql'
import {
  ExchangeStatus,
  ExchangeStatusText,
  ProductType,
  Status,
} from '../../../../constants/enums'
import {
  agreeToExchangeMutation,
  rejectToExchangeMutation,
} from '../../../../query/detail'
import client from '../../../../graphql-client'
import { ExchangeInfo, ProductInfoDetail } from '../../../../interfaces/detail'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeList from '../exchangeList'
import ExchangeListItem from '../exchangeList/exchangeListItem'

interface ReceivedExchangeProps {
  userId: string;
  exchanges: ExchangeInfo[];
  isGoodsOwner: boolean;
  refetchProductionDetails: () => Promise<ProductInfoDetail>;
  goodsStatus?: Status;
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const { userId, exchanges = [], goodsStatus = Status.FOR_SALE,  isGoodsOwner, refetchProductionDetails } = props
  const [toastOptions, setToastOptions] = useState({
    opened: false,
    text: '',
  })
  const disableOperations = goodsStatus !== Status.FOR_SALE

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { sourceId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${sourceId}&productType=${ProductType.GOODS}`,
    })
  }

  const handleOperation = async(id: string, mutation: DocumentNode, mutationName: string) => {
    try {
      const { data } = await client.mutate({
        mutation: mutation,
        variables: {
          id,
          userId,
        },
      })

      if(data[mutationName]) {
        setToastOptions({
          opened: true,
          text: '操作成功',
        })

        await refetchProductionDetails()
      }
    } catch (error) {
      setToastOptions({
        opened: true,
        text: '操作失败，请稍后重试',
      })
    }
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
          >
            {isGoodsOwner ? (
              status === ExchangeStatus.APPLIED ? (
                <Block>
                  <AtButton
                    size="small"
                    type="primary"
                    disabled={disableOperations}
                    onClick={() => handleOperation(exchange.id ?? '', agreeToExchangeMutation, 'agreeToExchange')}
                  >
                    同意
                  </AtButton>
                  <AtButton
                    size="small"
                    type="secondary"
                    disabled={disableOperations}
                    onClick={() => handleOperation(exchange.id ?? '', rejectToExchangeMutation, 'rejectToExchange')}
                  >
                    拒绝
                  </AtButton>
                </Block>
              ) : (
                <Block>
                  <Text>{ExchangeStatusText[status]}</Text>
                  <AtButton
                    size="small"
                    type="secondary"
                    disabled={disableOperations}
                  >
                    取消
                  </AtButton>
                </Block>
              )
            ) : (
              <Text>{ExchangeStatusText[status]}</Text>
            )}
          </ExchangeListItem>
        )
      })}
      <AtToast
        hasMask
        duration={2000}
        isOpened={toastOptions.opened}
        text={toastOptions.text}
        onClose={() => setToastOptions({ opened: false, text: '' })}
      />
    </ExchangeList>
  ) : null
}
