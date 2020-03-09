import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtFloatLayout, AtIcon, AtCheckbox, AtButton } from 'taro-ui'
import { Text, View } from '@tarojs/components'
import { ReactNodeLike } from 'prop-types'

import FormLine from '../../../components/formLine'
import { InContact, InContactOptions } from '../../../interfaces/contact'
import './index.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  selectedContacts: string[],
  contacts: InContact[],
  onSetVal: (key, value) => void,
}

type PageState = {
  isOpen: boolean,
  checkedOptions: string[],
  contactOptions: InContactOptions[],
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Contact {
  props: IProps;
}

class Contact extends Component<PageOwnProps, PageState> {

  state = {
    isOpen: false,
    contactOptions: [],
    checkedOptions: [],
  }

  componentDidMount(): void {
    const contactOptions = this.props.contacts
      .filter(item => item.content)
      .map(item => ({
        value: item.id,
        labelName: item.label,
        label: `${item.label}（${item.content}）`,
      }))

    this.setState({
      contactOptions,
      checkedOptions: this.props.selectedContacts,
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.selectedContacts !== this.props.selectedContacts) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        checkedOptions: this.props.selectedContacts,
      })
    }
  }

  onClose = (): void => {
    this.setState({
      isOpen: false,
      checkedOptions: this.props.selectedContacts,
    })
  }

  onConfirm = (): void => {
    this.setState({ isOpen: false })
    this.props.onSetVal('selectedContacts', this.state.checkedOptions)
  }

  handleValueClick(): void {
    this.setState({ isOpen: true })
  }

  handleChange = (val): void => {
    this.setState({
      checkedOptions: val,
    })
  }

  renderContactText(): ReactNodeLike {
    const { selectedContacts } = this.props
    const { contactOptions } = this.state

    const contactText: string = contactOptions
      .filter((item: InContactOptions) => selectedContacts.indexOf(item.value) > -1)
      .map((item: InContactOptions) => item.labelName)
      .join('，') || '选择联系方式'

    return <Text className='value'>{contactText}</Text>
  }

  render() {
    return (
      <View className='contact'>
        <FormLine title="联系方式">
          <View className='right-container' onClick={this.handleValueClick}>
            {this.renderContactText()}
            <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
          </View>
        </FormLine>
        <AtFloatLayout isOpened={this.state.isOpen} onClose={this.onClose}>
          <View className="checkbox-layout-header">
            <Text>请选择联系方式</Text>
            <AtButton
              className="contact-checkbox-confirm"
              type="secondary"
              size="small"
              onClick={this.onConfirm}
            >确定</AtButton>
          </View>
          {
            this.state.contactOptions.length > 0 ?
              <AtCheckbox
                options={this.state.contactOptions}
                selectedList={this.state.checkedOptions}
                onChange={this.handleChange}
              />
              :
              <View className="contact-placeholder">请先设置联系方式</View>
          }
        </AtFloatLayout>
      </View>
    )
  }
}

export default Contact as ComponentClass<PageOwnProps, PageState>
