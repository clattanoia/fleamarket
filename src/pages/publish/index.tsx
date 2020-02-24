import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton,AtToast }  from 'taro-ui'

import TabBar from '../../components/tabBar'
import PublishInfo from './info'
import Category from './category'
import Contact from './contact'
import PublishImages from './images'
import './index.scss'

const requiredTips = {
  title: '标题不能为空',
  price:'价格不能为空',
  detail:'详情不能为空',
  selectedCategory: '分类不能为空',
  selectedContacts: '联系方式不能为空',
}

export default class Publish extends Component {

  state = {
    title: '',
    price:'',
    detail:'',
    showToast: false,
    toastText: '',
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
    const {title, price, detail, selectedCategory} = this.state
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
    if(!this.validRequired(selectedCategory)){
      isShowErrorMessage && this.showErrorMessage('selectedContacts')
      return false
    }
    return true
  }

  handleSubmit = () => {
    if (this.vaildInput(true)) {
      // todo
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
    navigationBarTitleText: 'publish',
  }

  render () {
    return (
      <View className="publish">
        <PublishInfo onSetVal={this.setVal} />
        <PublishImages  onSetVal={this.setVal} />
        <Category onSetVal={this.setVal} selectedCategory={this.state.selectedCategory} />
        <Contact onSetVal={this.setVal} selectedContacts={this.state.selectedContacts} />
        <View className="form_btn">
          <AtButton type="primary" onClick={this.handleSubmit} disabled={!this.vaildInput()}>发布</AtButton>
        </View>
        <AtToast isOpened={this.state.showToast} text={this.state.toastText} onClose={this.handleClose} hasMask status="error"></AtToast>
        <TabBar  current={1} />
      </View>
    )
  }
}
