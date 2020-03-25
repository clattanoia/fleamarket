import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtIcon, AtAccordion, AtList, AtListItem, AtButton } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import TabBar from '../../components/tabBar'
import Avatar from '../../components/avatar'
import OperationItem from '../../components/operationItem'
import CertifyModal from './cetification'

import client from '../../graphql-client'
import { profileInfoQuery } from '../../query/profile'
import { CertifyEmail, ProductType, Origin } from '../../constants/enums'
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
    salesCollectCount: 0,
    purchaseCollectCount: 0,

    certificationModalOpened: false,
    isOpenCollect: true,
  }

  async componentDidMount() {
    this.getProfileInfo()
  }

  async componentDidShow() {
    this.getProfileInfo()
  }

  getProfileInfo = async() => {
    const { data: { profileInfo }} = await client.query({
      query: profileInfoQuery,
      variables: { userId: this.props.userInfo.id },
    })
    this.setState({
      salesCount: profileInfo.salesCount,
      purchaseCount: profileInfo.purchaseCount,
      salesCollectCount: profileInfo.salesCollectCount,
      purchaseCollectCount: profileInfo.purchaseCollectCount,
    })
  }

  editProfile = () => {
    Taro.navigateTo({
      url: '/pages/profile/edit/index',
    })
  }

  getContracts = () => {
    Taro.navigateTo({
      url: '/pages/profile/contact/index',
    })
  }

  toMyProductList = (productType, origin) => () => {
    Taro.navigateTo({
      url: `/pages/myProductList/index?productType=${productType}&origin=${origin}`,
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

  collectClick = (val) => {
    this.setState({
      isOpenCollect: val,
    })
  }

  render() {
    const  { isOpenCollect, purchaseCollectCount, salesCollectCount } = this.state
    return (
      <View className='profile'>
        <View className='profile-header' onClick={this.editProfile}>
          <Avatar
            certificate={this.props.userInfo.certification === CertifyEmail.CERTIFIED}
            userId={this.props.userInfo.id}
            avatarUrl={this.props.userInfo.avatarUrl}
            avatarSize={108}
          />
          <View className='header-right'>
            <Text className='name'>{this.props.userInfo.nickname}</Text>
            <View className='description'>{this.props.userInfo.brief || '这个人很懒，什么也没有留下~'}</View>
          </View>
          <View className="header-icon">
            <AtIcon prefixClass='iconfont' value='iconright' size="40" color='#fff'></AtIcon>
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
              handleClick={this.toMyProductList(ProductType.GOODS, Origin.PUBLISH)}
            ></OperationItem>
            <OperationItem
              title='我的求购'
              count={this.state.purchaseCount}
              icon='iconmairu'
              iconColor='#646de9'
              handleClick={this.toMyProductList(ProductType.PURCHASE, Origin.PUBLISH)}
            ></OperationItem>
          </View>
          <View className="contract">
            <AtAccordion
              title='我的收藏'
              icon={{ value: 'star', color: '#FF842F', size: '22' }}
              open={isOpenCollect}
              onClick={this.collectClick}
            >
              <AtList hasBorder={false}>
                <AtListItem
                  title='出售'
                  extraText={`${salesCollectCount || 0 }`}
                  arrow='right'
                  onClick={this.toMyProductList(ProductType.GOODS, Origin.COLLECT)}
                />
                <AtListItem
                  title='求购'
                  extraText={`${purchaseCollectCount || 0}`}
                  arrow='right'
                  onClick={this.toMyProductList(ProductType.PURCHASE, Origin.COLLECT)}
                />
              </AtList>
            </AtAccordion>
          </View>
          <View className='contract'>
            <OperationItem
              title='联系方式'
              icon='icondianhua'
              iconColor='#fb5d5e'
              handleClick={this.getContracts}
            ></OperationItem>
          </View>
          <View className="feedback">
            <AtButton className="feedback-btn" openType="feedback">
            </AtButton>
            <OperationItem
              title='建议/反馈'
              icon='iconinfo'
              iconColor='#FE5155'
              handleClick={() => {}}
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
