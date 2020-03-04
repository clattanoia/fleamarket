import Taro, { memo, useState, useRef } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'

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
  const inputEl = useRef(null)

  const [keyword, setKeyword] = useState('')
  const [currentType, setCurrentType] = useState(goodsTypes[0])

  const goToHome = () => {
    Taro.redirectTo({
      url: '/pages/index/index',
    })
  }

  const handleChange = (e) => {
    console.log(e)
    setKeyword(e.target.value)
  }

  const changeType = (type) => {
    setCurrentType(type)
  }

  const clearKeyword = () => {
    setKeyword('')
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
            ref={inputEl}
          />
        </View>
        <View className={styles.searchTextClear} onClick={clearKeyword}>
          <AtIcon prefixClass='at-icon' value="close-circle" size={keyword ? 16 : 0}></AtIcon>
        </View>
      </View>
      <Text className={styles.searchBtn} onClick={goToHome}>取消</Text>
    </View>
  )

}


export default memo(SeachSection)
