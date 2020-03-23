import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { AtLoadMore, AtToast } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { ReactNodeLike } from 'prop-types'


import ProductListItem from './components/productListItem'
import Preload from '../../components/center/preload'

import { ProductType } from '../../constants/enums'
import { Product } from '../../interfaces/product'
import { InMyCollectListState } from '../../reducers/MyCollectList'

import styles from './index.module.scss'
import { fetchMyCollectList, resetMyCollectListState } from '../../actions/myCollectList'

const TITLES = {
  [ProductType.GOODS]: '出售',
  [ProductType.PURCHASE]: '求购',
}

type PageStateProps = {
  myCollectList: InMyCollectListState,
}

type PageDispatchProps = {
  fetchMyCollectList: (searchInput) => Function,
  resetState: () => Function,
}

type PageOwnProps = {}

type PageState = {
  productType: ProductType,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface MyCollectList {
  props: IProps;
}

@connect(({ myCollectList }) => ({
  myCollectList,
}), (dispatch) => ({
  fetchMyCollectList(searchInput) {
    dispatch(fetchMyCollectList(searchInput))
  },
  resetState() {
    dispatch(resetMyCollectListState())
  },
}))
class MyCollectList extends Component<PageOwnProps, PageState> {
  state = {
    productType: ProductType.GOODS,
  }

  config: Config = {
    navigationBarTitleText: '',
  }

  componentWillMount(): void {
    const { productType } = this.$router.params
    this.setState({ productType: productType as ProductType })
    Taro.setNavigationBarTitle({
      title: `${TITLES[productType]}收藏` || '收藏列表',
    })
  }

  componentDidMount(): void {
    this.fetchListData()
  }

  componentWillUnmount(): void {
    this.props.resetState()
  }

  getSearchInput() {
    const { pageIndex, pageSize } = this.props.myCollectList

    return {
      pageIndex,
      pageSize,
      productType: this.state.productType,
    }
  }

  isFetching(): boolean {
    const { showLoadMore, showPreload } = this.props.myCollectList
    return showLoadMore || showPreload
  }

  fetchListData(): void {
    const searchInput = this.getSearchInput()

    this.props.fetchMyCollectList(searchInput)
  }

  handleGotoDetail(item: Product): void {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${item.id}&productType=${this.state.productType}`,
    })
  }

  onScrollToBottom = (): void => {
    const { totalPages, pageIndex } = this.props.myCollectList
    if(pageIndex >= totalPages || this.isFetching()) {
      return
    }

    this.fetchListData()
  }

  renderEmpty(): ReactNodeLike {
    const { myCollectList } = this.props
    const { listData } = myCollectList

    if(!listData.length && !this.isFetching()) {
      return <View className={styles.empty}>暂无相关数据</View>
    }
  }

  renderListData(): ReactNodeLike {
    const { myCollectList } = this.props
    const { listData } = myCollectList
    return listData.map((item: Product) => (
      <ProductListItem item={item} key={item.id} onClick={() => this.handleGotoDetail(item)} />
    ))
  }

  renderLoadMore(): ReactNodeLike {
    const { myCollectList } = this.props
    const { showLoadMore } = myCollectList
    if(showLoadMore) {
      return <AtLoadMore status="loading" />
    }
  }

  renderNoMore(): ReactNodeLike {
    const { myCollectList } = this.props
    const { totalPages, pageIndex, listData } = myCollectList

    // TODO: 大于 5 条并且加载完
    if((listData.length > 5 && pageIndex >= totalPages)) {
      return <AtLoadMore status="noMore" noMoreTextStyle="color: #c8c8c8" />
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

  renderToast() {
    const { myCollectList } = this.props
    const { isToastOpened, toastText } = myCollectList

    return <AtToast isOpened={isToastOpened} hasMask status="error" text={toastText}></AtToast>
  }

  render() {

    const { showPreload } = this.props.myCollectList
    return (
      <View className={styles.container}>
        { showPreload ? <Preload /> : this.renderScrollView() }
        {this.renderToast()}
      </View>
    )
  }
}

export default MyCollectList as ComponentClass<PageOwnProps, PageState>
