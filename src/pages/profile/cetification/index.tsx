import Taro, { memo, useState } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalAction, AtModalContent, AtInput, AtToast } from 'taro-ui'

import client from '../../../graphql-client'
import { delay } from '../../../utils/helper'
import { certificationApplyQuery } from '../../../query/profile'

interface InProps {
  isOpened: boolean,
  onClose: () => void
}

function CetificationModal({ isOpened, onClose }: InProps) {
  const suffix = '@thoughtworks.com'
  const duration = 2000

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
    try {
      await client.mutate({
        mutation: certificationApplyQuery,
        variables: { email: email.trim() + suffix },
      })
      await showToast('success')
      onClose()
    } catch (e) {
      await showToast('error')
    }

  }

  return (
    <View>
      <AtToast
        isOpened={toastOpened}
        text={toastStatus === 'success' ? '操作成功' : '操作失败'}
        status={toastStatus}
        duration={duration}
      />
      <AtModal
        isOpened={isOpened}
        onClose={handleClose}
      >
        <AtModalHeader>邮箱认证</AtModalHeader>
        <AtModalContent>
          <AtInput
            name="email"
            type='text'
            placeholder='前缀'
            placeholderStyle=""
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
