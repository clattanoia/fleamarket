import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar }  from 'taro-ui'

import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'


function SeachSection() {

  const goToSearch = () => {
    Taro.redirectTo({
      url: '/pages/search/index',
    })
  }
  const onChange = () => {}

  return (
    <View className={styles.search} onClick={goToSearch}>
      <View className={styles.searchLeft}>
        <AtSearchBar
          disabled
          value=""
          placeholder={placeholderText}
          onChange={onChange}
        />
      </View>
      <Text className={styles.searchBtn}>取消</Text>
    </View>
  )

}


export default memo(SeachSection)
