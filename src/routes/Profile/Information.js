import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Icon,
  Card,
  List,
  Tabs,
  Table,
  Radio,
  DatePicker,
  Tooltip,
  Menu,
  Button,
  Dropdown,
  Carousel 
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  MiniArea,
  MiniBar,
  MiniProgress,
  Field,
  Bar,
  Pie,
  TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance, checkWindowWidth,debounce } from '../../utils/utils';
import styles from './information.less';
import { clearInterval } from 'timers';

// 引入 ECharts 主模块
const echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

let echartsDom = [];

let basicConfig = {
  tooltip:{
    trigger: 'axis',
    axisPointer: {
        type: 'cross',
        label: {
            backgroundColor: '#6a7985'
        },
        lineStyle:{ 
            color:'green'
        }
    }
},
toolbox:  {
  feature: {
      saveAsImage: {}
  }
},
grid:{
  left: '5%',
  right: '3%',
  bottom: '13%',
  containLabel: true
},
}

const options1 = {
  // title: {
  //   text:'劳务人员现场人数变化趋势'
  // },
  tooltip : basicConfig.tooltip,
  legend: {
      data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
  },
  toolbox:basicConfig.toolbox,
  grid: {
      // top:'5%',
      left: '3%',
      right: '10%',
      bottom: '13%',
      containLabel: true
  },
  xAxis : [
      {   
          name:'时间',
          nameLocation:"end",
          type : 'category',
          boundaryGap : false,
          data : [0,2,4,6,8,10,12,14,16,18,22,24]
      }
  ],
  yAxis : [
      {   
          show:true,
          position:'left',
          type : 'value',
          name:'现场人数',
          nameLocation:"end",
          nameGap:20,
          min:0,
          max:120,
          splitLine:{ //网格线
            lineStyle:{
                color:'#eee'
            }
        }
      }
  ],
  series : [
      {
         
          type:'line',
          stack: '总量',
          smooth:true,
          label: {
              normal: {
                  show: true,
                  position: 'top'
              }
          },
          itemStyle:{
              normal: {
                  color: new echarts.graphic.LinearGradient(
                      0, 0, 0, 1,
                      [
                        {offset: 0, color: '#83bff6'},
                        {offset: 0.7, color: '#2378f7'},
                        {offset: 1, color: '#f7f6f7'}
                      ]
                  )
              }
          },
          areaStyle: {normal: {}},
          data:[40,62, 80, 50, 63, 59, 78, 52,63,50,90,58]
      }
  ]
};


const dataArray = [20, 18, 11, 23, 29, 30 ];
const options2 =  {
  grid: basicConfig.grid,
  xAxis: {
      data: ['木工', '土工', '钢筋工', '水电工', '电梯工', '架子工']
  },
  yAxis: {
    name:'人数',
    nameLocation:"end",
    nameGap:20,
    min:0,
    max:50,
    splitLine:{ //网格线
      lineStyle:{
          color:'#eee'
      }
  }
  },
  series: [{
      name: '人数',
      type: 'bar',
      barWidth:'50',
      barGap:'70%',
      itemStyle:{normal: {color:'#7B9AFE'}},
      data: dataArray
  }]
};

const options3 = {
  legend: {
      right:'10%',
      top:'5%',
      orient:'vertical',
      data:['安全检查','安全巡检','质量检查','质量巡检']
  },
  grid: {...basicConfig.grid,left:'3%',right:'8%'},
  xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一','周二','周三','周四','周五','周六','周日']
  },
  yAxis: {
      type: 'value',
      splitLine:{ //网格线
        lineStyle:{
            color:'#eee'
        }
    }
  },
  series: [
      {
          name:'安全检查',
          type:'line',
          stack: '总量',
          color:'orange',
          data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
          name:'安全巡检',
          type:'line',
          stack: '总量',
          color:'blue',
          data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
          name:'质量检查',
          type:'line',
          stack: '总量',
          color:'green',
          data:[150, 232, 201, 154, 190, 330, 410]
      },
      {
          name:'质量巡检',
          type:'line',
          stack: '总量',
          color:'pink',
          data:[320, 332, 301, 334, 390, 330, 320]
      }
  ]
};
const options4 = {
  ...options1,
  grid: {
    left: '3%',
    right: '2%',
    bottom: '1%',
    containLabel: true
},
  xAxis : [
    {   
        name:'时间',
        nameLocation:"end",
        type : 'category',
        boundaryGap : false,
        data : [0,2,4,6,8,10,12,14,16,18,22,24]
    }
],
}
let options = [options1,options2,options3,options4];

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const Yuan = ({ children }) => (
  <span dangerouslySetInnerHTML={{ __html: yuan(children) }} /> /* eslint-disable-line react/no-danger */
);


