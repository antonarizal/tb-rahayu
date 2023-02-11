
function simpanTrx()
{
  const terjual = dataProduct
  .map((item) => item.jenis !="jasa" ? item.qty : 0)
  .reduce((prev, curr) => prev + curr, 0);
const total_hpp = dataProduct
  .map((item) => item.total_hpp)
  .reduce((prev, curr) => prev + curr, 0);
const grandtotal = numeral($("#grandtotal").val()).value();
const laba_rugi = grandtotal - total_hpp;
const hutang_dibayar = numeral($("#dibayar").val()).value()
const hutang_sisa = numeral($("#grandtotal").val()).value() - numeral($("#dibayar").val()).value()
var insert = {
  total: numeral($("#subtotal2").val()).value(),
  ongkos: numeral($("#ongkos").val()).value(),
  grand_total: grandtotal,
  pemasukan: grandtotal,
  dibayar: numeral($("#dibayar").val()).value(),
  kembali: numeral($("#kembali").val()).value(),
  pelanggan_id: $("#pelanggan_id").val(),
  date: $("#date").val(),
  tempo: $("#tempo").val(),
  disc: $("#disc").val(),
  diskon: numeral($("#diskon").val()).value(),
  faktur: $("#faktur").val(),
  mode: "penjualan",
  pembayaran: $("#pembayaran").val(),
  hutang : $("#pembayaran").val() == "Hutang" ?  grandtotal : 0,
  hutang_dibayar : $("#pembayaran").val() == "Hutang" ?  hutang_dibayar : 0,
  hutang_sisa : $("#pembayaran").val() == "Hutang" ? hutang_sisa : 0,
  user_id: user.user_id,
  terjual: terjual,
  total_hpp: total_hpp,
  laba_rugi: laba_rugi,
  keterangan: "Penjualan " + $("#faktur").val(),
};
dataFaktur = {
  meta : insert,
  pelanggan : $("#nama_pelanggan").val(),
  listBarang : dataProduct
}
let nota = getNota(dataFaktur)
store.set("cetakNotaPOS",nota)
console.log(nota)

$.post(
  server_url + "api/kasir/insert",
  {
    data: dataProduct,
    insert: insert,
  },
  function (resp) {
    console.log(resp);
    $("#modal-bayar").modal("hide");
    popupSelesai(
      numeral($("#kembali").val()).format('0,0'),
      $("#faktur").val(),
      "barang"
    );

    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      var todayNew = new Date();
      var fakturTrxNew = "PJ." + form_ymdHis(todayNew);
      $("#nama_pelanggan").val("");
      $("#pelanggan_id").val(0);
      $("#faktur").val(fakturTrxNew);
      $("#notrx").html(fakturTrxNew);
      console
    }, 100);
  }
);
}


function popupSelesai(kembali) {
  reset();
  w2popup.open({
    title: "Kembalian",
    body:
      '<div class="w2ui-centered" ><span style="font-size:30px">Rp.' +
      kembali +
      "</span></div>",
    buttons:
      '<button class="w2ui-btn" onclick="cetakNota();">Cetak</button> ' +
      '<button class="w2ui-btn" onclick="w2popup.close();">Tutup</button>',
    width: 500,
    height: 200,
    overflow: "hidden",
    color: "#000",
    opacity: "0.8",
    modal: true,
    showClose: true,
    showMax: false,
    onOpen(event) {
      console.log("open");
    },
    onClose(event) {
      console.log("close");
      $("#kode_barang").focus();
    },
  });
}


function cetakNota() {
  // $('#ifrmPrint').attr('src', "http://localhost:3344/cetakNotaPOS")
  window.open("http://localhost:3344/cetakNotaPOS","cetakNotaPOS");

}
