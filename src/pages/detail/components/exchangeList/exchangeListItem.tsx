import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import cls from 'classnames'
import { ITouchEvent } from '@tarojs/components/types/common'
import { Status } from '../../../../constants/enums'
import { ExchangeInfo } from '../../../../interfaces/detail'
import './index.scss'

interface ExchangeListItemProps {
  exchange: ExchangeInfo;
  children?: any;
  productClick?(exchange: ExchangeInfo): void;
}

export default function ExchangeListItem(props: ExchangeListItemProps) {
  const { exchange, children, productClick } = props
  const {
    title = '',
    coverUrl = '',
    price = '',
    readCount = '',
    id = '',
    status = '',
  } = exchange?.goods ?? {}

  const handleProductClick = (exchange: ExchangeInfo) => {
    productClick && productClick(exchange)
  }

  const stopPropagation = (event: ITouchEvent) => {
    event.stopPropagation()
  }

  return (
    <View className="exchange-list-item" key={id} onClick={() => handleProductClick(exchange)} >
      <Image src={coverUrl} />
      <View className="item-content">
        <View className='title-wrapper' >
          <View
            className={cls('title', {
              'disabled-title': status !== Status.FOR_SALE,
            })}
          >
            {title}
          </View>
        </View>
        <View className="info">
          <View>
            <View className="price-btn-container">
              <View className="price">
                <Text>{price}</Text>
              </View>
              <View className="status-action" onClick={stopPropagation}>{children}</View>
            </View>
            <View className="view-count">
              <Text>浏览次数：{readCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
