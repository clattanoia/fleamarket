import Taro, { Component, Config } from '@tarojs/taro'
import { Button, Text, View } from '@tarojs/components'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import { AtButton, AtModal, AtModalAction, AtModalContent, AtToast } from 'taro-ui'

import './index.scss'
import { deleteContact } from '../../../actions/userInfo'

type UserInfo = {
  contacts: Contact.InContact[],
  id: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {
  deleteContact: (contactId: string, userId: string) => Function
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
  deleteContact(contactId, userId){
    dispatch(deleteContact(contactId, userId))
  },
}))
class Profile extends Component {

  config: Config = {
    navigationBarTitleText: '联系方式',
  }

  state = {
    isModalOpened: false,
    isToastOpened: false,
    toastText: '',
    contactId: '',
  }

  componentDidMount(): void {
    console.log(this.props.userInfo.contacts)
  }

  addContact() {
    Taro.navigateTo({
      url: '/pages/profile/contact/add/index',
    })
  }

  deleteContact(contactId) {
    return () => {
      this.setState({
        isModalOpened: true,
        contactId,
      })
    }
  }

  closeModal = () => {
    this.setState({
      isModalOpened: false,
    })
  }

  closeToast = () => {
    this.setState({
      isToastOpened: false,
    })
  }

  handleConfirm = async() => {
    await this.props.deleteContact(this.state.contactId, this.props.userInfo.id)
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
                  <Text className='label'>{item.label}</Text>
                  <Text className='content'>{item.content}</Text>
                </View>
                <Text className='delete-btn' onClick={this.deleteContact(item.id)}>删除</Text>
              </View>
            )}
        </View>
        <View className="add_btn">
          <AtButton
            type="primary"
            onClick={this.addContact}
          >新增</AtButton>
        </View>

        <AtModal isOpened={this.state.isModalOpened}>
          <AtModalContent>
            <View className='model-content'><Text>联系方式可能与一些帖子相关联，删除之后帖子的联系方式消失，确定需要删除？</Text></View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>取消</Button>
            <Button onClick={this.handleConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtToast isOpened={this.state.isToastOpened} hasMask status='error' text={this.state.toastText} onClose={this.closeToast}></AtToast>
      </View>
    )
  }
}

export default Profile as ComponentClass<PageOwnProps, PageState>
