import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtTabBar, AtFloatLayout, AtActionSheet, AtActionSheetItem } from 'taro-ui'
import AuthInfoLayout from '../authInfo'
import { authLogin } from '../../utils/auth'
import './index.scss'

interface InProps {
  current: number
}

function TabBar(props: InProps) {

  const pageUrl = ['/pages/index/index', '/pages/publish/index', '/pages/profile/index']

  const [isPublishLayoutOpen, setPublishLayoutOpen] = useState(false)
  const [isOpenedTel, setIsOpenedTel] = useState(false)
  let toUrl = ''

  const gotoPage = () => {
    Taro.redirectTo({
      url: toUrl,
    })
  }

  const handleClick = (value) => {
    if(value === 1){
      authLogin({ callback: () => setPublishLayoutOpen(true) })
    }

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
  }

  const handlePublishItemClick = (type) => {
    setPublishLayoutOpen(false)
    toUrl = `${pageUrl[1]}?type=${type}`
    console.log(toUrl)
    gotoPage()
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

      <AuthInfoLayout authCallback={gotoPage} />

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
    </View>
  )

}

export default memo(TabBar)
