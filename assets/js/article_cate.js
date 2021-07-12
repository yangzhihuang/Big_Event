$(function() {
    // 从 layui 中获取 layer和form 对象
    var layer = layui.layer
    var form = layui.form

    initArticleCateList()
        // 初始化获取文章分类的列表
    function initArticleCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别 btnAddCate 按钮绑定点击事件,弹出控制层
    // 获取索引
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
            indexAdd = layer.open({ //用layer.open()获得索引[关闭弹出层用]
                type: 1, //页面层【默认为0，信息框】
                area: ['500px', '300px'],
                title: '添加文章分类',
                content: $('#dialog-add').html() //定义弹出层内容，内容html已在article_cate.html编写
            })
        })
        // 通过代理的形式，为form-add表单添加绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()

        // 提交文章分类添加请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败')
                }
                initArticleCateList()
                layer.msg('添加文章分类成功')
                layer.close(indexAdd) //根据索引关闭弹出层
            }
        })
    })


    // 为编辑类别 btnEditCate 按钮绑定点击事件,弹出控制层 
    var indexEdit = null //获取索引
        // 通过代理的形式，为编辑按钮form-edit绑定click事件
    $('tbody').on('click', '#btnEditCate', function() {
        indexEdit = layer.open({ //用layer.open()获得索引[关闭弹出层用]
            type: 1, //页面层【默认为0，信息框】
            area: ['500px', '300px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() //定义弹出层内容，内容html已在article_cate.html编写
        })

        // 获取点击当前行的索引id
        var id = $(this).attr('data-Id')

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit2', res.data)
            }
        })

        // 再通过代理形式,为修改分类的表单绑定submit事件
        $('body').on('submit', '#form-edit', function(e) {
            //阻止表单的默认提交行为
            e.preventDefault()

            // 提交文章分类添加请求
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新文章分类失败')
                    }
                    initArticleCateList()
                    layer.msg('更新文章分类成功')
                    layer.close(indexEdit) //根据索引关闭弹出层
                }
            })
        })
    })

    //通过代理形式，为删除类别btnDeleteCate按钮添加点击事件，弹出控制层
    var indexDelete = null //获取索引
    $('tbody').on('click', '#btnDeleteCate', function() {
        // 获取点击当前行的索引id
        var id = $(this).attr('data-id')

        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败')
                    }
                    layer.msg('删除文章分类成功')
                    layer.close(index)
                    initArticleCateList()
                }
            })
        })
    })
})