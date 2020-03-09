import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SeachSection from '../../components/search'

export default class SearchList extends Component {

  config: Config = {
    navigationBarTitleText: '列表页',
  }

  render() {
    const { categoryId } = this.$router.params
    return (
      <View>
        <SeachSection />
        <Text>Hello 列表页{categoryId}!</Text>
      </View>
    )
  }
}



