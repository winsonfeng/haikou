var applyTypeValue;
layui.use(['form', 'jquery', 'laydate', 'layedit', 'table', 'upload', 'util', 'admin'], function () {
    var element = layui.element;
    var form = layui.form;
    var util = layui.util;
    var table = layui.table;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = layui.$;
    var admin = layui.admin;
    var layerIndex;

    var click;

    if (!Student.isAuditor) {
        checkLogin(form)
    }

    //弹出层皮肤全局使用。即所有弹出层都默认采用，但是单个配置skin的优先级更高
    layer.config({
        skin: 'public-class',
    })

    $(".layui-laydate .layui-this").css('color', '#1a1a1a');
    //执行
    util.fixbar({
        bar1: false
    });


    laydate.render({
        elem: '#selectDate'
        , position: 'static'
        , type: 'month'
        , theme: '#fcdb02'
        , range: true
        , format: 'yyyyMM'
        , max: getLastDate()
        , done: function (value, date, endDate) {
            layer.close(layerIndex);
            click.val(value).change();
        }
    });
    laydate.render({
        elem: '#selectSchoolDate'
        , position: 'static'
        , type: 'month'
        , theme: '#fcdb02'
        , range: true
        , format: 'yyyyMM'
        , done: function (value, date, endDate) {
            layer.close(layerIndex);
            click.val(value).change();
        }
    });


    $(".buyLastData").text(getBuyLastDate());

    $(".selectDate").on('click', function () {
        click = $(this);
        var selectDate = $("#selectDate");
        layerIndex = layer.open({
            type: 1,
            title: false,
            resize: false,
            area: '550px'
            , offset: '10%',
            content: selectDate,
            success: function () {
                selectDate.removeClass('layui-hide');
            },
            end: function () {
                selectDate.addClass('layui-hide');
            }
        });
        layer.iframeAuto(layerIndex)
    });
    $(".selectSchoolDate").on('click', function () {
        click = $(this);
        var selectSchoolDate = $("#selectSchoolDate");
        layerIndex = layer.open({
            type: 1,
            title: false,
            resize: false,
            area: '550px'
            , offset: '10%',
            content: selectSchoolDate,
            success: function () {
                selectSchoolDate.removeClass('layui-hide');
            },
            end: function () {
                selectSchoolDate.addClass('layui-hide');
            }
        });
        layer.iframeAuto(layerIndex)
    });

    form.on('select(sqydlx)', function (data) {
        applyType(data.value);
    });

    /**
     * 打开学校选择框
     * */
    $(".selectSchool").on('click', function () {
        click = $(this);
        var selectSchool = $("#selectSchool");
        layerIndex = layer.open({
            type: 1,
            title: "选择学校",
            resize: false,
            area: ['480px', '70%'],
            content: selectSchool,
            success: function () {
                selectSchool.removeClass('layui-hide');
            },
            end: function () {
                selectSchool.addClass('layui-hide');
                selectSchool.find("input").val("");
                selectSchool.find(".searchSchool").empty();
            }
        });
    });
    $("#modifyPassword").on('click', function () {
        $(this).parent().removeClass('layui-this');
        layer.open({
            type: 2,
            title: "修改密码",
            resize: false,
            area: ['30%', '30%'],
            content: Feng.ctxPath + "/signUp/modifyPassword"

        });
    })

    /**
     * 打开教育局选择框
     * */
    $(".selectEducationBureau").on('click', function () {
        click = $(this);
        var selectEducationBureau = $("#selectEducationBureau");
        layerIndex = layer.open({
            type: 1,
            title: "选择教育局",
            resize: false,
            area: ['480px', '70%'],
            content: selectEducationBureau,
            success: function () {
                selectEducationBureau.removeClass('layui-hide');
            },
            end: function () {
                selectEducationBureau.addClass('layui-hide');
                selectEducationBureau.find("input").val("");
                selectEducationBureau.find(".searchSchool").empty();
            }
        });
    });

    $(".searchSchool").on('click', 'dd', function () {
        layer.close(layerIndex);
        click.val($(this).text())
    });

    /**
     * 教育局点击选择
     */
    $(".searchEducationBureau").on('click', 'dd', function () {
        layer.close(layerIndex);
        click.val($(this).text())
    });

    $(".onDateChange1").change(function () {
        var click = $(this);
        var parent = click.parents("tr");
        var date1 = click.val();

        var myDate1 = getMyDate(date1);

        parent.find(".dateDistance").val(myDate1.getString());

    });

    $(".onDateChange").change(function () {
        var click = $(this);
        var parent = click.parents("tr");
        var date1 = $(parent.find(".onDateChange").get(0)).val();
        var date2 = $(parent.find(".onDateChange").get(1)).val();

        var myDate1 = getMyDate(date1);
        var myDate2 = getMyDate(date2);

        var useFulDate;
        if (!myDate1 && !myDate2) {
            useFulDate = null;
        } else if (myDate1 && !myDate2) {
            useFulDate = myDate1
        } else if (!myDate1 && myDate2) {
            useFulDate = myDate2
        } else if (myDate1.year > myDate2.year) {
            useFulDate = myDate2
        } else if (myDate1.year === myDate2.year) {
            if (myDate1.month >= myDate2.month) {
                useFulDate = myDate2;
            } else {
                useFulDate = myDate1
            }
        } else if (myDate1.year < myDate2.year) {
            useFulDate = myDate1
        }
        if (useFulDate) {
            var dateDistance = parent.find(".dateDistance");
            dateDistance.attr("date-year", useFulDate.year);
            dateDistance.attr("date-month", useFulDate.month);
            dateDistance.val(useFulDate.getString()).change();
        }
    });

    $(".guardianOne .dateDistance").change(function () {
        var totalYear = getYear();
        if (applyTypeValue === "3个6") {
            /*3个6必须满足6年社保*/
            calculationTime(totalYear, 6, "3个6必须满足6年社保")
        } else if (applyTypeValue === "3个3") {
            /*3个3必须满足3年社保*/
            calculationTime(totalYear, 3, "3个3必须满足3年社保")
        }
    });


    /*提交*/
    form.on('submit(submit)', function (data) {
        if ($("#id").val() || $("#password").val()) {
            data.field['signUpStatus'] = 1;
            save(data, "提交成功")
        } else {
            click = $(this);
            inputPassword();
            return false;
        }
        return false;
    });


    form.on("submit(search)", function (data) {
        $.ajax({
            type: 'get',
            url: Feng.ctxPath + '/signUp/search',
            dataType: 'json',
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: 'name=' + encodeURIComponent(data.field.name) + '&idCard=' + data.field.idcard,
            success: function (res) {
                if (res.code === 200) {
                    var jhrname = res.data.jhr2name;
                    if (jhrname != null && jhrname.length !== 0) {
                        $(".guardianTwo").show()
                    }
                    form.val("studentForm", res.data);
                    applyType(res.data.sqydlx);
                    $(".guardianSB .onDateChange").change()
                } else {
                    layer.msg(res.message, {icon: 2})
                }
            },
            error: function (data) {
                layer.msg("查询失败！", {icon: 2})
            }
        });
        return false;
    });

    form.on("submit(searchSchool)", function (data) {
        var clickTr = click.parents("tr");
        var schoolPid;
        if (clickTr.hasClass("primarySchool")) {
            schoolPid = 1
        } else if (clickTr.hasClass("juniorHighSchool")) {
            schoolPid = 2
        } else if (clickTr.hasClass("highSchool")) {
            schoolPid = 3
        }
        var schoolList = $(".searchSchool");
        $.ajax({
            type: 'get',
            url: Feng.ctxPath + '/signUp/searchSchool',
            dataType: 'json',
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: 'name=' + encodeURIComponent(data.field.name) + '&schoolType=' + schoolPid,
            success: function (res) {
                if (res.code === 200) {
                    schoolList.empty();
                    res.data.forEach(function (item) {
                        schoolList.append("<dd>" + item.simple_name + "</dd>")
                    })

                } else {
                    schoolList.empty();
                    schoolList.append("<dd>" + data.field.name + "</dd>")
                }
            },
            error: function (data) {
                layer.msg("查询失败！", {icon: 2})
            }
        });
        return false;
    });

    form.on("submit(searchEducationBureau)", function (data) {
        var educationBureauList = $(".searchEducationBureau");
        $.ajax({
            type: 'get',
            url: Feng.ctxPath + '/signUp/searchEducationBureau',
            dataType: 'json',
            async: true,
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            data: 'name=' + encodeURIComponent(data.field.name),
            success: function (res) {
                if (res.code === 200) {
                    educationBureauList.empty();
                    res.data.forEach(function (item) {
                        educationBureauList.append("<dd>" + item.name + "</dd>")
                    })

                } else {
                    educationBureauList.empty();
                    educationBureauList.append("<dd>" + data.field.name + "</dd>")
                }
            },
            error: function (data) {
                layer.msg("查询失败！", {icon: 2})
            }
        });
        return false;
    });

    form.on('submit(password)', function (data) {
        $("#password").val($.md5(data.field.password2));
        click.click();
        layer.close(layerIndex);
    });

    /*教师审核*/
    $("#btnAudit").on('click', function () {
        admin.putTempData('formOk', false);
        top.layui.admin.open({
            type: 2,
            title: "考生" + $("#name").val() + '预报名信息审核',
            area: ['500px', '500px'],
            content: Feng.ctxPath + '/student/signUp/audit/' + getPathnameId(),
            end: function () {
                admin.getTempData('formOk') && $('#search').click();
            }
        });
    });


    form.verify({
        confirmIdCard: function (value, item) {
            if (value !== $("#idcard").val()) {
                return "两次身份证号输入不一致";
            }
        },
        confirmPassword: function (value, item) {
            if (value !== $("#password2").val()) {
                return "两次密码输入不一致";
            }
        },
        password: function (value, item) {
            if (value.length < 6) {
                return "密码必须大于6位"
            }
        },
        /**
         * @return {string}
         */
        IdCard: function (value, item) {
            var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
            if (!idcardReg.test(value)) {
                return "请填写正确的身份证号码";
            }
        },
        IdCardIfNoNull: function (value, item) {
            if (value) {
                var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if (!idcardReg.test(value)) {
                    return "请填写正确的身份证号码";
                }
            }
        },
        phone: function (value, item) {
            var idcardReg = /^1(3|4|5|7|8)\d{9}$/;
            if (!idcardReg.test(value)) {
                return "请填写正确的手机号码";
            }
        },
        parentPhone: function (value, item) {
            if (value) {
                var idcardReg = /^1(3|4|5|7|8)\d{9}$/;
                if (!idcardReg.test(value)) {
                    return "请填写正确的手机号码";
                }
            }
        }
    });


    var reloadPhoto = function () {
        // layer.photos({
        //     photos: '#viewImg'
        // });
    };

    var uploadNoWith = function (id, code) {
        var up = $(id);
        upload.render({
            elem: id
            , url: Feng.ctxPath + '/file/upload'
            , multiple: true
            , accept: 'images' //只允许上传图片
            , acceptMime: 'image/*' //只筛选图片
            , number: 3
            , before: function (obj) {
                //预读本地文件示例，不支持ie8
                obj.preview(function (index, file, result) {

                    up.before(getImgPreview(result, code, index, file.name));
                    var uploadedSize = up.parent().children(".preview-img").size();
                    if (uploadedSize >= 10) {
                        up.addClass("layui-hide");
                    }
                });
            }
            , done: function (res, index, upload) {
                up.parent().find("input[data-fileindex=" + index + "]").val(res.data)
                up.parent().find("img[data-fileindex=" + index + "]").attr("layer-src", Feng.ctxPath + "/uploadfile/signUp/" + res.data);
                up.parent().find("img[data-fileindex=" + index + "]").attr("src", Feng.ctxPath + "/uploadfile/signUp/" + res.data);
                reloadPhoto()
            }
        });
    };

    var uploadWithTip = function (id, code, alt) {
        var up = $(id);
        upload.render({
            elem: id
            , url: Feng.ctxPath + '/file/upload'
            , multiple: true
            , accept: 'images' //只允许上传图片
            , acceptMime: 'image/*' //只筛选图片
            , number: 3
            , before:
                function (obj) {
                    //预读本地文件示例，不支持ie8
                    obj.preview(function (index, file, result) {

                        up.before(getImgPreviewWithTip(result, code, index, alt));
                        var uploadedSize = up.parent().children(".preview-img").size();
                        if (uploadedSize >= 10) {
                            up.addClass("layui-hide");
                        }
                    });

                }, done: function (res, index, upload) {
                up.parent().find("input[data-fileindex=" + index + "]").val(res.data)
                reloadPhoto()
            }
        });
    }

    var uploadWithSpan = function (id, code, span) {
        var up = $(id);
        upload.render({
            elem: id
            , url: Feng.ctxPath + '/file/upload'
            , accept: 'images' //只允许上传图片
            , acceptMime: 'image/*' //只筛选图片
            , before:
                function (obj) {
                    //预读本地文件示例，不支持ie8
                    obj.preview(function (index, file, result) {
                        up.before(getImgPreviewWithSpan(result, code, index, span, span));
                        up.addClass("layui-hide");
                    });
                }, done: function (res, index, upload) {
                up.parent().find("input[data-fileindex=" + index + "]").val(res.data);
                reloadPhoto()
            }
        });
    }
    uploadNoWith("#examAudit", 100);
    uploadNoWith("#examCommitment", 200);
    uploadNoWith("#examRegistrationForm", 300);
    uploadNoWith("#examReviewForm", 400);
    uploadWithSpan("#examAccountBookHome", 500, "考生本人的居民户口簿首页");
    uploadWithSpan("#examAccountBookUser", 550, "考生本人的居民户口簿内页");
    uploadWithSpan("#examGuardianAccountBookHome", 600, "法定监护人的居民户口簿首页");
    uploadWithSpan("#examGuardianAccountBookUser", 650, "法定监护人的居民户口簿内页");
    uploadWithSpan("#examIdCardFront", 700, "考生本人的居民身份证正面");
    uploadWithSpan("#examIdCardBack", 750, "考生本人的居民身份证反面");
    uploadWithSpan("#examGuardianIdCardBack", 850, "法定监护人的居民身份证反面");
    uploadWithSpan("#examGuardianIdCardFront", 800, "法定监护人的居民身份证正面");

    /*其他户籍材料*/
    uploadWithTip("#examCensusFile", 900, "其他户籍材料");
    /*就读情况
        * */
    uploadWithTip("#examStudySituation", 1000, "就读情况");
    /*
       居住从业情况
    */
    uploadWithTip("#examResidentialEmploymentSituation", 1100, "居住从业情况");
    //缴纳社保
    uploadWithTip("#examSocialSecurity", 1200, "缴纳社保");

    form.on('submit(submit)', function () {
        if (!Student.isAuditor) {
            layer.confirm("提交后将不能再改动！是否确定提交", {icon: 3, title: '提示'}, function (index) {
                getAttachmentList(1);
                layer.close(index);
            })
        } else {
            getAttachmentList(1);
        }
    });

    form.on('submit(saveAttachment)', function () {
        getAttachmentList(0)
    });

    function getAttachmentList(signUpStatus) {
        var imgInputs = $(document).find(".img-input");
        var studentId = getPathnameId();
        var data = [];
        imgInputs.each(function () {
            var that = $(this);
            var item = {};
            item.studentId = studentId;
            item.description = that.attr("data-description");
            item.fileName = that.val();
            item.type = that.attr("data-code");
            data.push(item);
        });

        if (data.length === 0) {
            Feng.confirm("还未上传附件，是否继续提交！", function (index) {
                saveAttachment(null, studentId, signUpStatus);
                layer.close(index);
            })
        } else {
            saveAttachment(data, studentId, signUpStatus)
        }
    }

    function saveAttachment(data, studentId, signUpStatus) {
        var data2 = {
            studentId: studentId,
            signUpStatus: signUpStatus,
            files: data
        };
        $.ajax({
                type: 'post',
                url: Feng.ctxPath + '/signUp/attachment',
                dataType: 'json',
                contentType: 'application/json;charset=UTF-8',
                async: true,
                data: JSON.stringify(data2),
                success: function (res) {
                    if (res.code === 200) {
                        if (signUpStatus === 1) {
                            layer.confirm("提交成功", function (index) {
                                Feng.success(res.message);
                                layer.close(index);
                                if (!Student.isAuditor) {
                                    window.location.reload()
                                }
                            });
                        } else {
                            Feng.success(res.message);
                        }
                    } else {
                        layer.alert(res.message, {icon: 2})
                    }
                },
                error:

                    function (data) {
                        layer.msg("保存失败！", {icon: 2})
                    }
            }
        );
    }


    $(document).on('input', '.onInput', function () {
        $(this).parent().find(".img-input").attr("data-description", $(this).val());
    });


    var inputPassword = function () {
        var password = $("#inputPassword");
        layerIndex = layer.open({
            type: 1,
            title: "设置登录密码",
            resize: false,
            area: '360px',
            offset: '200px',
            content: password,
            success: function () {
                password.removeClass('layui-hide');
            },
            end: function () {
                password.addClass('layui-hide');
                password.find("input").val("");
            }
        });
    }
    /*保存*/
    form.on('submit(save)', function (data) {
        if ($("#id").val() || $("#password").val()) {
            data.field['signUpStatus'] = 0;
            save(data, "保存成功");
            return false
        } else {
            // 未登录考生，提示设置密码
            click = $(this);
            inputPassword();
            return false;
        }
    });

    $(document).on('click', '.delete-img', function () {
        $(this).parent().remove()
    })
})
;

