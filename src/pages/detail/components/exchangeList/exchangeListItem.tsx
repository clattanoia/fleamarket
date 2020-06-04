import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import cls from 'classnames'
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

  return (
    <View className="exchange-list-item" key={id}>
      <Image src={coverUrl} onClick={() => handleProductClick(exchange)} />
      <View className="item-content">
        <View
          className={cls('title', {
            'disabled-title': status !== Status.FOR_SALE,
          })}
          onClick={() => handleProductClick(exchange)}
        >
          {title}
        </View>
        <View className="info">
          <View>
            <View className="price">
              <Text>{price}</Text>
            </View>
            <View className="view-count">
              <Text>浏览次数：{readCount}</Text>
            </View>
          </View>
          <View className="status-action">{children}</View>
        </View>
      </View>
    </View>
  )
}
