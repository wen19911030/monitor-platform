import request from '@/plugins/axios.ts';
import store from '@/store';

export function queryErrorList(
  projectId: string,
  errorType: string,
  startTime: any,
  endTime: any,
  page = 1,
  size = 20,
) {
  const username = store.state.userInfo.username;
  return request({
    method: 'post',
    url: '/api/jserror/list',
    params: {
      page,
      size,
    },
    data: {
      projectId,
      errorType,
      startTime,
      endTime,
    },
  });
}

export function queryErrorDetail( projectId: string, logId: string) {
  return request({
    method: 'get',
    url: '/api/jserror/detail',
    params: {
      logId,
      projectId,
    },
  });
}
