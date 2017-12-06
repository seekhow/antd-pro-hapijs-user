import axios from 'axios';
import { message } from 'antd';
import request from '../utils/request';

// export async function query() {
//   return request('/api/users');
// }

const token = sessionStorage.getItem('token');

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function deleteUser(params) {
  return axios.delete(`http://127.0.0.1:3000/api/user/${params.id.id}`, {
    headers: { Authorization: token },
  })
    .then((res) => {
      if (res.status === 204) {
        message.success('删除成功!');
      } else {
        message.error('权限不够!');
      }
    });
}

export async function query(params) {
  return axios.get(`http://127.0.0.1:3000/api/user?_id=${params.id.id}`, {
    headers: { Authorization: token },
  })
    .then(res => res.data);
}

export async function queryByOther(params) {
  return axios.get(`http://127.0.0.1:3000/api/user?name=${params}`, {
    headers: { Authorization: token },
  })
    .then(res => res.data);
}

export async function updateUser(params) {
  return axios.put(`http://127.0.0.1:3000/api/user/${params._id}`, {
    name: params.name,
    passwd: params.passwd,
    role: params.role,
    group: params.group,
    description: params.description,
  }, {
    headers: { Authorization: token },
  }).then((res) => {
    if (res.status === 200) {
      message.success('更新成功');
    } else {
      message.error('错误，权限不足');
    }
  });
}

export async function addUser(params) {
  return axios.post('http://127.0.0.1:3000/api/user', {
    name: params.name,
    passwd: params.passwd,
    role: params.role,
    group: params.group,
    description: params.description,
  }, {
    headers: { Authorization: token },
  }).then((res) => {
    if (res.status === 201) {
      message.success('添加成功');
    } else {
      message.error('权限不足，不能添加和自己权限一样或权限比自己高的用户');
    }
  });
}
