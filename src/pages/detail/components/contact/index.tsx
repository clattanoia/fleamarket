import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { AtButton, AtFloatLayout } from 'taro-ui'
import { ReactNodeLike } from 'prop-types'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'

import { InContact } from '../../../../interfaces/contact'

import './index.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  isOpen: boolean
  contacts: InContact[]
  onClose: BaseEventOrigFunction<void>
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Contact {
  props: IProps;
}

const CONTACT_TYPE = {
  EMAIL: '邮箱',
  PHONE: '电话',
  WECHAT: '微信',
}

class Contact extends Component {
  renderContactItem(contacts): ReactNodeLike {
    return <View>
      {contacts.map(contact => (<View key={contact} className='contact-item'>
        <Text>{CONTACT_TYPE[contact.type]}：</Text>
        <Text selectable>{contact.content}</Text>
      </View>))}
    </View>

  }

  render() {
    const { isOpen, contacts, onClose } = this.props
    return (
      <AtFloatLayout isOpened={isOpen} onClose={onClose}>
        <View className='contact'>
          <View className='contact-title'>
            <Text className='contact-title'>这是发帖者提供的联系方式，赶快联系TA吧～</Text>
          </View>
          {
            contacts && contacts.length > 0 ?
              this.renderContactItem(contacts)
              :
              <View className='contact-default'>暂无联系方式</View>
          }
          <View className="contact-btn">
            <AtButton type='primary' size='small' onClick={onClose}>关闭</AtButton>
          </View>
        </View>
      </AtFloatLayout>
    )
  }
}

export default Contact as ComponentClass<PageOwnProps, PageState>
