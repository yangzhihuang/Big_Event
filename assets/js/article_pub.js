$(function() {
    // 从 layui 中获取 layer和form 对象
    var layer = layui.layer
    var form = layui.form

    // 初始化富文本编辑器 
    initEditor()

    // 1. 初始化图片裁剪器 
    var $image = $('#image')

    // 2. 裁剪选项 
    var options = { aspectRatio: 400 / 280, preview: '.img-preview' }

    // 3. 初始化裁剪区域 
    $image.cropper(options)

    //4.为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    //5.为文件选择框绑定change事件
    $('#coverFile').on('change', function(e) {
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }
        //更换裁剪图片
        //拿到用户选择的文件
        var file = e.target.files[0]

        //根据选择的文件， 创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        //先 销毁 旧的裁剪区域，再重新设置图片路径， 之后再创建新的裁剪区域：
        $image.cropper('destroy') // 销毁旧的裁剪区域 
            .attr('src', newImgURL) // 重新设置图片路径 
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的状态：已发布和草稿，默认设置为 已发布
    var article_state = '已发布'

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSaveGrass').on('click', function() {
        article_state = '草稿'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()

        // 2.基于 form 表单,快速创建一个FormData对象
        var fd = new FormData($(this)[0])

        // 3.将文章的发布状态存到fd中
        fd.append('state', article_state)

        //4.将裁减后的图片，输出为文件
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布 
            width: 400,
            height: 280
        }).toBlob(function(blob) {
            // 将 Canvas 画布上的内容，转化为文件对象 
            // 得到文件对象后，进行后续的操作 
            // 5.将输出的图片文件存到fd中
            fd.append('cover_img', blob)

            // 6.发起ajax数据请求
            publishArticle(fd)
        })
    })

    //定义表单发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意，如果向服务器提交的时Formdata格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("发表文章失败！")
                }
                layer.msg("发表文章成功！")

                // 发布文章成功后跳转到文章列表页面
                location.href = '../article/article_list.html'
            }
        })
    }

    initCate()

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg("初始化文章分类失败！")
                }
                layer.msg("初始化文章分类成功！")

                // 调用模板引擎，渲染分类下拉菜单列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

})