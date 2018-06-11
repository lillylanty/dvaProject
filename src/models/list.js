import { queryFakeList } from '../services/api';

export default {
  namespace: 'list',

  state: {
    list: [],
  },

  /**
   * effects相当于异步action
   * put  用来发起一条action
    call 以异步的方式调用函数
    select 从state中获取相关的数据
    take 获取发送的数据
   * 
  */

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      console.log('appendFetch',payload);
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      console.log('appendList state',state)
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
