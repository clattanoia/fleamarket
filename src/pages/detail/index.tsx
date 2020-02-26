import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import Avatar from '../../components/avatar'
import Tag from '../../components/tag'
import ExtendedContainer from '../../components/extendedContainer'
import { GoodDetail } from '../../constants/types'
import DetailPreload from './components/detailPreload'
import { detailQuery } from '../../query/detail'
import client from '../../graphql-client'
import { Status } from '../../constants/enums'

import './index.scss'

class GoodsDetail extends Component<{}, {
  detail: GoodDetail | null
}> {
  config: Config = {
    navigationBarTitleText: '帖子详情',
  }

  state = {
    detail: null
  }

  async componentDidMount () {
    const { id } = this.$router.params
    const { data } = await client.query({query: detailQuery, variables: { id }})
    this.setState({
      detail: data.goods
    })
  }

  genSaleStatus = (status: Status) => {
    switch(status) {
      case Status.FOR_SALE:
        return '出售'
      case Status.SALE_OUT:
        return '已下架'
      case Status.FREEZE:
        return '冻结'
    }
  }

  render () {
    const { detail } = this.state
    return detail !== null ? (
      <View className="detail">
        <Avatar
          userId={detail.owner.id}
          avatarUrl={detail.owner.avatarUrl}
          nickname={detail.owner.nickname}
          avatarSize={80}
          nameSize={36}
        />
        <View className="price-container">
          <Text className="unit">￥</Text>
          <Text className="price">
            {detail.price}
          </Text>
        </View>
        <View className="detial-container">
          <View className="title">
            <Text>商品详情</Text>
          </View>
          <View className="status-tags">
            <Tag tagName={this.genSaleStatus(detail.status)} />
          </View>
          <View className="description">
            <ExtendedContainer maxLine={2} content={detail.description} />
          </View>
          <View className="pictures">
            {
              detail.pictures.length > 0
                ? detail.pictures.map(pic => (<Image key={pic} className="picture" src={pic} />))
                : null
            }
          </View>
        </View>
        <View className="footer">
          <Button className="contact-btn">获取联系方式</Button>
        </View>
      </View>
    ) : <DetailPreload />
  }
}

export default GoodsDetail