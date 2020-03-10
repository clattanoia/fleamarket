import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { fetchUserInfo } from '../../actions/userInfo'
import { fetchCategories } from '../../actions/category'
import TabBar from '../../components/tabBar'
import client from '../../graphql-client'
import { recommendListQuery } from '../../query/recommend'
import SeachSection from './search'
import CategorySection from './category'
import { ProductType } from '../../constants/enums'

import './index.scss'
import ProductList from '../../components/productList'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


interface State {
  goods: Array<Global.Goods>,
}

type PageStateProps = {
}

type PageDispatchProps = {
  fetchUserInfo: () => Function,
  fetchCategories: () => Function,
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(() => ({
}), (dispatch) => ({
  fetchUserInfo() {
    dispatch(fetchUserInfo())
  },
  fetchCategories() {
    dispatch(fetchCategories())
  },
}))
class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '骚窝跳蚤平台',
  }

  state: State = {
    goods: [],
  }

  componentDidMount() {
    this.props.fetchCategories()

    if(Taro.getStorageSync('token')) {
      this.props.fetchUserInfo()
    }
  }

  componentDidShow() {
    this.fetchRecommendList()
  }

  async fetchRecommendList() {
    const query = recommendListQuery
    const { data } = await client.query({ query, variables: {}})
    this.setState({
      goods: data.goods,
    })
  }

  handleGotoPurchase(id): void {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}&productType=${ProductType.PURCHASE}`,
    })
  }

  render() {
    return (
      <View className='index'>
        <View className="fixedTop">
          <SeachSection />
        </View>
        <View className="scrollSection">
          <CategorySection />
          {/*
          <View onClick={() => this.handleGotoPurchase('4c1a663d-0249-47c9-86ee-54e144120ddb')}>浩瀚求购显卡</View>
          <View onClick={() => this.handleGotoPurchase('7bc8317c-74f4-4239-a958-56b19e3696fe')}>林松求购内存</View>
          <View onClick={() => this.handleGotoPurchase('e366c10a-63e5-4c4c-85b3-7045c0603c21')}>红霞求购CPU</View>
          */}

          <Text className='category'>看推荐</Text>
          <View className='wrapper-list'>
            <ProductList productListData={this.state.goods} productType={ProductType.GOODS} />
          </View>
        </View>
        <TabBar current={0} />
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
