import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import TabBar from '../../components/tabBar'
import Avatar from '../../components/avatar'
import OperationItem from '../../components/operationItem'
import CertifyModal from './cetification'

import client from '../../graphql-client'
import { profileInfoQuery } from '../../query/profile'
import { CertifyEmail, ProductType } from '../../constants/enums'
import { updateUserInfo } from '../../actions/userInfo'

import './index.scss'

type UserInfo = {
  avatarUrl: string,
  id: string,
  nickname: string,
  brief: string,
  certification: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {
  updateMyUserInfo: (payload) => Function,
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Profile {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}), (dispatch) => ({
  updateMyUserInfo(payload){
    dispatch(updateUserInfo(payload))
  },
}))
class Profile extends Component<PageOwnProps, PageState> {

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

    certificationModalOpened: false,
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

  handleConfirmCertify = () => {
    this.setState({
      certificationModalOpened: false,
    })
    this.props.updateMyUserInfo({
      certification: CertifyEmail.UNCERTIFIED,
    })
  }

  renderCertificationTip = () => {
    const { userInfo } = this.props
    const { certification } = userInfo

    if(certification === CertifyEmail.CERTIFIED) {
      return
    } else if(certification === CertifyEmail.UNCERTIFIED) {
      return (
        <View className="certification-tip">
          <Text>认证邮件已发送，请登录您的邮箱完成验证。</Text>
        </View>
      )
    }

    return (
      <View
        className="certification-tip"
        onClick={() => this.setState({ certificationModalOpened: true })}
      >
        <Text>偷偷告诉你，认证后更容易被联系哦~</Text>
        <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#fff'></AtIcon>
      </View>
    )
  }

  render() {
    return (
      <View className='profile'>
        <View className='profile-header'>
          <Avatar
            certificate={this.props.userInfo.certification === CertifyEmail.CERTIFIED}
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
          {this.renderCertificationTip()}
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
        <CertifyModal
          isOpened={this.state.certificationModalOpened}
          onClose={() => this.setState({ certificationModalOpened: false })}
          onConfirm={this.handleConfirmCertify}
        />
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
