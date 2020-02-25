import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton,AtToast }  from 'taro-ui'
import {connect} from '@tarojs/redux'
import {ComponentClass} from 'react'

import TabBar from '../../components/tabBar'
import PublishInfo from './info'
import Category from './category'
import Contact from './contact'
import PublishImages from './images'
import client from '../../graphql-client'
import { publishMutation } from '../../query/publish'
import { cleanArrayEmpty } from '../../utils/helper'

import './index.scss'

const requiredTips = {
  title: '标题不能为空',
  price:'价格不能为空',
  detail:'详情不能为空',
  selectedCategory: '分类不能为空',
  selectedContacts: '联系方式不能为空',
}



type UserInfo = {
  contacts: Contact.InContact[],
  id: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Publish {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))
class Publish extends Component {

  state = {
    toastText: '',
    showToast: false,

    title: '',
    price:'',
    detail:'',
    selectedCategory: '',
    selectedContacts: [],
  }

  validRequired = (val) => {
    if (!val.length){
      return false
    }
    return true
  }

  showErrorMessage = (name) => {
    const text = requiredTips[name]
    this.setState({
      showToast: true,
      toastText: text
    })
  }

  vaildInput = (isShowErrorMessage = false) => {
    const {title, price, detail, selectedCategory, selectedContacts} = this.state
    if(!this.validRequired(title)){
      isShowErrorMessage && this.showErrorMessage('title')
      return false
    }
    if(!this.validRequired(price)){
      isShowErrorMessage && this.showErrorMessage('price')
      return false
    }
    if(!this.validRequired(detail)){
      isShowErrorMessage && this.showErrorMessage('detail')
      return false
    }
    if(!this.validRequired(selectedCategory)){
      isShowErrorMessage && this.showErrorMessage('selectedCategory')
      return false
    }
    if(!this.validRequired(selectedContacts)){
      isShowErrorMessage && this.showErrorMessage('selectedContacts')
      return false
    }
    return true
  }

  handleSubmit = async () => {
    if (this.vaildInput(true)) {
      // transform contact type to id
      const contactIds = cleanArrayEmpty(this.state.selectedContacts.map(item => {
        const matchedContact: Contact.InContact | undefined = this.props.userInfo.contacts.find(contact => contact.type === item)
        return matchedContact ? matchedContact.id : undefined
      }))

      const publishInfo = {
        owner: this.props.userInfo.id,
        title: this.state.title,
        price: this.state.price,
        description: this.state.detail,
        category: this.state.selectedCategory,
        coverUrl: 'string',
        pictures: [],
        contacts: contactIds,
      }

      try {
        const { data } = await client.mutate({mutation:publishMutation, variables: { publishInfo }})
        Taro.navigateTo({
          url: '/pages/detail/index?id=' + data.publish
        })
      } catch (e) {
        throw e
      }
    }

  }

  handleClose = () => {
    this.setState({
      showToast: false,
      toastText: ''
    })
  }

  setVal = (key,value) => {
    this.setState({
      [key]:value
    })
  }

  config: Config = {
    navigationBarTitleText: '出售',
  }

  render () {
    return (
      <View className="publish">
        <PublishInfo onSetVal={this.setVal} />
        <PublishImages  onSetVal={this.setVal} />
        <Category onSetVal={this.setVal} selectedCategory={this.state.selectedCategory} />
        <Contact
          contacts={this.props.userInfo.contacts}
          onSetVal={this.setVal}
          selectedContacts={this.state.selectedContacts}
        />
        <View className="form_btn">
          <AtButton type="primary" onClick={this.handleSubmit} disabled={!this.vaildInput()}>发布</AtButton>
        </View>
        <AtToast isOpened={this.state.showToast} text={this.state.toastText} onClose={this.handleClose} hasMask status="error"></AtToast>
        <TabBar  current={1} />
      </View>
    )
  }
}

export default Publish as ComponentClass<PageOwnProps, PageState>
