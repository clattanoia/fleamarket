import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtModal, AtModalContent, AtModalAction, AtToast } from 'taro-ui'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'

import client from '../../../../graphql-client'
import { pullOffShelvesGoodsMutation, putOnShelvesGoodsMutation } from '../../../../query/detail'

import styles from './index.module.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  goodsId: string
  isOpened: boolean
  onRefresh: BaseEventOrigFunction<void>
  onClose: BaseEventOrigFunction<void>
}

type PageState = {
  isSoldout: boolean
  type: '下架' | '激活'
  isModalOpened: boolean
  isToastOpened: boolean
  text: string
  status: Global.ToastStatus
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Manage {
  props: IProps;
}

class Manage extends Component<PageOwnProps, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      isSoldout: true,
      type: '下架',
      isModalOpened: false,
      isToastOpened: false,
      text: '',
      status: 'success',
    }
  }

  soldout = (event) => {
    this.setState({
      isSoldout: true,
      type: '下架',
      isModalOpened: true,
    })
    this.props.onClose(event)
  }
  
  activate = (event) => {
    this.setState({
      isSoldout: false,
      type: '激活',
      isModalOpened: true,
    })
    this.props.onClose(event)
  }

  handleShelves = async(event) => {
    const { isSoldout, type } = this.state
    const mutation = isSoldout ? pullOffShelvesGoodsMutation : putOnShelvesGoodsMutation
    try {
      await client.mutate({ mutation, variables: { id: this.props.goodsId }})
      this.setState({
        isToastOpened: true,
        text: `${type}成功`,
        status: 'success',
      })
      this.props.onRefresh(event)
    } catch (error) {
      this.setState({
        isToastOpened: true,
        text: `${type}失败`,
        status: 'error',
      })
    } finally {
      this.closeModal()
    }
  }
  
  closeModal = () => {
    this.setState({
      isModalOpened: false,
    })
  }

  closeToast = () => {
    this.setState({
      isToastOpened: false,
    })
  }

  render() {
    const { isOpened } = this.props
    const { text, status, isToastOpened, type } = this.state
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
            <View className={styles.modalContent}><Text>确认{type}此二货吗？</Text></View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.closeModal}>取消</Button>
            <Button onClick={this.handleShelves}>确定</Button>
          </AtModalAction>
        </AtModal>

        <AtToast isOpened={isToastOpened} hasMask status={status} text={text} onClose={this.closeToast}></AtToast>
      </View>
    )
  }
}

export default Manage as ComponentClass<PageOwnProps, PageState>
