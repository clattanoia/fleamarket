import Taro, { Component, Config } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtButton, AtInput, AtToast, AtCheckbox } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import './index.scss'
import { addContact } from '../../../../actions/userInfo'

type UserInfo = {
  id: string,
}

interface AddContactInput {
  label: string,
  content: string,
  type: string
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {
  addContact: (addContact: AddContactInput, userId: string) => Function,
}

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
  REQUIRED: '请先输入类型，名称和内容',
  PHONE: '请输入正确的电话号码',
  WECHAT: '请输入正确的微信号',
  EMAIL: '请输入正确的邮箱地址',
  SYSTEM_ERROR: '服务异常，请稍后再试',
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}), (dispatch) => ({
  addContact(data, userId) {
    dispatch(addContact(data, userId))
  },
}))
class AddContact extends Component {

  config: Config = {
    navigationBarTitleText: '联系方式',
  }

  state = {
    label: '',
    content: '',
    type: '',

    showToast: false,
    toastText: '',
  }

  setStateValue = (key, value): void => {
    this.setState({
      [key]: value,
    })
  }

  handleNameChange = (value) => {
    this.setStateValue('label', value)
    return value
  }

  handleContentChange = (value) => {
    this.setStateValue('content', value)
    return value
  }

  handleTypeChange = (value) => {
    this.setStateValue('type', value.pop())
  }

  isValidInput = (): boolean => {
    if(!this.state.label || !this.state.type || !this.state.content) {
      this.setStateValue('toastText', ERROR_MESSAGE.REQUIRED)
      return false
    }
    if(!regexs[this.state.type].test(this.state.content)) {
      this.setStateValue('toastText', ERROR_MESSAGE[this.state.type])
      return false
    }
    return true
  }

  addContact = async(): Promise<void> => {
    if(!this.isValidInput()) {
      this.setStateValue('showToast', true)
      return
    }
    try {
      const addContactInput: AddContactInput = {
        content: this.state.content,
        label: this.state.label,
        type: this.state.type,
      }
      await this.props.addContact(addContactInput, this.props.userInfo.id)
      Taro.navigateBack()
    } catch (e) {
      this.setState({
        showToast: true,
        toastText: ERROR_MESSAGE.SYSTEM_ERROR,
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
          <Text className='type-label'>类型</Text>
          <View className='type-radio'>
            <AtCheckbox
              options={[
                { label: '电话', value: 'PHONE' },
                { label: '微信', value: 'WECHAT' },
                { label: '邮件', value: 'EMAIL' },
              ]}
              selectedList={[this.state.type]}
              onChange={this.handleTypeChange}
            />
          </View>
        </View>
        <View className='label'>
          <AtInput
            name='label'
            title='名称'
            type='text'
            maxLength={5}
            placeholder='请输入名称'
            value={this.state.label}
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
