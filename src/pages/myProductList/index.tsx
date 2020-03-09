import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import client from '../../graphql-client'
import { ProductType, SearchOrderBy, SearchSortDirection } from '../../constants/enums'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'


const TITLES = {
  [ProductType.PURCHASE]: '求购列表',
  [ProductType.GOODS]: '出售列表',
}

type PageStateProps = {
  userId: string
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  type: ProductType,
  pageIndex: number,
  pageSize: number,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyProductList {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userId: userInfo.id,
}))
class MyProductList extends Component<PageOwnProps, PageState> {
  state = {
    type: ProductType.GOODS,

    pageIndex: 0,
    pageSize: 20,
  }

  config: Config = {
    navigationBarTitleText: '',
  }

  componentWillMount(): void {
    const { type } = this.$router.params
    this.setState({ type: type as ProductType })
    Taro.setNavigationBarTitle({
      title: TITLES[type] || '列表',
    })
  }

  componentDidMount(): void {
    this.fetchListData()
  }

  getSearchInput() {
    const { pageIndex, pageSize } = this.state
    const { userId } = this.props
    return {
      pageIndex,
      pageSize,
      userId,
      orderBy: SearchOrderBy.CT,
      sortDirection: SearchSortDirection.DESC,
    }
  }

  async fetchListData(): Promise<void> {
    const query = this.state.type === ProductType.GOODS ? searchGoodsQuery : searchPurchaseQuery
    const searchInput = this.getSearchInput()
    const { data } = await client.query({ query, variables: { searchInput }})
    console.log(data)
  }

  render() {
    const { type } = this.state
    return (
      <View>
        我的产品列表{type === ProductType.GOODS ? '出售' : '求购'}
      </View>
    )
  }
}

export default MyProductList as ComponentClass<PageOwnProps, PageState>




