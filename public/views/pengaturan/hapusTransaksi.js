const Store = require("electron-store");
const toastr = require("toastr");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';

function hapusTransaksi()
{
    w2confirm('Anda ingin  menghapus semua transaksi?')
    .yes(function() { 
        $.post(server_url+"api/action/delete_transaksi/transaksi",function(resp){
            toastr.success("Data berhasil dihapus")
        })

    })


}
function hapusPenjualan()
{
    w2confirm('Anda ingin  menghapus transaksi penjualan?')
    .yes(function() { 
        $.post(server_url+"api/action/delete_transaksi/penjualan",function(resp){
            toastr.success("Data berhasil dihapus")
        })

    })
    
}
function hapusPembelian()
{
    w2confirm('Anda ingin  menghapus transaksi pembelian?')
    .yes(function() { 
        $.post(server_url+"api/action/delete_transaksi/pembelian",function(resp){
            toastr.success("Data berhasil dihapus")
        })

    })
    
}