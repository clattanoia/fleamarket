import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtButton, AtInput, AtToast } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import SelectLayout from '../../../../components/selectLayout'
import './index.scss'

type UserInfo = {
  id: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface AddContact {
  props: IProps;
}

const contactTypes = [{
  name: '电话',
  id: 'PHONE',
}, {
  name: '微信',
  id: 'WECHAT',
}, {
  name: '邮件',
  id: 'EMAIL',
}]

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))
class AddContact extends Component {

  config: Config = {
    navigationBarTitleText: '联系方式',
  }

  state = {
    name: '',
    content: '',
    // type: '',

    showToast: false,
    toastText: '',

    isSaving: false,
  }

  handleNameChange(value) {
    this.setState({
      name: value,
    })
    return value
  }

  handleContentChange(value) {
    this.setState({
      content: value,
    })
    return value
  }

  handleChange() {

  }

  addContact() {

  }

  handleCloseToast = (): void => {
    this.setState({
      showToast: false,
      toastText: '',
    })
  }

  render() {
    return (
      <View className='add-contact'>
        <View className='type'>
          <Text className='label'>类型</Text>
          <View className='search-layout'>
            <SelectLayout list={contactTypes} current={contactTypes[0]} onChangeSelect={this.handleChange} />
          </View>
        </View>
        <View className='name'>
          <AtInput
            name='name'
            title='名称'
            type='text'
            maxLength={5}
            placeholder='请输入名称'
            value={this.state.name}
            onChange={this.handleNameChange.bind(this)}
          />
        </View>
        <View className='content'>
          <AtInput
            name='content'
            title='内容'
            type='text'
            placeholder='请输入内容'
            value={this.state.content}
            onChange={this.handleContentChange.bind(this)}
          />
        </View>
        <View className="save_btn">
          <AtButton
            type="primary"
            onClick={this.addContact}
            loading={this.state.isSaving}
            disabled={this.state.isSaving}
          >保存</AtButton>
        </View>
        <AtToast
          isOpened={this.state.showToast}
          text={this.state.toastText}
          onClose={this.handleCloseToast}
          hasMask
          status='error'
        ></AtToast>
      </View>
    )
  }
}

export default AddContact as ComponentClass<PageOwnProps, PageState>