var checkLogin = function (form) {
    $.ajax({
        type: 'get',
        url: Feng.ctxPath + '/signUp/checkLogin',
        dataType: 'json',
        async: true,
        success: function (res) {
            if (res.code === 200) {
                var jhrname = res.data.jhr2name;
                if (jhrname != null && jhrname.length !== 0) {
                    $(".guardianTwo").show()
                }
                form.val("studentForm", res.data);
                $(".sign-in").addClass('layui-hide');
                $(".sign-logout").removeClass('layui-hide');
                $("#studentName").text(res.data.name);
                $(".studeng-info").removeClass('layui-hide');
                var checkAttachment = $("#checkAttachment");
                if (res.data.signUpStatus !== 0) {
                    $(document).find('input').attr('disabled', 'disabled');
                    $(document).find('input').addClass("no-border");
                    $(document).find('.layui-select-title').unbind();
                    checkAttachment.removeClass('layui-hide');
                    checkAttachment.attr("href", Feng.ctxPath + "/signUp/attachment/" + res.data.id);
                    $(".delete-img").addClass("layui-hide");
                    $(".select-img").addClass("layui-hide");
                } else {

                    $("#saveAndAdd").removeClass('layui-hide');
                    $(".submit").removeClass("layui-hide");
                }
            } else {
                $(".sign-in").removeClass('layui-hide');
                $(".submit").removeClass("layui-hide");
            }
        }
    });
};

