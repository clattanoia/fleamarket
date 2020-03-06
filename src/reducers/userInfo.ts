import { FETCH_USERINFO, ADD_CONTACT, DELETE_CONTACT } from '../constants'

const INITIAL_STATE = {}

export default function category(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USERINFO:
      console.log('--->', action.data)
      return {
        ...state,
        ...action.data.user,
        // 'avatarUrl': 'string',
        // 'brief': 'string',
        // 'city': 'string',
        // 'contacts': [
        //   {
        //     'content': 'EMAIL',
        //     'id': 'EMAIL',
        //     'type': 'EMAIL'
        //   },
        //   {
        //     'content': 'PHONE',
        //     'id': 'PHONE',
        //     'type': 'PHONE'
        //   },
        //   {
        //     content: 'WECHAT',
        //     id: 'WECHAT',
        //     type: 'WECHAT'
        //   }
        // ],
        // 'country': 'string',
        // 'gender': 0,
        // 'id': 'string',
        // 'lastVisitTime': '2020-02-24T02:44:50.292Z',
        // 'nickname': 'string',
        // 'platform': 'WECHAT',
        // 'province': 'string',
        // 'unionId': 'string'
      }
    case ADD_CONTACT: {
      return {
        ...state,
        contacts: [action.data, ...state.contacts],
      }
    }
    case DELETE_CONTACT: {
      const newContactsList = state.contacts.filter(contact => {
        return contact === action.data
      })
      return {
        ...state,
        contacts: newContactsList,
      }
    }
    default:
      return state
  }
}

