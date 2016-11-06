/**
 * Created by dylanwang on 16/11/5.
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var billing_event = new mongoose.Schema({
    event: String,
    expense:[{Name:String,money:String}],
    user:[{
      type:ObjectId,
       ref:'hacthon_user'
      }],


},{collection:'billing'});

billing_event.pre('save', function (next) {

    var user = this;

    next()
});

var Billing = mongoose.model('Blling', billing_event);

module.exports = Billing;