var getImgPreview = function (src, code, fileIndex, alt) {
    return "<div class=\"upload preview-img\">\n" +
        "      <img class=\"layui-upload-img\" src='" + src + "' alt='" + alt + "' data-fileIndex='" + fileIndex + "'>\n" +
        "      <input type=\"hidden\" class='img-input' data-fileIndex='" + fileIndex + "' data-code='" + code + "'>\n" +
        "<button class=\"layui-btn layui-btn-sm layui-btn-radius delete-img\">\n" +
        "                                    <i class=\"layui-icon layui-icon-close\"></i>\n" +
        "                                </button>" +
        "   </div>"
}
var getImgPreviewWithTip = function (src, code, fileIndex, alt) {
    return "<div class=\"upload id_upload preview-img\">\n" +
        "      <img class=\"layui-upload-img\" src='" + src + "' alt='" + alt + "' data-fileIndex='" + fileIndex + "'>\n" +
        "      <input  class='layui-input onInput' required lay-verify='required' placeholder=\"请添加备注\">" +
        "      <input type=\"hidden\" class='img-input' data-fileIndex='" + fileIndex + "' data-code='" + code + "'>\n" +
        "<button class=\"layui-btn layui-btn-sm layui-btn-radius delete-img\">\n" +
        "                                    <i class=\"layui-icon layui-icon-close\"></i>\n" +
        "                                </button>" +
        "   </div>"
}
var getImgPreviewWithSpan = function (src, code, fileIndex, span, alt) {
    return "<div class=\"upload id_upload preview-img\">\n" +
        "      <img class=\"layui-upload-img\" src='" + src + "' alt='" + alt + "' data-fileIndex='" + fileIndex + "'>\n" +
        "      <span>" + span + "</span>" +
        "      <input type=\"hidden\" class='img-input' data-fileIndex='" + fileIndex + "' data-code='" + code + "'>\n" +
        "<button class=\"layui-btn layui-btn-sm layui-btn-radius delete-img\">\n" +
        "                                    <i class=\"layui-icon layui-icon-close\"></i>\n" +
        "                                </button>" +
        "   </div>"
}

