import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import SeachSection from '../../components/search'
import ResultPage from './resultPage'
import SearchPage from './searchPage'

export default class Search extends Component {

  config: Config = {
    navigationBarTitleText: '搜索',
  }

  render() {
    return (
      <View>
        <SearchPage />
        <ResultPage />
      </View>
    )
  }
}



