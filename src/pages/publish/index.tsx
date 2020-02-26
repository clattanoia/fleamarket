import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton,AtToast }  from 'taro-ui'
import {connect} from '@tarojs/redux'
import {ComponentClass} from 'react'

import TabBar from '../../components/tabBar'
import PublishInfo from './info'
import Category from './category'
import Contact from './contact'
import PublishImages from './images'
import client from '../../graphql-client'
import { publishMutation,getQiniuTokenQuery } from '../../query/publish'
import { cleanArrayEmpty } from '../../utils/helper'
import { upload } from '../../utils/qiniuUploader'

import './index.scss'

const errorMessage = {
  title: '标题不能为空',
  price:'价格不能为空',
  detail:'详情不能为空',
  selectedCategory: '分类不能为空',
  selectedContacts: '联系方式不能为空',
  invalidParameters: '参数错误',
  systemError: '服务异常',
  invalidUser: '用户已被禁用'
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
    title: '',
    price:'',
    detail:'',
    selectedCategory: '',
    selectedContacts: [],
    qiniuToken:'',
    imgUrls: [],
    isPublishing: false,
  }

  componentDidMount(){
    this.getToken()
  }

  getToken = async () => {
    const qiniuToken = Taro.getStorageSync('qiniuToken')
    if(qiniuToken){
      this.setState({qiniuToken})
      return
    }
    const { data } = await client.query({query:getQiniuTokenQuery, variables: {}})
    const qiniuTokenNew = data.qiniuToken.token
    Taro.setStorageSync('qiniuToken',qiniuTokenNew)
    this.setState({qiniuToken:qiniuTokenNew})
  }

  uploadPic = () => {
    const {imgUrls,qiniuToken} = this.state
    const filePath = imgUrls[0] && imgUrls[0].url
    upload({
      filePath: filePath,
      options: {
        region: 'ECN',       // 可选(默认为'ECN')
        domain: 'q67pnvkzx.bkt.clouddn.com',
        uptoken: qiniuToken,
        shouldUseQiniuFileName: true // 默认false
      },
      before: () => {
        // console.log('before upload');
      },
      success: () => {
        // console.log(res)
        // console.log(res.imageURL)
        // console.log('file url is: ' + res.fileUrl);
      },
      fail: () => {
        // console.log('error:' + err);
      },
      progress: () => {
        // console.log('上传进度', res.progress)
        // console.log('已经上传的数据长度', res.totalBytesSent)
        // console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      },
      complete: () => {
        // 上传结束
        // console.log('upload complete');
        // console.log(res)
      }
    })
  }

  validRequired = (val) => {
    if (!val.length){
      return false
    }
    return true
  }

  showErrorMessage = (name) => {
    const text = errorMessage[name]
    this.setState({
      showToast: true,
      toastText: text
    })
  }

  vaildInput = (isShowErrorMessage = false) => {
    const {title, price, detail, selectedCategory, selectedContacts} = this.state
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

  handleSubmit = async () => {
    this.setState({
      isPublishing: true
    })
    this.uploadPic()
    if (!this.vaildInput(true)) return
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
      coverUrl: 'https://img.alicdn.com/bao/uploaded/i4/2555955104/TB26NINyY9YBuNjy0FgXXcxcXXa_!!2555955104.png',
      pictures: ['https://img.alicdn.com/bao/uploaded/i4/2555955104/TB26NINyY9YBuNjy0FgXXcxcXXa_!!2555955104.png'],
      contacts: contactIds,
    }

    try {
      const { data } = await client.mutate({mutation:publishMutation, variables: { publishInput }})
      this.setState({
        isPublishing: false
      })
      Taro.removeStorage({
        key: 'qiniuToken'
      })
      Taro.redirectTo({
        url: '/pages/detail/index?id=' + data.publish
      })
    } catch (e) {
      let error = 'systemError'
      if (e.message.indexOf('400') > -1) {
        error = 'invalidParameters'
      } else if (e.message.indexOf('403') > -1) {
        error = 'invalidUser'
      }
      this.showErrorMessage(error)
    }
  }

  handleClose = () => {
    this.setState({
      showToast: false,
      toastText: ''
    })
  }

  setVal = (key,value) => {
    this.setState({
      [key]:value
    })
  }

  config: Config = {
    navigationBarTitleText: '出售',
  }

  render () {
    return (
      <View className="publish">
        <PublishInfo onSetVal={this.setVal} />
        <PublishImages  onSetVal={this.setVal} />
        <Category onSetVal={this.setVal} selectedCategory={this.state.selectedCategory} />
        <Contact
          contacts={this.props.userInfo.contacts}
          onSetVal={this.setVal}
          selectedContacts={this.state.selectedContacts}
        />
        <View className="form_btn">
          <AtButton
            type="primary"
            onClick={this.handleSubmit}
            disabled={!this.vaildInput()}
            loading={this.state.isPublishing}
          >发布</AtButton>
        </View>
        <AtToast
          isOpened={this.state.showToast}
          text={this.state.toastText}
          onClose={this.handleClose}
          hasMask
          status="error"
        >
        </AtToast>
        <TabBar  current={1} />
      </View>
    )
  }
}

export default Publish as ComponentClass<PageOwnProps, PageState>
