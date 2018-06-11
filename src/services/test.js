import { stringify } from 'qs';
import request from '../utils/request';

export async function query(){
    // return request(`/qy/data/3_picbypage.php?pagenum=0`);
     return request(`/prl_labor.do?laborCount`);
    
  }