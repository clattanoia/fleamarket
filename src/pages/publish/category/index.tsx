import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import {View, Picker, Text} from '@tarojs/components'

import { fetchCategories } from '../../../actions/category'
import './index.scss'

interface Category {
  id: string,
  name: string,
  icon: string
}

type PageStateProps = {
  category: {
    categories: Array<Category>,
  },
}

type PageDispatchProps = {
  fetchCategories: (callback) => Function
}

type PageOwnProps = {
  onSetVal: (key,value) => void,
  selectedCategory: string
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Category {
  props: IProps;
}

@connect(({ category }) => ({
  category
}), (dispatch) => ({
  fetchCategories (callback) {
    dispatch(fetchCategories(callback))
  }
}))
class Category extends Component {

  state = {
    selector: []
  }

  componentWillMount () {}

  componentDidMount () {
    if (this.props.category.categories.length === 0) {
      this.props.fetchCategories((data) => {
        this.setState({
          selector: data.categories.map(item => item.name)
        })
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onCategoryChange = (e) => {
    this.props.onSetVal('selectedCategory', this.state.selector[e.detail.value])
  }

  render () {
    return (
      <View className='category'>
        <View className='form_line'>
          <View>
            <Text className='form_line_required'>*</Text>
            <Text className='form_line_label'>分类</Text>
          </View>
          <View className='form_line_content'>
            <Picker className='picker' mode='selector' range={this.state.selector} onChange={this.onCategoryChange} value={0}>
              {this.props.selectedCategory ?
                <View className='right-container'>
                  <Text className='category'>{this.props.selectedCategory}</Text>
                  <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
                </View> :
                <View className='right-container'>
                  <Text className='category'>选择分类</Text>
                  <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
                </View>
              }
            </Picker>
          </View>
        </View>
      </View>
    )
  }
}

export default Category as ComponentClass<PageOwnProps, PageState>
