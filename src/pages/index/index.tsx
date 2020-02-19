import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'

import { fetchRecommendGoods } from '../../actions/recommend'

import './index.scss'
import goods from '../../assets/goods.jpg'
import avatar from '../../assets/avatar.png'

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
  name: string,
  avatar: string
}

interface Goods {
  id: string,
  title: string,
  image: string,
  price: number,
  tag: string,
  user: User,
}

type PageStateProps = {
  recommend: {
    recommendList: Array<Goods>,
    data: any
  }
}

type PageDispatchProps = {
  fetchRecommendGoods: () => Function
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

  state = {
    goodsList: [{
      id: 1,
      title: '榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机',
      image: goods,
      price: 2700,
      tag: '家电',
      user: {
        name: '昵称',
        avatar: avatar
      }
    }, {
      id: 2,
      title: '榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机',
      image: goods,
      price: 2700,
      tag: '家电',
      user: {
        name: '昵称',
        avatar: avatar
      }
    }]
  }

  componentWillReceiveProps () {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text className='category'>看推荐</Text>
        <View className='wrapper-list'>
          { this.state.goodsList.map(item =>
            <View className='list-item' key={item.id}>
              <Image className='goods-image' src={item.image} />
              <Text className='goods-name'>{item.title}</Text>
              <View className='detail'>
                <Text className='goods-price'><Text className='unit'>￥</Text>{item.price}</Text>
                <Text className='goods-tag'>{item.tag}</Text>
              </View>
              <View className='user-info'>
                <AtAvatar circle size="small" image={item.user.avatar}></AtAvatar>
                <Text className='name'>{item.user.name}</Text>
              </View>
            </View>
          )}
        </View>
        <Button className='dec_btn' onClick={this.props.fetchRecommendGoods}>fetch</Button>
        <View><Text>{JSON.stringify(this.props.recommend.data, null, 4)}</Text></View>
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
