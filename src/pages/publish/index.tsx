import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtToast } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { ComponentClass } from 'react'

import TabBar from '../../components/tabBar'
import PublishInfo from './info'
import Category from './category'
import Contact from './contact'
import PublishImages from './images'
import PublishPreload from './preload'

import { getToken, uploadQiniu } from '../../utils/qiniuUploader'
import client from '../../graphql-client'
import {
  editGoodsMutation,
  editPurchaseMutation,
  publishGoodsMutation,
  publishPurchaseMutation,
} from '../../query/publish'
import { ProductType } from '../../constants/enums'
import { InContact } from '../../interfaces/contact'
import { goodsDetailQuery, purchaseDetailQuery } from '../../query/detail'

import './index.scss'

const ERROR_MESSAGES = {
  title: '标题不能为空',
  price: '价格不能为空',
  detail: '详情不能为空',
  imagesUrls: '图片不能为空',
  selectedCategory: '分类不能为空',
  selectedContacts: '联系方式不能为空',
  invalidParameters: '参数错误',
  systemError: '服务异常',
  invalidUser: '用户已被禁用',
  images: '最多上传10张图片（JPG/PNG）,图片不能大于10M',
  uploadError: '图片上传失败',
}

const TITLE_TEXT = {
  [ProductType.PURCHASE]: '发布求购',
  [ProductType.GOODS]: '发布出售',
}

type UserInfo = {
  contacts: InContact[],
  id: string,
}

type PageStateProps = {
  userInfo: UserInfo
}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  productType: string,
  toastText: string,
  showToast: false,
  toastStatus: string,
  isPublishing: false,

  title: string,
  price: string,
  detail: string,
  imagesUrls: Array<Publish.InPickerImageFiles>,
  selectedCategory: string,
  selectedContacts: Array<string>,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Publish {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))
class Publish extends Component {

  state = {
    productType: ProductType.GOODS,
    productId: '',
    toastText: '',
    showToast: false,
    toastStatus: 'error',
    isPublishing: false,
    isLoading: false,

    title: '',
    price: '',
    detail: '',
    imagesUrls: [],
    selectedCategory: '',
    selectedContacts: [],
  }

  config: Config = {
    navigationBarTitleText: '',
  }

  componentWillMount(): void {
    const { productType, productId } = this.$router.params
    Taro.setNavigationBarTitle({
      title: TITLE_TEXT[productType] || '发布',
    })
    productType && this.setState({ productType })
    if(productId) {
      this.setState({ productId, isLoading: true })
      this.fetchGoodsDetail()
    }
    // console.log(this.$router.params)
  }

  fetchGoodsDetail = async() => {
    const { productType } = this.$router.params
    try {
      const { data: { detailInfo }} = await client.query({
        query: productType === ProductType.GOODS ? goodsDetailQuery : purchaseDetailQuery,
        variables: { id: this.$router.params.productId },
      })
      this.setState({
        title: detailInfo.title,
        price: `${detailInfo.price}`,
        detail: detailInfo.description,
        imagesUrls: detailInfo.pictures
          .map(pic => Object.assign({}, {
            url: pic,
            qiniuUrl: pic,
          })),
        selectedCategory: detailInfo.category,
        selectedContacts: this.props.userInfo.contacts
          .filter(item => detailInfo.contacts.includes(item.id))
          .map(item => item.id),
        isLoading: false,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
      })
      this.showErrorMessage('systemError')
      setTimeout(() => {
        Taro.navigateBack()
      }, 3000)
    }
  }