let timer;

@connect(({ global,chart, loading }) => ({
  global,chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Information extends Component {
  constructor(props){
    super(props);
  }
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
    echartsDom.push(
      document.getElementById('person'),
      document.getElementById('presents'),
      document.getElementById('security'),
      document.getElementById('env')
    );

    echartsDom.forEach((v,i)=>{
      let _a = echarts.init(v);
      _a.setOption(options[i], true);
      window.addEventListener('resize',()=>{
        _a.resize();
      })
    })
  }


  resizeCharts=()=>{
    let domCharts = [...echartsDom];
    domCharts.forEach((v,i) => {
      let echart = echarts.getInstanceByDom(v);
      echart.setOption(options[i],true);
      echart.resize();
    })
  }

  paintChart2 = (domNode,opt)=>{
    let _a = echarts.init(domNode,'light');
    _a.setOption(opt);
    // window.addEventListener('resize',()=>{
    //   _a.resize();
    // })
  }

  componentWillReceiveProps(nextProps){
    console.log('receiveProps',nextProps.global.windowWidth , this.props.global.windowWidth);
    if(nextProps.windowWidth !== this.props.windowWidth){
      this.resizeCharts();
    }
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
    // clearInterval(timer);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    this.setState({
      rangePickerValue,
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    this.props.dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
  }
  onChange = (a, b, c)=> {
    console.log(a, b, c);
  };


  handleClick = () =>{

  }

  render() {
    const { rangePickerValue, salesType, currentTabKey } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;

    const salesPieData =
      salesType === 'all'
        ? salesTypeData
        : salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;

    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const iconGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const salesExtra = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            今日
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            本周
          </a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
            本月
          </a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
            全年
          </a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );

    const columns = [
      {
        title: '排名',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '搜索关键词',
        dataIndex: 'keyword',
        key: 'keyword',
        render: text => <a href="/">{text}</a>,
      },
      {
        title: '用户数',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
      },
      {
        title: '周涨幅',
        dataIndex: 'range',
        key: 'range',
        sorter: (a, b) => a.range - b.range,
        render: (text, record) => (
          <Trend flag={record.status === 1 ? 'down' : 'up'}>
            <span style={{ marginRight: 4 }}>{text}%</span>
          </Trend>
        ),
        align: 'right',
      },
    ];

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    const CustomTab = ({ data, currentTabKey: currentKey }) => (
      <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
        <Col span={12}>
          <NumberInfo
            title={data.name}
            subTitle="转化率"
            gap={2}
            total={`${data.cvr * 100}%`}
            theme={currentKey !== data.name && 'light'}
          />
        </Col>
        <Col span={12} style={{ paddingTop: 36 }}>
          <Pie
            animate={false}
            color={currentKey !== data.name && '#BDE4FF'}
            inner={0.55}
            tooltip={false}
            margin={[0, 0, 0, 0]}
            percent={data.cvr * 100}
            height={64}
          />
        </Col>
      </Row>
    );

    // const topColResponsiveProps = {
    //   xs: 24,
    //   sm: 12,
    //   md: 6,
    //   lg: 6,
    //   xl: 6,
    //   style: { marginBottom: 24 },
    // };

    let countStyle = {
      backgroundColor:'#7B9AFE',
      border:'1px solid #7B9AFE '
    };
    let counts = [
      {
        title:'项目实时在场人数',
        num:'98547'
      },
      {
        title:'今日累计进/出人数',
        num:'1244/1244'
      },
      {
        title:'劳务人员今日出勤率',
        num:'47.2%'
      },
      {
        title:'本月平均每日出勤人数',
        num:'1396'
      },
      {
        title:'项目历史累计人数',
        num:'5177'
      }
    ]
    
    let countCard = (counts)=>{
      return counts.map((item,key,index)=>{
        return <Col span={4} key={key || index}>
          <div className={styles.topCount} style={countStyle}>
              <p className={styles.title}>{item.title}</p>
              <p className={styles.num}>{item.num}<span className={styles.unit}>{item.num.indexOf('%') == -1?'人':'%'}</span></p>
          </div>
        </Col>
      })
    };

    let mediaCard = [
      { 
        title:'工程形象进度展示',
        extraEvent:this.handleClick,
        extra: "新增",
        style: {
          padding:'10px',
          height:'400px',
          bordered:false
        },
        content: <div >空</div>
      },
      { 
        title:'实时视频监控',
        style: {
          padding:'10px',
          height:'400px',
          bordered:false
        },
        content: <div style={{background:'#eee'}}>空</div>
      }
    ]

    let bisCard = (data) =>{
      let extras = (data.extra && data.extraEvent)?<Button type="primary" onClick={data.extraEvent}>{data.extra}</Button>:null
      return (
      <Card title={data.title} extra={extras} style={data.style || { width: 300,height:500 }}>
        <p>{data.content}</p>
      </Card> )
    }
    let stepData = [
      {
        title:'工程概况牌',
        url:require('../../assets/img/profile-icon4-done.png')
      },
      {
        title:'管理人员名单及监督电话牌',
        url:require('../../assets/img/profile-icon5-done.png')
      },
      {
        title:'消防保卫',
        url:require('../../assets/img/profile-icon6-done.png')
      },
      {
        title:'安全生产牌',
        url:require('../../assets/img/profile-icon7-done.png')
      },
      {
        title:'文明施工牌',
        url:require('../../assets/img/profile-icon8-done.png')
      },
      {
        title:'施工现场平面布置图',
        url:require('../../assets/img/profile-icon9-done.png')
      },
      {
        title:'工程形象进度',
        url:require('../../assets/img/profile-icon10-done.png')
      },
      {
        title:'农民工维权告示牌',
        url:require('../../assets/img/profile-icon7-done.png')
      },
      {
        title:'五方责任主体',
        url:require('../../assets/img/profile-icon7-done.png')
      },
      {
        title:'工程效果图',
        url:require('../../assets/img/profile-icon7-done.png')
      }
    ];

    let projectStep = (data)=>{
      return data.map(v=>{
          return  (<Col xl={2} lg={4.5} md={8} sm={8} xs={12}>
                <div style={{textAlign:'center',boxSizing:'border-box',verticalAlign:'middle'}}>
                  <img src={v.url} />
                  <div style={{textAlign:'center'}}>
                      <span>{v.title.substr(0,6)}</span><br/>
                      <span>{v.title.substr(6)}</span>                
                </div>
                </div>
              </Col>)
      })
    }

    return (
      <Fragment>
         <Row type="flex" justify="space-between" style={{marginBottom:'15px',padding:'0 15px',background:'#fff'}}> 
          {
            countCard(counts)
          }
        </Row>
        <Row gutter={24}>
          {
             mediaCard.map((v,key,i)=> {
                return <Col key={key || i} span={12} style={{ marginBottom: 24 }}> { bisCard(v) }  </Col>  
              }
            )    
          }
        </Row>
        <Row type="flex" justify="space-between" style={{boxSizing:'border-box',padding:'15px 10px 10px 10px',background:"#fff"}}>
            {
              projectStep(stepData)
            }
        </Row>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="劳务人员现场人数变化趋势"
              extra={iconGroup}
              style={{ marginTop: 24,minHeight:'399px',height:'400' }}
            >
                <div id="person" style={{width:'85%',height:300}}></div>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card
								loading={loading}
								bordered={false}
								title="劳务现场班组统计"
								extra={iconGroup}
								style={{ marginTop: 24,height:'400' }}
							>
              <div id="presents" style={{width:'95%',height:300}}></div>
						</Card>
          </Col>
        </Row> 
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card
              loading={loading}
              bordered={false}
              title="本月安全质量情况统计"
              extra={iconGroup}
              style={{ marginTop: 24,minHeight:'399px',height:'400' }}
            >
                  <div id="security" style={{width:'85%',height:300}}></div>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
						<Card
								loading={loading}
								bordered={false}
								title="最近24小时环境数据统计"
								extra={iconGroup}
								style={{ marginTop: 24 ,height:'400'}}
							>
                <div id="env" style={{width:'95%',height:300}}></div>
						</Card>
          </Col>
        </Row>
       
      </Fragment>
    );
  }
}
