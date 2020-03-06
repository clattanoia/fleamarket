import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'
import { useSelector, useDispatch } from '@tarojs/redux'

import debounce from 'lodash/debounce'
import client from '../../graphql-client'

import styles from './index.module.scss'

import { placeholderText } from '../../constants/search'
import SelectLayout from '../selectLayout'
import FloatLayout from '../FloatLayout'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType } from '../../constants/enums'
import { SET_PRODUCT_SEARCH } from '../../constants'

const productTypes = [{
  name: '求购',
  id: ProductType.GOODS,
}, {
  name: '出售',
  id: ProductType.PURCHASE,
}]

function SeachSection() {
  const productSearch = useSelector((state: any) => {
    return state.global.productSearch
  })
  console.log(productSearch)
  const dispatch = useDispatch()
  const { currentProductType, title } = productSearch

  const [showResut, setShowResut] = useState(false)
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productTypes[0])
  const [searchResults, setSearchResults] = useState([])

  const setSearch = (search) => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: search })
  }

  const setCurrentSelectInfoHandle = (id) => {
    const info = productTypes.find(item => item.id === id)
    setCurrentSelectInfo(info)
  }

  useEffect(() => {
    setCurrentSelectInfoHandle(currentProductType)
  }, [currentProductType])

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
    setSearch({ title: '' })
    closeResultFloat()
  }

  const changeType = (type) => {
    setCurrentSelectInfo(type)
    setSearch({ currentProductType: type.id })
    clearKeyword()
  }

  const searchQuery = async(keywords: string) => {
    const searchInput = {
      pageIndex: 0,
      pageSize: 5,
      title: keywords,
    }
    let query = searchGoodsQuery, dataParam = 'searchGoods'
    if(currentProductType === ProductType.PURCHASE) {
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
    setSearch({ title: keywords })
    if(keywords){
      searchQuery(keywords)
    }
  }, 300)

  const onConfirm = () => {
    console.log('-----------onConfirm-------gotoList----')
  }

  const onFocus = () => {
    if(title){
      searchQuery(title)
    }
    layoutHadle(true)()
  }

  const clickHandle = (item) => () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&productType=${currentProductType}`,
    })
  }

  // const renderText = (title) => {
  //   if(!title){
  //     return ''
  //   }
  //   const reg = new RegExp(title,"g");
  //   return title.replace(reg,`<Text className="activeColor">${title}</Text>`)
  //   // const renderDom = (
  //   //   title.replace(reg,`<Text className="activeColor">${title}</Text>`)
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
            <SelectLayout list={productTypes} current={currentSelectInfo} onChangeSelect={changeType} />
          </View>
          <View className={styles.searchText}>
            <Input
              className={styles.searchInput}
              name='keyword'
              type='text'
              maxLength={10}
              placeholder={placeholderText}
              value={title}
              onInput={handleChange}
              confirmType="search"
              focus
              onConfirm={onConfirm}
              onFocus={onFocus}
              onBlur={layoutHadle(false)}
            />
          </View>
          <View className={styles.searchTextClear} onClick={clearKeyword}>
            <AtIcon prefixClass='at-icon' value="close-circle" size={title ? 16 : 0}></AtIcon>
          </View>
        </View>
        <Text className={styles.searchBtn} onClick={goToHome}>取消</Text>
      </View>
      <FloatLayout
        visible={!!title.length && showResut}
        closeFloat={closeResultFloat}
        type="search"
      >
        <View className={styles.searchResult}>
          {
            searchResults.map(item =>
              <View className={styles.searchResutList} onClick={clickHandle(item)} key={item.id}>
                {item.title}
                {/* <Text>{renderText(item.title)}</Text>
                {<Text className="activeColor">{title}</Text>} */}
              </View>
            )
          }
        </View>
      </FloatLayout>
    </View>
  )

}


export default memo(SeachSection)
