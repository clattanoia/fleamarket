import { Block, Text } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'
import { AtButton, AtToast, AtModal } from 'taro-ui'
import { DocumentNode } from 'graphql'
import {
  ExchangeStatus,
  ExchangeStatusText,
  ProductType,
  Status,
  ToastStatus,
} from '../../../../constants/enums'
import {
  agreeToExchangeMutation,
  rejectToExchangeMutation,
  cancelExchangeAgreementMutation,
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

type ExchangeInput = {
  exchangeId: string,
  mutation: DocumentNode,
  mutationName: string,
  status: Status,
}

type ToastOptions = {
  opened: boolean,
  text: string,
  status: undefined | ToastStatus,
}

export default function ReceivedExchange(props: ReceivedExchangeProps) {
  const {
    userId,
    exchanges = [],
    goodsStatus = Status.FOR_SALE,
    isGoodsOwner,
    refetchProductionDetails,
  } = props
  const [toastOptions, setToastOptions] = useState<ToastOptions>({
    opened: false,
    text: '',
    status: undefined,
  })
  const [modalOptions, setModalOptions] = useState({
    opened: false,
    content: '',
    exchange: {
      exchangeId: '',
      mutation: {},
      mutationName: '',
      status: Status.FOR_SALE,
    },
  })
  const disableOperations = goodsStatus !== Status.FOR_SALE

  const handleProductClick = (exchange: ExchangeInfo) => {
    const { sourceId } = exchange

    navigateWithFallback({
      url: `/pages/detail/index?id=${sourceId}&productType=${ProductType.GOODS}`,
    })
  }

  const handleOperation = (content: string, exchange: ExchangeInput) => {
    setModalOptions({
      content,
      exchange,
      opened: true,
    })
  }

  const handleCancel = () => {
    setModalOptions({
      opened: false,
      content: '',
      exchange: {
        exchangeId: '',
        mutation: {},
        mutationName: '',
        status: Status.FOR_SALE,
      },
    })
  }

  const handleConfirm = async() => {
    const { exchange: { exchangeId, mutation, mutationName, status }} = modalOptions

    if(status === Status.SALE_OUT && mutationName === 'agreeToExchange') {
      setToastOptions({
        opened: true,
        text: '当前二货已下架，不能继续进行易货！',
        status: ToastStatus.ERROR,
      })

      return handleCancel()
    }

    try {
      const { data } = await client.mutate({
        mutation: mutation,
        variables: {
          exchangeId,
          userId,
        },
      })

      if(data[mutationName]) {
        setToastOptions({
          opened: true,
          text: '操作成功',
          status: ToastStatus.SUCCESS,
        })

        await refetchProductionDetails()
      }
    } catch (error) {
      setToastOptions({
        opened: true,
        text: '操作失败，请稍后重试',
        status: ToastStatus.ERROR,
      })
    }
    handleCancel()
  }

  return exchanges.length ? (
    <ExchangeList listTitle="求易货 —— TA人发起的置换">
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
                    onClick={
                      () => handleOperation(
                        '确认要和该二货进行置换？',
                        {
                          exchangeId: exchange.id ?? '',
                          mutation: agreeToExchangeMutation,
                          mutationName: 'agreeToExchange',
                          status: exchange.goods?.status ?? Status.FOR_SALE,
                        },
                      )
                    }
                  >
                    同意
                  </AtButton>
                  <AtButton
                    size="small"
                    type="secondary"
                    disabled={disableOperations}
                    onClick={
                      () => handleOperation(
                        '确认拒绝与该二货进行置换？',
                        {
                          exchangeId: exchange.id ?? '',
                          mutation: rejectToExchangeMutation,
                          mutationName: 'rejectToExchange',
                          status: exchange.goods?.status ?? Status.FOR_SALE,
                        },
                      )
                    }
                  >
                    拒绝
                  </AtButton>
                </Block>
              ) : (
                <Block>
                  <Text>{ExchangeStatusText[status]}</Text>
                  {
                    status === ExchangeStatus.AGREED && <AtButton
                      size="small"
                      type="secondary"
                      disabled={disableOperations}
                      onClick={
                        () => handleOperation(
                          '确认取消与该二货进行置换？',
                          {
                            exchangeId: exchange.id ?? '',
                            mutation: cancelExchangeAgreementMutation,
                            mutationName: 'cancelExchangeAgreement',
                            status: exchange.goods?.status ?? Status.FOR_SALE,
                          },
                        )
                      }
                    >
                      取消
                    </AtButton>
                  }
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
        status={toastOptions.status}
        duration={1500}
        isOpened={toastOptions.opened}
        text={toastOptions.text}
        onClose={() => setToastOptions({ opened: false, text: '', status: undefined })}
      />
      <AtModal
        closeOnClickOverlay={false}
        isOpened={modalOptions.opened}
        cancelText='取消'
        confirmText='确定'
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        content={modalOptions.content}
      />
    </ExchangeList>
  ) : null
}
