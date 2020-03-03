import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton, AtToast }  from 'taro-ui'
import { connect } from '@tarojs/redux'
import { ComponentClass } from 'react'

import TabBar from '../../components/tabBar'
import PublishInfo from './info'
import Category from './category'
import Contact from './contact'
import PublishImages from './images'
import client from '../../graphql-client'
import { publishMutation, getQiniuTokenQuery } from '../../query/publish'
import { cleanArrayEmpty } from '../../utils/helper'
import { upload } from '../../utils/qiniuUploader'

import './index.scss'

const errorMessage = {
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
  purchase: '发布求购',
  goods: '发布出售',
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

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Publish {
  props: IProps;
}

@connect(({ userInfo }) => ({
  userInfo: userInfo,
}))
class Publish extends Component {

  state = {
    toastText: '',
    showToast: false,
    toastStatus: 'error',
    title: '',
    price: '',
    detail: '',
    selectedCategory: '',
    selectedContacts: [],
    qiniuToken: '',
    imagesUrls: [],
    // qiniuUrls: [],
    isPublishing: false,
  }

  componentWillMount(): void {
    Taro.setNavigationBarTitle({
      title: TITLE_TEXT[this.$router.params.type] || '发布',
    })
    console.log(this.$router.params)
  }

  componentDidMount(){
    this.getToken()
  }

  getToken = async() => {
    const { data } = await client.query({ query: getQiniuTokenQuery, variables: {}})
    const qiniuTokenNew = data.qiniuToken.token
    Taro.setStorageSync('qiniuToken', qiniuTokenNew)
    this.setState({ qiniuToken: qiniuTokenNew })
  }

  uploadPic = async() => {
    const { imagesUrls, qiniuToken } = this.state
    const urlCount = imagesUrls.length
    const newImg = await new Promise((resolve, reject)=>{
      try {
        const newImageUrls: Publish.InPickerImageFiles[] = []
        imagesUrls.forEach(async(imageUrl: Publish.InPickerImageFiles) => {
          const filePath = imageUrl.url
          const qiniuUrl = await this.uploadQiniu(filePath, qiniuToken)
          imageUrl.qiniuUrl = qiniuUrl
          newImageUrls.push(imageUrl)
          if(newImageUrls.length === urlCount ){
            resolve(newImageUrls)
          }
        })
      } catch (err) {
        reject('error')
      }
    })
    return newImg
  }

  uploadQiniu = async(filePath: string, qiniuToken: string) => {
    const qiniuUrl = await new Promise((resolve, reject)=>{
      upload({
        filePath: filePath,
        options: {
          region: 'ECN',
          domain: 'q67pnvkzx.bkt.clouddn.com',
          uptoken: qiniuToken,
          shouldUseQiniuFileName: true,
        },
        before: () => {
        },
        success: (res) => {
          const qiniuUrl = res.domainUrl
          return resolve(qiniuUrl)
        },
        fail: () => {
          return reject('')
        },
        progress: () => {
        },
        complete: () => {
        },
      })
    })
    return qiniuUrl
  }

  validRequired = (val) => {
    if(!val.length){
      return false
    }
    return true
  }

  showErrorMessage = (name) => {
    const text = errorMessage[name]
    this.setState({
      showToast: true,
      toastText: text,
      toastStatus: name === 'images' ? '' : 'error',
    })
  }

  vaildInput = (isShowErrorMessage = false) => {
    const { title, price, detail, selectedCategory, selectedContacts, imagesUrls } = this.state
    if(!this.validRequired(title)){
      isShowErrorMessage && this.showErrorMessage('title')
      return false
    }
    if(!this.validRequired(price)){
      isShowErrorMessage && this.showErrorMessage('price')
      return false
    }
    if(!this.validRequired(detail)){
      isShowErrorMessage && this.showErrorMessage('detail')
      return false
    }
    if(!this.validRequired(imagesUrls)){
      isShowErrorMessage && this.showErrorMessage('imagesUrls')
      return false
    }
    if(!this.validRequired(selectedCategory)){
      isShowErrorMessage && this.showErrorMessage('selectedCategory')
      return false
    }
    if(!this.validRequired(selectedContacts)){
      isShowErrorMessage && this.showErrorMessage('selectedContacts')
      return false
    }
    return true
  }

  validImage = async() => {
    const qiniuImages = await this.uploadPic()
    if(typeof qiniuImages === 'string'){
      this.showErrorMessage('uploadError')
      return false
    }
    const qiniuUrls = []
    qiniuImages.map(item=>{
      qiniuUrls.push(item.qiniuUrl)
    })
    this.setState({
      imagesUrls: qiniuImages,
    })
    return qiniuUrls
  }

  setLoading = (val) => {
    this.setState({
      isPublishing: val,
    })
  }

  handleSubmit = async() => {
    if(!this.vaildInput(true)) return
    this.setLoading(true)
    const toUploadUrls = await this.validImage()
    if(!toUploadUrls){
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
      coverUrl: toUploadUrls[0],
      pictures: toUploadUrls,
      contacts: contactIds,
    }

    try {
      const { data } = await client.mutate({ mutation: publishMutation, variables: { publishInput }})
      Taro.removeStorage({
        key: 'qiniuToken',
      })
      Taro.redirectTo({
        url: '/pages/detail/index?id=' + data.publish,
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

  handleClose = () => {
    this.setState({
      showToast: false,
      toastText: '',
    })
  }

  setVal = (key, value) => {
    this.setState({
      [key]: value,
    })
  }

  config: Config = {
    navigationBarTitleText: '',
  }

  render() {
    return (
      <View className="publish">
        <PublishInfo onSetVal={this.setVal} />
        <PublishImages  onSetVal={this.setVal} showErrorMessage={this.showErrorMessage} />
        <Category
          onSetVal={this.setVal}
          selectedCategory={this.state.selectedCategory}
        />
        <Contact
          contacts={this.props.userInfo.contacts}
          selectedContacts={this.state.selectedContacts}
          onSetVal={this.setVal}
        />
        <View className="form_btn">
          <AtButton
            type="primary"
            onClick={this.handleSubmit}
            disabled={!this.vaildInput() || this.state.isPublishing}
            loading={this.state.isPublishing}
          >发布</AtButton>
        </View>
        <AtToast isOpened={this.state.showToast} text={this.state.toastText} onClose={this.handleClose} hasMask status={this.state.toastStatus}></AtToast>
        <TabBar  current={1} />
      </View>
    )
  }
}

export default Publish as ComponentClass<PageOwnProps, PageState>
