import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtTabBar, AtFloatLayout } from 'taro-ui'
import AuthInfoLayout from '../authInfo'
import { authLogin } from '../../utils/auth'
import './index.scss'

interface InProps {
  current: number
}


function TabBar(props: InProps) {

  const pageUrl = ['/pages/index/index', '/pages/publish/index', '/pages/profile/index']

  const [isOpenedTel, setIsOpenedTel] = useState(false)
  const [toUrl, setToUrl] = useState('')
  let currentUrl = ''

  const gotoPage = () => {
    Taro.redirectTo({
      url: currentUrl || toUrl,
    })
  }

  const handleClick = (value) => {
    currentUrl = pageUrl[value]
    setToUrl(currentUrl)
    if(value===0 && props.current!==0){
      gotoPage()
      return
    }
    if(value===1 && props.current!==1){
      authLogin({ callback:gotoPage })
      return
    }
    if(value===2 && props.current!==2){
      authLogin({ callback:gotoPage })
      return
    }
  }

  const handleClose = () => {
    setIsOpenedTel(false)
  }

  const clickAuthTelBtn = () => {
    setIsOpenedTel(false)
  }

  return (
    <View>
      <AtTabBar
        fixed
        color='#4a4a4a'
        selectedColor='#fe5155'
        iconSize={28}
        tabList={[
          { title: '首页', iconPrefixClass:'iconfont', iconType: 'iconsidebar-home' },
          { title: '发布', iconPrefixClass:'iconfont', iconType: 'iconfabu_selected-copy' },
          { title: '我的', iconPrefixClass:'iconfont', iconType: 'iconsidebar-account-copy' },
        ]}
        onClick={handleClick}
        current={props.current}
      />

      <AuthInfoLayout authCallback={gotoPage} />

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
