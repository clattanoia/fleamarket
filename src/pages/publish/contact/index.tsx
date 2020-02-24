import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import {AtFloatLayout, AtIcon, AtCheckbox} from 'taro-ui'
import { connect } from '@tarojs/redux'
import {Text, View} from '@tarojs/components'
import {ReactNodeLike} from 'prop-types'


import { CONTACT_MAPPING } from '../../../constants/contact'
import FormLine from '../../../components/formLine'
import './index.scss'


interface ContactItem {
  id: string,
  content: string,
  type: string
}

type PageStateProps = {
  contacts: Array<ContactItem>,
}

type PageDispatchProps = {}

type PageOwnProps = {
  onSetVal: (key,value) => void,
  selectedContacts: string[]
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Contact {
  props: IProps;
}

@connect(({ userInfo }) => ({
  contacts: userInfo.contacts
}))
class Contact extends Component {

  state = {
    isOpen: false,
    contactOptions: []
  }

  componentDidMount(): void {
    const contactOptions = this.props.contacts
      .filter(item => item.content)
      .map(item => ({
        value: item.type,
        label: CONTACT_MAPPING[item.type],
      }))

    this.setState({ contactOptions })
  }

  onClose(): void {
    this.setState({isOpen: false })
  }

  handleValueClick(): void {
    this.setState({ isOpen: true })
  }

  handleChange(): void {
  }

  renderContactText(): ReactNodeLike {
    const { selectedContacts } = this.props
    const contactText = selectedContacts ? selectedContacts.map(item => CONTACT_MAPPING[item]).join('，') : '选择分类'

    return <Text className='value'>{contactText}</Text>
  }

  render () {
    return (
      <View className='contact'>
        <FormLine title="联系方式">
          <View className='right-container' onClick={this.handleValueClick}>
            {this.renderContactText()}
            <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
          </View>
        </FormLine>
        <AtFloatLayout isOpened={this.state.isOpen} title="选择联系方式" onClose={this.onClose}>
          <AtCheckbox
            options={this.state.contactOptions}
            selectedList={this.props.selectedContacts}
            onChange={this.handleChange}
          />
        </AtFloatLayout>
      </View>
    )
  }
}

export default Contact as ComponentClass<PageOwnProps, PageState>
