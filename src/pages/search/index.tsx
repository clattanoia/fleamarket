import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SeachSection from '../../components/search'

export default class Search extends Component {

  config: Config = {
    navigationBarTitleText: 'search',
    // navigationStyle: 'custom',
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



