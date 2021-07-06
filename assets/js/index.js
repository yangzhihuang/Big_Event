$(function() {
    //调用getUserInfo函数获得用户基本信息
    getUserInfo();
    // 提示是否确认退出登录操作
    $('#btnLogout').on('click', function() {
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function(index) {
            // 弹出层按确定时会进行操作
            // 退出时：1.清空本地存储中的token
            localStorage.removeItem('token')
                // 退出时：2.重新跳转到登录页面
            location.href = 'login.html'
            layer.close(index);
        });
    })

})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 注意： 已在baseAPI设置， 这里无需再书写
        /*  请求此接口必须携带请求头才可
        headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function(res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用renderAvatar()渲染用户的头像
            renderAvatar(res.data);
        },

        // 控制访问权限，不登录的话怎么也跳转不了index.html。不论成功还是失败，最终都会调用complete回调函数
        //【注意： 已在baseAPI设置， 这里无需再书写】
        /*  complete: function(res) {
             console.log("执行了complete函数");
             // 在complete回调函数中，可以使用res.responseJSON 拿到服务器相应回来的数据
             if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                 //1.强制清空token
                 localStorage.removeItem('token')
                     //2.强制跳转到登录界面
                 location.href = 'login.html'

             }
         } */
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获得用户名
    var name = user.nickname || user.username //nickname为用户类型{管理员、普通用户}
    console.log(name[0])
    console.log(typeof name)
        // 2.设置侧边栏欢迎用户--字
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 3.按需渲染用户头像
    if (user.user_pic) {
        // 3.1渲染图片图像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase() //把用户名的第一个字大写
        $('.text-avatar').html(first).show() //把大写的第一个字渲染到页面


    }
}