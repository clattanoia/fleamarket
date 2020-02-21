import Taro, { Component } from '@tarojs/taro'
import {View, Picker} from '@tarojs/components'

export default class Category extends Component {

  state = {
    selectedCategory: '美国',
    selector: ['美国', '中国', '巴西', '日本']
  }

  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onCategoryChange = (e) => {
    this.setState({
      selectedCategory: this.state.selector[e.detail.value]
    })
  }

  render () {
    return (
      <View>
        <Picker mode='selector' range={this.state.selector} onChange={this.onCategoryChange} value={0}>
          <View className='picker'>
            当前选择：{this.state.selectedCategory}
          </View>
        </Picker>
      </View>
    )
  }
}
