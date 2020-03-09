import Taro, { memo } from '@tarojs/taro'
import { View } from '@tarojs/components'
import SeachListSection from '../../../components/searchList'

interface InProps {
  onSetVal: (key, value) => void
  productTypes: Search.SelectLayout[]
}

function ResultPage(props: InProps) {
  const { productTypes, onSetVal } = props

  // const onSetP = (key, value) => {
  //   onSetVal(key,value)
  // }

  return (
    <View>
      <SeachListSection
        onSetVal={onSetVal}
        productTypes={productTypes}
      />
      11
    </View>
  )
}

export default memo(ResultPage)
