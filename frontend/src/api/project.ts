import request from '@/plugins/axios.ts';
import store from '@/store';

/**
 * 创建项目
 *
 * @export
 * @param {*} projectName 项目名称
 * @param {*} projectDesc 项目简介
 * @param {*} projectType 项目类型
 * @param {*} username 用户名称
 * @returns
 */
export function createProject(projectName: string, projectDesc: string, projectType: string) {
  const username = store.state.userInfo.username;
  return request({
    method: 'post',
    url: '/api/project/create',
    data: {
      projectName,
      projectDesc,
      projectType,
      creator: username,
    },
  });
}

export function queryProjectList(projectName: string, projectType: string, page = 1, size = 20) {
  const username = store.state.userInfo.username;
  return request({
    method: 'post',
    url: '/api/project/list',
    params: {
      page,
      size,
    },
    data: {
      projectName,
      projectType,
      creator: username,
    },
  });
}
