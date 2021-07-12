$(function() {
    // 从 layui 中获取 layer、form和laypage 对象
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = PadZero(dt.getFullYear())
        var m = PadZero(dt.getMonth() + 1)
        var d = PadZero(dt.getDate())
        var hh = PadZero(dt.getHours())
        var mm = PadZero(dt.getMinutes())
        var ss = PadZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补0的函数
    function PadZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象的数据提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求默认第一页数据
        pagesize: 5, //每页显示几条数据，默认每页显示2条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    initTable()
        // 初始化获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎渲染文章列表数据
                console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total) //res返回的值total为文章总数
            }
        })
    }

    initCate()
        //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                layer.msg('获取分类数据成功！');
                console.log(res);
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui 重新渲染表单区的UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()

        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val() //分类
        var state = $('[name=state]').val() //状态

        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件q, 重新渲染表格文章列表数据
        initTable()

    })

    //定义渲染分页的方法
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 pageBox 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页的文章条数
            curr: q.pagenum, //设置默认选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], //自定义分页栏，渲染页面的位置顺序由 layout参数 决定
            limits: [5, 10, 15, 20], //上面limit默认【10,20,30,40,50】,以此修改
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有两种：1.点击页码的时候会触发jump回调  2.只要调用了laypage.render()方法，就会出发jump回调
            jump: function(obj, first) { //obj包含了当前分页的所有参数 !!可以通过first的值来判断是通过哪种方式触发的jump回调：如果是true，则是方式二触发的；如果是false，则是方式一触发的
                //把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr

                //把最新的条目数，赋值到 q 这个查询参数对象中
                q.pagesize = obj.limit
                if (!first) {
                    // 根据最新的q获取对应的数据，并渲染表格
                    initTable()
                }
            }
        })
    }

    //通过代理的形势，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除元素按钮的个数
        var len = $('.btn-delete').length

        // 要删除文章的id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成后，需要判断当前页是否还有文章项，若无，则让页码值-1，再重新调用initTable()
                    if (len === 1) {
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                    layer.close(index)
                }
            })

            layer.close(index);
        });

    })

})