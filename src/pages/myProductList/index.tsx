import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import ProductListItem from './components/productListItem'
import Preload from './components/preload'

import client from '../../graphql-client'
import { ProductType, SearchOrderBy, SearchSortDirection } from '../../constants/enums'
import { searchGoodsQuery, searchPurchaseQuery } from '../../query/search'
import { Product } from '../../interfaces/product'

import styles from './index.module.scss'

const TITLES = {
  [ProductType.GOODS]: '我的出售',
  [ProductType.PURCHASE]: '我的求购',
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
  listData: Product[],
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
    listData: [],
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

    const { listData } = this.state
    this.setState({
      listData: listData.concat(data.searchResult.content),
    })
    console.log(data)
  }

  onScrollToBottom = () => {
    console.log('onScrollToBottom')
  }

  onScroll = () => {
    console.log('onScroll')
  }

  renderListData() {
    console.log('listData')
    const { listData } = this.state
    return listData.map((item: Product) => <ProductListItem item={item} key={item.id} />)
  }

  render() {
    const Threshold = 20
    return (
      <ScrollView
        className={styles.listContainer}
        scrollY
        scrollWithAnimation
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        onScrollToLower={this.onScrollToBottom} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
        onScroll={this.onScroll}
      >
        <Preload />
        {this.renderListData()}
      </ScrollView>
    )
  }
}

export default MyProductList as ComponentClass<PageOwnProps, PageState>




