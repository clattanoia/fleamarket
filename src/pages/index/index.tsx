import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import {View, Button, Text, Image} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar } from 'taro-ui'

import CustomButton from '../../components/button'

import { add, minus, asyncAdd, asyncGrapqlFetch } from '../../actions/counter'

import './index.scss'
import goods from '../../assets/goods.jpg'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
    data: any
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => void
  asyncGrapqlFetch: () => Function
  // asyncGraphqlAdd: () => any
  // asyncGet: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  },
  asyncGrapqlFetch () {
    dispatch(asyncGrapqlFetch())
  }
  // asyncGraphqlAdd() {
  //   dispatch(asyncGraphqlAdd())
  // },
  // asyncGet() {
  //   dispatch(asyncGet())
  // }
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
          <View className='list-item'>
            <Image className='goods-image' src={goods} />
            <Text className='goods-name'>榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机</Text>
            <View className='detail'>
              <Text className='goods-price'><Text className='unit'>￥</Text>2700</Text>
              <Text className='goods-tag'>家电</Text>
            </View>
            <AtAvatar circle size="small" image='https://jdc.jd.com/img/200'></AtAvatar>
          </View>
          <View className='list-item'>
            <Image className='goods-image' src={goods} />
            <Text className='goods-name'>榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机榨汁机</Text>
            <View className='detail'>
              <Text className='goods-price'><Text className='unit'>￥</Text>2700</Text>
              <Text className='goods-tag'>家电</Text>
            </View>
          </View>
        </View>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <Button className='dec_btn' onClick={this.props.asyncGrapqlFetch}>fetch</Button>
        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>{JSON.stringify(this.props.counter.data, null, 4)}</Text></View>
        <CustomButton />
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
