import Taro, { memo, useState, chooseImage } from '@tarojs/taro'
import { useSelector, useDispatch } from '@tarojs/redux'
import { AtInput, AtTextarea, AtButton } from 'taro-ui'
import { View } from '@tarojs/components'

import Avatar from '../../../components/avatar'

import client from '../../../graphql-client'
import { CertifyEmail } from '../../../constants/enums'
import { updateUserInfo } from '../../../actions/userInfo'
import { updateUserInfoQuery } from '../../../query/userInfo'
import { getToken, uploadQiniu } from '../../../utils/qiniuUploader'

import styles from './index.module.scss'

function ProfileEdit() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: any) => {
    return state.userInfo
  })

  const [nickname, setNickname] = useState(userInfo.nickname)
  const [nicknameError, setNicknameError] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(userInfo.avatarUrl)
  const [brief, setBrief] = useState(userInfo.brief)

  const onNicknameChange = (val) => {
    setNickname(val)
    if(val) {
      setNicknameError(false)
    }
  }

  const onBriefChange = (event) => setBrief(event.target.value)

  const handleSubmit = async() => {
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
      Taro.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 3000,
      })
    } catch (e) {
      console.log(e)
      Taro.showToast({
        title: e.message.indexOf('content_risky') > -1 ? '信息包含敏感内容，请修改后保存' : '修改失败',
        icon: 'none',
        duration: 3000,
      })
    }
  }

  const handleAvatarClick = () => {
    chooseImage({
      count: 1,
      success: async function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        const token = await getToken()
        const path = 'user/avatar/'
        try {
          Taro.showLoading({
            title: '上传中...',
          })
          const result = await uploadQiniu(tempFilePaths[0], token, path)
          Taro.hideLoading()
          let status = true
          if(result.auditResult.isValid) {
            setAvatarUrl(result.qiniuUrl)
          } else {
            status = false
          }
          Taro.showToast({
            title: status ? '上传成功' : '图片内容包含敏感信息，请重新选择上传',
            icon: status ? 'success' : 'none',
            duration: 3000,
          })
        } catch (e) {
          Taro.hideLoading()
          Taro.showToast({
            title: e.message && e.message.indexOf('audit_image_limited') > -1 ? '图片上传已达上限，请邮箱认证或稍后再试' : '上传失败',
            icon: 'none',
            duration: 3000,
          })
        }
      },
    })
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
          maxLength={30}
          placeholder='请输入你的简介'
        />
        <AtButton
          customStyle="margin-top: 20px"
          type="primary"
          onClick={handleSubmit}
        >保存</AtButton>
      </View>
    </View>
  )
}

ProfileEdit.config = {
  navigationBarTitleText: '修改个人信息',
}

export default memo(ProfileEdit)
