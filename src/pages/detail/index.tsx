import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'

import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import DetailPreload from './components/detailPreload'
import AuthInfoLayout from '../../components/authInfo'
import Contact from './components/contact'
import Manage from './components/manage'

import { GoodDetail } from '../../constants/types'
import { detailQuery, contactsQuery } from '../../query/detail'
import client from '../../graphql-client'
import { Status } from '../../constants/enums'
import { authLogin } from '../../utils/auth'

import './index.scss'

type PageStateProps = {
  id: string
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  detail: GoodDetail | null
  isOpen: boolean
  isOpened: boolean
  contacts: Contact.InContact[]
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface GoodsDetail {
  props: IProps;
}

@connect(({ userInfo }) => ({
  id: userInfo.id,
}))
class GoodsDetail extends Component {
  config: Config = {
    navigationBarTitleText: '二货详情',
  }

  state = {
    detail: null,
    isOpen: false,
    isOpened: false,
    contacts: [],
  }

  async componentDidMount() {
    const { id } = this.$router.params
    const { data: { goods }} = await client.query({ query: detailQuery, variables: { id }})
    this.setState({
      detail: goods,
    })
  }

  genSaleStatus = (status: Status) => {
    switch (status) {
      case Status.FOR_SALE:
        return '出售'
      case Status.SALE_OUT:
        return '已下架'
      case Status.FREEZE:
        return '冻结'
    }
  }

  showContact = async(): Promise<void> => {
    if(Taro.getStorageSync('token')) {
      const detail = this.state.detail
      const contacts = await this.getContacts(detail.owner.id, detail.contacts)
      this.setState({
        contacts,
        isOpen: true,
      })
    } else {
      authLogin({ callback: this.showContact })
    }
  }

  showManage = (): void => {
    this.setState({
      isOpened: true,
    })
  }

  closeContact = (): void => {
    this.setState({
      isOpen: false,
    })
  }

  closeManage = (): void => {
    this.setState({
      isOpened: false,
    })
  }

  getContacts = async(userId, ids): Promise<Contact.InContact[]> => {
    if(!ids || !ids.length) return []
    try {
      const { data: { contacts }} = await client.query({ query: contactsQuery, variables: { userId, ids }})
      return contacts
    } catch (error) {
      throw error
    }
  }

  gotoPage = () => {
    this.showContact()
  }

  render() {
    const { detail } = this.state
    const isOwnGoods = detail && this.props.id === (detail as any).owner.id
    return detail !== null ? (
      <View className="detail">
        <Avatar
          userId={(detail as any).owner.id}
          avatarUrl={(detail as any).owner.avatarUrl}
          nickname={(detail as any).owner.nickname}
          avatarSize={80}
          nameSize={36}
        />
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">
            {(detail as any).price}
          </Text>
        </View>
        <View className="detial-container">
          <View className="label">
            <Text>商品详情</Text>
          </View>
          <View className="status-tags">
            <Tag tagName={this.genSaleStatus((detail as any).status)} />
          </View>
          <View className="title">{(detail as any).title}</View>
          <View className="description">
            <ExtendedContainer maxLine={5} content={(detail as any).description} />
          </View>
          <View className="pictures">
            {
              (detail as any).pictures.length > 0
                ? (detail as any).pictures.map(pic => (<Image key={pic} className="picture" mode="widthFix" src={pic} />))
                : null
            }
          </View>
        </View>
        <View className="footer">
          {
            isOwnGoods ?
              <AtButton type='primary' className="btn manage-btn" onClick={this.showManage}>管理</AtButton> :
              <AtButton type='primary' className="btn contact-btn" onClick={this.showContact}>获取联系方式</AtButton>
          }
        </View>
        <Contact isOpen={this.state.isOpen} contacts={this.state.contacts} onClose={this.closeContact} />
        <Manage goodsId={(detail as any).id} isOpened={this.state.isOpened} onClose={this.closeManage} />
        <AuthInfoLayout authCallback={this.gotoPage} />
      </View>
    ) : <DetailPreload />
  }
}

export default GoodsDetail as ComponentClass<PageOwnProps, PageState>
