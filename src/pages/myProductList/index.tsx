import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { ReactNodeLike } from 'prop-types'


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
  productType: ProductType,
  pageIndex: number,
  pageSize: number,
  totalPages: number,
  listData: Product[],
  showPreload: boolean,
  showLoadMore: boolean,
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
    productType: ProductType.GOODS,

    pageIndex: 0,
    pageSize: 10,
    totalPages: 0,
    listData: [],

    showPreload: false,
    showLoadMore: false,
  }

  config: Config = {
    navigationBarTitleText: '',
  }

  componentWillMount(): void {
    const { productType } = this.$router.params
    this.setState({ productType: productType as ProductType })
    Taro.setNavigationBarTitle({
      title: TITLES[productType] || '列表',
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

  isFetching(): boolean {
    const { showLoadMore, showPreload } = this.state
    return showLoadMore || showPreload
  }

  setLoading(): void {
    const { listData } = this.state

    if(listData.length) {
      this.setState({
        showLoadMore: true,
      })
    } else {
      this.setState({
        showPreload: true,
      })
    }
  }

  cancelLoading(): void {
    this.setState({
      showPreload: false,
      showLoadMore: false,
    })
  }

  delay() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1200)
    })
  }

  async fetchListData(): Promise<void> {
    const query = this.state.productType === ProductType.GOODS ? searchGoodsQuery : searchPurchaseQuery
    const searchInput = this.getSearchInput()

    // console.log('searchInput:', searchInput)
    this.setLoading()
    try {
      await this.delay()
      const { data } = await client.query({ query, variables: { searchInput }})
      const { listData } = this.state
      this.setState({
        pageIndex: this.state.pageIndex + 1,
        totalPages: data.searchResult.totalPages,
        listData: listData.concat(data.searchResult.content),
      })

    } catch (e) {
      console.log(e)
    }
    finally {
      this.cancelLoading()
    }
  }

  handleGotoDetail(item: Product): void {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&productType=${this.state.productType}`,
    })
  }

  onScrollToBottom = (): void => {
    const { totalPages, pageIndex } = this.state
    if(pageIndex >= totalPages || this.isFetching()) {
      return
    }

    this.fetchListData()
  }

  renderEmpty(): ReactNodeLike {
    const { listData } = this.state

    if(!listData.length && !this.isFetching()) {
      return <View className={styles.empty}>暂无相关数据</View>
    }
  }

  renderListData(): ReactNodeLike {
    const { listData } = this.state
    return listData.map((item: Product) => (
      <ProductListItem item={item} key={item.id} onClick={() => this.handleGotoDetail(item)} />
    ))
  }

  renderLoadMore(): ReactNodeLike {
    const { showLoadMore } = this.state
    if(showLoadMore) {
      return <AtLoadMore status="loading" />
    }
  }

  renderNoMore(): ReactNodeLike {
    const { totalPages, pageIndex, listData } = this.state

    // TODO: 大于 5 条并且加载完
    if((listData.length > 5 && pageIndex >= totalPages)) {
      return <AtLoadMore status="noMore" />
    }
  }

  renderScrollView(): ReactNodeLike {
    const Threshold = 20

    return (
      <ScrollView
        className={styles.scrollContainer}
        scrollY
        scrollWithAnimation
        lowerThreshold={Threshold}
        upperThreshold={Threshold}
        onScrollToLower={this.onScrollToBottom} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
      >
        {this.renderEmpty()}
        {this.renderListData()}
        {this.renderLoadMore()}
        {this.renderNoMore()}
      </ScrollView>
    )
  }

  render() {
    const { showPreload } = this.state
    return (
      <View className={styles.container}>
        { showPreload ? <Preload /> : this.renderScrollView() }
      </View>
    )
  }
}

export default MyProductList as ComponentClass<PageOwnProps, PageState>
