// 用户管理  vuex：先从要存储数据的组件传过来的数据存储到本数据库中，（vue自带）
//               再调用vuex-persistedstate组件将本数据库（store文件夹下面的js文件）存储到本地 （第三方插件（可以监听））
//                这个第三方插件会把值自动返回到这里（vuex）
// 就是说用这个数据库里的数据就像是在用本地存储的数据
// 固定写法
export const state = () => ({
    // 采用接口返回的数据结构
    // vuex-persistedstate监听里面的值，变化就会把数据存储到本地
    userInfo: {
        token: "",
        user: {},
    },
})

export const mutations = {
    // 保存用户信息到state
    // 更改state里的数据
    setUserInfo(state, data) {
        console.log(data);
        
        state.userInfo = data;
    },
};



export const actions = {
    // 封装登录的方法
    // store是固定必须要有的参数，执行当前的store == 组件内this.$store
    async login(store, data){
        var res = await this.$axios({
            url: "/accounts/login",
            method: "POST",
            data
        })

        if(res.status === 200){
            store.commit("setUserInfo", res.data);
        }

        return res;
    },

    // 发送验证码
    // sendCaptcha(store,tel){
    //    return this.$axios({
    //         url: `/captchas`,
    //         method: "POST",
    //         data: {
    //             tel
    //         }
    //     })
    // }
    async sendCaptcha(store,tel){
        var res = await this.$axios({
            url:"/captchas",
            method:"post",
            data:{
                tel
            }
        })
        return res
    }
};