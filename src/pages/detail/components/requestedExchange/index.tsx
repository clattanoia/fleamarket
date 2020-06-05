import Taro, { useState } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtModal, AtToast, AtButton } from 'taro-ui'
import { AtToastProps } from 'taro-ui/@types/toast'
import { ExchangeInfo } from '../../../../interfaces/detail'
import { ExchangeStatusText, ProductType, ExchangeStatus, Status } from '../../../../constants/enums'
import { navigateWithFallback } from '../../../../utils/helper'
import ExchangeListItem from '../exchangeList/exchangeListItem'
import ExchangeList from '../exchangeList'
import client from '../../../../graphql-client'
import { cancelExchangeAgreementMutation, deleteExchangeMutation } from '../../../../query/detail'

const TOAST_INFO: Record<string, Partial<AtToastProps>> = {
  SUCCESS: {
    text: '操作成功',
    status: 'success',
  },
  ERROR: {
    text: '操作失败，请稍后重试',
    status: 'error',
  },
}

const MODEL_TEXT = {
  [ExchangeStatus.AGREED]: '确认取消与该二货的置换？',
  [ExchangeStatus.APPLIED]: '确认取消与该二货的置换？取消后，该二货将从列表移除！',
}


interface RequestedExchangeProps {
  onRefresh: () => {};
  productStatus: Status | undefined;
  exchanges: ExchangeInfo[];
}

export default function RequestedExchange(props: RequestedExchangeProps) {
  const { exchanges = [], onRefresh, productStatus } = props
  const [ modalText, setModalText ] = useState('')
  const [ toastInfo, setToastInfo ] = useState<Partial<AtToastProps>>()
  const [ isToastOpened, setToastOpened ] = useState(false)
  const [ actionExchange, setActionExchange ] = useState<ExchangeInfo>()
  const [ isModelOpened, setModelOpened ] = useState(false)

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { targetId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${targetId}&productType=${ProductType.GOODS}`,
    })
  }

  const handleCancelClick = (exchange: ExchangeInfo) => {
    const { status = '' } = exchange
    setActionExchange(exchange)
    setModalText(MODEL_TEXT[status])
    setModelOpened(true)
  }

  const handleModelCancel = () => {
    setActionExchange(undefined)
    setModelOpened(false)
  }

  const handleModelConfirm = async() => {
    setModelOpened(false)
    try {
      if(!actionExchange) throw new Error()

      const { id, status } = actionExchange

      if(status === ExchangeStatus.AGREED) {
        await client.mutate({
          mutation: cancelExchangeAgreementMutation,
          variables: { exchangeId: id },
        })
      } else if(status === ExchangeStatus.APPLIED) {
        await client.mutate({
          mutation: deleteExchangeMutation,
          variables: { exchangeId: id },
        })
      } else {
        throw new Error()
      }

      setToastInfo(TOAST_INFO.SUCCESS)
      setToastOpened(true)
      onRefresh && onRefresh()
    } catch (e) {
      setToastInfo(TOAST_INFO.ERROR)
      setToastOpened(true)
    }
  }

  return (
    exchanges.length > 0 ? (
      <View>
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
                  (status === ExchangeStatus.AGREED || status === ExchangeStatus.APPLIED) &&
                  <AtButton
                    size="small"
                    type="secondary"
                    onClick={() => handleCancelClick(exchange)}
                    disabled={productStatus === Status.SALE_OUT}
                  >取消</AtButton>
                }
              </ExchangeListItem>
            )
          })}
        </ExchangeList>
        <AtModal
          isOpened={isModelOpened}
          title='提示'
          cancelText='取消'
          confirmText='确认'
          content={modalText}
          onClose={handleModelCancel}
          onCancel={handleModelCancel}
          onConfirm={handleModelConfirm}
        />
        <AtToast
          hasMask
          isOpened={isToastOpened}
          onClose={() => setToastOpened(false)}
          status={toastInfo?.status}
          text={toastInfo?.text}
        />
      </View>
    ) : null
  )
}