var applyType = function (value) {
    if (value === "3个6") {
        /*弹出初一到高三*/
        $(".primarySchool").addClass('layui-hide');
        $(".highSchool").removeClass('layui-hide');
        $(".juniorHighSchool").removeClass('layui-hide')
    } else if (value === "3个3" || value === "3个有") {
        /*弹出高一到高三*/
        $(".primarySchool").addClass('layui-hide');
        $(".highSchool").removeClass('layui-hide');
        $(".juniorHighSchool").addClass('layui-hide')
    } else {
        $(".primarySchool").removeClass('layui-hide');
        $(".highSchool").removeClass('layui-hide');
        $(".juniorHighSchool").removeClass('layui-hide')
    }
    applyTypeValue = value;
}

function save(data, tip) {
    // if (data.field.ksid === "0") {
    //     layer.msg("请选择考生类别", {icon: 2});
    //     return false;
    // }
    // if (data.field.sqydlx === "0") {
    //     layer.msg("请选择异地类型", {icon: 2});
    //     return false;
    // }

    var totalYear = getYear();
    if (applyTypeValue === "3个6") {
        /*3个6必须满足6年社保*/
        if (!calculationTime(totalYear, 6, "3个6必须满足6年社保")) {
            return false;
        }
    } else if (applyTypeValue === "3个3") {
        /*3个3必须满足3年社保*/
        if (!calculationTime(totalYear, 3, "3个3必须满足3年社保")) {
            return false;
        }
    }
    $.ajax({
        type: 'post',
        url: Feng.ctxPath + '/signUp/save',
        dataType: 'json',
        async: true,
        data: data.field,
        success: function (res) {
            if (res.code === 200) {
                window.location.href = Feng.ctxPath + Student.saveAndAddAttachmentUrl + res.data;
            } else {
                layer.alert(res.message, {icon: 2})
            }
        },
        error: function (data) {
            layer.msg("保存失败！", {icon: 2})
        }
    });
    return false
}


