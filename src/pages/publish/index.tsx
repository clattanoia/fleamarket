import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtInput,AtTextarea }  from 'taro-ui'

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

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: 'publish',
  }

  render () {
    return (
      <View>
        <AtInput
          name='title'
          title=''
          type='text'
          placeholder='请输入标题'
          value={this.state.title}
          onChange={this.handleChangeTitle}
          maxLength={100}
        />
        <AtInput
          name='price'
          title=''
          type='number'
          placeholder='请输入价格'
          value={this.state.price}
          onChange={this.handleChangePrice}
        />
        <AtTextarea
          value={this.state.detail}
          onChange={this.handleChangeDetail}
          maxLength={500}
          placeholder='请输入详情'
          height={200}
        />

      </View>
    )
  }
}
