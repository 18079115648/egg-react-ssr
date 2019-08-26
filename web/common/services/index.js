// 获取store中的 token
// import {store} from "../redux";
import axios from 'axios'
import {api} from './env.config'
import {getToken} from "@/common/utils/token";
export const server = api
export const ajax = axios.create({
    baseURL: api,
    withCredentials: true
})


// axios 华住活动后台request拦截器 处理与华住活动后台相匹配的登录权限、数据格式等

ajax.interceptors.request.use((config) => {
    let {headers} = config
    headers.sid = getToken('sid') || ''
    // const {token, fingerPrint} = store.getState().app

    // // 添加sk && 添加指纹
    // data ? data.sk = token : data = {sk: token}
    // headers.fp = fingerPrint

    // 处理url
//  if (/^\//.test(url)) baseURL = api + '/v1/pointStore'

    // 处理数据格式
    // headers['Content-Type'] = 'application/x-www-form-urlencoded'

    // if (method === 'post') {
    //     let temp = []
    //     for (let i in data) {
    //         temp.push(i + '=' + encodeURI(data[i]))
    //     }
    //     data = temp.join('&')
    // } else {
    //     params = params ? {...data,...params} : data
    // }
    // headers = {
    //     ...headers,
    //     'Content-Type': 'application/json',
    // }
    
    // return config;
    return {
        ...config,
        headers,
        // data,
        // params,
        // headers,
        // baseURL
    }
}, (err) => {
    return Promise.reject(err)
})

// axios 华住活动后台response拦截器 处理响应数据及底层容错

ajax.interceptors.response.use(
    (res) => {
        const {status, data, headers, request} = res
        data['apiHeaders'] = headers
        if (status === 200) return data
    },
    (error) => {

        console.log('底层出错:', error)

        return {
            code: 700
        }
    }
)


/* ***** 接口列表 ***** */

// eq:可删除
export function getUserInfo() {
    return ajax({
        url: '/info'
    })
}

//发送验证码
export function getCode(data, jiYan) {
    return ajax({
        url: '/api/sso/smsCaptcha',
        method: 'post',
        data,
        headers: jiYan
    })
}
//注册
export function registerHandle(data) {
    return ajax({
        url: '/api/sso/registration',
        method: 'post',
        data
    })
}

//密码登录
export function loginByPassword(data, jiYan) {
    return ajax({
        url: '/api/sso/loginByPassword',
        method: 'post',
        data,
        headers: jiYan
    })
}

//验证码登录
export function loginByPhone(data) {
    return ajax({
        url: '/api/sso/loginByPhone',
        method: 'post',
        data
    })
}

//验证码登录
export function validLoginStatue() {
    return ajax({
        url: 'api/sso/validLoginStatue',
        method: 'post',
    })
}

// 城市列表
export function getCityList(data) {
    return ajax({
        url: 'api/citys',
        method: 'get',
        params: data
    })
}

// 活动列表页初始化
export function getHotelListActivityInit(data) {
    return ajax({
        url: '/api/configurations/hotles',
        method: 'get',
        params: data
    })
}

// 筛选数据
export function getFilterInfoInit(data) {
    return ajax({
        url: '/api/hotels/filter',
        method: 'get',
        params: data
    })
}
// 经纬度获取城市
export function getCityFromPosition(data) {
    return ajax({
        url: '/api/citys/position',
        method: 'get',
        params: data
    })
}
//获取活动酒店列表
export function getActivityHotelList(data) {
    return ajax({
        url: '/api/hotels',
        method: 'get',
        params: data
    })
}
//获取推荐酒店列表
export function getActivityRecommendHotelList(data) {
    return ajax({
        url: '/api/hotels/recommend',
        method: 'get',
        params: data
    })
}
//外部登录
export function externalLogin(data) {
    return ajax({
        url: '/api/sso/externalLogin',
        method: 'get',
        headers: data
    })
}





