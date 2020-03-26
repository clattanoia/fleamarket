import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { AtButton, AtFloatLayout, AtIcon, AtRadio } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'

import './index.scss'
import FormLine from '../../components/formLine'

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
}

type PageOwnProps = {
  onSetVal: (key, value) => void,
  selectedCategory: string
}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Category {
  props: IProps;
}

@connect(({ category }) => ({
  category,
}))
class Category extends Component {

  state = {
    isOpen: false,
    selector: [],
    selected: '',
    selectedCategoryName: '',
  }

  componentDidMount() {
    const selectedItem = this.props.category.categories.find(item => item.id === this.props.selectedCategory)
    this.setState({
      selector: this.props.category.categories.map(item => Object.assign({}, {
        label: item.name,
        value: item.id,
      })),
      selected: this.props.selectedCategory,
      selectedCategoryName: selectedItem && selectedItem.name,
    })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.selectedCategory !== this.props.selectedCategory) {
      const selectedItem = this.props.category.categories.find(item => item.id === this.props.selectedCategory)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        selectedCategoryName: selectedItem && selectedItem.name,
        selected: this.props.selectedCategory,
      })
    }
  }

  onCategoryChange = (val) => {
    this.setState({
      selected: val,
    })
  }

  handleValueClick(): void {
    this.setState({ isOpen: true })
  }

  onClose = (): void => {
    this.setState({
      isOpen: false,
      selected: this.props.selectedCategory,
    })
  }

  onConfirm = (): void => {
    const item = this.props.category.categories.find(item => item.id === this.state.selected)
    this.setState({
      isOpen: false,
      selectedCategoryName: item && item.name,
    })
    this.props.onSetVal('selectedCategory', this.state.selected)
  }

  render() {
    return (
      <View className='category'>
        <FormLine title="分类">
          <View className='right-container' onClick={this.handleValueClick}>
            <Text className='category'>{this.state.selectedCategoryName ? this.state.selectedCategoryName : '选择分类'}</Text>
            <AtIcon prefixClass='iconfont' value='iconright' size="22" color='#999898'></AtIcon>
          </View>
        </FormLine>
        <AtFloatLayout isOpened={this.state.isOpen} onClose={this.onClose}>
          <View className="radio-layout-header">
            <Text>请选择分类</Text>
            <AtButton
              className="category-radio-confirm"
              type="secondary"
              size="small"
              onClick={this.onConfirm}
            >确定</AtButton>
          </View>
          <AtRadio
            value={this.state.selected}
            options={this.state.selector}
            onClick={this.onCategoryChange}
          />
        </AtFloatLayout>
      </View>
    )
  }
}

export default Category as ComponentClass<PageOwnProps, PageState>
