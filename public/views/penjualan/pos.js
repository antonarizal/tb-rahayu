const Store = require("electron-store");
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
var api_url = server_url + "api/product/retail";
const styleGrid = "border: 1px solid #ccc;font-size:16px!important;";
const styleGridRight = styleGrid + "text-align:right;";
const numeral = require("numeral");
const host = store.get("base_url") + "views";
var db = new localdb("db_weringin");
var isUserLogin = db.tableExists("user");
if (!isUserLogin) {
  window.location.href = host + "/home/unauthorized";
} else {
  var user = db.findById("user", 1);
  console.log(user);
}

// var api_url = 'http://192.168.1.5:7038/api/';
const tbTransaksi = "transaksi";
const sum = 0;
$("#subtotal").val(numeral(sum).format("0,0"));
var dataProduct = []; // create "null" object (same as before)
var dataFaktur = []; // create "null" object (same as before)
$("#kode_barang").focus();

// dataProduct.push(product2);
// console.log(dataProduct);
// const found = dataProduct.find(element => element.barcode = "1234");
// console.log('Ditemukan : ');
// console.log(found);
// found.price = 10000;
// console.log(found);
// dataProduct.forEach(x => x.notrx = "123");
// console.log(dataProduct);
// console.log(db.exportData('kasir'));

var today = new Date();

var db = new localdb("db_weringin");
if (!db.tableExists(tbTransaksi)) {
  db.createTable(tbTransaksi);
}

var results = db.find(tbTransaksi, { date: date_format(today) });
if (results.length < 1) {
  db.insert(tbTransaksi, {
    date: date_format(today),
    number: 1,
  });
  noTrx = 1;
} else {
  noTrx = results[0].number;
}

// console.log(noTrx);
// console.log(db.exportData(tbTransaksi));
var fakturTrx = "PJ." + form_ymdHis(today);
$("#faktur").val(fakturTrx);
$("#notrx").html(fakturTrx);

$.get(server_url + "api/options/toko", function (resp) {
  $("#nama_toko").html(resp.nama_toko);
  $("#alamat_toko").html(resp.alamat);
  $("#telp").html("TELP. " + resp.no_telp);
  $("#top_kasir").show();
  $("#kasir_header").html("Point Of Sale");
  $("#version").html(store.get("version"));
  // $("#kota").html(kota);
});

$("#user").html(user.username);
$("#user_id").val(user.user_id);
$("#date").val(date_now());
setInterval(function () {
  $("#tanggal").html(tanggal("tanggal_kasir"));
}, 100);

var base_url = base_url;
var api_url = server_url + "kasir/api/";
var barang_url = server_url + "barang/api/all/";

