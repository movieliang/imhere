/* !
**使用站长工具http://tool.chinaz.com/js.aspx，普通压缩后再加密得到im.js
*/

//打开页面要运行。
$(function () {
    checkGh();
    checkNo();//增加检查数字功能
    enterToTab();
    myAutoComplete();
    autoUpperCase();
});

//功能：验证集装箱箱号：
function chkcon(con) {
        //con = con.replace(/\s+/g, "");//去掉所有空格
        if (!con || con == "") { return true; }
        if (con.length != 11) { return false; }
        con = con.toUpperCase();
        var re = /^[A-Z]{4}\d{7}/;
        if (re.test(con)) {
            var sum = 0;
            for (i = 0; i < 10; i++) {
                var n = con.substr(i, 1);
                if (i < 4) {
                    n = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ".indexOf(con.substr(i, 1));
                }
                n *= Math.pow(2, i); //2的i次方
                sum += n;
            }
            if (con.substr(0, 4) == "HLCU") {
                sum -= 2;
            }
            sum %= 11;
            sum %= 10; //余数为10的取0
            return sum == con.substr(10);
        } else {
            return false; //不匹配正则表达式   
        }
    };

//选择.container 的类柜号错误时增加error StyleSheet样式
function checkGh() {
        $(".gh").keyup(function () {
            $(this).val($(this).val().toUpperCase()); //转成大写
            if (chkcon($(this).val())) {
                $(this).removeClass("gherror");
                $(this).addClass("ghok");
            } else {
                $(this).removeClass("ghok");
                $(this).addClass("gherror");
            }
        });
    };

    //小写转成大写
    function autoUpperCase() {
        $(".autoUpperCase").keyup(function () {
            $(this).val($(this).val().toUpperCase());
       })
    };

function checkNo() {
    function checkNum(KeyCode) {
        if (!isNaN(KeyCode)) { //判断输入的是不是数字
            return true;
        }
        else {
            0
            if (KeyCode == "-") //可以先输负号
            {
                return true;
            } else {
                //alert("只能输入数字");
                return false;
            }
        }
    };

    //选择.number 的类错误时增加error StyleSheet样式

    $(".imNumber,.imNum").keyup(function () {
        $(this).removeClass("error");
        if (!checkNum($(this).val())) {
            $(this).addClass("error");
            $(this).val("0");
        }
    });

    //$(".imNumber,.imNum").ready(function () {
    //    if ($(this).val() === "" || $(this).val() === "0" ) {
    //        $(this).val("0.00")
    //    }
    //})
    //    .blur(function () {
    //        if ($(this).val() === "" || $(this).val() === "0") {
    //            $(this).val("0.00");
    //        }
    //    });
    };

//1、表格奇偶行不同颜色 （以下3项在bootstrap-table下没用，在普通的表格才能用。）
//$(function () {
//    //  $(".discolorTable tr:odd").addClass("error");
//    $(".table tbody tr:even").addClass("info");

//    //2、鼠标Over变颜色
//    $(".table tbody tr,#Label1").hover(
//        function () {
//            $(this).addClass("danger");
//        },
//        function () {
//            $(this).removeClass("danger");
//        });

//    //3、鼠标点击后变换颜色
//    $(".table tbody tr").click(
//        function () {
//            $(this).addClass("warning");
//        } //,   //如果表格中没有单击事件，可以取消注释，click改为toggle，可以取消点击后的背景颜色。
//        //          function () {
//        //             $(this).removeClass("clicked");
//        //             }
//    );
//});


//以下2项是在bootstrap-table中使用。
//表格奇偶行不同颜色,要在表格增加这样的属性：data-striped="true"  data - row - style="rowStyle" @*隔行变色 *@
//function rowStyle(row, index) { 
//    //var classes = ['active', 'success', 'info', 'warning', 'danger'];

//    if (index % 2 === 0) {
//        return {
//            classes: 'info'
//        };
//    }
//    return {};
//}

//.table行点击后加色
$('.table').on('click-row.bs.table', function (e, row, $element) {
    //$('.success').removeClass('success');
    $($element).addClass('warning');
    return false;
});

//设置标题行浮动,要先引入table-fixed-header-master
//$('.table-fixed-header').fixedHeader(); 

