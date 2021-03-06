import { queryNotices } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    windowWidth:'',
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      //测试select 
      const selectData = yield select(state => {
        console.log('all state',state);
        return window.innerWidth
      });
      //end
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *windowWidthChange({payload}, {put, select }){
      const selectData = yield select(state => {
        console.log('all state',state);
        return window.pageXOffset
      });
      console.log(selectData);
      yield put({
        type:'updateWindowWidth',
        payload:payload
      })
    }
  },

  reducers: {
    // windowWidthChange(state,{payload}){
    //   console.log('reducer global windowChange',payload);
    //   return {
    //     ...state,
    //     windowWidth:payload
    //   }
    // },
    updateWindowWidth(state,{payload}){
      // console.log('reducer global windowChange',payload);
      return {
        ...state,
        windowWidth:payload
      }
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },

    windowWidthChange({dispatch,history}){
      //在此处监听浏览器document.clientWidth,如果变化了，则更改widthChange属性为true，传至组件，调用resize
      let winWidth = 0;
      if(document.compatMode == "css1Compat"){
        winWidth = document.documentElement.clientWidth;
      }else{
        winWidth = document.body.clientWidth;
      }
      return winWidth
    }
  },
};
