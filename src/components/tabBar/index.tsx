import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtTabBar, AtFloatLayout, AtActionSheet, AtActionSheetItem, AtToast } from 'taro-ui'
import { useSelector } from '@tarojs/redux'

import AuthInfoLayout from '../authInfo'
import { authLogin } from '../../utils/auth'
import { ProductType, CertifyEmail } from '../../constants/enums'
import client from '../../graphql-client'
import { getForSaleProductCountQuery } from '../../query/count'

import './index.scss'

interface InProps {
  current: number
}

const MAX_PUBLISH_COUNT=5
const MAX_CERTIFIED_PUBLISH_COUNT=20

function TabBar(props: InProps) {

  const userInfo = useSelector((state: any) => {
    return state.userInfo
  })
  const pageUrl = ['/pages/index/index', '/publishPages/index', '/pages/profile/index']

  const [isPublishLayoutOpen, setPublishLayoutOpen] = useState(false)
  const [isOpenedTel, setIsOpenedTel] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState('')

  let toUrl = ''
  let openPublishLayout = false  // 登录回调判断是跳转页面还是打开弹窗

  const gotoPage = () => {
    Taro.reLaunch({
      url: toUrl,
    })
  }

  const authLoginCallback = async() => {
    const { certification } = userInfo
    let maxCount = MAX_PUBLISH_COUNT
    let toastText = `您的发布已达到${MAX_PUBLISH_COUNT}条。认证后，才可以发布更多！`
    if(certification === CertifyEmail.CERTIFIED){
      maxCount = MAX_CERTIFIED_PUBLISH_COUNT
      toastText = `正常求购/出售的二货数量不能超过${MAX_CERTIFIED_PUBLISH_COUNT}条！`
    }
    const { data: { getForSaleProductCount }} = await client.query({
      query: getForSaleProductCountQuery,
    })
    const { result } = getForSaleProductCount
    if(result >= maxCount){
      setToastText(toastText)
      setShowToast(true)
    } else {
      setPublishLayoutOpen(true)
    }
  }

  const authCallback = () => {
    if(openPublishLayout) {
      authLoginCallback()
    } else {
      gotoPage()
    }
  }

  const handleClick = (value) => {
    if(value === 1){
      openPublishLayout = true
      return authLogin({ callback: authLoginCallback })
    }

    openPublishLayout = false

    // 主页或者个人中心不重复渲染
    if(value === props.current) {
      return
    }

    if(value === 0){
      toUrl = pageUrl[value]
      gotoPage()
    }

    if(value === 2){
      toUrl = pageUrl[value]
      authLogin({ callback: gotoPage })
    }
  }

  const handleClose = () => {
    setIsOpenedTel(false)
  }

  const clickAuthTelBtn = () => {
    setIsOpenedTel(false)
    setToastText('')
  }

  const handlePublishItemClick = (key) => {
    const type = {
      goods: ProductType.GOODS,
      purchase: ProductType.PURCHASE,
    }[key]
    setPublishLayoutOpen(false)
    const currentPage = Taro.getCurrentPages()[0]
    // pages/publish/index /pages/publish/index
    if( pageUrl[1].indexOf(currentPage.route) > -1 && currentPage.options.type === type) {
      return
    }
    toUrl = `${pageUrl[1]}?productType=${type}`
    gotoPage()
  }

  const handleCloseToast = () => {
    setShowToast(false)

  }

  return (
    <View>
      <AtTabBar
        fixed
        color='#4a4a4a'
        selectedColor='#fe5155'
        iconSize={28}
        tabList={[
          { title: '首页', iconPrefixClass: 'iconfont', iconType: 'iconsidebar-home' },
          { title: '发布', iconPrefixClass: 'iconfont', iconType: 'iconfabu_selected-copy' },
          { title: '我的', iconPrefixClass: 'iconfont', iconType: 'iconsidebar-account-copy' },
        ]}
        onClick={handleClick}
        current={props.current}
      />

      <AuthInfoLayout authCallback={authCallback} />

      <AtActionSheet
        isOpened={isPublishLayoutOpen}
        cancelText='取消'
        title='选择你要发布的类型'
        onCancel={() => setPublishLayoutOpen(false)}
        onClose={() => setPublishLayoutOpen(false)}
      >
        <AtActionSheetItem onClick={() => handlePublishItemClick('goods')}>
          发布出售
        </AtActionSheetItem>
        <AtActionSheetItem onClick={() => handlePublishItemClick('purchase')}>
          发布求购
        </AtActionSheetItem>
      </AtActionSheet>

      <AtFloatLayout isOpened={isOpenedTel} title="获取授权" onClose={handleClose}>
        <View className='get-auth'>
          <Text className='get-auth-text'>该操作需要您的微信信息，请授权后，再次操作</Text>
          <Button open-type='getPhoneNumber' onGetPhoneNumber={clickAuthTelBtn} >获取手机号码授权</Button>
        </View>
      </AtFloatLayout>

      <AtToast
        isOpened={showToast}
        text={toastText}
        onClose={handleCloseToast}
        hasMask
      >
      </AtToast>
    </View>
  )

}

export default memo(TabBar)
