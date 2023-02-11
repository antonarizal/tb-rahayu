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

let months = [
  "Pilih Bulan",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
$("#month").html("");
$("#year").html("");
$.each(months, function (idx, val) {
  $("#month").append(
    $("<option>").text(val).attr("value", idx)
  );
});
let yearNow = (year_now())

for(let thn=yearNow ; thn >= 2018 ; thn--){
  $("#year").append(
    $("<option>").text(thn).attr("value", thn)
  );

}

$("#post").on("submit", function (e) {

  e.preventDefault();
  let month = $("#month").find(":selected").text();
  let year = $("#year").find(":selected").text();

  if ($("#tgl_mulai").val() == "" || $("#tgl_selesai").val() == "") {
    w2alert("Masukkan tanggal mulai dan tanggal selesai!");
    return false;
  }
  $.ajax({
    url: server_url + "api/laporan/tb_penjualan",
    type: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (resp) {
      const total = resp.data
      .map((item) =>numeral(item.salesPrice).value()).reduce((prev, curr) => prev + curr, 0);
      console.log(total)
      $("#laporan > tbody").html("")
      $("#toko").html(`<h5>${resp.options.nama_toko}</h5> ${resp.options.alamat} Telp. ${resp.options.no_telp} <hr>`)
      $("#total").html("Rp." +numeral(total).format("0,0"))
      $("#periode").html(`Periode Bulan ${month} ${year} `)
      $("#tanggal").html(`Tanggal : ${resp.date} ${resp.time}`)
      var i = 1;
      $.each(resp.data, function (idx, val) {
        $("#laporan > tbody").append(`
        <tr>
        <td style="text-align:center">${i}.</td>
        <td>${moment(val.sls_date).format("DD-MM-YYYY")}</td>
        <td>${val.custname}</td>
        <td>${val.carabayar}</td>
        <td><span class="float-right">Rp.${numeral(val.salesPrice).format("0,0")}</span></td>
        </tr>`);

        i++;

      });


    },
    error: function (data) {},
  });
});
function printLaporan(){
  $("#cetak").print();

}