/**
 *	config.js
 *	author：liamhuang
 *	date：20150720
 *
 **/
define("page/controller/config", [], function(require, exports, module) {
    exports.map = {
        flow: "page/flow/index"
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
        require.async(tabMap["flow"], function(index) {
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
