import Taro, { memo, useState, useEffect } from '@tarojs/taro'
import { View, Swiper, SwiperItem } from '@tarojs/components'
import { useSelector } from '@tarojs/redux'
import CategoryItem from '../components/categoryItem'

import styles from './index.module.scss'

const colors = ['#10CA2E', '#646DE9', '#FFD252', '#FF842F', '#278EE4', '#07D6AA', '#FCA84F', '#0CC429', '#7E5AD6', '#FB5D5E']

function CategorySection() {
  const categories = useSelector((state: any) => {
    return state.category.categories
  })
  const [width, setWidth]=useState(0)
  const [pages, setPages]=useState(0)

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setWidth(res.screenWidth / 5)
      },
    })
  }, [])

  useEffect(() => {
    const pagesNum = Math.ceil(categories.length / colors.length)
    setPages(pagesNum)
  }, [categories])

  if(categories.length === 0){
    return null
  }

  const gotoList = (id) => () => {
    Taro.redirectTo({
      url: `/pages/searchList/index?categoryId=${id}`,
    })
  }

  return (
    <View className={styles.categorySection}>
      <Swiper
        className={styles.categoryBody}
        indicatorDots
        indicatorColor='#cccccc'
        indicatorActiveColor='#FE5155'
        circular
      >
        {
          [...new Array(pages).keys()].map((item) => {
            const currentCategories = categories.slice(item*10, item*10+10)
            return (
              <SwiperItem key={item}>
                <View className={styles.categoryContent}>
                  {
                    currentCategories.map((category, index) =>
                      <View className={styles.categoryItem} key={category.id} onClick={gotoList(category.id)}>
                        <CategoryItem category={category} color={colors[index]} width={width} />
                      </View>
                    )
                  }
                </View>
              </SwiperItem>
            )
          }

          )
        }
      </Swiper>
    </View>
  )

}


export default memo(CategorySection)
