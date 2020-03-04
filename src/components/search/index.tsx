import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'
import SelectLayout from '../selectLayout'

const goodsTypes = [{
  name: '求购',
  id: 'puchase',
}, {
  name: '出售',
  id: 'sell',
}]

function SeachSection() {

  const [keyword, setKeyword] = useState('')
  const [currentType, setCurrentType] = useState(goodsTypes[0])

  const goToHome = () => {
    Taro.redirectTo({
      url: '/pages/index/index',
    })
  }

  const handleChange = (val) => {
    console.log(val)
    setKeyword(val)
    return val
  }

  const changeType = (type) => {
    setCurrentType(type)
  }

  return (
    <View className={styles.search}>
      <View className={styles.searchLeft}>
        <View className={styles.searchType}>
          <SelectLayout list={goodsTypes} current={currentType} onChangeSelect={changeType} />
        </View>
        <View className={styles.searchText}>
          <Input
            className={styles.searchInput}
            name='keyword'
            type='text'
            maxLength={10}
            placeholder={placeholderText}
            value={keyword}
            onInput={handleChange}
            confirmType="search"
            focus
          />
        </View>
      </View>
      <Text className={styles.searchBtn} onClick={goToHome}>取消</Text>
    </View>
  )

}


export default memo(SeachSection)
