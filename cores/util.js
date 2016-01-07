/**
 * @author Phuluong
 * May 13, 2015 5:02:26 PM
 */

/** Exports **/
module.exports = new Util();
/** Classes **/
Array.prototype.unique = function () {
    var retval = this.concat();
    for (var i = 0; i < retval.length; ++i) {
        for (var j = i + 1; j < retval.length; ++j) {
            if (retval[i] === retval[j])
                retval.splice(j--, 1);
        }
    }
    return retval;
};
Array.prototype.remove = function (items) {
    var retval = this.concat();
    for (var i = 0; i < items.length; ++i) {
        for (var j = 0; j < retval.length; ++j) {
            if (items[i] === retval[j]) {
                retval.splice(j, 1);
            }
        }
    }
    return retval;
};
function Util() {
    this.now = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : "0" + month;
        var day = date.getDate().toString();
        day = day.length > 1 ? day : "0" + day;
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
    };
    this.log = function (message, option) {
        if (option != null) {
            if (option.timeDisp) {
                console.log(this.now() + ": " + message);
            }
        } else {
            console.log(message);
        }
    };
    this.parseObjectToRequestURL = function (obj) {
        var retval = "";
        var index = 0;
        for (var property in obj) {
            retval += (index == 0 ? "" : "&") + property + "=" + obj[property];
            index++;
        }
        return retval;
    };
}
;