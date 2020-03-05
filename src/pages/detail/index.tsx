import Taro, { Component, Config } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
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

import { ProductInfoDetail, User } from '../../interfaces/types'
import { contactsQuery, goodsDetailQuery, purchaseDetailQuery } from '../../query/detail'

import client from '../../graphql-client'
import { ProductType, Status } from '../../constants/enums'
import { authLogin } from '../../utils/auth'

import './index.scss'

type PageStateProps = {
  userId: string
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  id: string | null
  productType: ProductType
  detail: ProductInfoDetail
  isOpen: boolean
  isOpened: boolean
  contacts: Contact.InContact[]
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ProductDetail {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userId: userInfo.id,
}))
class ProductDetail extends Component<PageOwnProps, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      productType: ProductType.GOODS,
      detail: { id: '' },
      isOpen: false,
      isOpened: false,
      contacts: [],
    }
  }

  componentWillMount(): void {
    const { productType, id } = this.$router.params
    this.setState({ productType: productType as ProductType, id })
  }

  componentDidMount(): void {
    this.fetchGoodsDetail()
  }

  config: Config = {
    navigationBarTitleText: '二货详情',
  }

  fetchGoodsDetail = async() => {
    const { id, productType } = this.state
    const { data: { detailInfo }} = await client.query({
      query: productType === ProductType.GOODS ? goodsDetailQuery : purchaseDetailQuery,
      variables: { id },
    })
    this.setState({
      detail: detailInfo,
    })
  }

  genProductType = (type: ProductType) => {
    return {
      [ProductType.PURCHASE]: '求购',
      [ProductType.GOODS]: '出售',
    }[type]
  }

  genSaleStatus = (status: Status) => {
    switch (status) {
      case Status.FOR_SALE:
        return '在售'
      case Status.SALE_OUT:
        return '已下架'
      case Status.FREEZE:
        return '冻结'
    }
  }

  showContact = async(): Promise<void> => {
    if(Taro.getStorageSync('token')) {
      const contacts = await this.getContacts()
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

  getContacts = async(): Promise<Contact.InContact[]> => {
    const { owner, contacts } = this.state.detail
    if(!contacts || !contacts.length) return []
    try {
      const { data } = await client.query({ query: contactsQuery, variables: { userId: (owner as User).id, ids: contacts }})
      return data.contacts
    } catch (error) {
      throw error
    }
  }

  gotoPage = () => {
    this.showContact()
  }

  render() {
    const { detail, productType } = this.state
    const { userId } = this.props
    return detail && detail.owner ? (
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
            {(detail.price as number)}
          </Text>
        </View>
        <View className="detial-container">
          <View className="label">
            <Text>商品详情</Text>
          </View>
          <View className="status-tags">
            <Tag tagName={this.genProductType((productType as ProductType))} />
            <Tag tagName={this.genSaleStatus((detail.status as Status))} />
          </View>
          <View className="title">{(detail.title as string)}</View>
          <View className="description">
            <ExtendedContainer maxLine={5} content={(detail.description as string)} />
          </View>
          <View className="pictures">
            {
              (detail.pictures as string[]).length > 0
                ? (detail.pictures as string[]).map(pic => (<Image key={pic} className="picture" mode="widthFix" src={pic} />))
                : null
            }
          </View>
        </View>
        <View className="footer">
          {
            userId === detail.owner.id ?
              <AtButton type='primary' className="btn manage-btn" onClick={this.showManage}>管理</AtButton> :
              <AtButton type='primary' className="btn contact-btn" onClick={this.showContact}>获取联系方式</AtButton>
          }
        </View>
        <Contact isOpen={this.state.isOpen} contacts={this.state.contacts} onClose={this.closeContact} />
        <Manage productId={detail.id} userId={detail.owner.id} productStatus={(detail.status as Status)} productType={this.state.productType} isOpened={this.state.isOpened} onClose={this.closeManage} onRefresh={this.fetchGoodsDetail} />
        <AuthInfoLayout authCallback={this.gotoPage} />
      </View>
    ) : <DetailPreload />
  }
}

export default ProductDetail as ComponentClass<PageOwnProps, PageState>
