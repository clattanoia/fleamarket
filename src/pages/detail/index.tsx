import { Block, Image, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component, Config } from '@tarojs/taro'
import classNames from 'classnames'
import { ComponentClass } from 'react'
import { AtButton, AtIcon, AtToast } from 'taro-ui'
import { updateListData } from '../../actions/myProductList'
import AuthInfoLayout from '../../components/authInfo'
import Avatar from '../../components/avatar'
import ExtendedContainer from '../../components/extendedContainer'
import Tag from '../../components/tag'
import { CertifyEmail, ProductType, Status } from '../../constants/enums'
import client from '../../graphql-client'
import { InContact } from '../../interfaces/contact'
import { ExchangeInfo, ProductInfoDetail, User } from '../../interfaces/detail'
import {
  collectedQuery,
  collectMutation,
  unCollectMutation,
} from '../../query/collect'
import {
  contactsQuery,
  exchangeableGoodsQuery,
  exchangeGoodsMutation,
  goodsDetailQuery,
  increaseGoodsReadCount,
  increasePurchaseReadCount,
  purchaseDetailQuery,
} from '../../query/detail'
import { authLogin } from '../../utils/auth'
import Contact from './components/contact'
import DetailPreload from './components/detailPreload'
import ExchangeableGoods from './components/exchangeableGoods'
import Manage from './components/manage'
import DetailNote from './components/note'
import ReceivedExchange from './components/receivedExchange'
import RequestedExchange from './components/requestedExchange'
import './index.scss'

type PageStateProps = {
  userId: string;
}

type PageDispatchProps = {
  updateMyProductList: (payload) => Function;
}

type PageOwnProps = {}

