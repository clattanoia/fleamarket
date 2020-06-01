import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtSwitch } from 'taro-ui'
import { View } from '@tarojs/components'

import './index.scss'

type PageOwnProps = {
  onSetVal: (key, value) => void,
}

type PageState = {
  isSelected: boolean,
}

class Exchange extends Component<PageOwnProps, PageState> {
  state = {
    isSelected: true,
  }

  onSwitch = (value) => {
    this.setState({ isSelected: value })
    this.props.onSetVal('agreeExchange', value)
  }

  render() {
    return (
      <View className='exchange'>
        <AtSwitch
          className='exchange-switch'
          title='允许以货换货'
          color='#FE5155'
          border={false}
          checked={this.state.isSelected}
          onChange={this.onSwitch}
        />
      </View>
    )
  }
}

export default Exchange as ComponentClass<PageOwnProps, PageState>
