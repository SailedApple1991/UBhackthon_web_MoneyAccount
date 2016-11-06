define("page/controller/config", [], function(require, exports, module) {
    exports.map = {
        mainpage: "page/mainpage/index"
    };
});

/**
 * Created by Haoyu Guo on 2016/9/3.
 */
define("page/controller/module", [ "page/controller/config", "lib/jquery" ], function(require, exports, module) {
    var tabMap = require("page/controller/config").map;
    var $ = require("lib/jquery");
    var curTab = "flow";
    /*从url获取tab信息*/
    var getTabFromHash = function() {
        var tempurl = location.hash;
        var hash;
        hash = !location.hash ? "#metric" : location.hash;
        return hash.substring(1, hash.length);
    };
    //init function to start load js
    exports.init = function(username) {
        // for the tab part may need in future
        // curTab = getTabFromHash();
        // curUser   = username;
        // curNs     = namespace||"";
        // var target    = tabMap[ curTab ];
        // require.async( target , function( index ){
        //     index.init();
        // });
        require.async(tabMap["mainpage"], function(index) {
            index.init(username);
        });
        $("#logout").click(function() {});
    };
});

/**
 * Created by kaiyu on 10/25/16.
 */
define("page/login/index", [ "lib/jquery", "util/tpl", "util/util", "net/login", "util/net" ], function(require, exports, module) {
    var $ = require("lib/jquery");
    var tpl = require("util/tpl");
    var util = require("util/util");
    var login = require("net/login");
    var p = "";
    var typingTimer;
    //timer identifier
    var doneTypingInterval = 1e3;
    //time in ms, 5 second for example
    exports.init = function() {
        _bindEvent();
    };
    var login_check = function() {};
    /*the combination of needed action function*/
    var actionList = {
        start: function(tar) {},
        logindata: function(tar) {
            var obj = {};
            var login_username = $("#username").val();
            var pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
            /*No Underscore at first and last*/
            if (pattern.test(login_username)) {
                obj.email = login_username;
            } else {
                obj.username = login_username;
            }
            var login_password = $("#password").val();
            obj.password = login_password;
            var success = function(data) {
                if (data.errno == "0") {
                    util.cookie.set("u_Ticket", data.data);
                    location.href = "http://localhost:3000/";
                } else {
                    alert(data.error);
                }
            };
            login.Login(obj, success);
        },
        click_google: function(tar) {
            $.ajax({
                method: "GET",
                url: "./auth/google"
            }).done(callback);
        }
    };
    var _bindEvent = function() {
        $main = $("#login");
        $main.on("click", "[data-action]", function() {
            if ($(this).attr("disabled") != "disabled") {
                var actionName = $(this).data("action");
                var action = actionList[actionName];
                var tar = this;
                if ($.isFunction(action)) action(tar);
            }
        });
    };
});

/**
 * Created by gmyth on 16/11/5.
 */
define("page/mainpage/config", [], function(require, exports, module) {
    exports.data = [ {
        name: "john",
        dstname: [ "peter", "cindy", "dave" ],
        num: [ "-1", "-3", "-4" ]
    }, {
        name: "peter",
        dstname: [ "john", "cindy", "dave" ],
        num: [ "-2", "-4", "-5" ]
    }, {
        name: "cindy",
        dstname: [ "john", "cindy", "dave" ],
        num: [ "1", "-2", "-4" ]
    } ];
});

/**
 * Created by Haoyu Guo on 2016/10/25.
 */
