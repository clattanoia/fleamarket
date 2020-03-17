import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux'

import { RefreshDataType, ProductStatus, SearchOrderBy, SearchSortDirection } from '../../../../constants/enums'
import { SET_PRODUCT_SEARCH } from '../../../../constants/actionTypes'
import SelectLayout from '../../../../components/selectLayout'

import styles from './index.module.scss'

interface InProps {
  refreshData: (type: RefreshDataType) => void
}
const productFilter = [{
  name: '浏览次数降序',
  id: 1,
  filter: { orderBy: SearchOrderBy.RC, sortDirection: SearchSortDirection.DESC },
}, {
  name: '浏览次数升序',
  id: 2,
  filter: { orderBy: SearchOrderBy.RC, sortDirection: SearchSortDirection.ASC },
}, {
  name: '期望价格降序',
  id: 3,
  filter: { orderBy: SearchOrderBy.PC, sortDirection: SearchSortDirection.DESC },
}, {
  name: '期望价格升序',
  id: 4,
  filter: { orderBy: SearchOrderBy.PC, sortDirection: SearchSortDirection.ASC },
}, {
  name: '发布时间降序',
  id: 5,
  filter: { orderBy: SearchOrderBy.CT, sortDirection: SearchSortDirection.DESC },
}, {
  name: '发布时间升序',
  id: 6,
  filter: { orderBy: SearchOrderBy.CT, sortDirection: SearchSortDirection.ASC },
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
  const { refreshData } = props
  const dispatch = useDispatch()
  const { status } = productSearch
  const [currentSelectInfo, setCurrentSelectInfo] = useState(productFilter && productFilter[0])
  const [currentSelectStautsInfo, setCurrentSelectStatusInfo] = useState(productStatus[0])
  const [forceHiddenFloatLayout, setForceHiddenFloatLayout] = useState(false)
  const [forceHiddenStatusFloatLayout, setForceHiddenStatusFloatLayout] = useState(false)

  const setCurrentSelectStatusInfoHandle = (id) => {
    const info = productStatus.find(item => item.id === id)
    setCurrentSelectStatusInfo(info)
  }

  /* eslint-disable */
  useEffect(() => {
    setCurrentSelectStatusInfoHandle(status)
  }, [status])
  /* eslint-disable */

  const setSearch = (search) => {
    dispatch({ type: SET_PRODUCT_SEARCH, payload: search })
  }
  const changeType = (type) => {
    console.log(type)
    setCurrentSelectInfo(type)
    refreshData(RefreshDataType.RESET_PAGE)
  }

  const changeStatusType = (type) => {
    const statusCurrent = type.id
    if(statusCurrent!==status){
      setSearch({ status: statusCurrent })
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
