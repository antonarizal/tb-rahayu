const Store = require("electron-store");
const toastr = require("toastr");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
var base_url = 'http://localhost:3344/';
$.get(server_url+"api/options/toko",function(resp){
    $("input[name='nama_toko").val(resp.nama_toko);
    $("textarea[name='alamat']").val(resp.alamat);
    $("input[name='no_telp']").val(resp.no_telp);
    // $("#kota").html(config.kota);
})

$("#post").on('submit', (function(e) {
    e.preventDefault();
    $.ajax({
        url: server_url+'api/options/save',
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            toastr.success(data.message)
        },
        error: function(data) {
            toastr.error(data.message)
        }
    });

}));