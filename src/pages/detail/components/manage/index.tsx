import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtActionSheet, AtActionSheetItem, AtModal, AtModalContent, AtModalAction, AtToast } from 'taro-ui'
import { BaseEventOrigFunction } from '@tarojs/components/types/common'

import client from '../../../../graphql-client'
import { Status, ProductType, ProductHandleType, ToastStatus } from '../../../../constants/enums'
import {
  pullOffShelvesGoodsMutation,
  putOnShelvesGoodsMutation,
  putOnShelvesPurchaseMutation,
  pullOffShelvesPurchaseMutation,
} from '../../../../query/detail'

import styles from './index.module.scss'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  productId: string
  productStatus: Status
  userId: string
  isOpened: boolean
  productType: ProductType
  onRefresh: BaseEventOrigFunction<void>
  onClose: BaseEventOrigFunction<void>
}

type PageState = {
  isModalOpened: boolean
  isToastOpened: boolean
  text: string
  status: ToastStatus
  isForSale: boolean
  type: ProductHandleType
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Manage {
  props: IProps;
}

class Manage extends Component<PageOwnProps, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      isModalOpened: false,
      isToastOpened: false,
      text: '',
      status: ToastStatus.SUCCESS,
      isForSale: true,
      type: ProductHandleType.SOLDOUT,
    }
  }

  componentWillReceiveProps(nextProps) {
    const isForSale = nextProps.productStatus === Status.FOR_SALE
    this.setState({
      isForSale,
      type: isForSale ? ProductHandleType.SOLDOUT : ProductHandleType.ACTIVATE,
    })
  }

  soldout = (event) => {
    this.setState({ isModalOpened: true })
    this.props.onClose(event)
  }

  activate = (event) => {
    this.setState({ isModalOpened: true })
    this.props.onClose(event)
  }

  edit = (event) => {
    this.props.onClose(event)
    Taro.navigateTo({
      url: `/pages/publish/index?productType=${this.props.productType}&productId=${this.props.productId}`,
    })
  }

  getShelvesMutation() {
    const { isForSale } = this.state
    const { productType } = this.props
    if(productType === ProductType.GOODS) {
      if(isForSale) {
        return pullOffShelvesGoodsMutation
      }
      return putOnShelvesGoodsMutation
    }

    if(productType === ProductType.PURCHASE) {
      if(isForSale) {
        return pullOffShelvesPurchaseMutation
      }
      return putOnShelvesPurchaseMutation
    }
  }

  handleShelves = async(event) => {
    const { productId, userId } = this.props
    const { type } = this.state
    const mutation = this.getShelvesMutation()
    try {
      await client.mutate({ mutation, variables: { id: productId, userId }})
      this.setState({
        isToastOpened: true,
        text: `${type}成功`,
        status: ToastStatus.SUCCESS,
      })
      this.props.onRefresh(event)
    } catch (error) {
      this.setState({
        isToastOpened: true,
        text: `${type}失败`,
        status: ToastStatus.ERROR,
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
    const { text, status, isToastOpened, isForSale, type } = this.state
    return (
      <View>
        <AtActionSheet isOpened={isOpened} cancelText='取消'>
          {
            isForSale && <AtActionSheetItem onClick={this.edit}>编辑</AtActionSheetItem>
          }
          {
            isForSale ?
              <AtActionSheetItem onClick={this.soldout}>下架</AtActionSheetItem> :
              <AtActionSheetItem onClick={this.activate}>激活</AtActionSheetItem>
          }
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
