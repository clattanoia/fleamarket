import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import client from '../../graphql-client'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType, RefreshDataType, ProductStatus } from '../../constants/enums'
import { resetProductSearch } from '../../actions/global'

import ResultPage from './resultPage'
import SearchPage from './searchPage'

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
  showNoMore: boolean
  isLoading: boolean
}
type IProps = PageStateProps & PageDispatchProps

interface Search {
  props: IProps;
}


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

  productTypes = [{
    name: '出售',
    id: ProductType.GOODS,
  }, {
    name: '求购',
    id: ProductType.PURCHASE,
  }]

  state = {
    hasFetchSearch: false,
    showResult: false,
    searchListResult: [],
    pageIndex: 0,
    showNoMore: false,
    isLoading: false,
  }

  componentDidMount() {
    const { productSearch: { categoryId }} = this.props.global
    if(categoryId){
      this.setState({
        hasFetchSearch: true,
        showResult: true,
        isLoading: true,
      }, () => {
        this.fetchSearch()
      })
    }
  }

  componentWillUpdate() {
    const pages = Taro.getCurrentPages()
    const currentPage = pages.pop()
    if(currentPage && currentPage.route.indexOf('pages/search/index') === -1){
      return
    }
    const { productSearch: { categoryId, categoryName }} = this.props.global
    Taro.setNavigationBarTitle({
      title: categoryId ? `${categoryName}列表` : '搜索',
    })
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
    const { pageIndex, searchListResult } = this.state
    const { currentProductType, categoryId, title, orderBy, sortDirection, status } = productSearch

    const searchInput = {
      pageSize: 10,
      pageIndex,
      title,
      categoryId,
      orderBy,
      sortDirection,
    }

    if(status !== ProductStatus.ALL){
      searchInput['status'] = status
    }

    const query = currentProductType === ProductType.PURCHASE ? searchPurchaseQuery : searchGoodsQuery
    try {
      const { data } = await client.query({ query, variables: { searchInput }})
      const { content, totalPages, totalElements } = data.searchResult
      const newContent = pageIndex ? [...searchListResult, ...content] : content
      this.setState({
        searchListResult: newContent,
        showNoMore: (pageIndex === totalPages - 1) && (totalElements > 0),
      })
    } catch (err){
      console.log(err)
    } finally {
      this.setState({
        isLoading: false,
      })
    }
  }

  refreshData = (type: RefreshDataType) => {
    const { pageIndex, searchListResult } =this.state

    const newPageIndex = type === RefreshDataType.RESET_PAGE ? 0 : (pageIndex + 1)
    const newResult = type === RefreshDataType.RESET_PAGE ? [] : searchListResult

    this.setState({
      pageIndex: newPageIndex,
      isLoading: true,
      searchListResult: newResult,
    }, () => {
      this.fetchSearch()
    })

  }

  render() {
    const { showResult, hasFetchSearch, searchListResult, showNoMore, isLoading } = this.state
    const { productSearch } = this.props.global

    return (
      <View>
        {
          showResult ? (
            <ResultPage
              productTypes={this.productTypes}
              onSetVal={this.setStateValue}
              refreshData={this.refreshData}
              searchListResult={searchListResult}
              productType={productSearch.currentProductType}
              showNoMore={showNoMore}
              isLoading={isLoading}
            />
          ) : (
            <SearchPage
              productTypes={this.productTypes}
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