function loadData() {
  $("#kode_barang").focus();
}
var name = "grid_box";
var config2 = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: "Kasir Penjualan",
    // url: api_url + "/all",
    method: "GET",
    reorderRows: false,
    autoLoad: true,
    show: {
      header: false,
      toolbar: false,
      footer: false,
      toolbarReload: false,
      toolbarAdd: false,
      toolbarDelete: true,
      toolbarSave: true,
      toolbarEdit: false,
      lineNumbers: true,
      selectColumn: false,
      toolbarSearch: false,
    },
    limit: 20,
    multiSearch: false,
    style: "font-size:18px!important",
    toolbar: {
      items: [],
      onLoad: function (event) {},
      onClick: function (event) {
        switch (event.target) {
          case "import":
            var id = w2ui[name].getSelection();
            console.log(id);
        }
      },
    },
    columns: [
      {
        field: "kode_barang",
        text: '<span class="table-header">BARCODE</span>',
        size: "8%",
        sortable: true,
        style: styleGrid

      },
      {
        field: "nama_barang",
        text: '<span class="table-header">NAMA BARANG</span>',
        size: "30%",
        sortable: true,
        style: styleGrid

      },
      {
        field: "harga_jual",
        text: '<span class="table-header">HARGA</span>',
        size: "120px",
        style: "text-align:right",
        render(record, extra) {
          var html = record.jenis == 'xxx' ? numeral(record.harga_jual).format("0,0") : '<input type="text" style="width:100%;text-align:right;font-size:16px" class="form-control-sm form-cart" id="harga_' +
          record.recid +
          '" onChange="changeHarga(\'' +
          record.recid +
          '\')" value="' +
          numeral(record.harga_jual).format('0,0') +
          '">';
          return html;
        },
        style: styleGridRight

      },
      {
        field: "qty",
        text: '<span class="table-header">QTY</span>',
        size: "80px",
        render(record, extra) {
          var html = 
            '<input type="number" style="width:60px;font-size:16px" class="form-control-sm form-cart" id="qty_' +
            record.recid +
            '" onChange="changeQty(\'' +
            record.recid +
            '\')" value="' +
            record.qty +
            '">';

          return html;
        },
        style: styleGrid

      },
      // {
      //   field: "disc",
      //   text: '<span class="table-header">DISC(%)</span>',
      //   size: "100px",
      //   render(record, extra) {
      //     var html = record.jenis == 'jasa' ? record.disc :
      //       '<input min=0 max=100 type="number" style="width:60px" class="form-control-sm form-cart" id="disc_' +
      //       record.recid +
      //       '" onChange="discPercent(\'' +
      //       record.recid +
      //       '\')" value="' +
      //       record.disc +
      //       '">';

      //     return html;
      //   },
      // },
      // {
      //   field: "diskon",
      //   text: '<span class="table-header">DISC(RP.)</span>',
      //   size: "100px",
      //   render(record, extra) {
      //     var html = record.jenis == 'jasa' ? record.diskon :
      //       '<input type="number" style="width:90px;text-align:right" class="form-control-sm form-cart" id="diskon_' +
      //       record.recid +
      //       '" onChange="discRp(\'' +
      //       record.recid +
      //       '\')" value="' +
      //       record.diskon +
      //       '">';

      //     return html;
      //   },
      // },
      {
        field: "amount",
        text: '<span class="table-header">JUMLAH</span>',
        size: "120px",
        style: "text-align:right",
        render(record, extra) {
          var html = "Rp." + numeral(record.amount).format("0,0");

          return html;
        },
        style: styleGridRight

      },
      {
        field: "hapus",
        text: '<span class="table-header">DEL</span>',
        size: "60px",
        render(record, extra) {
          var html =
            '<span class="text-center full-width" style="text-align:center"><a href="javascript:deleteCart(' +
            record.recid +
            ')" class="w2ui-btn text-sm text-center"><i class="fa fa-times"></i></a></span>';
          return html;
          console.log(recid);
        },
        style: styleGrid

      },
    ],

    onAdd: function (event) {
      add();
    },
    onEdit: function (event) {
      var id = w2ui[name].getSelection();
      console.log(id);
      edit(id);
    },
    onDelete: function (event) {
      var id = w2ui[name].getSelection();
      console.log(id);
      loadData();
    },
    onSave: function (event) {
      var id = w2ui[name].getSelection();
      console.log(id);
      loadData();
    },
  },
};

$(function () {
  $("#barcode").focus();
  $("#grid").w2grid(config2.grid);
  // w2ui[name].add(kasir.rows);
  loadCart();
  loadData();
});

$("#disc").click(function () {
  $(this).select();
});
$("#diskon").click(function () {
  $(this).select();
});
$("#bayar").click(function () {
  $(this).select();
});

shortcut.add("f1", function () {
  $("#kode_barang").focus();
  $("#kode_barang").select();
});

shortcut.add("esc", function () {
  $("#kode_barang").focus();
});

shortcut.add("f3", function () {
  openBarang();
});
shortcut.add("f4", function () {
  openJasa();
});
shortcut.add("f6", function () {
  batal();
});
shortcut.add("f8", function () {
  lunasi();
});
shortcut.add("f9", function () {
  selesai();
});

// shortcut.add("f7", function () {
//   simpanTrx();
// });

shortcut.add("f12", function () {
  $("#bayar").focus();
});

$("#kredit").click(function () {
  $("#tempo").prop("disabled", false);
  $("#tempo").val("");
});
$("#tunai").click(function () {
  $("#tempo").prop("disabled", true);
  $("#tempo").val("");
});

function openModal() {
  // $("#modal-lg").modal("show")
  w2popup.open({
    title: "RE-PRINT PENJUALAN POS",
    body: '<div class="w2ui-centered">This is text inside the popup</div>',
  });
}

