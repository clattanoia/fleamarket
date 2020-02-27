import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import DetailPreload from './components/detailPreload'
import Contact from './contact'

import { GoodDetail } from '../../constants/types'
import { detailQuery, contactsQuery } from '../../query/detail'
import client from '../../graphql-client'
import { Status } from '../../constants/enums'
import {authLogin} from '../../utils/auth'

import './index.scss'

type PageState = {
  detail: GoodDetail | null
  isOpen: boolean
  contacts: Contact.InContact[]
}

class GoodsDetail extends Component<{}, PageState> {
  config: Config = {
    navigationBarTitleText: '帖子详情',
  }

  state = {
    detail: null,
    isOpen: false,
    contacts: [],
  }

  async componentDidMount() {
    const { id } = this.$router.params
    const { data: { goods } } = await client.query({ query: detailQuery, variables: { id } })
    this.setState({
      detail: goods
    })
    this.getContacts(goods.owner.id, goods.contacts)
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

  showContact = (): void => {
    if (Taro.getStorageSync('token')) {
      this.setState({
        isOpen: true
      })
    } else {
      authLogin({})
      console.log('session过期啦')
    }
  }

  closeContact = (): void => {
    this.setState({
      isOpen: false
    })
  }

  getContacts = async (userId, ids): Promise<void> => {
    try {
      const { data: { contacts } } = await client.query({ query: contactsQuery, variables: { userId, ids } })
      this.setState({ contacts })
    } catch (error) {
      throw error
    }
  }

  render() {
    const { detail } = this.state
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
          <AtButton type='primary' className="contact-btn" onClick={this.showContact}>获取联系方式</AtButton>
        </View>
        <Contact isOpen={this.state.isOpen} contacts={this.state.contacts} onClose={this.closeContact} />
      </View>
    ) : <DetailPreload />
  }
}

export default GoodsDetail
