import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'

import styles from './index.module.scss'

interface InProps {
  closeFloat: () => void
  visible: boolean
  listData: any[]
  listClickFunc: (data) => () => void
}

function FloatList(props: InProps) {
  const { visible, closeFloat, listData, listClickFunc } = props

  const closeHandle = () => {
    closeFloat()
  }

  const clickHandle = (item) => () => {
    closeFloat()
    listClickFunc(item)
  }

  return (
    <View className={styles.searchResutBody} style={{ 'display': visible ? 'block' : 'none' }}>
      <View className={styles.searchResut}>
        {
          listData.map(item =>
            <View className={styles.searchResutList} onClick={clickHandle(item)}>
              {item.name}
            </View>
          )
        }
      </View>
      <View className={styles.shadow} onClick={closeHandle}></View>
    </View>
  )

}


export default memo(FloatList)
