const Store = require("electron-store");
const toastr = require("toastr");
const numeral = require("numeral");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
var base_url = 'http://localhost:3344/';
$("#post").hide()

function importData(){
        $.ajax({
        url: server_url+'api/maintenance/barang',
        type: 'GET',
        contentType: false,
        cache: false,
        processData: false,
        success: function(resp) {
            if(resp.success){
                w2alert("Berhasil")

            }
        },
        error: function(resp) {
            console.log(resp)
        }
    });
}


// $("#get").on('submit', (function(e) {
//     e.preventDefault();
//     $.ajax({
//         url: server_url+'api/maintenance/penjualan',
//         type: 'POST',
//         data: new FormData(this),
//         contentType: false,
//         cache: false,
//         processData: false,
//         success: function(resp) {
//             $("#post").show()

//             $("#faktur").val($("#nfaktur").val())
//             $("#date").val($("#ndate").val())
//             console.log(resp);
//             $("#loadFaktur").html("")
//             $("#loadFaktur").append(`
//             <tr>
//             <td>Faktur</td>
//             <td>Date</td>
//             <td>Total</td>
//         </tr>`)
//             $.each(resp.records, function (idx, val) {
//                 $("#loadFaktur").append('<tr><td>'+val.faktur+' </td><td> '+val.date+'</td><td> '+numeral(val.pemasukan).format("0,0")+'</td></tr>');
//               });
//         },
//         error: function(resp) {
//             console.log(resp)
//         }
//     });

// }))

// $("#post").on('submit', (function(e) {
//     e.preventDefault();
//     $.ajax({
//         url: server_url+'api/maintenance/updatepenjualan',
//         type: 'POST',
//         data: new FormData(this),
//         contentType: false,
//         cache: false,
//         processData: false,
//         success: function(data) {
//             toastr.success(data.message)
//         },
//         error: function(data) {
//             toastr.error(data.message)
//         }
//     });

// }));