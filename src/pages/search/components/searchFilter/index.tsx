import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux'

import { RefreshDataType, ProductStatus, SearchOrderBy, SearchSortDirection } from '../../../../constants/enums'
import { SET_PRODUCT_SEARCH } from '../../../../constants/actionTypes'
import SelectLayout from '../../../../components/selectLayout'

import styles from './index.module.scss'

interface InProps {
  refreshData: (type: RefreshDataType) => void
  isForceCloseFloatLayout: boolean
  resetIsForceCloseFilterLayout: () => void
}
const productFilter = [{
  name: '浏览次数降序',
  id: `${SearchOrderBy.RC}_${SearchSortDirection.DESC}`,
}, {
  name: '浏览次数升序',
  id: `${SearchOrderBy.RC}_${SearchSortDirection.ASC}`,
}, {
  name: '期望价格降序',
  id: `${SearchOrderBy.PC}_${SearchSortDirection.DESC}`,
}, {
  name: '期望价格升序',
  id: `${SearchOrderBy.PC}_${SearchSortDirection.ASC}`,
}, {
  name: '发布时间降序',
  id: `${SearchOrderBy.CT}_${SearchSortDirection.DESC}`,
}, {
  name: '发布时间升序',
  id: `${SearchOrderBy.CT}_${SearchSortDirection.ASC}`,
}]
const productStatus = [{
  name: '全部',
  id: ProductStatus.ALL,
}, {
  name: '激活',
  id: ProductStatus.FOR_SALE,
}, {
  name: '已下架',
  id: ProductStatus.SALE_OUT,
}]

function SeachFilter(props: InProps) {
  const productSearch = useSelector((state: any) => {
    return state.global.productSearch
  })
  const { refreshData, isForceCloseFloatLayout, resetIsForceCloseFilterLayout } = props
  const dispatch = useDispatch()
  const { status, orderBy, sortDirection } = productSearch
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productFilter && productFilter[0])
  const [currentSelectStautsInfo, setCurrentSelectStatusInfo] = useState(productStatus[0])
  const [forceHiddenFloatLayout, setForceHiddenFloatLayout] = useState(false)
  const [forceHiddenStatusFloatLayout, setForceHiddenStatusFloatLayout] = useState(false)

  const setCurrentSelectStatusInfoHandle = (id) => {
    const info = productStatus.find(item => item.id === id)
    setCurrentSelectStatusInfo(info)
  }
  const setCurrentSelectInfoHandle = (id) => {
    const info = productFilter.find(item => item.id === id)
    setCurrentSelectInfo(info)
  }

  /* eslint-disable */
  useEffect(() => {
    setCurrentSelectStatusInfoHandle(status)
  }, [status])
  useEffect(() => {
    setCurrentSelectInfoHandle(`${orderBy}_${sortDirection}`)
  }, [orderBy,sortDirection])
  /* eslint-disable */

  useEffect(() => {
    if(isForceCloseFloatLayout){
      setForceHiddenFloatLayout(true)
      setForceHiddenStatusFloatLayout(true)
      resetIsForceCloseFilterLayout()
    }
  }, [isForceCloseFloatLayout])

  const setSearch = (search) => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: search })
  }
  const changeType = (type) => {
    const current = type.id
    if(current!==`${orderBy}_${sortDirection}`){
      const arr = current.split('_')
      setSearch({ orderBy: arr[0], sortDirection:arr[1] })
      refreshData(RefreshDataType.RESET_PAGE)
    }

  }

  const changeStatusType = (type) => {
    const current = type.id
    if(current!==status){
      setSearch({ status: current })
      refreshData(RefreshDataType.RESET_PAGE)
    }
  }

  const filterClick = () => {
    setForceHiddenStatusFloatLayout(true)
  }

  const statusClick = () => {
    setForceHiddenFloatLayout(true)
  }

  const resetForceHiddenFloatLayout = (val) => {
    setForceHiddenFloatLayout(val)
  }

  const resetStatusForceHiddenFloatLayout = (val) => {
    setForceHiddenStatusFloatLayout(val)
  }

  return (
    <View className={styles.searchFilter}>
      <View className={styles.searchFilterLeft} onClick={filterClick}>
        <SelectLayout
          list={productFilter}
          current={currentSelectInfo}
          onChangeSelect={changeType}
          forceHiddenFloatLayout={forceHiddenFloatLayout}
          resetForceHiddenFloatLayout={resetForceHiddenFloatLayout}
        />
      </View>
      <View className={styles.searchFilterRight}  onClick={statusClick}>
        <SelectLayout
          list={productStatus}
          current={currentSelectStautsInfo}
          onChangeSelect={changeStatusType}
          forceHiddenFloatLayout={forceHiddenStatusFloatLayout}
          resetForceHiddenFloatLayout={resetStatusForceHiddenFloatLayout}
        />
      </View>
    </View>
  )

}


export default memo(SeachFilter)
