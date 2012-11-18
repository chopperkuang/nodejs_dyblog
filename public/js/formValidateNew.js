var regD = /^\d+$/;
var regEnD = /^[a-zA-Z0-9]*$/;
var regIDCard = /^[a-zA-Z0-9-\(\)]*$/;
var regIDCardL = /(^\d{17}[xX\d]{1})$|(^\d{15})$/;
var regTel = /^[\d-]+$/;
var regCellPhone = /^1[3|4|5|8][0-9]\d{8}$/;
var regSum1 = /^\d+(\.\d{1})?$/;
var regSum2 = /^\d+(\.\d{1,2})?$/;
var regSum3 = /^\d+(\.\d{1,3})?$/;
var regSum4 = /^\d+(\.\d{1,4})?$/;
var regSum6 = /^\d+(\.\d{1,6})?$/;
var regDate = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
var regUrl = /^((https|http|ftp|rtsp|mms)?:\/\/)?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*\'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+\/?)$/;
var regMail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
var isBinding = false;

function checkForm() {
    if (!isBinding) {
        $.each(arrElement, function(i, n) {
            var obj = $("[name=" + n[0] + "]");
			var evt = getBindEvtType(n[1]);
			if (evt != 'hidden') {
				obj.bind(evt, 
				function() {
					checkElement(n[0], n[1], n[2], n[3], n[4])
				})
			}
        });
        isBinding = true
    }
    return checkFm();
}

var firstErr;
function checkFm() {
    var isFormValid = true;
    firstErr = null;
    $.each(arrElement, function(i, n) {
        if (n[3] == "sub" && $("[name=" + n[0] + "]").parents(".subs").eq(0).css("display") == "none") {
            return true
        }
        if (n[3] == "sub" && $("[name=" + n[0] + "]").parents(".subs").eq(0).parents("tr").eq(0).css("display") == "none") {
            return true
        }
        if (n[3] == "role" && $("[name=" + n[0] + "]").parents("tr").eq(0).css("display") == "none") {
            return true
        } else {
            var isValid = checkElement(n[0], n[1], n[2], n[4], n[5]);
            
            if (!isValid) {
                isFormValid = false
            }
        }
    });
    if (isFormValid) return true;
    else {
        var errPos = firstErr.parents("tr").eq(0).offset().top;
        $("html, body").scrollTop(errPos);
        return false
    }
}

function checkElement(obj, type, arrCond, focusObj, callback) {
    var obj = $("[name=" + obj + "]");
    var focusObj = $("#" + focusObj);
    switch (type) {
    case 'text':
    case 'date':
    case 'select':
        var focusOn = obj;
        break;
    case 'hidden':
        var focusOn = focusObj;
        break;
    case 'radio':
    case 'checkbox':
        var focusOn = obj.eq(0);
        break
    }
    var callback = callback ? callback: null;
    var isValid = true;
    for (var i = 0; i < arrCond.length; i++) {
        if (eval(arrCond[i][0])) {
            setErrMsg(obj, arrCond[i][1]);
            isValid = false;
            if (firstErr == null) firstErr = focusOn;
            return false
        }
    }
    if (isValid) {
        clearErrMsg(obj)
    }
    if (callback) callback;
    return true
}

function getBindEvtType(type) {
    switch (type) {
    case 'text':
        return "blur";
    case 'date':
    case 'select':
        return "change";
    case 'hidden':
        return "hidden";
    case 'radio':
    case 'checkbox':
        return "click"
    }
}

function setErrMsg(obj, msg) {
    obj.parents("td").eq(0).find(".ErrMsgNew").remove();
    obj.parents("td").eq(0).prepend('<p class="ErrMsgNew">' + msg + '</p>')
}
function clearErrMsg(obj) {
	window.setTimeout(function(){
		obj.parents("td").eq(0).find(".ErrMsgNew").remove();
	}, 200);
}