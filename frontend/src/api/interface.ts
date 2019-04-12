export interface UserInfo {
  username: string; // 用户名称
  email: string; // 电子邮箱
  [key: string]: string;
}

export interface Project {
  projectName: string; // 项目名称
  projectDesc: string; // 项目描述
  projectType: string; // 项目类型
  creator: string; // 创建者
  alerts: number; // 报警次数
  [key: string]: any;
}
