import React ,{Component} from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

const actions = (
  <div className={styles.actions}>
    <a href="">
      <Button size="large" type="primary">
        查看邮箱
      </Button>
    </a>
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);
@connect(({ usercenter, loading }) => ({
  usercenter,
  loading: loading.models.usercenter,
}))

// export default ({ location }) => (
//   <div>
//   <button >测试redux 的 userinfo 的state</button>
  
//   <Result
//     className={styles.registerResult}
//     type="success"
//     title={
//       <div className={styles.title}>
//         测试：{location.state ? location.state.account : 'AntDesign@example.com'} id路由
//       </div>
//     }
//     description="激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。"
//     actions={actions}
//     style={{ marginTop: 56 }}
//   />
//   </div>
// );
export default class SomeComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      bb:null
    }

  }
  handleClick = ()=>{
    console.log('test dva dispatch ')
    this.props.dispatch({
      type:'usercenter/getUserInfo',
      payload:{a:1}
    });
  }

  shouldComponentUpdate(nextProps){
    //console.log('should',this.props.userinfors,this.props.usercenter,nextProps.userinfors)
    if(nextProps.usercenter){
      this.state.bb = nextProps.usercenter;
    }
    else{
      this.state.bb = this.props.usercenter;
    }
    return nextProps.usercenter !== this.props.usercenter
  }
  render(){
    return (
    <div>
      <button onClick={this.handleClick}>测试redux 的 userinfo 的state</button>
      <h1>redux state 的 userinfors，要先访问model名usercenter才行啊，{this.state.bb?this.state.bb.userinfors.a:`没有更新${this.props.usercenter}`}</h1>
      <Link to="/">
        <Button size="large">返回首页</Button>
      </Link>
    </div>
    )
  }
}
