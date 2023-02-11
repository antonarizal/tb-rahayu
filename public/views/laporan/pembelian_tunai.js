const numeral = require("numeral");
const moment = require("moment");
const Store = require("electron-store");
const { ajax } = require("jquery");
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
const host = store.get("base_url") + "views";
var db = new localdb("db_weringin");
var isUserLogin = db.tableExists("user");
if (!isUserLogin) {
  window.location.href = host + "/home/unauthorized";
} else {
  var user = db.findById("user", 1);
  console.log(user);
}

$("#post").on("submit", function (e) {
  e.preventDefault();

  if ($("#tgl_mulai").val() == "" || $("#tgl_selesai").val() == "") {
    w2alert("Masukkan tanggal mulai dan tanggal selesai!");
    return false;
  }
  $.ajax({
    url: server_url + "api/laporan/pembelian/tunai",
    type: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (resp) {
      $("#laporan > tbody").html("")
      $("#toko").html(`<h5>${resp.options.nama_toko}</h5> ${resp.options.alamat} Telp. ${resp.options.no_telp} <hr>`)
      $("#total").html("Rp. "+numeral(resp.total).format("0,0"))
      $("#periode").html(`Periode : ${moment(resp.request.tgl_mulai).format("DD/MM/YYYY")}  - ${moment(resp.request.tgl_selesai).format("DD/MM/YYYY")} `)
      $("#tanggal").html(`Tanggal : ${resp.date} ${resp.time}`)
      var i = 1;
      $.each(resp.data, function (idx, val) {
        $("#laporan > tbody").append(`<tr><td style="text-align:center">${i}.</td><td>${moment(val.date).format("DD-MM-YYYY")}</td><td>${val.faktur}</td><td>${val.nama_pelanggan}</td><td> <psan class="float-right">Rp.${numeral(val.pemasukan).format("0,0")}</span></td></tr>`);

        i++;

      });


    },
    error: function (data) {},
  });
});
function printLaporan(){
  $("#cetak").print();

}
