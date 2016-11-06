/**
 * Created by gmyth on 16/11/5.
 */
define("util/count_num", [], function(require, exports, module) {
    exports.getdata = function() {
        data = {
            expence: [ {
                Name: "David",
                money: "9.5"
            }, {
                Name: "Wang",
                money: "18.87"
            }, {
                Name: "Dave",
                money: "30.23"
            } ],
            person: "3",
            event: "dining"
        };
        json = data.expence;
        return json;
    };
    exports.get = function(json) {
        var output = [];
        var eachone = new Array();
        for (var i = 0; i < json.length; i++) {
            if (!!eachone[json[i].Name]) {
                eachone[json[i].Name] = eachone[json[i].Name] + parseFloat(json[i].money);
            } else {
                eachone[json[i].Name] = parseFloat(json[i].money);
            }
        }
        for (var key in eachone) {
            eachone[key] = eachone[key] / parseInt(data.person);
            eachone[key] = eachone[key].toString();
        }
        //console.log(eachone);
        for (var key in eachone) {
            var tem = {};
            tem["name"] = key;
            d = [];
            n = [];
            for (var x in eachone) {
                if (x != key) {
                    d.push(x);
                    n.push(eachone[key] - eachone[x]);
                }
            }
            tem["dstname"] = d;
            tem["num"] = n;
            tem["event"] = data.event;
            output.push(tem);
        }
        return output;
    };
});