function getYear() {
    var totalYear = 0;
    var totalMonth = 0;
    $(".guardianSB .dateDistance").each(function () {
        var year = parseInt($(this).attr("date-year"));
        var month = parseInt($(this).attr("date-month"));
        if (year) {
            totalYear += year;
        }
        if (month) {
            totalMonth += month;
        }
    });
    if (totalMonth !== 0) {
        totalYear += parseInt(totalMonth / 12);
        totalMonth = totalMonth % 12
    }
    return totalYear;
}


/*计算时限*/
function calculationTime(totalYear, year, tip) {
    if (totalYear >= year) {
        return true;
    } else {
        layer.confirm(tip + ",是否填写下一个监护人缴纳社保信息，点《取消》则继续填写当前监护人缴纳社保信息。", function (index) {
            $(".guardianTwo").show();
            layer.close(index);
        });
        return false
    }
}

function MyDate(year, month) {
    this.year = year;
    this.month = month;

    this.getString = function () {
        if (year === 0) {
            return this.month + "个月"
        } else if (month === 0) {
            return this.year + "年"
        } else {
            return this.year + "年" + this.month + "个月"
        }
    }
}


var getMyDate = function (date) {
    if (date) {
        var date1 = date.substring(0, 6);
        var date2 = date.substring(9);
        var year1 = parseInt(date1.substring(0, 4));
        var month1 = parseInt(date1.substring(4));
        var year2 = parseInt(date2.substring(0, 4));
        var month2 = parseInt(date2.substring(4));
        if (month2 < month1) {
            month2 += 12;
            year2 -= 1;
        }
        return new MyDate(year2 - year1, month2 - month1)
    } else {
        return null;
    }
}

var getLastDate = function () {
    // 获取当前日期
    var date = new Date();
    var seperator = "-";


    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    return date.getFullYear() + seperator + "12-30";
}
var getBuyLastDate = function () {
    // 获取当前日期
    var date = new Date();
    var seperator = "-";
    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
    return date.getFullYear() + "年12月";
};
var getPathnameId = function () {
    var pathname = window.location.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
};