import Taro, { Component, Config } from '@tarojs/taro'
import { ComponentClass } from 'react'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import client from '../../graphql-client'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { ProductType } from '../../constants/enums'

import ResultPage from './resultPage'
import SearchPage from './searchPage'

type PageStateProps = {
  global: {
    productSearch: any
  }
}

type PageState =  {
  hasFetchSearch: boolean
  showResult: boolean
}
type IProps = PageStateProps

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
}))
class Search extends Component<{}, PageState> {

  config: Config = {
    navigationBarTitleText: '搜索',
  }

  constructor(props) {
    super(props)
    this.state = {
      hasFetchSearch: false,
      showResult: false,
    }
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

  setStateValue = (key, value): void => {
    this.setState({
      [key]: value,
    })
  }

  fetchSearch = async() => {
    const { productSearch } = this.props.global

    const searchInput = {
      pageIndex: 0,
      pageSize: 10,
      title: '',
    }

    let query = searchGoodsQuery
    if(productSearch.currentProductType === ProductType.PURCHASE) {
      query = searchPurchaseQuery
    }
    try {
      const { data } = await client.query({ query, variables: { searchInput }})
      console.log(data)
      // setSearchResults(data.searchResult.content)
    } catch (err){
      console.log(err)
      // setSearchResults([])
    }
  }

  render() {
    const { showResult, hasFetchSearch } = this.state
    console.log(showResult)
    return (
      <View>
        {
          showResult ? (
            <ResultPage
              productTypes={productTypes}
              onSetVal={this.setStateValue}
            />
          ) : (
            <SearchPage
              productTypes={productTypes}
              hasFetchSearch={hasFetchSearch}
              onSetVal={this.setStateValue}
            />
          )
        }

      </View>
    )
  }
}

export default Search as ComponentClass<{}, PageState>