function reset() {
  w2ui[name].clear();
  w2ui[name].refresh();
  dataProduct = [];
  $("#subtotal").val(0);
  $("#kode_barang").focus();
}

function disc(input) {
  var disc = input.value;
  var subtotal = numeral($("#subtotal").val()).value();
  var diskon = (disc / 100) * subtotal;
  var grandtotal = subtotal - diskon;
  $("#diskon").val(numeral(diskon).format("0,0"));
  $("#grandtotal").val(numeral(grandtotal).format("0,0"));
  console.log(diskon);
}
function diskon(input) {
  var diskon = numeral(input.value).value();
  var ongkos = numeral($("#ongkos").val()).value();
  var subtotal = numeral($("#subtotal").val()).value();
  var grandtotal = subtotal - diskon + ongkos;
  $("#disc").val("0");
  $("#diskon").val(numeral(diskon).format("0,0"));
  $("#grandtotal").val(numeral(grandtotal).format("0,0"));
  console.log(subtotal);
  console.log(ongkos);
  console.log(diskon);
  console.log(grandtotal);
}
function ongkos(input) {
  var diskon = numeral($("#diskon").val()).value();
  var ongkos = numeral(input.value).value();
  var subtotal = numeral($("#subtotal").val()).value();
  var grandtotal = subtotal - diskon + ongkos;

  $("#disc").val("0");
  $("#ongkos").val(numeral(ongkos).format("0,0"));
  $("#grandtotal").val(numeral(grandtotal).format("0,0"));
  console.log(grandtotal);
}
function subtotal() {
  const subtotal = dataProduct
    .map((item) => item.amount)
    .reduce((prev, curr) => prev + curr, 0);
  $("#subtotal").val(numeral(subtotal).format("0,0"));
  $("#subtotal2").val(numeral(subtotal).format("0,0"));
  $("#grandtotal").val(numeral(subtotal).format("0,0"));
  $("#kode_barang").val("");
  // $("#kode_barang").focus();
  return subtotal;
}

function selesai() {
  if($("#pembayaran").val() == "Hutang"){
    if($("#pelanggan_id").val() == 0){
      w2alert("Pilih nama pelanggan");
      return false;
    }
  }

  $("#modal-bayar").modal("show");
  $("#dibayar").val(0);
  $("#kembali").val(0);
  $("#disc").val(0);
  $("#diskon").val(0);
  $("#ongkos").val(0);
  subtotal();

  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    if (timesRun === 2) {
      clearInterval(interval);
    }
    $("#dibayar").select();
    $("#dibayar").focus();
  }, 100);
}

function klikBayar()
{
  var grandtotal = numeral($("#grandtotal").val()).value();
  var dibayar = numeral($("#dibayar").val()).value();
  if(dibayar < grandtotal){
    w2confirm('Pembayaran Anda kurang.<br>Apakah Anda ingin menyimpan transaksi?')
    .yes(function() { 
      simpanTrx()
    })
    .no(function(){
      $("#dibayar").focus()
    })

  }else{
    simpanTrx()
  }

}
function dibayar(input) {
  if (event.key === "Enter") {
    var grandtotal = numeral($("#grandtotal").val()).value();
    var dibayar = numeral(input.value).value();
    if(dibayar < grandtotal){
      w2confirm('Pembayaran Anda kurang.<br>Apakah Anda ingin menyimpan transaksi?')
      .yes(function() { 
        simpanTrx()
      })
      .no(function(){
        $("#dibayar").focus()
      })
    }else{
      simpanTrx()
    }

  } else {
    var grandtotal = numeral($("#grandtotal").val()).value();
    var dibayar = numeral(input.value).value();
    var kembali = dibayar - grandtotal;
    $(input).val(numeral(dibayar).format("0,0"));
    $("#kembali").val(numeral(kembali).format("0,0"));
  }
}

function lunasi()
{
  var grandtotal = numeral($("#grandtotal").val()).value();
  var dibayar = numeral(grandtotal).value();
  var kembali = dibayar - grandtotal;
  $("#dibayar").val(numeral(dibayar).format("0,0"));
  $("#kembali").val(numeral(kembali).format("0,0"));
}

//[tbDtlPjlPOS] [tbHdrPjlPOS] [tbLogDtlPjlPOS]
