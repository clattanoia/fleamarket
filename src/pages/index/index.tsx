import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'

import { fetchRecommendGoods } from '../../actions/recommend'
import { fetchUserInfo } from '../../actions/userInfo'
import TabBar from '../../components/tabBar'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

interface User {
  nickname: string,
  avatarUrl: string
}

interface Goods {
  id: string,
  title: string,
  coverUrl: string,
  price: number,
  categoryName: string,
  owner: User,
}

type PageStateProps = {
  recommend: {
    goods: Array<Goods>,
  }
}

type PageDispatchProps = {
  fetchRecommendGoods: () => Function,
  fetchUserInfo: () => Function,
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ recommend }) => ({
  recommend
}), (dispatch) => ({
  fetchRecommendGoods () {
    dispatch(fetchRecommendGoods())
  },
  fetchUserInfo () {
    dispatch(fetchUserInfo())
  }
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
    navigationBarTitleText: '骚窝跳蚤平台'
  }

  componentWillReceiveProps () {}

  componentDidMount() {
    this.props.fetchRecommendGoods()
    this.props.fetchUserInfo()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClickEvent() {
    Taro.navigateTo({
      url: '/pages/detail/index'
    })
  }

  render () {
    return (
      <View className='index'>
        <Text className='category'>看推荐</Text>
        {this.props.recommend.goods.length === 0 ?
          <View className='no-goods'><Text>暂无信息</Text></View> :
          <View className='wrapper-list'>
            {this.props.recommend.goods.map(item =>
              <View className='list-item' key={item.id}>
                <Image className='goods-image' src={item.coverUrl} onClick={this.onClickEvent} />
                <Text className='goods-name' onClick={this.onClickEvent}>{item.title}</Text>
                <View className='detail'>
                  <Text className='goods-price'><Text className='unit'>￥</Text>{item.price}</Text>
                  <Text className='goods-tag'>{item.categoryName}</Text>
                </View>
                <View className='user-info'>
                  <AtAvatar circle size="small" image={item.owner.avatarUrl}></AtAvatar>
                  <Text className='name'>{item.owner.nickname}</Text>
                </View>
              </View>
            )}
          </View>
        }
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
