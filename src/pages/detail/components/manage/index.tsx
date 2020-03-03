import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtModal, AtModalContent, AtModalAction } from 'taro-ui'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'

import styles from './index.module.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  goodsId: string
  isOpened: boolean
  onClose: BaseEventOrigFunction<void>
}

type PageState = {
  isModalOpened: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Manage {
  props: IProps;
}

class Manage extends Component {
  state = {
    isModalOpened: false,
  }

  soldout = (event) => {
    this.setState({
      isModalOpened: true,
    })
    this.props.onClose(event)
  }

  handleSoldout = async() => {
    console.log(this.props.goodsId)
    this.closeModal()
  }

  closeModal = () => {
    this.setState({
      isModalOpened: false,
    })
  }

  activate = () => {}

  render() {
    const { isOpened } = this.props
    return (
      <View>
        <AtActionSheet isOpened={isOpened} cancelText='取消' title='编辑'>
          <AtActionSheetItem onClick={this.activate}>
            激活
          </AtActionSheetItem>
          <AtActionSheetItem onClick={this.soldout}>
            下架
          </AtActionSheetItem>
        </AtActionSheet>
        <AtModal isOpened={this.state.isModalOpened}>
          <AtModalContent>
            <View className={styles.modalContent}><Text>确认下架此二货吗？</Text></View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>取消</Button>
            <Button onClick={this.handleSoldout}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
  }
}

export default Manage as ComponentClass<PageOwnProps, PageState>
