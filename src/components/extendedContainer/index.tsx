import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { CSSProperties } from 'react'
import {getLineText} from '../../utils/textareaValue'

import './index.scss'

interface InProps {
  content: string;
  maxLine: number;
  needSwitch?: boolean;
  style?: {
    [key: string]: string
  };
}

class ExtendedContainer extends Component<InProps, {
  extend: boolean;
  needSwitch: boolean
}> {

  constructor(props: InProps) {
    super(props)
    this.state = {
      extend: false,
      needSwitch: true
    }
  }

  componentDidMount () {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query.select('#switch').boundingClientRect()
    query.select('#content').boundingClientRect().exec(res => {
      const [ switchDom, contentDom ] = res
      if ((contentDom.height / switchDom.height) < this.props.maxLine) {
        this.setState({ needSwitch: false })
      }
    })
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
    const { content } = this.props
    const { extend, needSwitch } = this.state
    return (
      <View className="extend-container">
        <View id="content" className="content" style={style as CSSProperties}>
          <Text>{getLineText(content)}</Text>
        </View>
        {
          needSwitch ? (
            <Text id="switch" className="switch" onClick={this.toggle}>{extend ? '收起' : '展开'}</Text>
          ) : null
        }
      </View>
    )
  }
}


export default ExtendedContainer
