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
