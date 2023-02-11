function padNum(str, len, pad){
    pad = typeof pad === "undefined" ? "0" : pad + "";
    while(str.length < len){
        str = pad + str;
    }
    return str;
}

function padx(num,len){
    return Array(len + 1 - num.toString().length).join('0') + num;
}