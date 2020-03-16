import Taro, { memo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon }  from 'taro-ui'
import classNames from 'classnames'


import styles from './index.module.scss'

interface InProps {
  searchHistory: string[]
  onClearHistory: () => void
}

function SeachHistory(props: InProps) {
  const { searchHistory=[], onClearHistory } = props

  const clearHistory = () => {
    if(searchHistory.length){
      onClearHistory()
    }
  }

  const searchKeyword = (keyword) => () => {
    console.log(keyword)
  }

  const renderKeywordsEmpty = () => {
    return (
      <View className={styles.empty}>
        <Text>暂无搜索记录</Text>
      </View>
    )
  }

  return (
    <View className={styles.searchHistory}>
      <View className={styles.header}>
        <Text>历史搜索</Text>
        <View
          className={classNames(styles.headerRight, { 'grey': !searchHistory.length })}
          onClick={clearHistory}
        >
          <AtIcon prefixClass='iconfont' value="iconshanchu" size={14}></AtIcon>
          <Text className={styles.headerRightText}>清空</Text>
        </View>
      </View>
      <View className={styles.body}>
        {
          searchHistory.length ? (
            searchHistory.map((item, index) =>
              <View
                className={styles.keywords}
                key={Symbol(index).toString()}
                onClick={searchKeyword(item)}
              >
                {item}
              </View>
            )
          ) : renderKeywordsEmpty()
        }
      </View>
    </View>
  )

}


export default memo(SeachHistory)
