import Taro, { memo, useState } from '@tarojs/taro'
import { useSelector, useDispatch } from '@tarojs/redux'
import { AtInput, AtTextarea, AtButton, AtToast } from 'taro-ui'
import { View } from '@tarojs/components'

import Avatar from '../../../components/avatar'

import client from '../../../graphql-client'
import { delay } from '../../../utils/helper'
import { CertifyEmail } from '../../../constants/enums'
import { updateUserInfo } from '../../../actions/userInfo'
import { updateUserInfoQuery } from '../../../query/userInfo'

import styles from './index.module.scss'


function ProfileEdit() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: any) => {
    return state.userInfo
  })

  const [nickname, setNickname] = useState(userInfo.nickname)
  const [nicknameError, setNicknameError] = useState(false)
  const [avatarUrl] = useState(userInfo.avatarUrl)
  const [brief, setBrief] = useState(userInfo.brief)
  const [toastOpened, setToastOpened] = useState(false)
  const [toastStatus, setToastStatus] = useState('success')
  const [toastText, setToastText] = useState('')

  const handleAvatarClick = () => {
    console.log('handleAvatarClick')
  }

  const onNicknameChange = (val) => {
    setNickname(val)
    if(val) {
      setNicknameError(false)
    }
  }

  const onBriefChange = (event) => setBrief(event.target.value)

  const showToast = async(status, text) => {
    setToastStatus(status)
    setToastText(text)
    setToastOpened(true)
    await delay(3000)
    setToastOpened(false)
  }

  const onSubmit = async() => {
    if(!nickname) {
      setNicknameError(true)
      return
    }
    try {
      const { data } = await client.mutate({
        mutation: updateUserInfoQuery,
        variables: { userInfoInput: { avatarUrl, nickname, brief }},
      })
      dispatch(updateUserInfo(data.userInfo))
      showToast('success', '修改成功')
    } catch (e) {
      console.log(e)
      showToast('error', '修改失败')
    }
  }

  return (
    <View className={styles.profileEditContainer}>
      <View className={styles.avatar}>
        <Avatar
          certificate={userInfo.certification === CertifyEmail.CERTIFIED}
          userId={userInfo.id}
          avatarUrl={avatarUrl}
          avatarSize={108}
          onClick={handleAvatarClick}
        />
      </View>

      <View className={styles.formContainer}>
        <AtInput
          error={nicknameError}
          name="nickname"
          title="昵称"
          type="text"
          value={nickname}
          onChange={onNicknameChange}
        />
        <AtTextarea
          value={brief}
          onChange={onBriefChange}
          maxLength={100}
          placeholder='请输入你的简介'
        />
        <AtButton
          customStyle="margin-top: 20px"
          type="primary"
          onClick={onSubmit}
        >保存</AtButton>
        <AtToast
          isOpened={toastOpened}
          text={toastText}
          status={toastStatus}
        />
      </View>
    </View>
  )
}

export default memo(ProfileEdit)
