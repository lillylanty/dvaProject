import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '项目概况',
    icon: 'dashboard',
    path: 'profile',
    children: [
      {
        name: '项目信息',
        path: 'information',
      },
    ]
  },
  {
    name: '安全管理',
    icon: 'dashboard',
    path: 'security',
    children: [
      {
        name: '安全检查',
        path: 'securitycheck',
      },
      {
        name: '安全监督申报',
        path: 'securitymonitor',
      },
      {
        name: '安全体系',
        path: 'securitysystem',
      },
      {
        name: '安全教育',
        path: 'securityeducation',
      },
      {
        name: '安全巡检',
        path: 'routinginspection',
      },
      {
        name: '安全评价',
        path: 'securityevaluation',
      },
      {
        name: '安全统计',
        path: 'securitycensus',
      },
      {
        name: '安全防护',
        path: 'securityprotection',
      }
    ],
  },
  {
    name: '劳务管理',
    icon: 'dashboard',//security
    path: 'labor',
    children: [
      {
        name: '人员统计',
        path: 'statistics',
      },
      {
        name: '人员档案',
        path: 'archives',
      },
      {
        name: '考勤管理',
        path: 'attendanceManage',
      },
      {
        name: '工资发放',
        path: 'payroll',
      }
    ],
  },
  {
    name: '质量管理',
    icon: 'form',
    path: 'quality',
    children: [
      {
        name: '质量检查',
        path: 'qualitycheck',
      },
      {
        name: '质量监督注册登记',
        path: 'qualityregister',
      },
      {
        name: '质量体系',
        authority: 'admin',
        path: 'qualitysystem',
      },
      {
        name: '混凝土质量信息',
        authority: 'admin',
        path: 'concrete',
      },
      {
        name: '质量验收',
        authority: 'admin',
        path: 'qualityacceptance',
      },
      {
        name: '质量巡检',
        authority: 'admin',
        path: 'qualityrouteinspec',
      },
      {
        name: '质量统计',
        authority: 'admin',
        path: 'qualitystatictises',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '环境管理',
    icon: 'profile',
    path: 'envmanage',
    children: [
      {
        name: '环境监测',
        path: 'envinspec',
      },
      {
        name: '实时预警',
        path: 'realtimewaring',
        authority: 'admin',
      },
    ],
  },
  {
    name: '视频监控',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '实时监控',
        path: 'success',
      },
      {
        name: '移动执法',
        path: 'fail',
      },
    ],
  },
  {
    name: '资料管理',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '资料归档',
        path: '403',
      },
      {
        name: '施工日志',
        path: '404',
      },
      {
        name: '监督检查用表',
        path: '500',
      }
    ],
  },
  {
    name: '项目权限',
    icon: 'warning',
    path: 'projectAuthority',
    children: [
      {
        name: '权限管理',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
