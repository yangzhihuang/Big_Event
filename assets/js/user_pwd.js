$(function() {
    // 从 layui 中获取 form和layer 对象
    var form = layui.form
    var layer = layui.layer
        // 创建修改密码表单验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return layer.msg('输入的新密码不能与原密码相同，必须做修改！')
            } else if (value !== $('[name=newPwd]').val()) {
                return layer.msg('新密码与确认密码两次输入不一致！')
            } else {
                // 提交密码修改申请
                $('.layui-form').on('submit', function(e) {
                    // 1. 阻止默认的提交行为
                    e.preventDefault()

                    // 2. 发起Ajax的POST请求
                    $.ajax({
                        method: 'POST',
                        url: '/my/updatepwd',
                        // 快速获取表单中的数据
                        data: $(this).serialize(),
                        success: function(res) {
                            if (res.status !== 0) {
                                return layer.msg('修改密码失败！')
                            }
                            layer.msg('修改密码成功！')

                            // 提交修改密码后重置清空表单
                            $('.layui-form')[0].reset() //jquery对象转化为DOM对象，才可调用reset()函数
                        }
                    })
                })
            }


        }
    })
})