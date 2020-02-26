import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton, AtFloatLayout } from 'taro-ui'

import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import DetailPreload from './components/detailPreload'
import Contact from './contact'

import { GoodDetail } from '../../constants/types'
import { detailQuery, contactsQuery } from '../../query/detail'
import client from '../../graphql-client'
import { Status } from '../../constants/enums'

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

  async componentDidMount () {
    const { id } = this.$router.params
    const { data: { goods } } = await client.query({query: detailQuery, variables: { id }})
    this.setState({
      detail: goods
    })
    this.getContacts(goods.owner.id, goods.contacts)
  }

  genSaleStatus = (status: Status) => {
    switch(status) {
      case Status.FOR_SALE:
        return '出售'
      case Status.SALE_OUT:
        return '已下架'
      case Status.FREEZE:
        return '冻结'
    }
  }

  showContact = (): void => {
    this.setState({
      isOpen: true
    })
  }

  closeContact = (): void => {
    this.setState({
      isOpen: false
    })
  }

  getContacts = async(userId, ids): Promise<void>  => {
    try {
      const { data: { contacts } } = await client.query({query: contactsQuery, variables: { userId, ids }})
      this.setState({ contacts })
    } catch (error) {
      throw error
    }
  }

  render () {
    const { detail } = this.state
    return detail !== null ? (
      <View className="detail">
        <Avatar
          userId={detail.owner.id}
          avatarUrl={detail.owner.avatarUrl}
          nickname={detail.owner.nickname}
          avatarSize={80}
          nameSize={36}
        />
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">
            {detail.price}
          </Text>
        </View>
        <View className="detial-container">
          <View className="title">
            <Text>商品详情</Text>
          </View>
          <View className="status-tags">
            <Tag tagName={this.genSaleStatus(detail.status)} />
          </View>
          <View className="description">
            <ExtendedContainer maxLine={2} content={detail.description} />
          </View>
          <View className="pictures">
            {
              detail.pictures.length > 0
                ? detail.pictures.map(pic => (<Image key={pic} className="picture" src={pic} />))
                : null
            }
          </View>
        </View>
        <View className="footer">
          <AtButton type='primary' className="contact-btn" onClick={this.showContact}>获取联系方式</AtButton>
        </View>
        <AtFloatLayout isOpened={this.state.isOpen} onClose={this.closeContact}>
          <Contact contacts={this.state.contacts} />
        </AtFloatLayout>
      </View>
    ) : <DetailPreload />
  }
}

export default GoodsDetail