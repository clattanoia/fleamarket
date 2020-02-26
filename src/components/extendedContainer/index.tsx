import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CSSProperties } from 'react'

import './index.scss'

interface InProps {
  content: string;
  maxLine: number;
  removeSwitch?: boolean;
  style?: {
    [key: string]: string
  };
}

class ExtendedContainer extends Component<InProps, {
  extend: boolean;
}> {

  constructor(props: InProps) {
    super(props)
    this.state = {
      extend: false,
    }
  }

  genStyle = () => {
    const { maxLine, style } = this.props
    const { extend } = this.state
    if (maxLine && !extend) return {
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': maxLine,
      ...style
    }
    return style
  }

  toggle = () => {
    const { extend } = this.state
    this.setState({ extend: !extend })
  }

  render () {
    const style = this.genStyle()
    const { content, removeSwitch } = this.props
    const { extend } = this.state
    return (
      <View className="extend-container">
        <View className="content" style={style as CSSProperties}>{content}</View>
        {
          removeSwitch ? null : (
            <Text className="switch" onClick={this.toggle}>{extend ? '收起' : '展开'}</Text>
          )
        }
      </View>
    )
  }
}


export default ExtendedContainer