//以下是检验身份证号是否正确
$(function () {
    function isIdCardNo(num) {
        num = num.toUpperCase();
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        if (num.length == 0) { return true; }; //如果为空则不验证
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
            alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
            return false;
        }
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        //下面分别分析出生日期和校验位
        var len, re;
        len = num.length;
        if (len == 15) {
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                alert('输入的身份证号里出生日期不对！');
                return false;
            }
            else {
                //将15位身份证转成18位
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return num;
            }
        }
        if (len == 18) {
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
            var arrSplit = num.match(re);

            //检查生日日期是否正确
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
            var bGoodDay;
            bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
            if (!bGoodDay) {
                alert(dtmBirth.getYear());
                alert(arrSplit[2]);
                alert('输入的身份证号里出生日期不对！');
                return false;
            }
            else {
                //检验18位身份证的校验码是否正确。
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var valnum;
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                for (i = 0; i < 17; i++) {
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[nTemp % 11];
                if (valnum != num.substr(17, 1)) {
                    alert('18位身份证的校验码不正确！应该为：' + valnum);
                    return false;
                }
                return num;
            }
        }
        return false;
    };
    //选择身份证.idk 的类错误时增加error StyleSheet样式
    $(".idk").blur(function () {
        $(this).removeClass("error");
        if (!isIdCardNo($(this).val())) {
            $(this).addClass("error");
        }
    });
});

//按回车跳到下一input
function enterToTab() {
    $("input").keypress(function (e) {
        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        //alert(keyCode);
        if (keyCode === 39) // 判断所按是否方向右键
        {
            keyCode === 9;
        }
        if (keyCode === 13) // 判断所按是否回车键 FireFox下事件的keyCode 是只读的，不能修改
        {
            keyCode === 9;
            var inputs = $("input"); // 获取表单中的所有输入框
            var idx = inputs.index(this); // 获取当前焦点输入框所处的位置

            if (idx === inputs.length - 1) // 判断是否是最后一个输入框
            {
                return false; // 取消默认的提交行为
            } else {
                inputs[idx + 1].focus(); // 设置焦点
                //  inputs[idx + 1].select(); // 选中
            }
            return false; // 取消默认的提交行为
        }
    });
}

