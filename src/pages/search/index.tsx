import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import client from '../../graphql-client'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType } from '../../constants/enums'
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
    const { categoryId, title, currentProductType } = productSearch

    const searchInput = {
      pageIndex: 0,
      pageSize: 10,
      title,
      categoryId,
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
              fetchSearch={this.fetchSearch}
              searchListResult={searchListResult}
              productType={productSearch.currentProductType}
            />
          ) : (
            <SearchPage
              productTypes={productTypes}
              hasFetchSearch={hasFetchSearch}
              onSetVal={this.setStateValue}
              fetchSearch={this.fetchSearch}
            />
          )
        }
      </View>
    )
  }
}

export default Search as ComponentClass<{}, PageState>

