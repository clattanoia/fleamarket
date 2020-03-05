import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtButton, AtInput, AtToast, AtRadio } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

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

const regexs = {
  PHONE: /^1\d{10}$/,
  WECHAT: /^[a-zA-Z]{1}[a-zA-Z0-9_-]{5,19}$/,
  // eslint-disable-next-line no-useless-escape
  EMAIL: /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
}

const ERROR_MESSAGE = {
  REQUIRED: '请先选择类型',
  PHONE: '请输入正确的电话号码',
  WECHAT: '请输入正确的微信号',
  EMAIL: '请输入正确的邮箱地址',
}

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
    type: '',

    showToast: false,
    toastText: '',

    isSaving: false,
  }

  handleNameChange = (value) => {
    this.setState({
      name: value,
    })
    return value
  }

  handleContentChange = (value) => {
    this.setState({
      content: value,
    })
    return value
  }

  handleTypeChange = (value) => {
    this.setState({
      type: value,
    })
  }

  isValidInput = (): boolean => {
    if(!this.state.type) {
      this.setState({
        toastText: ERROR_MESSAGE.REQUIRED,
      })
      return false
    }
    if(!regexs[this.state.type].test(this.state.content)) {
      this.setState({
        toastText: ERROR_MESSAGE[this.state.type],
      })
      return false
    }
    return true
  }

  addContact = async(): Promise<void> => {
    if(!this.isValidInput()) {
      this.setState({
        showToast: true,
      })
    }
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
          <View className='type-radio'>
            <AtRadio
              options={[
                { label: '电话', value: 'PHONE' },
                { label: '微信', value: 'WECHAT' },
                { label: '邮件', value: 'EMAIL' },
              ]}
              value={this.state.type}
              onClick={this.handleTypeChange}
            />
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
            onChange={this.handleNameChange}
          />
        </View>
        <View className='content'>
          <AtInput
            name='content'
            title='内容'
            type='text'
            placeholder='请输入内容'
            value={this.state.content}
            onChange={this.handleContentChange}
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
