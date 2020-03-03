import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import styles from './index.module.scss'

interface InProps {
  category: Global.Category
  color: string
  width: number
}

function CategoryItem(props: InProps) {

  const { category, color, width } = props

  return (
    <View className={styles.categoryContent} style={{ width: `${width}px` }}>
      <View className={styles.categoryIcon} style={{ backgroundColor: color }}>
        <AtIcon prefixClass='iconfont' value="iconjianshen"></AtIcon>
      </View>
      <Text>{category.name}</Text>
    </View>
  )

}


export default memo(CategoryItem)
