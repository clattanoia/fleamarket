import Taro, { memo,useState} from '@tarojs/taro'
import {View,Text,Button} from '@tarojs/components'
import { AtTabBar,AtFloatLayout } from 'taro-ui'

import {isAuthUserInfo,authLogin} from '../../utils/auth'
import './index.scss'

interface InProps {
  current: number
}

function TabBar(props: InProps) {

  const [isOpened,setIsOpened] = useState(false)
  const [isOpenedTel,setIsOpenedTel] = useState(false)

  const isAuthUser = async () => {
    const isAuth = await isAuthUserInfo()
    setIsOpened(!isAuth)
    if(isAuth){
      return authLogin()
    }
    return isAuth
  }


  const handleClick = async (value) => {
    if(value===0 && props.current!==0){
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
    if(value===1 && props.current!==1){
      const isAuth = await isAuthUser()
      if(isAuth){
        Taro.navigateTo({
          url: '/pages/publish/index'
        })
      }
    }
    if(value===2 && props.current!==2){
      const isAuth = await isAuthUser()
      if(isAuth){
        Taro.navigateTo({
          url: '/pages/profile/index'
        })
      }
    }
  }

  const handleClose = () => {
    setIsOpened(false)
  }

  const clickAuthBtn = (res) => {
    setIsOpened(false)
    const {detail} = res
    const {errMsg} = detail
    if(errMsg.indexOf(':ok') > -1){
      authLogin()
    }
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
          { title: '首页', iconPrefixClass:'iconfont', iconType: 'iconsidebar-home'},
          { title: '发布', iconPrefixClass:'iconfont', iconType: 'iconfabu_selected-copy'},
          { title: '我的', iconPrefixClass:'iconfont', iconType: 'iconsidebar-account-copy'}
        ]}
        onClick={handleClick}
        current={props.current}
      />

      <AtFloatLayout isOpened={isOpened} title="获取授权" onClose={handleClose}>
        <View className='get-auth'>
          <Text className='get-auth-text'>该操作需要您的微信信息，请授权后，再次操作</Text>
          <Button open-type='getUserInfo' onGetUserInfo={clickAuthBtn} >获取微信授权</Button>
        </View>
      </AtFloatLayout>

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