type PageState = {
  id: string | null;
  productType: ProductType;
  detail: ProductInfoDetail;
  isOpen: boolean;
  isOpened: boolean;
  exchangeableGoodsModalVisible: boolean;
  contacts: InContact[];
  exchangeableGoods: ProductInfoDetail[];
  isCollected: boolean;
  toastText: string;
  receivedExchanges: ExchangeInfo[];
  requestedExchanges: ExchangeInfo[];
  isToastOpened: boolean;
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface ProductDetail {
  props: IProps;
}

@connect(
  ({ userInfo }) => ({
    userId: userInfo.id,
  }),
  dispatch => ({
    updateMyProductList(payload) {
      dispatch(updateListData(payload))
    },
  })
)
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
      exchangeableGoods: [],
      exchangeableGoodsModalVisible: false,
      isCollected: false,
      toastText: '',
      isToastOpened: false,
      receivedExchanges: [],
      requestedExchanges: [],
    }
  }

  authCallback?: () => void

  componentWillMount(): void {
    const { productType, id } = this.$router.params
    this.setState({ productType: productType as ProductType, id })
  }

  async componentDidMount(): Promise<void> {
    await this.fetchProductDetail()
    this.increaseReadCount()
  }

  async componentDidShow(): Promise<void> {
    await this.fetchProductDetail()
  }

  config: Config = {
    navigationBarTitleText: '二货详情',
  }

  getIsCollected = async() => {
    const { productType, id } = this.state
    const { userId } = this.props
    const isOwner = this.isOwnProduct()

    if(!userId || isOwner) {
      return
    }
    const collectInput = {
      productId: id,
      productType,
    }
    const { data } = await client.query({
      query: collectedQuery,
      variables: { collectInput },
    })
    this.setState({
      isCollected: data.collected.result,
    })
  }

  fetchProductDetail = async(): Promise<ProductInfoDetail> => {
    const { id, productType } = this.state
    const {
      data: { detailInfo, receivedExchanges = [], requestedExchanges = []},
    } = await client.query<{
      detailInfo: ProductDetail;
      receivedExchanges: ExchangeInfo[];
      requestedExchanges: ExchangeInfo[];
    }>({
      query:
        productType === ProductType.GOODS
          ? goodsDetailQuery
          : purchaseDetailQuery,
      variables: { id },
    })
    this.setState(
      {
        detail: detailInfo,
        receivedExchanges,
        requestedExchanges,
      },
      () => {
        this.getIsCollected()
      }
    )

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
      query:
        productType === ProductType.GOODS
          ? increaseGoodsReadCount
          : increasePurchaseReadCount,
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

  excuteAuthCallback = () => {
    this.authCallback && this.authCallback()
  }

  showContact = async(): Promise<void> => {
    this.authCallback = this.concatcAuthCallback
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

  showExchange = async() => {
    this.authCallback = this.showExchange
    if(Taro.getStorageSync('token')) {
      const goods = await this.getExchangeableGoods()
      if(goods.length) {
        this.setState({
          exchangeableGoods: goods,
          exchangeableGoodsModalVisible: true,
        })
      } else {
        this.setState({
          toastText: '您当前没有可以易货的二货',
          isToastOpened: true,
        })
      }
    } else {
      authLogin({ callback: this.showExchange })
    }
  }

  exchangeGoods = async(sourceId: string) => {
    const exchangeInput = {
      sourceId: sourceId,
      targetId: this.state.id,
      userId: this.props.userId,
    }

    try {
      await client.mutate({
        mutation: exchangeGoodsMutation,
        variables: { exchangeInput },
      })

      this.setState({
        toastText: '操作成功',
        isToastOpened: true,
      })

      setTimeout(() => {
        this.handleCloseToast()
        this.setState({ exchangeableGoodsModalVisible: false })
      }, 2000)
    } catch (error) {
      this.setState({
        toastText: '操作失败，请稍后重试！',
        isToastOpened: true,
      })

      setTimeout(() => {
        this.handleCloseToast()
      }, 2000)
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
      const { data } = await client.query({
        query: contactsQuery,
        variables: { userId: (owner as User).id, ids: contacts },
      })
      return data.contacts
    } catch (error) {
      throw error
    }
  }

  getExchangeableGoods = async(): Promise<ProductInfoDetail[]> => {
    try {
      const { data } = await client.query({
        query: exchangeableGoodsQuery,
        variables: {},
      })
      return data.exchangeableGoods
    } catch (error) {
      throw error
    }
  }

  concatcAuthCallback = () => {
    if(!this.isOwnProduct()) {
      this.showContact()
    }
  }

  isOwnProduct = (): boolean => {
    const { detail } = this.state
    const { userId } = this.props
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

  doCollectHandle = async() => {
    const { productType, id, isCollected } = this.state

    const mutation = isCollected ? unCollectMutation : collectMutation
    const toastText = isCollected ? '取消收藏成功' : '收藏成功'
    const collectInput = {
      productId: id,
      productType,
    }
    try {
      await client.mutate({
        mutation,
        variables: { collectInput },
      })
      this.setState({
        toastText,
        isToastOpened: true,
        isCollected: !isCollected,
      })
    } catch (err) {
      console.log(err)
      this.setState({
        toastText: '操作失败，请稍后重试',
        isToastOpened: true,
      })
    } finally {
      Taro.hideLoading()
    }
  }

  collectHandle = () => {
    this.authCallback = this.collectAuthCallback
    if(Taro.getStorageSync('token')) {
      const isOwner = this.isOwnProduct()
      if(isOwner) {
        this.setState({
          toastText: '不能收藏自己的"二货"哦～',
          isToastOpened: true,
        })
        return
      }
      Taro.showLoading({
        title: 'loading...',
        mask: true,
      })
      this.doCollectHandle()
    } else {
      authLogin({ callback: this.collectAuthCallback })
    }
  }

  collectAuthCallback = async() => {
    await this.getIsCollected()
    this.collectHandle()
  }

  handleCloseToast = () => {
    this.setState({
      toastText: '',
      isToastOpened: false,
    })
  }

  onShareAppMessage = res => {
    const { productType, id } = this.state
    if(res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '二货集好物',
      path: `pages/detail/index?id=${id}&productType=${productType}`,
    }
  }

  render() {
    const {
      detail,
      productType,
      isCollected,
      toastText,
      isToastOpened,
      receivedExchanges,
      requestedExchanges,
    } = this.state
    return detail && detail.owner ? (
      <View className="detail">
        <View className="owner-container">
          <View className="owner-left">
            <Avatar
              certificate={
                detail.owner.certification === CertifyEmail.CERTIFIED
              }
              userId={detail.owner.id}
              avatarUrl={detail.owner.avatarUrl}
              avatarSize={80}
            />
          </View>
          <View className="owner-right">
            <Text className="nickname">{detail.owner.nickname}</Text>
            <View className="brief">{detail.owner.brief || ''}</View>
          </View>
        </View>
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">{detail.price!}</Text>
        </View>
        <View className="detial-container">
          <View className="label">
            <Text>商品详情</Text>
            {this.renderReadCount()}
          </View>
          <View className="status-tags">
            <Tag tagName={this.genProductType(productType as ProductType)} />
            {this.renderSaleStatus()}
          </View>
          <View className="title">{detail.title!}</View>
          <View className="description">
            <ExtendedContainer maxLine={5} content={detail.description!} />
          </View>
          <View className="pictures">
            {(detail.pictures as string[]).length > 0
              ? (detail.pictures as string[]).map(pic => (
                <Image
                  key={pic}
                  className="picture"
                  mode="widthFix"
                  src={pic}
                />
              ))
              : null}
          </View>
          <RequestedExchange exchanges={requestedExchanges} />
          <ReceivedExchange
            isGoodsOwner={this.isOwnProduct()}
            exchanges={receivedExchanges}
          />
          <View className="note">
            <DetailNote productType={productType} />
          </View>
        </View>
        <View className="footer">
          <View className="footer-left">
            <View className="collect" onClick={this.collectHandle}>
              <View className={classNames({ active: isCollected })}>
                <AtIcon
                  value={isCollected ? 'star-2' : 'star'}
                  size="24"
                ></AtIcon>
              </View>
            </View>
            <View className="share">
              <AtIcon value="share" size="24" color="#808080"></AtIcon>
              <AtButton className="share-btn" openType="share"></AtButton>
            </View>
          </View>
          <View className="footer-right">
            {this.isOwnProduct() ? (
              <AtButton
                type="primary"
                className="btn manage-btn"
                onClick={this.showManage}
              >
                管理
              </AtButton>
            ) : (
              <Block>
                {detail.agreeExchange && detail.status === Status.FOR_SALE && (
                  <AtButton
                    type="secondary"
                    className="btn exchange-btn"
                    onClick={this.showExchange}
                  >
                    以货换货
                  </AtButton>
                )}
                <AtButton
                  type="primary"
                  className="btn contact-btn"
                  onClick={this.showContact}
                >
                  获取联系方式
                </AtButton>
              </Block>
            )}
          </View>
        </View>
        <Contact
          isOpen={this.state.isOpen}
          contacts={this.state.contacts}
          onClose={this.closeContact}
        />
        <ExchangeableGoods
          visible={this.state.exchangeableGoodsModalVisible}
          goods={this.state.exchangeableGoods}
          onConfirm={this.exchangeGoods}
          onClose={() =>
            this.setState({ exchangeableGoodsModalVisible: false })
          }
        />
        <Manage
          productId={detail.id}
          userId={detail.owner.id}
          productStatus={detail.status!}
          productType={this.state.productType}
          isOpened={this.state.isOpened}
          onClose={this.closeManage}
          onRefresh={this.refreshDetail}
        />
        <AuthInfoLayout authCallback={this.excuteAuthCallback} />
        <AtToast
          isOpened={isToastOpened}
          hasMask
          text={toastText}
          onClose={this.handleCloseToast}
        ></AtToast>
      </View>
    ) : (
      <DetailPreload />
    )
  }
}

export default ProductDetail as ComponentClass<PageOwnProps, PageState>
