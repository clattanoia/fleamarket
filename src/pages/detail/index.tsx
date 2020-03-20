import Taro, { Component, Config } from '@tarojs/taro'
import { Image, Text, View } from '@tarojs/components'
import { AtButton, AtIcon, AtToast } from 'taro-ui'
import { ComponentClass } from 'react'
import { connect } from '@tarojs/redux'
import classNames from 'classnames'

import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import DetailPreload from './components/detailPreload'
import AuthInfoLayout from '../../components/authInfo'
import Contact from './components/contact'
import Manage from './components/manage'

import { ProductInfoDetail, User } from '../../interfaces/detail'
import {
  contactsQuery,
  goodsDetailQuery,
  purchaseDetailQuery,
  increaseGoodsReadCount,
  increasePurchaseReadCount,
} from '../../query/detail'

import client from '../../graphql-client'
import { ProductType, Status, CertifyEmail } from '../../constants/enums'
import { InContact } from '../../interfaces/contact'
import { authLogin } from '../../utils/auth'
import { updateListData } from '../../actions/myProductList'

import './index.scss'

type PageStateProps = {
  userId: string
}

type PageDispatchProps = {
  updateMyProductList: (payload) => Function,
}

type PageOwnProps = {}

type PageState = {
  id: string | null
  productType: ProductType
  detail: ProductInfoDetail
  isOpen: boolean
  isOpened: boolean
  contacts: InContact[]
  isCollected: boolean
  toastText: string
  isToastOpened: boolean
  isOwner: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ProductDetail {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userId: userInfo.id,
}), dispatch => ({
  updateMyProductList(payload) {
    dispatch(updateListData(payload))
  },
}))
class ProductDetail extends Component<PageOwnProps, PageState> {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      productType: ProductType.GOODS,
      detail: { id: '', readCount: 0 },
      isOpen: false,
      isOpened: false,
      contacts: [],
      isCollected: false,
      toastText: '',
      isToastOpened: false,
      isOwner: false,
    }
  }

  componentWillMount(): void {
    const { productType, id } = this.$router.params
    this.setState({ productType: productType as ProductType, id })
  }

  async componentDidMount(): Promise<void> {
    await this.fetchProductDetail()
    this.increaseReadCount()
    //TODO get iscollect query
  }

  async componentDidShow(): Promise<void> {
    await this.fetchProductDetail()
  }

  config: Config = {
    navigationBarTitleText: '二货详情',
  }

  fetchProductDetail = async(): Promise<ProductInfoDetail> => {
    const { id, productType } = this.state
    const { data: { detailInfo }} = await client.query({
      query: productType === ProductType.GOODS ? goodsDetailQuery : purchaseDetailQuery,
      variables: { id },
    })
    const isOwner = !!detailInfo.owner && this.props.userId === detailInfo.owner.id
    this.setState({
      detail: detailInfo,
      isOwner,
    })

    this.props.updateMyProductList({
      id: this.state.id,
      modification: {
        title: detailInfo.title,
        price: detailInfo.price,
        status: detailInfo.status,
        coverUrl: detailInfo.coverUrl,
      },
    })

    return detailInfo as ProductInfoDetail
  }

  increaseReadCount = async() => {
    const { id, productType } = this.state
    await client.query({
      query: productType === ProductType.GOODS ? increaseGoodsReadCount : increasePurchaseReadCount,
      variables: { id },
    })
    this.props.updateMyProductList({
      id: this.state.id,
      modification: { readCount: this.state.detail.readCount + 1 },
    })
  }

  genProductType = (type: ProductType) => {
    return {
      [ProductType.PURCHASE]: '求购',
      [ProductType.GOODS]: '出售',
    }[type]
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

  getContacts = async(): Promise<InContact[]> => {
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
    // if(this.isOwnProduct()) {
    //   this.showManage()
    // } else {
    //   this.showContact()
    // }
  }

  isOwnProduct = (): boolean => {
    const { detail } = this.state
    const { userId } = this.props
    console.log(userId)
    console.log(detail.owner.id)
    return !!detail.owner && userId === detail.owner.id
  }

  refreshDetail = async(): Promise<void> => {
    const detail = await this.fetchProductDetail()
    // update my product list data
    this.props.updateMyProductList({
      id: this.state.id,
      modification: { status: detail.status },
    })
  }

  renderReadCount() {
    const { detail } = this.state
    if(detail.readCount) {
      return <Text className="read-count">{detail.readCount}次浏览</Text>
    }
  }

  renderSaleStatus = () => {
    const { detail } = this.state
    if(detail.status === Status.SALE_OUT) {
      return <Tag tagName="已下架" />
    }
    if(detail.status === Status.FREEZE) {
      return <Tag tagName="冻结" />
    }
  }

  collectHandle = () => {
    console.log('--------------collectHandle------------------------')
    if(Taro.getStorageSync('token')) {
      const isOwner = this.isOwnProduct()
      console.log(isOwner)
      if(isOwner){
        this.setState({
          toastText: '不能收藏自己的"二货"哦～',
          isToastOpened: true,
          isOwner,
        })
        return
      }
      const { isCollected } = this.state
      this.setState({
        isCollected: !isCollected,
      })
    } else {
      authLogin({ callback: this.collectHandle })
    }
  }

  handleCloseToast = () => {
    this.setState({
      toastText: '',
      isToastOpened: false,
    })
  }

  render() {
    const { detail, productType, isCollected, toastText, isToastOpened, isOwner } = this.state
    return detail && detail.owner ? (
      <View className="detail">
        <View className="owner-container">
          <Avatar
            certificate={detail.owner.certification === CertifyEmail.CERTIFIED}
            userId={detail.owner.id}
            avatarUrl={detail.owner.avatarUrl}
            avatarSize={80}
          />
          <Text className="nickname">{detail.owner.nickname}</Text>
        </View>
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">
            {(detail.price as number)}
          </Text>
        </View>
        <View className="detial-container">
          <View className="label">
            <Text>商品详情</Text>
            { this.renderReadCount() }
          </View>
          <View className="status-tags">
            <Tag tagName={this.genProductType((productType as ProductType))} />
            { this.renderSaleStatus() }
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
          <View className="footer_left">
            <View className="collect" onClick={this.collectHandle}>
              <View className={classNames({ 'active': isCollected })}>
                <AtIcon value={isCollected ? 'star-2' : 'star'} size='20'></AtIcon>
              </View>
              <Text>{isCollected ? '已收藏' : '收藏'}</Text>
            </View>
          </View>
          <View className="footer_right">
            {
              isOwner ?
                <AtButton type='primary' className="btn manage-btn" onClick={this.showManage}>管理</AtButton> :
                <AtButton type='primary' className="btn contact-btn" onClick={this.showContact}>获取联系方式</AtButton>
            }
          </View>
        </View>
        <Contact
          isOpen={this.state.isOpen}
          contacts={this.state.contacts}
          onClose={this.closeContact}
        />
        <Manage
          productId={detail.id}
          userId={detail.owner.id}
          productStatus={(detail.status as Status)}
          productType={this.state.productType}
          isOpened={this.state.isOpened}
          onClose={this.closeManage}
          onRefresh={this.refreshDetail}
        />
        <AuthInfoLayout authCallback={this.gotoPage} />
        <AtToast
          isOpened={isToastOpened}
          hasMask
          text={toastText}
          onClose={this.handleCloseToast}
        >
        </AtToast>
      </View>
    ) : <DetailPreload />
  }
}

export default ProductDetail as ComponentClass<PageOwnProps, PageState>
