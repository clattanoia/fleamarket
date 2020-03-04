import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SeachSection from '../../components/search'

export default class Search extends Component {

  config: Config = {
    navigationBarTitleText: '搜索',
  }

  render() {
    return (
      <View>
        <SeachSection />
        <Text>Hello search!</Text>
      </View>
    )
  }
}



