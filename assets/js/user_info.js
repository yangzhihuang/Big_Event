$(function() {
    // 从 layui 中获取 form和layer 对象
    var form = layui.form
    var layer = layui.layer
        // 创建用户基本资料表单验证规则
    form.verify({
        nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (value.length > 6 || value.length == 0) {
                return '昵称长度必须在1~6个';
            }
        }
    })

    // 调用函数初始化个人基本信息模块
    initUserInfo()

    //初始化用户的基本信息并赋值表单
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                console.log(res);
                // 调用form.val()为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据【再次调用初始化表单函数initUserInfo()】
    $('#btnReset').on('click', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()

        // 重置后回复初始状态
        initUserInfo()
    })

    // 更新提交修改信息
    $('.layui-form').on('submit', function(e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()

        // 2. 发起Ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 当nickname修改提交后应更新渲染 ,调用父类index.js的getUserInfo()方法重新渲染
                window.parent.getUserInfo();

            }
        })
    })
})