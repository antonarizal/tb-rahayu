//https://github.com/mike183/localDB#getting-table-meta-data
var db = new localdb('db_weringin');

console.log(db.exportData('user'));
const Store = require("electron-store");
const moment = require("moment");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
var base_url = 'http://localhost:3344/';
$.get(server_url+"api/options/toko",function(resp){
    $("#nama_toko").html(resp.nama_toko);
    $("#alamat_toko").html(resp.alamat);
    $("#telp").html(resp.no_telp);
    store.set("namaToko",resp.nama_toko)
    store.set("alamat",resp.alamat)
    store.set("telp",resp.no_telp)

})
$.get(server_url+"api/options/cetak",function(resp){
    store.set("footerText",resp.printer_footer_text)

})
console.log(store.get("dbOption"))
// let url = new URL(store.get("server_url"))
let server = store.get("hostName")
if(store.get("license_status") == "ACTIVE"){
    $("#footer").css( "background", "green" );
}
$("#footer").html(`${store.get("appName")}  :: ${store.get("license_status")} :: ${store.get("license_date")} :: <a style="color:yellow" href="http://localhost:3344/views/pengaturan/server">${server}</a>`);
// $("#footer").html(`${store.get("appName")} :: v.${store.get("version")}  :: <a style="color:yellow" href="http://localhost:3344/views/pengaturan/server">${server}</a> `);

$("#login").on('submit', (function(e) {
    var _data = {
        "username": $("#username").val(),
        "password": $("#password").val()
    };
    e.preventDefault();
    // window.location.href = base_url + "admin";
    $.ajax({
        url: server_url + 'api/user/login',
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(response) {
            console.log(response)
            if (response.success) {
                if (!db.tableExists('user')) {
                    console.log('Table user already exists');
                    db.createTable('user');
                }
                db.insert('user', {
                    'username': response.data.username,
                    'level': response.data.level,
                    'user_id': response.data.user_id,
                });
                document.cookie = "isLogin=true";
                store.set('isLogin', true);
                store.set('username', response.data.username);
                store.set('level', response.data.level);

                // document.cookie = "username="+data.username;
                // document.cookie = "user_id="+data.user_id;
                // w2alert(response.message)
                console.log(db.exportData('user'));
                $("#login").hide();
                var text = 'Sukses! Anda berhasil login.<br> Username : '+response.data.username.trim()
                + '<br> Posisi : ' +  response.data.level;
                $("#login-text").html(text);


            } else {
                w2alert(response.message);
                
            }
        },
        error: function(data) {}
    });


}));