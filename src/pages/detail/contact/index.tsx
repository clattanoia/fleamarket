import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { ReactNodeLike } from 'prop-types'

import { CONTACT_MAPPING } from '../../../constants/contact'

import './index.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  contacts: Contact.InContact[]
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Contact {
  props: IProps;
}

class Contact extends Component {
  renderContactItem(contacts): ReactNodeLike {
    return <View>
      {contacts.map(contact => (<View key={contact} className='contact-item'>
        <Text>{CONTACT_MAPPING[contact.type]}：</Text>
        <Text>{contact.content}</Text>
      </View>))}
    </View>

  }

  render() {
    return (
      <View className='contact'>
        <View className='contact-title'>
          <Text className='contact-title'>这是发帖者提供的联系方式，赶快联系他吧～</Text>
        </View>
        {
          this.props.contacts.length > 0 ?
            this.renderContactItem(this.props.contacts)
            :
            <View className='contact-default'>这个人很懒，什么都没留下</View>
        }
      </View>
    )
  }
}

export default Contact as ComponentClass<PageOwnProps, PageState>
