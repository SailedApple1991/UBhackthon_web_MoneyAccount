/**
 * Created by Haoyu Guo on 2016/10/25.
 */
define(function(require, exports, module){
    //var config    = require("page/mainpage/config").data;
    var counter = require('util/count_num');
    var $ = require('lib/jquery')
    var tpl = require('util/tpl')
    var config;
    var curdata;
    var current = "";
    var tmpl = {
        main:MAINPAGE.ACCOUNTTABLE,
        table:MAINPAGE.DATATABLE
    }
    exports.init = function(username){
        current = username
        config = counter.get(counter.getdata(current));
        curdata = counter.getdata();
        $('.main_container').html(tpl.get(tmpl.main,{"nlist":config}));
        $('#table-data').html(tpl.get(tmpl.table,{"DATA":config[0].dstname,"numList":config[0].num}))
        _bindEvent();

    };

    /*the combination of needed action function*/
    var actionList={
      "new_bill":function(){
          var name = $('#name').val();
          var namelist=[];
          while(name.indexOf(',')!=-1){
              var temp = name.substring(0,name.indexOf(','));
              namelist.push(temp);
              name = name.substring(name.indexOf(',')+1,name.length);
          }
          if(name!="") {
              namelist.push(name);
          }
          var dataobj = [];
          for (var i =0; i<namelist.length;i++){
              var obj={
                  "Name":namelist[i],
                  "money":"0"
              };
              dataobj.push(obj);
          }
          //cgi here
          
          //....

      },
        "add_bill":function () {
            var pattern = /^[0-9.]+$/;
            /*No Underscore at first and last*/
            var goals = $('#goals').val();
            var user = $('#client').val();
            var count = $('#money_spent').val();
            if(pattern.test(count)){
                for(var i =0; i<curdata.length;i++){
                    if(curdata[i].Name == user){
                        curdata[i].money = (parseFloat(curdata[i].money)+parseFloat(count)).toString();
                    }
                }
                //cgi here

                //.........
                config = counter.get(counter.getdata(current));
                curdata = counter.getdata();
                $('.main_container').html(tpl.get(tmpl.main,{"nlist":config}));
                $('#table-data').html(tpl.get(tmpl.table,{"DATA":config[0].dstname,"numList":config[0].num}))
            }else{
                alert("wrong format number!");
            }
        }
    };
    var dataparse = function(data,index){
        return data[index].dstname;
    };
    var numparse = function(data,index){
        return data[index].num;
    };
    var _bindEvent = function(){
        main_container = $(".main_container");
        main_container.on('click', '[data-action]', function () {
            if($(this).attr("disabled")!="disabled"){
                var actionName = $(this).data('action');
                var action = actionList[actionName];
                var tar = this;
                if ($.isFunction(action)) action(tar);
            }
        })
        main_container.on('change', "#sel-name", function (){
            var val = $(this).val();
            for(var i=0,item;item = config[i];i++) {
                if(item.name==val){
                    $('#table-data').html(tpl.get(tmpl.table,{"DATA":dataparse(config,i),"numList":numparse(config,i)}));
                    break;
                }
            }
        })
    };
});