define("page/mainpage/index", [ "util/count_num", "lib/jquery", "util/tpl" ], function(require, exports, module) {
    //var config    = require("page/mainpage/config").data;
    var counter = require("util/count_num");
    var $ = require("lib/jquery");
    var tpl = require("util/tpl");
    var config;
    var curdata;
    var current = "";
    var tmpl = {
        main: '    <div class="main-area">    <h4>Current Bill</h4>        <form class="form-horizontal">            <div class="form-group">                <label class="col-sm-1 control-label" style="width: 10px;">Hi,</label>                <div class="col-sm-10">                    <select class="form-control" id="sel-name" style="width: 160px">                        <%for(var i=0,item;item = nlist[i];i++){%>                        <option name="<%=item.name%>"><%=item.name%></option>                        <%}%>                    </select>                </div>            </div>        </form>        <hr>    <div id="table-data"></div>    </div>    <button type="button" class="btn btn-lg btn-success" style="float: right; margin-top: 20px; margin-right: 6%;"data-toggle="modal" data-target="#myModal">Add Some!</button>    <button type="button" class="btn btn-lg btn-warning" style="float: right; margin-top: 20px; margin-right: 6%;"data-toggle="modal" data-target="#myModal1">Create New Bill!</button>    <div class="modal fade" id="myModal" role="dialog">        <div class="modal-dialog">            <!-- Modal content-->            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title">FInancial Status</h4>                </div>                <div class="modal-body">                    <p>Client Name</p >                    <input type="text" name="bookId" id="client" value=""/>                    <p></p >                    <p>Money spent</p >                    <input type="text" name="bookId" id="money_spent" value=""/>                    <p></p >                    <p>For What</p>        <textarea rows="4" cols="50" id="goals">        </textarea>                </div>                <div class="modal-footer">                    <button type="button" class="btn btn-default" data-dismiss="modal">Confirm</button>                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>                </div>            </div>        </div>    </div>    <!-- Modal -->    <div class="modal fade" id="myModal1" role="dialog">        <div class="modal-dialog">            <!-- Modal content-->            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title"><font size="3">Type Of Bill</font></h4>                </div>                <div class="modal-body">                    <p><font size="3">Name <font size="1">(Please use comma to separate each name)</font></font></p>                    <input type="text" name="bookId" id="name" value="">                </div>                <div class="modal-footer">                    <button type="button" class="btn btn-default" data-dismiss="modal" data-action="new_bill">Confirm</button>                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>                </div>            </div>        </div>    </div>',
        table: '    <table class="table table-hover " style="padding: 20px;">        <thead>        <tr>            <th style="text-align: center">Name</th>            <th style="text-align: center">Event</th>            <th style="text-align: center">Sum</th>        </tr>        </thead>        <tbody>        <%for(var i=0,item;item = DATA[i];i++){%>        <tr>            <td><%=item%></td>            <td>Dining</td>            <td><%=numList[i]%></td>        </tr>        <%}%>        </tbody>    </table>'
    };
    exports.init = function(username) {
        current = username;
        config = counter.get(counter.getdata(current));
        curdata = counter.getdata();
        $(".main_container").html(tpl.get(tmpl.main, {
            nlist: config
        }));
        $("#table-data").html(tpl.get(tmpl.table, {
            DATA: config[0].dstname,
            numList: config[0].num
        }));
        _bindEvent();
    };
    /*the combination of needed action function*/
    var actionList = {
        new_bill: function() {
            var name = $("#name").val();
            var namelist = [];
            while (name.indexOf(",") != -1) {
                var temp = name.substring(0, name.indexOf(","));
                namelist.push(temp);
                name = name.substring(name.indexOf(",") + 1, name.length);
            }
            if (name != "") {
                namelist.push(name);
            }
            var dataobj = [];
            for (var i = 0; i < namelist.length; i++) {
                var obj = {
                    Name: namelist[i],
                    money: "0"
                };
                dataobj.push(obj);
            }
        },
        add_bill: function() {
            var pattern = /^[0-9.]+$/;
            /*No Underscore at first and last*/
            var goals = $("#goals").val();
            var user = $("#client").val();
            var count = $("#money_spent").val();
            if (pattern.test(count)) {
                for (var i = 0; i < curdata.length; i++) {
                    if (curdata[i].Name == user) {
                        curdata[i].money = (parseFloat(curdata[i].money) + parseFloat(count)).toString();
                    }
                }
                //cgi here
                //.........
                config = counter.get(counter.getdata(current));
                curdata = counter.getdata();
                $(".main_container").html(tpl.get(tmpl.main, {
                    nlist: config
                }));
                $("#table-data").html(tpl.get(tmpl.table, {
                    DATA: config[0].dstname,
                    numList: config[0].num
                }));
            } else {
                alert("wrong format number!");
            }
        }
    };
    var dataparse = function(data, index) {
        return data[index].dstname;
    };
    var numparse = function(data, index) {
        return data[index].num;
    };
    var _bindEvent = function() {
        main_container = $(".main_container");
        main_container.on("click", "[data-action]", function() {
            if ($(this).attr("disabled") != "disabled") {
                var actionName = $(this).data("action");
                var action = actionList[actionName];
                var tar = this;
                if ($.isFunction(action)) action(tar);
            }
        });
        main_container.on("change", "#sel-name", function() {
            var val = $(this).val();
            for (var i = 0, item; item = config[i]; i++) {
                if (item.name == val) {
                    $("#table-data").html(tpl.get(tmpl.table, {
                        DATA: dataparse(config, i),
                        numList: numparse(config, i)
                    }));
                    break;
                }
            }
        });
    };
});

