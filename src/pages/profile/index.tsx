import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import TabBar from '../../components/tabBar'
import OperationItem from '../../components/operationItem'
import './index.scss'
import client from '../../graphql-client'
import { profileInfoQuery } from '../../query/profile'
import { ProductType } from '../../constants/enums'
import Avatar from '../../components/avatar'

type UserInfo = {
  avatarUrl: string,
  id: string,
  nickname: string,
  brief: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Profile {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))

class Profile extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '个人中心',
  }

  state = {
    salesCount: 0,
    purchaseCount: 0,
  }

  async componentDidMount() {
    const { data: { profileInfo }} = await client.query({
      query: profileInfoQuery,
      variables: { userId: this.props.userInfo.id },
    })
    this.setState({
      salesCount: profileInfo.salesCount,
      purchaseCount: profileInfo.purchaseCount,
    })
  }

  getContracts = () => {
    Taro.navigateTo({
      url: '/pages/profile/contact/index',
    })
  }

  toMyProductList = (productType) => {
    Taro.navigateTo({
      url: `/pages/myProductList/index?productType=${productType}`,
    })
  }

  render() {
    return (
      <View className='profile'>
        <View className='profile-header'>
          <Avatar
            userId={this.props.userInfo.id}
            avatarUrl={this.props.userInfo.avatarUrl}
            avatarSize={108}
          />
          <View className='header-right'>
            <Text className='name'>{this.props.userInfo.nickname}</Text>
            <Text className='description'>{this.props.userInfo.brief || '这个人很懒，什么也没有留下~'}</Text>
          </View>
        </View>
        <View className='scroll-section'>
          <View className='operation-list'>
            <OperationItem
              title='我的出售'
              count={this.state.salesCount}
              icon='iconmaichu'
              hasDivision
              iconColor='#10ca2e'
              handleClick={() => this.toMyProductList(ProductType.GOODS)}
            ></OperationItem>
            <OperationItem
              title='我的求购'
              count={this.state.purchaseCount}
              icon='iconmairu'
              iconColor='#646de9'
              handleClick={() => this.toMyProductList(ProductType.PURCHASE)}
            ></OperationItem>
          </View>
          <View className='contract'>
            <OperationItem
              title='联系方式'
              icon='icondianhua'
              iconColor='#fb5d5e'
              handleClick={this.getContracts}
            ></OperationItem>
          </View>
        </View>
        <TabBar  current={2} />
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
