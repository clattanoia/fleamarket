import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton,AtToast }  from 'taro-ui'

import PublishInfo from './info'
import './index.scss'

const requiredTips = {
  title: '标题不能为空',
  price:'价格不能为空',
  detail:'详情不能为空',
}

export default class Publish extends Component {

  state = {
    title: '',
    price:'',
    detail:'',
    showToast: false,
    toastText: ''
  }

  validRequired = (val,name) => {
    if (!val.length){
      const text = requiredTips[name]
      this.setState({
        showToast: true,
        toastText: text
      })
      return false
    }
    return true
  }

  validPrice = (val) => {
    const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
    let msg = ''
    if(val > Math.pow(2,53)){
      msg = '价格不能大于9007199254740992'
    }
    if(!reg.test(val)){
      msg = '请输入正确的价格'
    }
    if(msg){
      this.setState({
        showToast:true,
        toastText:msg
      })
      return false
    }
    return true
  }

  handleSubmit = () => {
    const {title,price,detail} = this.state
    if(!this.validRequired(title,'title')){
      return
    }
    if(!this.validRequired(price,'price')){
      return
    }
    if(!this.validPrice(price)){
      return
    }
    if(!this.validRequired(detail,'detail')){
      return
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
        <PublishInfo setVal={this.setVal} />

        <View className="form_btn">
          <AtButton type="primary" onClick={this.handleSubmit}>发布</AtButton>
        </View>
        <AtToast isOpened={this.state.showToast} text={this.state.toastText} onClose={this.handleClose} hasMask status="error"></AtToast>
      </View>
    )
  }
}
