/**
 * Created by Haoyu Guo on 2016/9/3.
 */
define(function(require, exports, module){
    var tabMap    = require("page/controller/config").map;
    var $ = require("lib/jquery");
    var curTab    = "flow";
    /*从url获取tab信息*/
    var getTabFromHash=function(){
        var tempurl=location.hash;
        var hash;
        hash=(!location.hash)?"#metric":location.hash;
        return hash.substring(1,hash.length);
    }

    //init function to start load js
    exports.init = function( username ){
        // for the tab part may need in future
        // curTab = getTabFromHash();
        // curUser   = username;
        // curNs     = namespace||"";
        // var target    = tabMap[ curTab ];
        // require.async( target , function( index ){
        //     index.init();
        // });
        require.async( tabMap["flow"] , function( index ){
            index.init(username);
        });
        $('#logout').click(function () {
            // $.ajax({
            //     method: "GET",
            //     url: "./logout",
            // }).done(function(){location.href="http://localhost:3000/login.html"});
        })
    };
});