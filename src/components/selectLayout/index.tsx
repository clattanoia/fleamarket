import Taro, { memo, useState, useEffect, useCallback } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'
import classNames from 'classnames'
import FloatLayout from '../FloatLayout'

import styles from './index.module.scss'

interface InProps {
  list: Search.SelectLayout[]
  current: Search.SelectLayout
  onChangeSelect: (id) => void
  textBottom?: number
  forceHiddenFloatLayout: boolean
  resetForceHiddenFloatLayout: (val) => void
}

function SelectLayout(props: InProps) {
  const { list, current, onChangeSelect, textBottom = 0, forceHiddenFloatLayout = false, resetForceHiddenFloatLayout } = props
  const [arrotB, setArrowB] = useState(true)


  const closeFloat = useCallback(() => {
    setArrowB(true)
    resetForceHiddenFloatLayout(false)
  })

  useEffect(() => {
    if(forceHiddenFloatLayout){
      closeFloat()
    }
  }, [closeFloat, forceHiddenFloatLayout])

  if(!list || !list.length){
    return null
  }

  const selectClick = () => {
    setArrowB(!arrotB)
  }

  const listClick = (val) => () => {
    onChangeSelect(val)
    closeFloat()
  }

  return (
    <View  id="selectLayout">
      <View className={styles.selectLayout} style={{ marginBottom: `${textBottom}px` }}>
        <View className={styles.selectLayoutShow} onClick={selectClick}>
          <View className={styles.selectTitle}>{current.name}</View>
          <View className={styles.selectIcon}>
            <AtIcon prefixClass='iconfont' value={arrotB ? 'iconarrowbottom' : 'iconarrowtop'} size="16"></AtIcon>
          </View>
        </View>
      </View>

      <FloatLayout visible={!arrotB} closeFloat={closeFloat}>
        <View
          className={classNames(styles.selectLayoutList)}
        >
          {
            list.map(item =>
              <View
                className={classNames(styles.list, { 'activeColor': item.id === current.id  })}
                onClick={listClick(item)}
                key={item.id}
              >
                {item.name}
              </View>
            )
          }
        </View>
      </FloatLayout>
    </View>
  )

}


export default memo(SelectLayout)
