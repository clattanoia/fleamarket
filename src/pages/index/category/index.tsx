import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import CategoryItem from '../conponents/categoryItem'

import styles from './index.module.scss'

const colors = ['#10CA2E', '#646DE9', '#FFD252', '#FF842F', '#278EE4', '#07D6AA', '#FCA84F', '#0CC429', '#7E5AD6', '#FB5D5E']

function CategorySection() {
  const categories = useSelector((state: any)=> {
    return state.category.categories
  })
  const [width, setWidth]=useState(0)
  console.log(categories)

  useEffect(()=>{
    Taro.getSystemInfo({
      success: res => {
        setWidth(res.screenWidth / 5)
      },
    })
  }, [])

  if (categories.length === 0){
    return null
  }

  const firstPage = categories.slice(0, 10)
  console.log(firstPage)

  // if (firstPage.length === 0){
  //   return null
  // }

  const gotoList = (id) => () => {
    // Taro.redirectTo({
    //   url: id
    // })
    console.log(id)
  }

  return (
    <View className={styles.categorySection}>
      <Swiper
        className={styles.categoryBody}
        indicatorDots
        indicatorColor='#ffffff'
        indicatorActiveColor='#FE5155'
        circular
      >
        <SwiperItem>
          <View className={styles.categoryContent}>
            {
              firstPage.map((category, index)=>
                <View className={styles.categoryItem} key={category.id} onClick={gotoList(category.id)}>
                  <CategoryItem category={category} color={colors[index]} width={width} />
                </View>
              )
            }
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className='categoryContent'>
            {
              firstPage.map((category)=>
                <CategoryItem key={category.id} category={category} color="green" width={width} />
              )
            }
          </View>
        </SwiperItem>
      </Swiper>
    </View>
  )

}


export default memo(CategorySection)
