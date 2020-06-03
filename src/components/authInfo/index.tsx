import { Button, Text, View } from '@tarojs/components'
import { useDispatch, useSelector } from '@tarojs/redux'
import Taro, { memo } from '@tarojs/taro'
import { AtFloatLayout } from 'taro-ui'
import { SET_AUTH_INFO } from '../../constants/actionTypes'
import { authLogin } from '../../utils/auth'
import './index.scss'

interface InProps {
  authCallback?: () => void;
}

const _authCallbacks = new Set<() => void>()

function authCallbacks() {
  _authCallbacks.forEach(cb => cb())
}

function AuthInfoLayout(props: InProps) {
  Taro.useEffect(() => {
    props.authCallback && _authCallbacks.add(props.authCallback)
    return () => {
      props.authCallback && _authCallbacks.delete(props.authCallback)
    }
  }, [props.authCallback])

  const dispatch = useDispatch()
  const isOpenedAuthInfo = useSelector((state: any) => {
    return state.global.isOpenedAuthInfo
  })

  const handleClose = () => {
    dispatch({ type: SET_AUTH_INFO, payload: false })
  }

  const clickAuthBtn = res => {
    dispatch({ type: SET_AUTH_INFO, payload: false })
    const { detail } = res
    const { errMsg } = detail
    if(errMsg.indexOf(':ok') > -1) {
      authLogin({ callback: authCallbacks })
    }
  }

  return (
    <View>
      <AtFloatLayout
        isOpened={isOpenedAuthInfo}
        title="获取授权"
        onClose={handleClose}
      >
        <View className="get-auth">
          <Text className="get-auth-text">
            该操作需要您的微信信息，请授权后，再次操作
          </Text>
          <Button open-type="getUserInfo" onGetUserInfo={clickAuthBtn}>
            获取微信授权
          </Button>
        </View>
      </AtFloatLayout>
    </View>
  )
}

export default memo(AuthInfoLayout)
