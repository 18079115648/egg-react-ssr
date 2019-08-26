let developmentConfig = {
    // api: 'http://10.105.22.123:9808',
    defaultLoginReturnUrl: 'https://www.baidu.com',
    api: 'http://10.100.249.215:47806',
    // api: ' https://h5api.yisutravel.com'
}



let productionConfig = {
    // api: 'https://activityapi.yisutravel.com:9010'
    // api: 'http://10.100.249.215:47806',
    defaultLoginReturnUrl: 'https://www.baidu.com',
    api: ' https://h5api.yisutravel.com'
}




if(process.env.NODE_ENV === 'production') {
    module.exports = productionConfig;
}else {
    module.exports = developmentConfig;
}