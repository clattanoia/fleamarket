import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'

import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'
import SelectLayout from '../selectLayout'
import FloatLayout from '../FloatLayout'

const goodsTypes = [{
  name: '求购',
  id: 'puchase',
}, {
  name: '出售',
  id: 'sell',
}]

const searchResults = [{
  name: '哈哈爱国大纲',
  id: '11111',
}, {
  name: '哈哈爱国大纲阿尕电商广告',
  id: '2222222',
}, {
  name: '哈哈爱国大纲',
  id: '3333333',
}, {
  name: '哈哈爱国大纲阿尕电商广告',
  id: '44444444',
}, {
  name: '哈哈爱国大纲',
  id: '55555555',
}]

function SeachSection() {

  const [keyword, setKeyword] = useState('')
  const [showResut, setShowResut] = useState(false)
  const [currentType, setCurrentType] = useState(goodsTypes[0])

  const goToHome = () => {
    Taro.redirectTo({
      url: '/pages/index/index',
    })
  }

  const closeResultFloat = () => {
    setShowResut(false)
  }

  const clearKeyword = () => {
    setKeyword('')
    closeResultFloat()
  }

  const changeType = (type) => {
    setCurrentType(type)
    clearKeyword()
  }

  const handleChange = (e) => {
    setKeyword(e.target.value)
    setShowResut(true)
  }

  const onConfirm = () => {
    console.log('-----------onConfirm-------gotoList----')
  }

  const clickHandle = (item) => () => {
    closeResultFloat()
    console.log(item)
    console.log('------------goto---------detail-------------------')
  }

  return (
    <View className={styles.searchBody}>
      <View className={styles.search}>
        <View className={styles.searchLeft}>
          <View className={styles.searchType} onClick={closeResultFloat}>
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
              onConfirm={onConfirm}
            />
          </View>
          <View className={styles.searchTextClear} onClick={clearKeyword}>
            <AtIcon prefixClass='at-icon' value="close-circle" size={keyword ? 16 : 0}></AtIcon>
          </View>
        </View>
        <Text className={styles.searchBtn} onClick={goToHome}>取消</Text>
      </View>
      <FloatLayout visible={showResut} closeFloat={closeResultFloat}>
        <View className={styles.searchResult}>
          {
            searchResults.map(item =>
              <View className={styles.searchResutList} onClick={clickHandle(item)}>
                {item.name}
              </View>
            )
          }
        </View>
      </FloatLayout>
    </View>
  )

}


export default memo(SeachSection)
