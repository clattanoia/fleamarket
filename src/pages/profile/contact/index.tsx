import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import { AtButton } from 'taro-ui'

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

  addContact() {
    Taro.navigateTo({
      url: '/pages/profile/contact/add/index',
    })
  }

  render() {
    return (
      <View className='contact'>
        <View className='contact-list'>
          { this.props.userInfo.contacts.length === 0 ?
            <View className='no-contacts'><Text>暂无联系方式，请先新增联系方式吧~</Text></View>
            : this.props.userInfo.contacts.map(item =>
              <View key={item.id} className='contact-item'>
                <View className='left-container'>
                  <Text className='label'>{item.label || '电话'}</Text>
                  <Text className='content'>{item.content}</Text>
                </View>
                <Text className='delete-btn'>删除</Text>
              </View>
            )}
        </View>
        <View className="add_btn">
          <AtButton
            type="primary"
            onClick={this.addContact}
          >新增</AtButton>
        </View>
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