  getUploadPromises = (qiniuToken: string): Array<Promise<Publish.InPickerImageFiles>> => {
    const { imagesUrls } = this.state

    return imagesUrls.map((imageUrl: Publish.InPickerImageFiles) => {
      return new Promise(async(resolve, reject) => {
        try {
          if(imageUrl.qiniuUrl) {
            return resolve(imageUrl)
          }
          const qiniuUrl = await uploadQiniu(imageUrl.url, qiniuToken)
          imageUrl.qiniuUrl = qiniuUrl
          // console.log(imageUrl)
          resolve(imageUrl)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  uploadImages = async(): Promise<Array<Publish.InPickerImageFiles>> => {
    const qiniuToken = await getToken()

    return Promise.all(this.getUploadPromises(qiniuToken)).then((res: Array<Publish.InPickerImageFiles>) => {
      return Promise.resolve(res)
    }, () => Promise.reject('upload error'))
  }

  showErrorMessage = (name: string) => {
    const text = ERROR_MESSAGES[name]
    this.setState({
      showToast: true,
      toastText: text,
      toastStatus: name === 'images' ? '' : 'error',
    })
  }

  validRequired = (val: string | Array<any>): boolean => !!val.length

  vaildInputValues = (isShowErrorMessage = false): boolean => {
    const attrKeys: Array<string> = [
      'title',
      'price',
      'detail',
      'selectedCategory',
      'selectedContacts',
    ]

    // 求购信息校验图片
    if(this.state.productType === ProductType.GOODS) {
      attrKeys.push('imagesUrls')
    }

    for(const key of attrKeys) {
      if(!this.validRequired(this.state[key])){
        isShowErrorMessage && this.showErrorMessage(key)
        return false
      }
    }

    return true
  }

  setLoading = (val: boolean): void => {
    this.setState({
      isPublishing: val,
    })
  }

  handleSubmit = async(): Promise<void> => {
    if(!this.vaildInputValues(true)) return

    this.setLoading(true)

    let uploadedImages: Array<Publish.InPickerImageFiles> = []
    // upload images
    try {
      if(this.state.imagesUrls.length) {
        uploadedImages = await this.uploadImages()
      }
    } catch (e) {
      this.showErrorMessage('uploadError')
      this.setLoading(false)
      return
    }

    const publishInput = {
      owner: this.props.userInfo.id,
      title: this.state.title,
      price: Number(this.state.price),
      description: this.state.detail,
      category: this.state.selectedCategory,
      coverUrl: uploadedImages.length ? uploadedImages[0].qiniuUrl : null,
      pictures: uploadedImages.map(item => item.qiniuUrl),
      contacts: this.state.selectedContacts,
    }

    const { productType, productId } = this.state

    // console.log('productId', productId)
    if(!productId) {
      await this.publish(productType, publishInput)
    } else {
      await this.edit(productId, productType, publishInput)
    }
  }

  async publish(productType, publishInput) {
    try {
      const { data } = await client.mutate({
        mutation: productType === ProductType.GOODS ? publishGoodsMutation : publishPurchaseMutation,
        variables: { publishInput },
      })
      Taro.redirectTo({
        url: `/pages/detail/index?id=${data.publishGoods || data.publishPurchase}&productType=${productType}`,
      })
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setLoading(false)
    }
  }

  async edit(productId, productType, publishInput) {
    try {
      await client.mutate({
        mutation: productType === ProductType.GOODS ? editGoodsMutation : editPurchaseMutation,
        variables: { productId, publishInput },
      })
      Taro.navigateBack()
    } catch (e) {
      this.handleError(e)
    } finally {
      this.setLoading(false)
    }
  }

  handleError(e) {
    let error = 'systemError'
    if(e.message.indexOf('400') > -1) {
      error = 'invalidParameters'
    } else if(e.message.indexOf('403') > -1) {
      error = 'invalidUser'
    }
    this.showErrorMessage(error)
  }

  handleCloseToast = (): void => {
    this.setState({
      showToast: false,
      toastText: '',
    })
  }

  setStateValue = (key, value): void => {
    this.setState({
      [key]: value,
    })
  }

  render() {
    return (
      <View className="publish">
        {this.state.isLoading ?
          <PublishPreload /> :
          <View>
            <PublishInfo onSetVal={this.setStateValue} publishInfo={{
              title: this.state.title,
              price: this.state.price,
              detail: this.state.detail,
            }}
            />
            <PublishImages
              onSetVal={this.setStateValue}
              showErrorMessage={this.showErrorMessage}
              imagesUrls={this.state.imagesUrls}
            />
            <Category
              onSetVal={this.setStateValue}
              selectedCategory={this.state.selectedCategory}
            />
            <Contact
              contacts={this.props.userInfo.contacts}
              selectedContacts={this.state.selectedContacts}
              onSetVal={this.setStateValue}
            />
            <View className="form_btn">
              <AtButton
                type="primary"
                onClick={this.handleSubmit}
                disabled={!this.vaildInputValues() || this.state.isPublishing}
                loading={this.state.isPublishing}
              >发布</AtButton>
            </View>
            <AtToast isOpened={this.state.showToast} text={this.state.toastText} onClose={this.handleCloseToast} hasMask status={this.state.toastStatus}></AtToast>
            <TabBar  current={1} />
          </View>
        }
      </View>
    )
  }
}

export default Publish as ComponentClass<PageOwnProps, PageState>
