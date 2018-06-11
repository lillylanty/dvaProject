import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  console.log('router.js app',app,'routerDataCache',routerDataCache);
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}
/* dva路由跳转    dynamic(app, model, component )
* 第一个参数为挂载的对象，就是你要将这个router挂载到哪个实例上。
* 第二个参数为这个router所需要的model。
* 第三个参数为这个router的组件。
*/
export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['global','user','login'],  () => import('../layouts/IndexLayout')), //() => import('../routes/Test/OtherComponent'))
    },
    //项目概况
    '/profile/information': {
      component: dynamicWrapper(app, ['global'], () => import('../routes/Profile/Information')),
    },

    //劳务管理
    '/labor/statistics': {
      component: dynamicWrapper(app, [], () => import('../routes/Forms/BasicForm')),
    },
    '/labor/archives': {
      component: dynamicWrapper(app, [], () => import('../routes/Forms/BasicForm')),
    },
    '/labor/attendanceManage': {
      component: dynamicWrapper(app, [], () => import('../routes/Forms/BasicForm')),
    },
    '/labor/payroll': {
      component: dynamicWrapper(app, [], () => import('../routes/Forms/BasicForm')),
    },
    
    //安全管理
    '/security/securitycheck': {
      component: dynamicWrapper(app, [], () => import('../routes/Security/SecurityCheck')),
    },
    '/security/securitysystem': {
      component: dynamicWrapper(app, [], () => import('../routes/Security/SecuritySystem')),
    },
    '/security/securityeducation': {
      component: dynamicWrapper(app, [], () => import('../routes/Security/SecurityEducation')),
    },
    '/security/securityevaluation': {
      component: dynamicWrapper(app, [], () => import('../routes/Security/SecurityEvaluation')),
    },
    '/security/securitymonitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Security/SecurityMonitor')),
    },
    '/security/securityprotection': {
      component: dynamicWrapper(app, [], () => import('../routes/Security/SecurityProtection')),
    },
    '/security/routinginspection': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Security/RoutingInspection')
      )
    },
    //质量管理
    '/quality/qualitycheck': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Quality/QualityCheck')),
    },
    '/quality/qualityregister': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Quality/QualityRegister')),
    },
    '/quality/qualitysystem': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Quality/QualitySystem')),
    },
    '/quality/concrete': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/Quality/Concrete')),
    },
    '/quality/qualityacceptance': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Quality/QualityAcceptance')),
    },
    '/quality/qualityrouteinspec': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Quality/QualityRouteInspec')),
    },
    '/quality/qualitystatictises': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/Quality/QualityStatictises')),
    },  
    
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },  
    //列表测试页
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/envmanage/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/EnvManage/BasicProfile')),
    },
    '/envmanage/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/EnvManage/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/projectauthority':{
      component: dynamicWrapper(app, [], ()=> import('../routes/ProjectAutority/AutorityManagement')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/user/:id': {
      component: dynamicWrapper(app, ['usercenter'], () => import('../routes/User/SomeComponent')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  // console.log('routerData',routerData)
  return routerData;
};
