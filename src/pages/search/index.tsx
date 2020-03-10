import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import client from '../../graphql-client'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType, RefreshDataType } from '../../constants/enums'
import { resetProductSearch } from '../../actions/global'

import ResultPage from './resultPage'
import SearchPage from './searchPage'
import './index.module.scss'

type PageStateProps = {
  global: {
    productSearch: any
  }
}
type PageDispatchProps = {
  resetProductSearch: () => Function,
}
type PageState =  {
  hasFetchSearch: boolean
  showResult: boolean
  searchListResult: any[]
  pageIndex: number
}
type IProps = PageStateProps & PageDispatchProps

interface Search {
  props: IProps;
}
const productTypes = [{
  name: '求购',
  id: ProductType.GOODS,
}, {
  name: '出售',
  id: ProductType.PURCHASE,
}]

@connect(({ global }) => ({
  global,
}), (dispatch) => ({
  resetProductSearch() {
    dispatch(resetProductSearch())
  },
}))
class Search extends Component<{}, PageState> {

  config: Config = {
    navigationBarTitleText: '搜索',
  }

  state = {
    hasFetchSearch: false,
    showResult: false,
    searchListResult: [],
    pageIndex: 0,
  }

  componentDidMount() {
    const { productSearch } = this.props.global
    if(productSearch.categoryId){
      this.setState({
        hasFetchSearch: true,
        showResult: true,
      }, () => {
        this.fetchSearch()
      })
    }
  }

  componentWillUnmount() {
    this.props.resetProductSearch()
  }

  setStateValue = (key, value): void => {
    this.setState({
      [key]: value,
    })
  }

  fetchSearch = async() => {
    this.setState({
      showResult: true,
      hasFetchSearch: true,
    })
    const { productSearch } = this.props.global
    const { pageIndex } = this.state
    const { currentProductType, categoryId, title, orderBy, sortDirection } = productSearch

    const searchInput = {
      pageSize: 10,
      pageIndex,
      title,
      categoryId,
      orderBy,
      sortDirection,
    }

    const query = currentProductType === ProductType.PURCHASE ? searchPurchaseQuery : searchGoodsQuery
    try {
      const { data } = await client.query({ query, variables: { searchInput }})
      this.setState({
        searchListResult: data.searchResult.content,
      })
    } catch (err){
      console.log(err)
      this.setState({
        searchListResult: [],
      })
    }
  }

  refreshData = (type: RefreshDataType) => {
    const { pageIndex } =this.state

    const newPageIndex = type === RefreshDataType.RESET_PAGE ? 0 : (pageIndex + 1)

    this.setState({
      pageIndex: newPageIndex,
    }, () => {
      this.fetchSearch()
    })

  }

  render() {
    const { showResult, hasFetchSearch, searchListResult } = this.state
    const { productSearch } = this.props.global

    return (
      <View>
        {
          showResult ? (
            <ResultPage
              productTypes={productTypes}
              onSetVal={this.setStateValue}
              refreshData={this.refreshData}
              searchListResult={searchListResult}
              productType={productSearch.currentProductType}
            />
          ) : (
            <SearchPage
              productTypes={productTypes}
              hasFetchSearch={hasFetchSearch}
              onSetVal={this.setStateValue}
              refreshData={this.refreshData}
            />
          )
        }
      </View>
    )
  }
}

export default Search as ComponentClass<{}, PageState>

