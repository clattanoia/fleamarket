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

import { cleanArrayEmpty } from '../../utils/helper'
import { getToken, uploadQiniu } from '../../utils/qiniuUploader'
import client from '../../graphql-client'
import { publishGoodsMutation, publishPurchaseMutation } from '../../query/publish'
import { ProductType } from '../../constants/enums'

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
  contacts: Contact.InContact[],
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
    toastText: '',
    showToast: false,
    toastStatus: 'error',
    isPublishing: false,

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
    const { productType } = this.$router.params
    Taro.setNavigationBarTitle({
      title: TITLE_TEXT[productType] || '发布',
    })
    productType && this.setState({ productType })
    // console.log(this.$router.params)
  }

  getUploadPromises = (qiniuToken: string): Array<Promise<Publish.InPickerImageFiles>> => {
    const { imagesUrls } = this.state

    return imagesUrls.map((imageUrl: Publish.InPickerImageFiles) => {
      return new Promise(async(resolve, reject) => {
        try {
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

    // transform contact type to id
    const contactIds = cleanArrayEmpty(this.state.selectedContacts.map(item => {
      const matchedContact: Contact.InContact | undefined = this.props.userInfo.contacts.find(contact => contact.type === item)
      return matchedContact ? matchedContact.id : undefined
    }))

    const publishInput = {
      owner: this.props.userInfo.id,
      title: this.state.title,
      price: Number(this.state.price),
      description: this.state.detail,
      category: this.state.selectedCategory,
      coverUrl: uploadedImages.length ? uploadedImages[0].qiniuUrl : null,
      pictures: uploadedImages.map(item => item.qiniuUrl),
      contacts: contactIds,
    }
    // console.log('publishInput:', publishInput)

    const { productType } = this.state

    try {
      const { data } = await client.mutate({
        mutation: productType === ProductType.GOODS ? publishGoodsMutation : publishPurchaseMutation,
        variables: { publishInput },
      })
      Taro.redirectTo({
        url: `/pages/detail/index?id=${data.publishGoods || data.publishPurchase}&productType=${productType}`,
      })
    } catch (e) {
      let error = 'systemError'
      if(e.message.indexOf('400') > -1) {
        error = 'invalidParameters'
      } else if(e.message.indexOf('403') > -1) {
        error = 'invalidUser'
      }
      this.showErrorMessage(error)
    } finally {
      this.setLoading(false)
    }
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
        <PublishInfo onSetVal={this.setStateValue} />
        <PublishImages onSetVal={this.setStateValue} showErrorMessage={this.showErrorMessage} />
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
    )
  }
}

export default Publish as ComponentClass<PageOwnProps, PageState>