/**
 * Created by Haoyu Guo on 2016/10/25.
 */
/**
 * Created by gmyth on 16/9/7.
 * this part is created for the implement of the sign up page
 * */
define("page/signup/index", [ "lib/jquery", "util/tpl", "net/signup", "util/net" ], function(require, exports, module) {
    var $ = require("lib/jquery");
    var tpl = require("util/tpl");
    var signup = require("net/signup");
    var p = "";
    var typingTimer;
    //timer identifier
    var doneTypingInterval = 1e3;
    //time in ms, 5 second for example
    var username_right = false;
    var password_right = false;
    var password_check_right = false;
    var email_right = false;
    exports.init = function() {
        _bindEvent();
    };
    /*the combination of needed action function*/
    var actionList = {
        confirm_signup: function(tar) {
            //检查 信息完整
            if (username_right == true && password_right == true && email_right == true && password_check_right == true) {
                var obj = {
                    email: $("#email").val(),
                    name: $("#username").val(),
                    password: $("#password").val(),
                    uni: $("#university").val(),
                    gender: $("#gender").find("option:selected").val(),
                    YRS_EXPERIENCE: $("#YRS_EXPERIENCE").find("option:selected").attr("yrs")
                };
                signup.Signup(obj, function() {
                    alert("success");
                });
            } else {
                $("#Signup_msg").html('<p class="error_msg"> <span class="fui-cross" style="color: #e63c5f"></span>Please complete the form to continue Sign up!</p>');
            }
        },
        click_google: function(tar) {
            $.ajax({
                method: "GET",
                url: "./auth/google"
            }).done(callback);
        }
    };
    /*bind the button input control event*/
    PasswordCheck = function(p1, p2) {
        if (p1 === p2) {
            $("#password_r_info").html('PASSWORD  CONFIRM &nbsp; &nbsp; &nbsp;<span class="fui-check-circle" style=" color: #2ECC71;"></span>&nbsp;<b class="is_success">MATCHED</b>');
            $("#PASSWORD_R").addClass("is_success");
            $("#PASSWORD_R").removeClass("is_error");
            password_check_right = true;
        } else {
            if (p2 == "" || p2.length < 6) {
                $("#password_r_info").html('PASSWORD  CONFIRM <b class="info_guide"></b>');
                $("#PASSWORD_R").removeClass("is_success");
                $("#PASSWORD_R").removeClass("is_error");
                password_check_right = false;
            } else {
                $("#password_r_info").html('PASSWORD  CONFIRM &nbsp; &nbsp; &nbsp;<span class="fui-cross-circle" style=" color: #e74c3c;"></span>&nbsp;<b class="is_error">DISMATCHED</b>');
                $("#PASSWORD_R").removeClass("is_success");
                $("#PASSWORD_R").addClass("is_error");
                password_check_right = false;
            }
        }
    };
    var _bindEvent = function() {
        Signup = $("#Signup");
        Signup.on("click", "[data-action]", function() {
            if ($(this).attr("disabled") != "disabled") {
                var actionName = $(this).data("action");
                var action = actionList[actionName];
                var tar = this;
                if ($.isFunction(action)) action(tar);
            }
        });
        Signup.on("input", "#username", function() {
            var pattern = /^(?!_)(?!.*?_$)[A-Za-z0-9_,]+$/;
            /*No Underscore at first and last*/
            var temp = $("#username").val();
            if (pattern.test(temp) && temp.length >= 4) {
                $("#username_info").html('USERNAME &nbsp; &nbsp; &nbsp;<span class="fui-check-circle" style=" color: #2ECC71;"></span>&nbsp;<b class="is_success">GOOD NAME TO USE</b>');
                $("#username").addClass("is_success");
                $("#username").removeClass("is_error");
                username_right = true;
            } else {
                if (temp == "") {
                    $("#username_info").html('USERNAME <b class="info_guide"></b>');
                    $("#username").removeClass("is_success");
                    $("#username").removeClass("is_error");
                } else if (temp.length < 4) {
                    $("#username_info").html('USERNAME &nbsp; &nbsp; &nbsp;<span class="fui-cross-circle" style=" color: #e74c3c;"></span>&nbsp;<b class="is_error">TOO SHORT</b>');
                    $("#username").removeClass("is_success");
                    $("#username").removeClass("is_error");
                } else {
                    $("#username_info").html('USERNAME &nbsp; &nbsp; &nbsp;<span class="fui-cross-circle" style=" color: #e74c3c;"></span>&nbsp;<b class="is_error">WRONG FORMAT</b>');
                    $("#username").removeClass("is_success");
                    $("#username").addClass("is_error");
                }
                username_right = false;
            }
        });
        Signup.on("input", "#password", function() {
            var pattern = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            /*No Underscore at first and last*/
            var temp = $("#password").val();
            p = temp;
            if ($("#PASSWORD_R").val() != "") {
                PasswordCheck(p, $("#PASSWORD_R").val());
            }
            if (pattern.test(temp) && temp.length >= 6) {
                $("#password_info").html('PASSWORD &nbsp; &nbsp; &nbsp;<span class="fui-check-circle" style=" color: #2ECC71;"></span>&nbsp;<b class="is_success">PERFECT PASSWORD</b>');
                $("#password").addClass("is_success");
                $("#password").removeClass("is_error");
                password_right = true;
            } else {
                if (temp == "" || temp.length < 6) {
                    $("#password_info").html('PASSWORD <b class="info_guide"></b>');
                    $("#password").removeClass("is_success");
                    $("#password").removeClass("is_error");
                } else {
                    $("#password_info").html('PASSWORD &nbsp; &nbsp; &nbsp;<span class="fui-cross-circle" style=" color: #e74c3c;"></span>&nbsp;<b class="is_error">WRONG FORMAT</b>');
                    $("#password").removeClass("is_success");
                    $("#password").addClass("is_error");
                }
                password_right = false;
            }
        });
        Signup.on("input", "#PASSWORD_R", function() {
            var pattern = /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
            /*No Underscore at first and last*/
            var temp = $("#PASSWORD_R").val();
            PasswordCheck(p, temp);
        });
        Signup.on("input", "#email", function() {
            var pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
            /*No Underscore at first and last*/
            var temp = $("#email").val();
            if (temp.length > 0) {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(doneTyping, doneTypingInterval);
                function doneTyping() {
                    //do something
                    if (pattern.test(temp)) {
                        $("#email_info").html('EMAIL &nbsp; &nbsp; &nbsp;<span class="fui-check-circle" style=" color: #2ECC71;"></span>&nbsp;<b class="is_success">THANK YOU</b>');
                        $("#email").addClass("is_success");
                        $("#email").removeClass("is_error");
                        email_right = true;
                    } else {
                        $("#email_info").html('EMAIL &nbsp; &nbsp; &nbsp;<span class="fui-cross-circle" style=" color: #e74c3c;"></span>&nbsp;<b class="is_error">NOT VALID</b>');
                        $("#email").removeClass("is_success");
                        $("#email").addClass("is_error");
                        email_right = false;
                    }
                }
            } else {
                clearTimeout(typingTimer);
                $("#email_info").html('EMAIL <b class="info_guide"></b>');
                $("#email").removeClass("is_success");
                $("#email").removeClass("is_error");
                email_right = false;
            }
        });
    };
});
