import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'

import { store } from './store/store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    debug: false,
    pages: [
      'pages/index/index',
      'pages/detail/index',

      'pages/profile/index',
      'pages/profile/contact/index',
      'pages/profile/contact/add/index',
      'pages/profile/edit/index',
      'pages/profile/feedback/index',

      'pages/myProductList/index',

      'pages/locationSelect/index',
    ],
    subPackages: [
      {
        root: 'searchPages',
        pages: [
          'index',
        ],
      },
      {
        root: 'publishPages',
        pages: [
          'index',
        ],
      },
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white',
      navigationBarBackgroundColor: '#fe5155',
    },
    // tabBar: {
    //   selectedColor: '#fe5155',
    //   list: [{
    //     text: '首页',
    //     iconPath: 'assets/home.png',
    //     selectedIconPath: 'assets/home_selected.png',
    //     pagePath: 'pages/index/index'
    //   }, {
    //     text: '发布',
    //     iconPath: 'assets/publish.png',
    //     selectedIconPath: 'assets/publish.png',
    //     pagePath: 'pages/publish/index'
    //   }, {
    //     text: '我的',
    //     iconPath: 'assets/profile.png',
    //     selectedIconPath: 'assets/profile_selected.png',
    //     pagePath: 'pages/profile/index'
    //   }]
    // }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
