import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { connect } from '@tarojs/redux'
import {View, Picker, Text} from '@tarojs/components'

import { fetchCategories } from '../../../actions/category'
import './index.scss'
import FormLine from '../../../components/formLine'

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
    selector: [],
    selected: '',
  }

  componentWillMount () {}

  componentDidMount () {
    if (this.props.category.categories.length === 0) {
      this.props.fetchCategories((data) => {
        this.setState({
          selector: data.categories.map(item => item.name)
        })
      })
    } else {
      this.setState({
        selector: this.props.category.categories.map(item => item.name)
      })
    }
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onCategoryChange = (e) => {
    const value = this.state.selector[e.detail.value]
    const item = this.props.category.categories.find(item => item.name === value)
    this.setState({
      selected: value
    })
    this.props.onSetVal('selectedCategory', item && item.id)
  }

  render () {
    return (
      <View className='category'>
        <FormLine title="分类">
          <Picker className='picker' mode='selector' range={this.state.selector} onChange={this.onCategoryChange} value={0}>
            <View className='right-container'>
              <Text className='category'>{this.state.selected ? this.state.selected : '选择分类'}</Text>
              <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
            </View>
          </Picker>
        </FormLine>
      </View>
    )
  }
}

export default Category as ComponentClass<PageOwnProps, PageState>
