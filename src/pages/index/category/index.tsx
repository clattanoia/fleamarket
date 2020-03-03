import Taro, { memo } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'

import './index.scss'


function CategorySection() {

  return (
    <View className="category">
      <Swiper
        className='test-h'
        indicatorDots
        indicatorColor='#ffffff'
        indicatorActiveColor='#FE5155'
        circular
      >
        <SwiperItem>
          1111111
          <Image src="http://qiniu.yaya12.com/Fg9GeQd8SVbcmSS0sFC_5eEXJSUc" />
          <View className='demo-text-1'>1111</View>
        </SwiperItem>
        {/* <SwiperItem>
          222222
          <View className='demo-text-2'>2222</View>
        </SwiperItem>
        <SwiperItem>
          3333
          <View className='demo-text-3'>3333</View>
        </SwiperItem> */}
      </Swiper>
    </View>
  )

}


export default memo(CategorySection)
