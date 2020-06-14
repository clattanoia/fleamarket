import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import cls from 'classnames'
import './index.scss'
import { districtData } from './data'
import { setLocationSelect } from '../../actions/global'
import { Location, DistrictInfo } from '../../interfaces/detail'
import { SpecialAreaPrefix } from '../../constants/index'
import { isValidDistrictInfo } from '../../utils/helper'

type PageStateProps = {
  global: {
    locationSelect: Location
  }
}

type PageDispatchProps = {
  setLocationSelect: (payload: Location) => Function,
}

type PageState = {
  curProvince?: DistrictInfo
}

type IProps = PageStateProps & PageDispatchProps

interface LocationSelect {
  props: IProps
}

@connect(({ global }) => ({
  global,
}), (dispatch) => ({
  setLocationSelect(payload) {
    dispatch(setLocationSelect(payload))
  },
}))
class LocationSelect extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '选择位置',
  }

  state = {
    curProvince: undefined,
  }

  get activeProvince(): DistrictInfo | undefined {
    const provinceFromStore = this.props.global?.locationSelect?.province
    const provinceFallback = isValidDistrictInfo(provinceFromStore) ? provinceFromStore : districtData.province[0]
    return this.state.curProvince || provinceFallback
  }

  get activeCity(): DistrictInfo | undefined {
    return this.props.global?.locationSelect?.city
  }

  get cityList() {
    const { activeProvince } = this
    if(activeProvince) {
      if(SpecialAreaPrefix.some(id => activeProvince.id.startsWith(id))) {
        return [activeProvince]
      } else {
        const provincePrefix = activeProvince.id.substr(0, 2)
        return districtData.city.filter(item => item.id.startsWith(provincePrefix))
      }
    } else {
      return []
    }
  }

  private handleProvinceClick = (item: DistrictInfo) => {
    this.setState({
      curProvince: item,
    })
  }

  private handleCityClick = (item: DistrictInfo) => {
    const { setLocationSelect } = this.props

    setLocationSelect && setLocationSelect({
      province: this.activeProvince,
      city: item,
    })

    Taro.navigateBack()
  }

  render() {
    const activeProvinceId = this.activeProvince?.id
    const activeCityId = this.activeCity?.id
    const { province } = districtData

    return (
      <View className='location-select-page'>
        <View className='scroll-wrapper'>
          <ScrollView
            className='scroll-province'
            scrollY
          >
            {
              province.map(item =>
                <View
                  key={item.id}
                  className={cls({
                    active: item.id === activeProvinceId,
                  })}
                  onClick={() => this.handleProvinceClick(item)}
                >
                  <Text>{item.name}</Text>
                </View>
              )
            }
          </ScrollView>
          <ScrollView
            className='scroll-city'
            scrollY
          >
            {
              this.cityList.map(item =>
                <View
                  key={item.id}
                  className={cls({
                    active: item.id === activeCityId,
                  })}
                  onClick={() => this.handleCityClick(item)}
                >
                  <Text>{ item.name}</Text>
                </View>
              )
            }
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default LocationSelect
