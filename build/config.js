// 项目配置
const config = {
    name: 'app_sign',
    cdn: '/h5',
    //发布项目cdn地址
    // cdn: `https://campaign.huazhu.com/static/${getYear()}/${getDir()}`,
    // ftp: {
    //     //ftp主机地址
    //     host: '10.100.20.106',
    //     localPath: 'dist/client',
    //     //上传到的目录
    //     remotePath: `upload/static/${getYear()}`
    // },
    // CSS 单位模式 viewport or rem
    cssMode: 'viewport',
    design: {
        // 用于 viewport
        viewportWidth: 375,
        rootValue: 16,
        toViewport: true,
        toRem: true,
    }
}
module.exports = config