// Combobox  and Autocomplete 注意要引入jQuery ui
function myAutoComplete() {
    // json 格式示例
    //$(".atocomplete").autocomplete({
    //    source: function (request, response) {
    //        //var term = request.term;
    //        //if (term in cache) {
    //        //    response(cache[term]);
    //        //    return;
    //        //}
    //        $.ajax({
    //            url: "api/AutoApi",
    //            dataType: "json",
    //            //data:request,
    //            success: function (data) {
    //                var cache = [];
    //                $(data).each(function () {
    //                    cache[cache.length] = { label: this.Genre, value: this.Title };
    //                });
    //                response(cache);
    //            }
    //        });
    //    },
    //    minLength: 0,
    //    autoFocus: true
    //}).focus(function (event) {
    //    $(this).autocomplete("search", "");
    //});

    //$.ajax({ //方式二
    //    url: "api/AutoApi",
    //    dataType: "json",
    //    cache: true,
    //    success: function (data) {
    //        var cache = [];
    //        $(data).each(function () {
    //            cache[cache.length] = { label: this.Genre, value: this.Title };
    //        });      
    //        $(".autoFee").autocomplete({
    //            source: cache,
    //            minLength: 0,
    //            autoFocus: true
    //        }).focus(function (event) {
    //            $(this).autocomplete("search", "");
    //        });
    //    }
    //});

    ////XML 格式示例    
    //$.ajax({
    //    url: "../../api/ApiSelectList/Client",
    //    dataType: "xml",
    //    cache: true,
    //    success: function (xmlResponse) {
    //        var data = $("item", xmlResponse).map(function () {
    //            return {
    //                label: $("label", this).text(),
    //                value: $("value", this).text(),
    //                driver: $("driver", this).text(),
    //                tel: $("tel", this).text(),
    //                trailer: $("trailer", this).text(),
    //                company: $("company", this).text()
    //            };
    //        }).get();
    //        $(".truck5Auto").autocomplete({
    //            source: data,
    //            minLength: 0,
    //            select: function (event, ui) {
    //                $("#DriverComboBox").val(ui.item.driver);
    //                $("#DailyDriverPhone").val(ui.item.tel);
    //                $("#TrailerDropDownList1").val(ui.item.trailer);
    //                $("#TruckCompany1").val(ui.item.company);// return false;
    //            }
    //        }).focus(function (event) {
    //            $(this).autocomplete("search", "");
    //        });
    //    }
    //});

    ////空时后面的也设置为空

    //$(".truck5Auto").blur(function () {
    //    if ($(this).val() === "") {
    //        $("#DriverComboBox").val("");
    //        $("#DailyDriverPhone").val("");
    //        $("#TrailerDropDownList1").val("");
    //        $("#TruckCompany1").val("");
    //    }
    //});


    //下拉列表带分组
    //$.widget("custom.catcomplete", $.ui.autocomplete, {
    //    _create: function () {
    //        this._super();
    //        this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
    //    },
    //    _renderMenu: function (ul, items) {
    //        var that = this,
    //            currentCategory = "";
    //        $.each(items, function (index, item) {
    //            var li;
    //            if (item.category !== currentCategory) {
    //                ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
    //                currentCategory = item.category;
    //            }
    //            li = that._renderItemData(ul, item);
    //            if (item.category) {
    //                li.attr("aria-label", item.category + " : " + item.label);
    //            }
    //        });
    //    }
    //});
    //$.ajax({
    //    url: "../../api/ApiReamrkSelectList/aa",
    //    cache: true,
    //    success: function (jsonData) {
    //        $("#search").catcomplete({  //这是catcomplete 不是autocomplete
    //            source: jsonData,
    //            minLength: 0
    //        }).focus(function (event) {
    //            $(this).catcomplete("search", "");
    //        });
    //    }
    //});

    //柜型，不可以为空
    $(".conType").autocomplete({
        source: ["40HQ", "40GP", "20GP", "40RH", "45HQ"],
        minLength: 0
    }).focus(function (event) {
        $(this).autocomplete("search", "");
    }).ready(function () {
        if ($(".conType").val() === "") {
            $(".conType").val("40HQ")
        }
    }).blur(function () {
        if ($(this).val() === "") {
            $(this).val("40HQ");
        }
    });
    //报关方式
    $(".bgfsAuto").autocomplete({
        source: ["出口清关", "出口转关", "进口清关", "进口转关", "手册报关", "其它方式"],
        minLength: 0
    }).focus(function (event) {
        $(this).autocomplete("search", "");
    }).ready(function () {
        if ($(this).val() === "") {
            $(this).val("出口清关")
        }
    }).blur(function () {
            if ($(this).val() === "") {
                $(this).val("出口清关");
            }
        });

    //车牌
    $(".cpAuto").autocomplete({
        source: ["粤B", "粤A"],
        minLength: 0
    }).focus(function (event) {
        $(this).autocomplete("search", "");
    });

    //备注
    $.ajax({
        url: "../../api/ApiSelectList/Remark",
        cache: true,
        success: function (jsonData) {
            var data = [];
            $(jsonData).each(function () {
                data[data.length] = { label: this.RemarkCode + "-" + this.RemarkContent, value: this.RemarkContent };
            });
            //$.each(jsonData, function (key, v) { //采用以上的更简单。
            //    var list = new Object();
            //    list.label = v.remarkCode + "-" + v.remarkContent;
            //    list.value = v.remarkContent;
            //    data.push(list);
            //});
            $(".remarkAuto").autocomplete({
                source: data,
                minLength: 0
            }).focus(function (event) {
                $(this).autocomplete("search", "");
            });
        }
    });

    //客户
    $.ajax({
        url: "../../api/ApiSelectList/Client",
        cache: true,
        success: function (jsonData) {
            var data = [];
            $(jsonData).each(function () {
                data[data.length] = { label: this.ClientCode + "-" + this.ClientName, value: this.ClientName };
            });
            $(".clientAuto").autocomplete({
                source: data,
                minLength: 0
            }).focus(function (event) {
                $(this).autocomplete("search", "");
            });
        }
    });
}

//自动跳出应付费用
$(function () {
    $("#getFreight").blur(function () {
        var gFreight = $("#getFreight").val();
        var pFreight = $("#payFreight").val();
        if (!isNaN(gFreight) && !pFreight.length) {  //isNaN()判断是不是数字
            $("#payFreight").val(gFreight);
        }
    });

    $("#getPrintFee").blur(function () {
        var gPrintFee = $("#getPrintFee").val();
        var pPrintFee = $("#payPrintFee").val();
        if (!isNaN(gPrintFee) && !pPrintFee.length) {
            $("#payPrintFee").val(gPrintFee);
        }
    });

    $("#getCustomFee").blur(function () {
        var gFreight = $("#getCustomFee").val();
        var pFreight = $("#payCustomFee").val();
        if (!isNaN(gFreight) && !pFreight.length) {
            $("#payCustomFee").val(gFreight);
        }
    });
});

//双击在新窗口打开
//function dbclick(myid) {
//    //alert(myid);
//    window.open("DailyEdit.aspx?sta=0&DailyId=" + myid, null, "width=1024,height=640,toolbar=0,resizable=0,scrollbars=0");
//};

