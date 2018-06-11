import {  queryUserInfo } from '../services/user';

export default {
  namespace: 'usercenter',

  state: {
    userinfors:{}
  },

  effects: {
    *fetchUserInfo( {payload}, { call ,get }) {
      console.log('async action',payload);
       const response = yield call(queryUserInfor);
       yield put({
         type: 'getUserInfo',
         payload:response
       }); 
    }
  },

  reducers: {
    getUserInfo(state, action) {
      console.log('testModel reducer works!!!',state)
      return {...state, userinfors:action.payload}
    }
  },
};
