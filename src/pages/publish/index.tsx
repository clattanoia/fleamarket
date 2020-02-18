import Taro, { Component, Config } from '@tarojs/taro'
import { View ,Text} from '@tarojs/components'
import { AtInput,AtTextarea }  from 'taro-ui'

import './index.scss'

export default class Publish extends Component {

  state = {
    title: '',
    price:'',
    detail:''
  }

  handleChangeTitle = (value) => {
    this.setState({
      title:value
    })
    return value
  }

  handleChangePrice = (value) => {
    this.setState({
      price:value
    })
    return value
  }

  handleChangeDetail = (event) => {
    this.setState({
      detail:event.target.value
    })
  }

  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  config: Config = {
    navigationBarTitleText: 'publish',
  }

  render () {
    return (
      <View>
        <View className='form_line'>
          <Text className='form_line_label'>*</Text>
          <View className='form_line_content'>
            <AtInput
              name='title'
              title=''
              type='text'
              placeholder='请输入标题'
              value={this.state.title}
              onChange={this.handleChangeTitle}
              maxLength={100}
            />
          </View>
        </View>
        <View className='form_line'>
          <Text className='form_line_label'>*</Text>
          <View className='form_line_content'>
            <AtInput
              name='price'
              title=''
              type='number'
              placeholder='请输入期望价格'
              value={this.state.price}
              onChange={this.handleChangePrice}
            />
          </View>
        </View>
        <View className='form_line'>
          <Text className='form_line_label'>*</Text>
          <View className='form_line_content'>
            <AtTextarea
              value={this.state.detail}
              onChange={this.handleChangeDetail}
              maxLength={500}
              placeholder='请输入详情'
              height={200}
            />
          </View>
        </View>


      </View>
    )
  }
}
