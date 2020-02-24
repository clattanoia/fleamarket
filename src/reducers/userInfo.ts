import { FETCH_USERINFO } from '../constants'

const INITIAL_STATE = {}

export default function category (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USERINFO:
      return {
        // ...state,
        // userInfo: action.data.userInfo
        'avatarUrl': 'string',
        'brief': 'string',
        'city': 'string',
        'contacts': [
          {
            'content': 'string',
            'id': 'EMAIL',
            'type': 'EMAIL'
          },
          {
            'content': 'string',
            'id': 'PHONE',
            'type': 'PHONE'
          }
        ],
        'country': 'string',
        'gender': 0,
        'id': 'string',
        'lastVisitTime': '2020-02-24T02:44:50.292Z',
        'nickname': 'string',
        'platform': 'WECHAT',
        'province': 'string',
        'unionId': 'string'
      }
    default:
      return state
  }
}

