/**
 * 将指定层里面的所有input转换成json格式
 * @param form
 */
function form2json(form) {
    var txt = '';
    form = '#' + form;
    $(form).find('input[type="hidden"]').each(function() {
        if ($(this).attr('name')) {
            txt += '"' + $(this).attr('name') + '":"' + serialize($(this).val()) + '",';
        }
    });
    //input text
    $(form).find('input[type="text"]').each(function() {
        if ($(this).attr('name')) {
            txt += '"' + $(this).attr('name') + '":"' + serialize($(this).val()) + '",';
        }
    });
    //checkbox
    var chknames = '';
    $(form).find('input[type="checkbox"]').each(function() {
        if (this.name) {
            if (this.checked) {
                if (chknames.toUpperCase().indexOf(this.name.toUpperCase()) >= 0) {
                    var reg = new RegExp('"' + this.name + '":' + '"(.+?)",', 'i');
                    txt = txt.replace(reg, '"' + this.name + '":' + '"$1,' + this.value + '",');
                } else {
                    chknames += this.name + ',';
                    txt += '"' + this.name + '":"' + this.value + '",';
                }
            }
        }
    });
    //radio
    var rdnames = '';
    $(form).find('input[type="radio"]').each(function() {
        if (this.name) {
            if (this.checked) {
                if (rdnames.toUpperCase().indexOf(this.name.toUpperCase()) >= 0) {
                    var reg = new RegExp('"' + this.name + '":' + '"(.+?)",', 'i');
                    txt = txt.replace(reg, '"' + this.name + '":' + '"' + this.value + '",');
                } else {
                    rdnames += this.name + ',';
                    txt += '"' + this.name + '":"' + this.value + '",';
                }
            }
        }
    });

    //textArea
    $(form).find('textArea').each(function() {
        if ($(this).attr('name')) {
            txt += $(this).attr('name') + ':"' + serialize($(this).val()) + '",';
        }
    });
    //select
    $(form).find('select').each(function() {
        if ($(this).attr('name')) {
            var value = '';
            if ($(this).attr('selectedIndex') >= 0) {
                value = this.options[this.selectedIndex].value;
            }
            txt += $(this).attr('name') + ':"' + serialize(value) + '",';
        }
    });
    //file
    txt = txt.replace(/,$/, '');
    return '{' + txt + '}';
}

function serialize(text) {
    text = text.replace(/(")/g, "\\\"");
    return text;
}


/**
 * 构造 ajaxGet, ajaxPost, ajaxDelete, ajaxPut方法
 * 在jquery ajax 基础的再次封装，返回值只接收json格式的
 * demo:
 * ajaxDelete({
 *      url:url,
 *      ok: function(data) {
 *          alert("ok");
 *      },
 *
 *      fail: function(data){
 *          alert(data.message);
 *      }
 *  });
 *
 * @type {Array}
 */
var methods = ["ajaxGet", "ajaxPost", "ajaxDelete", "ajaxPut"];
for(var i = 0; i < methods.length; i ++) {
    (function(_i){
        var method = methods[_i];
        window[methods[_i]] = function(options) {
            $.ajax({
                type:  methods[_i].replace("ajax", ""),
                url:   options.url,
                cache: options.cache || false,
                data:  options.data  || undefined,
                async: options.async || true,
                dataType:'json',
                contentType : options.contentType || undefined,

                success:function (data) {
                    var status = data.status;
                    if(status == 'ok') {
                        options.ok(data);
                    } else if (status == 'fail') {
                        options.fail(data);
                    } else {
                        alert(status + " - 你的操作出现异常状态，请重试或报修！");
                    }
                },
                error:function (jqXHR) {
                    errorStatus = jqXHR.status;
                    if(errorStatus == 404) {
                        alert(jqXHR.status + ", 你请求的操作不存在！");
                    } else if (errorStatus == 403) { //未登录
                        //showPopupDiv($('#loginLayer'));
                        return false;
                    } else if (errorStatus == 500) {
                        alert(jqXHR.status + ", 你请求的出现错误了，请重试或报修！");
                    } else {
                        alert(jqXHR.status + ", 你请求的出现错误了，请重试或报修！");
                    }
                },
                complete:function (jqXHR) {
                    if (jqXHR == null)
                        return;
                    if (jqXHR.status == 403) { //未登录
                        showPopupDiv($('#loginLayer'));
                    }
                }
            });
        }
    })(i);
}