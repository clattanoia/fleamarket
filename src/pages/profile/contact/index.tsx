import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import './index.scss'

type UserInfo = {
  contacts: Contact.InContact[],
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

const CONTACT_TYPE = {
  WECHAT: '微信',
  PHONE: '电话',
  EMAIL: '邮箱',
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))
class Profile extends Component {

  config: Config = {
    navigationBarTitleText: '联系方式',
  }

  componentDidMount(): void {
    console.log(this.props.userInfo.contacts)
  }

  render() {
    return (
      <View className='contact-list'>
        {this.props.userInfo.contacts.map(item =>
          <View key={item.id} className='contact-item'>
            <View>
              <Text className='type'>{CONTACT_TYPE[item.type]}</Text>
              <Text className='content'>{item.content}</Text>
            </View>
            <Text className='edit-btn'>编辑</Text>
          </View>
        )}
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
