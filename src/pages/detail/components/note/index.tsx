import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { ProductType } from '../../../../constants/enums'

import styles from './index.module.scss'

interface InProps {
  productType: ProductType
}

function DetailNote(props: InProps) {

  const renderExchange = () => {
    return (
      <View>
        <View className={styles.title}>
          易货换货说明：
        </View>
        <View className={styles.content}>
          易货换货功能，用于方便易货双方及时获取意向来源，确认意向后，需要彼此及时联系，提升易货成功率！
        </View>
      </View>
    )
  }

  return (
    <View className={styles.detail_note}>

      {props.productType === ProductType.GOODS && renderExchange()}

      <View className={styles.title}>
        免责说明：
      </View>
      <View className={styles.content}>
        <View>1、二货集提供二手信息发布平台，我们无法对信息的真实性逐一验证，购买二手物品请仔细辨别。</View>
        <View>2、交易双方自行承担交易风险和因此产生的经济损失，二货集不为交易产品信息的可靠性、准确性、安全性和产品质量承担任何责任。</View>
      </View>

    </View>
  )

}


export default memo(DetailNote)
