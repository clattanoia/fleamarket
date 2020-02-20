import Taro, { memo } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'

import * as authLogin from '../utils/auth'

interface InProps {
  current: number
}

function TabBar(props: InProps) {

  const handleClick = (value) => {
    if(value===0 && props.current!==0){
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
    if(value===1 && props.current!==1){
      authLogin.default()
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

  return (
    <AtTabBar
      fixed
      color='#4a4a4a'
      selectedColor='#fe5155'
      iconSize={28}
      tabList={[
        { title: '首页', iconPrefixClass:'iconfont', iconType: 'iconsidebar-home'},
        { title: '发布', iconPrefixClass:'iconfont', iconType: 'iconfabu'},
        { title: '我的', iconPrefixClass:'iconfont', iconType: 'iconsidebar-account-copy'}
        // { title: '发布', image: '../assets/publish.png',selectedImage:'../assets/publish.png'},
        // { title: '我的', image: '../assets/profile.png',selectedImage:'../assets/profile_selected.png' }
      ]}
      onClick={handleClick}
      current={props.current}
    />
  )

}

export default memo(TabBar)
