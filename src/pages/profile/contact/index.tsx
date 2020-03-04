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
      <View className='contact'>
        <View className='fix-top-container'>
          <Text className="add-btn">新增</Text>
        </View>
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
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
