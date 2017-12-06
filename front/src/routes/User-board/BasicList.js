
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Button, Icon, Dropdown, Menu, Modal, Form } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './BasicList.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;
const FormItem = Form.Item;

@connect(state => ({
  list: state.userList.list,
  visible: state.userList.visible,
  editData: state.userList.editData,
}))
export default class BasicList extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'userList/fetch',
      payload: {
        role: this.props.role,
      },
    });
  }

  onModalChange = (data) => {
    if (this.modalStatus === 'update') {
      this.props.dispatch({
        type: 'userList/updateUser',
        payload: {
          visible: false,
          editData: data,
          role: this.props.role,
        },
      });
    } else {
      this.props.dispatch({
        type: 'userList/addUser',
        payload: {
          visible: false,
          editData: data,
          role: this.props.role,
        },
      });
    }
  };

  onModalCancel = () => {
    this.props.dispatch({
      type: 'userList/editModalChange',
      payload: {
        visible: false,
        editUser: this.props.editData,
      },
    });
  };

  deleteUser = (e, id) => {
    e.preventDefault();
    this.props.dispatch({
      type: 'userList/deleteUser',
      payload: {
        id,
        role: this.props.role,
      },
    });
  };

  editUser = (e, id) => {
    e.preventDefault();
    this.modalStatus = 'update';
    this.props.dispatch({
      type: 'userList/editUser',
      payload: id,
    });
  };

  addUser = (e) => {
    e.preventDefault();
    this.modalStatus = 'add';
    this.props.dispatch({
      type: 'userList/editModalChange',
      payload: {
        visible: true,
        editUser: {},
      },
    });
  };

  searchUser = (value) => {
    if (!value) {
      this.props.dispatch({
        type: 'userList/fetch',
      });
      return null;
    }
    this.props.dispatch({
      type: 'userList/searchUser',
      payload: value,
    });
  };
  radioChange = (e) => {
    // console.log(e.target.value);
    switch (e.target.value) {
      case 'all':
        this.props.dispatch({
          type: 'userList/fetch',
          payload: {
            role: this.props.role,
          },
        });
        break;
      case 'super':
        this.props.dispatch({
          type: 'userList/fetchByRole',
          payload: {
            role: 3,
          },
        });
        break;
      case 'admin':
        this.props.dispatch({
          type: 'userList/fetchByRole',
          payload: {
            role: 2,
          },
        });
        break;
      case 'normal':
        this.props.dispatch({
          type: 'userList/fetchByRole',
          payload: {
            role: 1,
          },
        });
        break;
      default:
        return null;
    }
  };

  render() {
    const { list, loading, visible, editData } = this.props;
    const role = sessionStorage.getItem('role');
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all" onChange={e => this.radioChange(e)}>
          <RadioButton value="all">全部</RadioButton>
          {role === 3 ? <RadioButton value="super">超级管理员</RadioButton> : null}
          {role >= 2 ? <RadioButton value="admin">管理员</RadioButton> : null }
          <RadioButton value="normal">普通用户</RadioButton>
        </RadioGroup>
        <Search
          className={styles.extraContentSearch}
          placeholder="请输入用户名"
          onSearch={value => this.searchUser(value)}
        />
      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { role, group, update } }) => (
      <div className={styles.listContent}>
        <div>
          <span>Group</span>
          <p>{group}</p>
        </div>
        <div>
          <span>身份权限</span>
          <p>{role === 3 ? '超级管理员' : (role === 2 ? '管理员' : '普通用户')}</p>
        </div>
        <div>
          <span>上次登录时间</span>
          <p>{moment(update).format('YYYY-MM-DD hh:mm')}</p>
        </div>
      </div>
    );

    const EditMenu = id => (
      <Menu>
        <Menu.Item>
          <a
            href=""
            onClick={e => this.editUser(e, id)}
          >编辑
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            href=""
            onClick={e => this.deleteUser(e, id)}
          >删除
          </a>
        </Menu.Item>
      </Menu>
    );
    const MoreBtn = id => (
      <Dropdown overlay={<EditMenu id={id} />}>
        <a>
          操作 <Icon type="down" />
        </a>
      </Dropdown>
    );
    const EditModal = Form.create()(
      (props) => {
        const { visible, onCancel, form, data, onSure, status } = props;
        const { getFieldDecorator, getFieldsValue } = form;
        const thead = ['name', 'passwd', 'role', 'description', 'group', 'update'];
        const handleData = () => {
          const cacheData = getFieldsValue();
          Object.keys(cacheData).map(
            (item) => {
              data[item] = cacheData[item];
              return null;
            });
          onSure(data);
        };

        return (
          <Modal
            visible={visible}
            title="编辑页面"
            okText={status === 'update' ? '更新' : '添加'}
            cancelText=""
            onCancel={onCancel}
            onOk={handleData}
          >
            <Form layout="vertical">
              {thead.map(key => (
                key === 'update' ?
                (
                  <FormItem label={key} key={key}>
                    {getFieldDecorator(`${key}`, {
                      initialValue: status === 'update' ? data[key] : '(时间自动填充)',
                      rules: [{ required: true, message: `${key}是必填项` }],
                    })(
                      <Input
                        disabled
                      />
                      )}
                  </FormItem>
                ) :
                (
                  <FormItem label={key} key={key}>
                    {getFieldDecorator(`${key}`, {
                      initialValue: data[key],
                      rules: [{ required: true, message: `${key}是必填项` }],
                    })(
                      <Input />
                      )}
                  </FormItem>
                )
              )
              )
              }
            </Form>
          </Modal>
        );
      }
    );

    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              {role === 3 ?
                (
                  <div>
                    <Col sm={6} xs={12}>
                      <Info title="用户总数" value="6人" bordered />
                    </Col>
                    <Col sm={6} xs={12}>
                      <Info title="超级管理员" value="1人" bordered />
                    </Col>
                  </div>
                )
                : null
              }
              {role >= 2 ?
                (
                  <Col sm={6} xs={12}>
                    <Info title="普通管理员" value="2人" bordered />
                  </Col>
                )
                : null
              }
              <Col sm={6} xs={12}>
                <Info title="普通用户" value="3人" />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={e => this.addUser(e)}
            >
              添加
            </Button>
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item
                  actions={[<MoreBtn id={item._id} />]}
                >
                  <List.Item.Meta
                    title={<a href="">{item.name}</a>}
                    description={item.description}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <EditModal
          visible={visible}
          onCancel={this.onModalCancel}
          onSure={data => this.onModalChange(data)}
          data={editData || {}}
          status={this.modalStatus}
        />
      </PageHeaderLayout>
    );
  }
}