// 日期选择器 要先引入jQuery UI
$(function () {
    $('.datePicker').datepicker({
        dateFormat: "yy-mm-dd",
        showButtonPanel: true,
        //changeMonth: true,
        //changeYear: true,
        //numberOfMonths: 2,
        //defaultDate: '-1m +1',
        duration: "fast"
    });
});

//给序列编号
function ph() {
    $(".ph").each(function (index) {
        $(this).text(index + 1);
    })
};

//以下4项For Create page
//将Name序列化 （在提交前调用）
function editName() {
    $("tbody tr").each(function (index) {
        //var mytr = "tbody tr:eq(" + index + ") td";
        //$(mytr).first().append(index + 1);
        //$(mytr + ":input[name]").append(index);
        //$(this).find("td").first().append(index + 1);
        $(this).find("[name]").each(function () {
            $(this).attr("name", function (i, val) {
                return "fees[" + index + "]." + val;
            });
        });
    })
};
//Daily提交表单
function dailysub() {
    if ($("#DailyClient").val() == "") {
        alert("客户不能为空！");
        $("#DailyClient").focus();
        return false;
    }
    editName();
    $("#MyForm").submit();
}
//增加行
function addrow(obj) {
    //var nrow = "<tr><td><input class='autoFee' /></td><td><input /></td><td><input /></td><td><input /></td><td><input /></td><td><a href='#' onclick='addrow(this)'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></a><a href='#' onclick='delrow(this)'> <span class='glyphicon glyphicon-minus' aria-hidden='true'></span></a></td></tr>";
    //var nrow = $(obj).parent().parent().parent().html();//.css({ "color": "red", "border": "2px solid red" }); //tr里面的HHML,不包含TR,这样用就要用 .wrap("<tr></tr>")前后增加TR 
    $(obj).parent().parent().clone().appendTo("tbody");//复制TR增加
    //$("tbody").append(nrow);
    ph();
    dbauto();
    checkGh();
    checkNo();
    enterToTab();
    myAutoComplete();
    $("tbody tr").last().find("input").first().val("");
    $("tbody tr:last").find(".gh").val("").focus();
};
//减少行
function delrow(obj) {
    if ($(".ph").length == 1) {
        alert("费用信息不能为空！");
    } else {
        $(obj).parent().parent().remove();
        ph();
    }
};
//自动跳出费用
function dbauto() {
    $.ajax({
        url: "../../api/ApiSelectList/",
        cache: false,
        success:function(data) {
            var cache = [];
            $(data).each(function () {
                cache[cache.length] = {
                    label: this.containerType,
                    value: this.containerType,
                    feeBgf: this.feeBgf,
                    feeGjf: this.feeGjf,
                    feeCgf: this.feeCgf,
                    feeSjf: this.feeSjf,
                    feeLdf: this.feeLdf,
                    feeQtf: this.feeQtf,
                    feeRemark: this.feeRemark
                };
            });
            $(".autoFee").autocomplete({
                source: cache,
                minLength: 0,
                autoFocus: true,
                select: function (event, ui) {
                    //alert(ui.item.Price);
                    //$(this).parent().next().find("input").css({ "color": "red", "border": "2px solid red" });
                    $(this).parent().next().find("input").val(ui.item.feeBgf);
                    $(this).parent().next().next().find("input").val(ui.item.feeGjf);
                    $(this).parent().next().next().next().find("input").val(ui.item.feeCgf);
                    $(this).parent().next().next().next().next().find("input").val(ui.item.feeSjf);
                    $(this).parent().next().next().next().next().next().find("input").val(ui.item.feeLdf);
                    $(this).parent().next().next().next().next().next().next().find("input").val(ui.item.feeQtf);
                    $(this).parent().next().next().next().next().next().next().next().find("input").val(ui.item.feeRemark);
                }
            }).focus(function (event) {
                $(this).autocomplete("search", "");
            });
        },
        dataType:"json"});

    $(".autoFee").ready(function () {
        if ($(this).val() === "") {
            $(this).val("40HQ")
        }
    })
        .blur(function () {
            if ($(this).val() === "") {
                $(this).val("40HQ");
            }
        });
}

//增加标签
function adtab(title, url) {
    window.parent.window.$.addtabs.add({ title: title, url: url });
}
//关闭指定ID标签id = tab_id
function closetab(id) {
    window.parent.window.$.addtabs.close({ id: id });
}
//关闭当前标签
function closeCurrent() {
    window.parent.window.closeCurrentTab();
}