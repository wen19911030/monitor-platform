import request from '@/plugins/axios.ts';

export function uploadMap(files: any, id: string) {
  const formdata = new FormData();
  formdata.append('id', id);
  for (const file of files) {
    formdata.append('file', file);
  }
  return request({
    method: 'post',
    url: '/api/upload/jsmap',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formdata,
  });
}
