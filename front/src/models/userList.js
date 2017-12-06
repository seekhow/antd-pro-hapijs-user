import { queryFakeList, queryByRole } from '../services/api';
import { deleteUser, query, updateUser, addUser, queryByOther } from '../services/user';

export default {
  namespace: 'userList',

  state: {
    list: [],
    loading: false,
    visible: false,
    editData: {},
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryFakeList, payload.role);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchByRole({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryByRole, payload.role);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *deleteUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(deleteUser, payload.id);
      const response = yield call(queryFakeList, payload.role);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *editUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(query, payload);
      yield put({
        type: 'editModalChange',
        payload: {
          editData: response,
          visible: true,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *updateUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(updateUser, payload.editData);
      yield put({
        type: 'editModalChange',
        payload: {
          editData: payload.editData,
          visible: payload.visible,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          role: payload.role,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *addUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      yield call(addUser, payload.editData);
      yield put({
        type: 'editModalChange',
        payload: {
          editData: payload.editData,
          visible: payload.visible,
        },
      });
      yield put({
        type: 'fetch',
        payload: {
          role: payload.role,
        },
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *searchUser({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const res = yield call(queryByOther, payload);
      const newRes = [];
      if (!Array.isArray(res)) {
        newRes.push(res);
      }
      yield put({
        type: 'appendList',
        payload: Array.isArray(res) ? res : newRes,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    editModalChange(state, action) {
      return {
        ...state,
        visible: action.payload.visible,
        editData: action.payload.editData,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
