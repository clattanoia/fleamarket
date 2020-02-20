import Taro, { memo,useState} from '@tarojs/taro'
import {View,Text,Button} from '@tarojs/components'
import { AtTabBar,AtFloatLayout } from 'taro-ui'

import {GlobalData} from '../../utils/globalData'

import * as authLogin from '../../utils/auth'
import './index.scss'

interface InProps {
  current: number
}

function TabBar(props: InProps) {

  const [isOpened,setIsOpened] = useState(false)

  const getInfo = async () => {
    try {
      const info = await Taro.getUserInfo()
      GlobalData.authInfo = {...GlobalData.authInfo,...info.userInfo}
      return true
    } catch(err){
      setIsOpened(true)
      // console.log(err)
      return false
    }
  }


  const handleClick = async (value) => {
    if(value===0 && props.current!==0){
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
    if(value===1 && props.current!==1){
      const isGetInfo = await getInfo()
      if(isGetInfo){
        authLogin.default()
      }
      Taro.navigateTo({
        url: '/pages/publish/index'
      })
    }
    if(value===2 && props.current!==2){
      authLogin.default()
      Taro.navigateTo({
        url: '/pages/profile/index'
      })
    }
  }

  const handleClose = () => {
    setIsOpened(false)
  }

  const clickAuthBtn = () => {
    setIsOpened(false)
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
          // { title: '发布', image: '../assets/publish.png',selectedImage:'../assets/publish.png'},
          // { title: '我的', image: '../assets/profile.png',selectedImage:'../assets/profile_selected.png' }
        ]}
        onClick={handleClick}
        current={props.current}
      />
      <AtFloatLayout isOpened={isOpened} title="获取授权" onClose={handleClose}>
        <View className='get-auth'>
          <Text>获取授权后，关闭弹框，再次操作</Text>
          <Button open-type='getUserInfo' onClick={clickAuthBtn} >获取授权</Button>
        </View>
      </AtFloatLayout>
    </View>
  )

}

export default memo(TabBar)
