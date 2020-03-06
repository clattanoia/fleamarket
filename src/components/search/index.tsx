import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'
import debounce from 'lodash/debounce'
import client from '../../graphql-client'

import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'
import SelectLayout from '../selectLayout'
import FloatLayout from '../FloatLayout'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType } from '../../constants/enums'

const goodsTypes = [{
  name: '求购',
  id: ProductType.GOODS,
}, {
  name: '出售',
  id: ProductType.PURCHASE,
}]

function SeachSection() {

  const [keyword, setKeyword] = useState('')
  const [showResut, setShowResut] = useState(false)
  const [currentSelectInfo, setCurrentSelectInfo] = useState(goodsTypes[0])
  const [currentType, setCurrentType] = useState(goodsTypes[0].id)
  const [searchResults, setSearchResults] = useState([])

  const goToHome = () => {
    Taro.redirectTo({
      url: '/pages/index/index',
    })
  }

  const layoutHadle = (val) => () => {
    setShowResut(val)
  }

  const closeResultFloat = () => {
    layoutHadle(false)
    setSearchResults([])
  }

  const clearKeyword = () => {
    setKeyword('')
    closeResultFloat()
  }

  const changeType = (type) => {
    setCurrentSelectInfo(type)
    setCurrentType(type.id)
    clearKeyword()
  }

  const searchQuery = async(keywords: string) => {
    const searchInput = {
      pageIndex: 0,
      pageSize: 5,
      title: keywords,
    }
    let query = searchGoodsQuery, dataParam = 'searchGoods'
    if(currentType === ProductType.PURCHASE) {
      query = searchPurchaseQuery
      dataParam = 'searchPurchase'
    }
    try {
      const { data } = await client.query({ query, variables: { searchInput }})
      setSearchResults(data[dataParam].content)
    } catch (err){
      console.log(err)
      setSearchResults([])
    }
  }

  const handleChange = debounce((e) => {
    const keywords = e.target.value
    setKeyword(keywords)
    if(keywords){
      searchQuery(keywords)
    }
  }, 300)

  const onConfirm = () => {
    console.log('-----------onConfirm-------gotoList----')
  }

  const onFocus = () => {
    if(keyword){
      searchQuery(keyword)
    }
    layoutHadle(true)()
  }

  const clickHandle = (item) => () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&productType=${currentType}`,
    })
  }

  // const renderText = (title) => {
  //   if(!title){
  //     return ''
  //   }
  //   const reg = new RegExp(keyword,"g");
  //   return title.replace(reg,`<Text className="activeColor">${keyword}</Text>`)
  //   // const renderDom = (
  //   //   title.replace(reg,`<Text className="activeColor">${keyword}</Text>`)
  //   // )
  //   // console.log(renderDom)
  //   // return renderDom
  // }

  // const results = () => {
  //   return searchResults.map(item => item.title = renderText(item.title))
  // }

  return (
    <View className={styles.searchBody}>
      <View className={styles.search}>
        <View className={styles.searchLeft}>
          <View className={styles.searchType} onClick={closeResultFloat}>
            <SelectLayout list={goodsTypes} current={currentSelectInfo} onChangeSelect={changeType} />
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
              onFocus={onFocus}
              onBlur={layoutHadle(false)}
            />
          </View>
          <View className={styles.searchTextClear} onClick={clearKeyword}>
            <AtIcon prefixClass='at-icon' value="close-circle" size={keyword ? 16 : 0}></AtIcon>
          </View>
        </View>
        <Text className={styles.searchBtn} onClick={goToHome}>取消</Text>
      </View>
      <FloatLayout
        visible={!!keyword.length && showResut}
        closeFloat={closeResultFloat}
        type="search"
      >
        <View className={styles.searchResult}>
          {
            searchResults.map(item =>
              <View className={styles.searchResutList} onClick={clickHandle(item)} >
                {item.title}
                {/* <Text>{renderText(item.title)}</Text>
                {<Text className="activeColor">{keyword}</Text>} */}
              </View>
            )
          }
        </View>
      </FloatLayout>
    </View>
  )

}


export default memo(SeachSection)
