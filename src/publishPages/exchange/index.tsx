import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtSwitch } from 'taro-ui'
import { View, Text } from '@tarojs/components'

import './index.scss'

type PageOwnProps = {
  onSetVal: (key, value) => void,
  agreeExchange: boolean,
}

type PageState = {}

class Exchange extends Component<PageOwnProps, PageState> {
  onSwitch = (value) => {
    this.props.onSetVal('agreeExchange', value)
  }

  render() {
    return (
      <View className='exchange'>
        <View><Text>允许以货换货</Text></View>
        <View>
          <AtSwitch
            className='exchange-switch'
            color='#FE5155'
            border={false}
            checked={this.props.agreeExchange}
            onChange={this.onSwitch}
          />
        </View>
      </View>
    )
  }
}

export default Exchange as ComponentClass<PageOwnProps, PageState>
