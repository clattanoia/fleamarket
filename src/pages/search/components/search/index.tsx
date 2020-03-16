import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon, AtToast }  from 'taro-ui'
import { useSelector, useDispatch } from '@tarojs/redux'

import debounce from 'lodash/debounce'
import client from '../../../../graphql-client'

import styles from './index.module.scss'

import { placeholderText } from '../../../../constants/search'
import SelectLayout from '../../../../components/selectLayout'
import FloatLayout from '../../../../components/FloatLayout'
import { searchGoodsQuery, searchPurchaseQuery } from '../../../../query/search'
import { ProductType, SearchOrderBy, SearchSortDirection, RefreshDataType } from '../../../../constants/enums'
import { SET_PRODUCT_SEARCH } from '../../../../constants/actionTypes'

interface InProps {
  productTypes: Search.SelectLayout[]
  hasFetchSearch: boolean
  onSetVal: (key, value) => void
  refreshData: (type: RefreshDataType) => void
  searchHistory: string[]
}

function SeachSection(props: InProps) {
  const productSearch = useSelector((state: any) => {
    return state.global.productSearch
  })
  const { productTypes, hasFetchSearch, onSetVal, refreshData, searchHistory } = props

  const dispatch = useDispatch()
  const { currentProductType, title } = productSearch

  const [showResut, setShowResut] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [forceHiddenFloatLayout, setForceHiddenFloatLayout] = useState(false)
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productTypes && productTypes[0])
  const [searchResults, setSearchResults] = useState([])
  const [showToast, setShowToast] = useState(false)

  const setSearch = (search) => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: search })
  }

  const setCurrentSelectInfoHandle = (id) => {
    const info = productTypes.find(item => item.id === id)
    setCurrentSelectInfo(info)
  }

  useEffect(() => {
    setKeyword(title)
  }, [title])

  /* eslint-disable */
  useEffect(() => {
    setCurrentSelectInfoHandle(currentProductType)
  }, [currentProductType])
  /* eslint-disable */

  const cancleHandle = () => {
    if(hasFetchSearch){
      onSetVal('showResult', true)
      return
    }
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
    clearKeyword()
  }

  const searchQuery = async(keywords: string) => {
    const searchInput = {
      pageIndex: 0,
      pageSize: 5,
      title: keywords,
      orderBy: SearchOrderBy.RC,
      sortDirection: SearchSortDirection.DESC,
    }
    const query = currentSelectInfo.id === ProductType.PURCHASE ? searchPurchaseQuery : searchGoodsQuery
    try {
      const { data } = await client.query({ query, variables: { searchInput }})
      setSearchResults(data.searchResult.content)
    } catch (err){
      console.log(err)
      setSearchResults([])
    }
  }

  const handleChange = debounce((e) => {
    const keywords = e.target.value.replace(/^\s*/, '')
    setKeyword(keywords)
    if(keywords){
      searchQuery(keywords)
    }
  }, 200)

  const setSearchHistory = (keyword) => {
    const newSearchHistory = [...searchHistory]
    if(!newSearchHistory.includes(keyword)){
      newSearchHistory.unshift(keyword)
      const currentSearchHistory = newSearchHistory.slice(0,10)
      console.log(currentSearchHistory)
      Taro.setStorageSync('searchHistory',currentSearchHistory)
    }
  }

  const onConfirm = () => {
    if(keyword){
      setSearch({ title: keyword, categoryId: '', currentProductType: currentSelectInfo.id })
      refreshData(RefreshDataType.RESET_PAGE)
      setSearchHistory(keyword)
    } else {
      setShowToast(true)
    }
  }

  const onFocus = () => {
    if(title){
      searchQuery(title)
    }
    setForceHiddenFloatLayout(true)
    layoutHadle(true)()
  }

  const onBlur = () => {
    setForceHiddenFloatLayout(false)
    layoutHadle(false)()
  }

  const clickHandle = (item) => () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&productType=${currentSelectInfo.id}`,
    })
  }

  const handleCloseToast = () => {
    setShowToast(false)
  }

  const renderResult = () => {
    return searchResults.map(product => {
      const result = product['title'].split(new RegExp(keyword, 'gi'))
      product['resultLength'] = result.length - 1
      return (
        <View className={styles.searchResutList} onClick={clickHandle(product)} key={product.id}>
          {
            result.map((tit, index) => {
              if(index === product['resultLength']){
                return (
                  <View key={Symbol(index).toString()}>
                    {tit}
                  </View>
                )
              }
              return (
                <View key={Symbol(index).toString()}>
                  {tit}<Text className="activeColor">{keyword}</Text>
                </View>
              )
            })
          }
        </View>
      )
    })
  }

  return (
    <View className={styles.searchBody}>
      <View className={styles.search}>
        <View className={styles.searchLeft}>
          <View className={styles.searchType} onClick={closeResultFloat}>
            <SelectLayout
              list={productTypes}
              current={currentSelectInfo}
              onChangeSelect={changeType}
              textBottom={10}
              forceHiddenFloatLayout={forceHiddenFloatLayout}
            />
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
              onBlur={onBlur}
            />
          </View>
          <View className={styles.searchTextClear} onClick={clearKeyword}>
            <AtIcon prefixClass='at-icon' value="close-circle" size={keyword ? 16 : 0}></AtIcon>
          </View>
        </View>
        <Text className={styles.searchBtn} onClick={cancleHandle}>取消</Text>
      </View>
      <FloatLayout
        visible={!!keyword.length && !!searchResults.length && showResut}
        closeFloat={closeResultFloat}
        type="search"
      >
        <View className={styles.searchResult}>
          {renderResult}
        </View>
      </FloatLayout>
      <AtToast
        isOpened={showToast}
        text="关键词不能为空"
        onClose={handleCloseToast}
        hasMask
      >
      </AtToast>
    </View>
  )

}


export default memo(SeachSection)
