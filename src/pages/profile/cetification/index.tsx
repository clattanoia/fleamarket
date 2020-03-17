import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalAction, AtModalContent, AtInput, AtToast } from 'taro-ui'

import client from '../../../graphql-client'
import { delay } from '../../../utils/helper'
import { certificationApplyQuery } from '../../../query/profile'

interface InProps {
  isOpened: boolean,
  onClose: () => void,
  onConfirm: () => void,
}

function CetificationModal({ isOpened, onClose, onConfirm }: InProps) {
  const suffix = '@thoughtworks.com'
  const duration = 3000
  let loading = false

  const [email, setEmail] = useState('')
  const [toastOpened, setToastOpened] = useState(false)
  const [toastStatus, setToastStatus] = useState('success')

  const handleClose = () => {
    onClose()
  }

  const showToast = async(status) => {
    setToastStatus(status)
    setToastOpened(true)
    await delay(duration)
    setToastOpened(false)
  }

  const handleConfirm = async() => {
    if(!email.trim()) {
      return
    }
    if(loading) {
      return
    }
    loading = true
    try {
      await client.mutate({
        mutation: certificationApplyQuery,
        variables: { email: email.trim() + suffix },
      })
      await showToast('success')
      setEmail('')
      onConfirm()
    } catch (e) {
      await showToast('error')
    } finally {
      loading = false
    }
  }

  return (
    <View>
      <AtToast
        isOpened={toastOpened}
        text={toastStatus === 'success' ? `邮件发送成功，请登录邮箱${email}${suffix}进行认证` : '操作失败'}
        status={toastStatus}
        duration={duration}
      />
      <AtModal
        isOpened={isOpened}
        onClose={handleClose}
      >
        <AtModalHeader>tw邮箱认证</AtModalHeader>
        <AtModalContent>
          <AtInput
            name="email"
            type='text'
            placeholder='邮箱前缀'
            placeholderStyle="font-size: 13px"
            value={email}
            onChange={val => setEmail(val)}
          >
            <Text>{suffix}</Text>
          </AtInput>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleConfirm}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}

export default memo(CetificationModal)
