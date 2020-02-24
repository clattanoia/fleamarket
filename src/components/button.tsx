import Taro, { Component } from '@tarojs/taro'
import { AtButton } from 'taro-ui'

class CustomButton extends Component {
  render() {
    return <AtButton type='primary'>按钮文案</AtButton>
  }
}

export default CustomButton
