import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import avatarUrl from '../../assets/avatar.png'
import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import './index.scss'

export default class GoodsDetail extends Component {

  state = {
    userInfo: {
      avatarUrl: avatarUrl,
      nickname: 'nickname'
    },
    price: 2700,
    description: '李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾李源春的垃圾',
  }

  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '帖子详情',
  }

  render () {
    return (
      <View className="detail">
        <Avatar
          avatarSize={80}
          nameSize={36}
          {...this.state.userInfo}
        />
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">
            {this.state.price}
          </Text>
        </View>
        <View className="detial-container">
          <View className="title">
            <Text>商品详情</Text>
          </View>
          <View className="status-tags">
            <Tag tagName="出售" style={{ marginRight: '10rpx' }} />
            <Tag tagName="已下架" style={{ marginRight: '10rpx' }} />
          </View>
          <View className="description">
            <ExtendedContainer maxLine={2} content={this.state.description} />
          </View>
          <View className="pictures">
            <Image className="picture" src={this.state.userInfo.avatarUrl} />
            <Image className="picture" src={this.state.userInfo.avatarUrl} />
            <Image className="picture" src={this.state.userInfo.avatarUrl} />
          </View>
        </View>
        <View className="footer">
          <Button className="contact-btn">获取联系方式</Button>
        </View>
      </View>
    )
  }
}
