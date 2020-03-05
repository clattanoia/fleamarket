import Taro, { memo, useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'
import classNames from 'classnames'
// import FloatList from '../FloatList'

import styles from './index.module.scss'

interface InProps {
  list: Search.SelectLayout[]
  current: Search.SelectLayout
  onChangeSelect: (id) => void
}

function SelectLayout(props: InProps) {
  const { list, current, onChangeSelect } = props
  const [arrotB, setArrowB] = useState(true)

  if(!list || !list.length){
    return null
  }


  const selectClick = () => {
    setArrowB(!arrotB)
  }

  // const closeFloat = () => {
  //   setArrowB(true)
  // }

  const listClick = (val) => () => {
    onChangeSelect(val)
    setArrowB(!false)
  }

  return (
    <View>
      <View className={styles.selectLayout}>
        <View className={styles.selectLayoutShow} onClick={selectClick}>
          <View className={styles.selectTitle}>{current.name}</View>
          <View className={styles.selectIcon}>
            <AtIcon prefixClass='iconfont' value={arrotB ? 'iconarrowbottom' : 'iconarrowtop'} size="16"></AtIcon>
          </View>
        </View>
      </View>
      <View
        className={classNames(styles.selectLayoutList)}
        style={{ display: arrotB ? 'none' : 'block' }}
      >
        {
          list.map(item =>
            <View
              className={classNames(styles.list, { 'selectActive': item.id === current.id  })}
              onClick={listClick(item)}
            >
              {item.name}
            </View>
          )
        }
      </View>
      {/* <FloatList visible={!arrotB} closeFloat={closeFloat} listData={list} listClickFunc={listClick}/> */}
    </View>
  )

}


export default memo(SelectLayout)
