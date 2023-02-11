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
var fakturTrx = "PB." + form_ymdHis(today);
$("#faktur").val("");
$("#notrx").html("");

$.get(server_url + "api/options/toko", function (resp) {
  $("#nama_toko").html(resp.nama_toko);
  $("#alamat_toko").html(resp.alamat);
  $("#telp").html("TELP. " + resp.no_telp);
  $("#top_kasir").show();
  $("#kasir_header").html("Pembelian Barang");
  $("#version").html(store.get("version"));
  // $("#kota").html(kota);
});

$("#user").html(user.username);
$("#user_id").val(user.user_id);
$("#date, #tempo").val(date_now());
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
        style: styleGrid,

      },
      {
        field: "nama_barang",
        text: '<span class="table-header">NAMA BARANG</span>',
        size: "30%",
        sortable: true,
        style: styleGrid,

      },
      
      {
        field: "harga_beli",
        text: '<span class="table-header">HARGA BELI</span>',
        size: "120px",
        style: "text-align:right",
        render(record, extra) {
          var html = record.jenis == 'barang' ? numeral(record.harga_beli).format("0,0") : '<input type="text" style="width:100%;text-align:right" class="form-control-sm form-cart" id="harga_' +
          record.recid +
          '" onChange="changeHarga(\'' +
          record.recid +
          '\')" value="' +
          numeral(record.harga_beli).format('0,0') +
          '">';
          return html;
        },
        style: styleGrid,

      },
      {
        field: "qty",
        text: '<span class="table-header">QTY</span>',
        size: "80px",
        render(record, extra) {
          var html = record.jenis == 'jasa' ? record.qty :
            '<input type="number" style="width:60px" class="form-control-sm form-cart" id="qty_' +
            record.recid +
            '" onChange="changeQty(\'' +
            record.recid +
            '\')" value="' +
            record.qty +
            '">';

          return html;
        },
        style: styleGrid,

      },
      {
        field: "amount",
        text: '<span class="table-header">JUMLAH</span>',
        size: "120px",
        style: styleGridRight,
        render(record, extra) {
          var html = "Rp." + numeral(record.amount).format("0,0");

          return html;
        },
      },
      {
        field: "hapus",
        text: '<span class="table-header">DEL</span>',
        size: "60px",
        render(record, extra) {
          var html =
            '<span class="text-center full-width"><a href="javascript:deleteCart(' +
            record.recid +
            ')" class="w2ui-btn text-sm text-center"><i class="fa fa-times"></i></a></span>';
          return html;
          console.log(recid);
        },
        style: styleGrid,

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

$("#inputCart").on("submit", function (e) {
  e.preventDefault();
  //javascript split
  var barcode = $("#kode_barang").serializeArray();
  barcode = barcode[0].value.split("x");
  console.log(barcode);
  if (barcode.length > 1) {
    var qty = barcode[0];
    var barcode = barcode[1];
  } else {
    var qty = 1;
    var barcode = barcode[0];
  }
  if (barcode == "") {
    // $("#modal-bayar").modal("show");
    // return false;
  }
  $.get(server_url + "api/product/barcode/" + barcode, function (data) {
    //115000604000
    //0222010006
    console.log(data);
    if (data.success) {
      addCart(data.data, qty);
    } else {
      // toastr.info(data.message);
      openBarang();
    }
  });
});

function addCart(row, qty = 1) {
  var qty = parseInt(qty);
  var g = w2ui[name].records.length;
  var found = dataProduct.findIndex(
    (el) => el.kode_barang.trim() === row.kode_barang.trim()
  );
  if (found === -1) {
    var cart = {
      recid: g + 1,
      id_barang: row.id,
      kode_barang: row.kode_barang,
      nama_barang: row.nama_barang,
      harga_beli: row.harga_beli,
      harga: row.harga_beli,
      qty: qty,
      status: 0,
      amount: qty * row.harga_beli,
      total: qty * row.harga_beli,
      satuan: row.satuan,
      faktur: $("#faktur").val(),
      date: $("#date").val(),
      user_id: $("#user_id").val(),
    };
    w2ui[name].add(cart);
    dataProduct.push(cart);
    console.log(dataProduct);
    var i = 1;
    dataProduct.forEach((el) => {
      el.recid = i;
      i++;
    });
  } else {
    dataProduct.forEach((el) => {
      if (el.kode_barang == row.kode_barang.trim()) {

        el.qty = el.qty + qty;
        el.amount = el.qty * row.harga_beli;
      }
    });
  }
  console.log(found);
  console.log(dataProduct);
  w2popup.close();
  w2ui[name].refresh();
  subtotal();
  loadData();
}

function pendingCart() {
  // url: api_url+ '/add_cart/',
  $.post(api_url + "/pending_cart/", function (resp) {
    if (resp.success) {
      loadData();
      w2ui[name].reload();
      w2alert("Transaksi telah dipending dan masuk ke antrian");
    } else {
      w2alert("Gagal");
    }
  });
}

function loadCart() {
  var rec = dataProduct;
  $.each(rec, function (i, val) {
    w2ui[name].add(val);
  });
}

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

shortcut.add("f2", function () {
  $("#cari_barang").focus();
});

shortcut.add("f3", function () {
  openBarang();
});
shortcut.add("f6", function () {
  batal();
});
shortcut.add("f9", function () {
  selesai();
});

shortcut.add("f7", function () {
  simpanTrx();
});

shortcut.add("f12", function () {
  $("#bayar").focus();
});

function deleteCart(id) {
  w2ui[name].reload();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      dataProduct.splice(dataProduct.indexOf(el), 1);
    }
  });
  console.log(dataProduct);
  w2ui[name].remove(id);
  w2ui[name].refresh();
  loadData();
  subtotal();
}

function discPercent(id) {
  var disc = numeral($("#disc_" + id).val()).value();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      // dataProduct.splice(dataProduct.indexOf(el), 1);
      var diskon = (disc / 100) * el.harga;
      el.disc = disc;
      el.diskon = numeral(diskon).value();
      el.total = el.qty * el.harga - el.qty * diskon;
      el.amount = el.qty * el.harga - el.qty * diskon;
      console.log(diskon);
    }
  });
  console.log(dataProduct);
  w2ui[name].refresh();
  w2ui[name].reload();
  loadData();
  subtotal();
  // $("#diskon_"+id).focus()
}
function discRp(id) {
  var diskon = numeral($("#diskon_" + id).val()).value();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      // dataProduct.splice(dataProduct.indexOf(el), 1);
      el.diskon = diskon;
      el.disc = 0;
      el.total = el.qty * el.harga - el.qty * diskon;
      el.amount = el.qty * el.harga - el.qty * diskon;
    }
  });
  console.log(id);
  console.log($("#diskon_" + id).val());
  console.log(dataProduct);
  w2ui[name].refresh();
  w2ui[name].reload();
  subtotal();
  loadData();
  $("#disc_" + id).val(0);
}

$("#kredit").click(function () {
  $("#tempo").prop("disabled", false);
  $("#tempo").val("");
});
$("#tunai").click(function () {
  $("#tempo").prop("disabled", true);
  $("#tempo").val("");
});

function changeQty(id) {
  var qty = numeral($("#qty_" + id).val()).value();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      // dataProduct.splice(dataProduct.indexOf(el), 1);
      el.disc = 0;
      el.diskon = 0;
      el.qty = qty;
      el.total = qty * el.harga;
      el.amount = qty * el.harga;
    }
  });
  console.log(id);
  console.log($("#diskon_" + id).val());
  console.log(dataProduct);
  w2ui[name].refresh();
  w2ui[name].reload();
  subtotal();
  loadData();
  $("#disc_" + id).val(0);
  $("#diskon_" + id).val(0);
}

function changeHarga(id) {
  var harga = numeral($("#harga_" + id).val()).value();
  var qty = numeral($("#qty_" + id).val()).value();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      // dataProduct.splice(dataProduct.indexOf(el), 1);
      el.harga = harga;
      el.harga_beli = harga;
      el.amount = harga*qty;
      el.total = harga*qty;
    }
  });
  $("#harga_" + id).val(numeral(harga).format('0,0'))
  w2ui[name].refresh();
  w2ui[name].reload();
  subtotal();
  loadData();
}

function popupSelesai(kembali, faktur, type) {
  reset();
  w2popup.open({
    title: "Success",
    body:
      '<div class="w2ui-centered" ><span style="font-size:20px">Transaksi Pembelian Berhasil</span></div>',
    buttons:
      '<button class="w2ui-btn" onclick="cetakNota(\'' +
      faktur +
      "','" +
      type +
      "'); \">Cetak</button> " +
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
    onMax(event) {
      console.log("max");
    },
    onMin(event) {
      console.log("min");
    },
    onKeydown(event) {
      console.log("keydown");
    },
  });
}

function cetakNota(faktur, type) {
  // $("#frame").attr(
  //   "src",
  //   server_url + "api/cetak/print/?type=58mm&faktur=" + faktur
  // );
  console.log(server_url + "api/cetak/print/?type=58mm&faktur=" + faktur);
  $.get(server_url + "api/cetak/print/?type=58mm&faktur=" + faktur,function(resp){
    // var printWindow=window.open();
    // printWindow.document.open('text/plain')
    // printWindow.document.write(resp.data);
    // printWindow.document.close()
    // printWindow.focus()
    // printWindow.print()
    try{
      var oIframe = document.getElementById('ifrmPrint');
      var oContent = resp.data;
      var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
      if (oDoc.document) oDoc = oDoc.document;
      oDoc.write('<head><title>title</title>');
      oDoc.write('</head><body onload="this.focus(); this.print();">');
      oDoc.write('<pre>'+oContent + '</pre></body>');
      oDoc.close();
        w2popup.close()

    } catch(e){
      self.print();
    }

  })
}

function openModal() {
  // $("#modal-lg").modal("show")
  w2popup.open({
    title: "RE-PRINT PENJUALAN POS",
    body: '<div class="w2ui-centered">This is text inside the popup</div>',
  });
}
function simpanTrx() {
  w2popup.open({
    title: "Konfirmasi",
    body: '<div class="w2ui-centered" ><span>Simpan Data Penjualan?</span></div>',
    buttons:
      '<button class="w2ui-btn" onclick="cetakNota(); ">Ya</button> ' +
      '<button class="w2ui-btn" onclick="w2popup.close();">Tidak</button>',
    width: 350,
    height: 200,
    overflow: "hidden",
    color: "#000",
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
  var subtotal = numeral($("#subtotal").val()).value();
  var grandtotal = subtotal - diskon;
  $("#disc").val("0");
  $("#diskon").val(numeral(diskon).format("0,0"));
  $("#grandtotal").val(numeral(grandtotal).format("0,0"));
  console.log(diskon);
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
  if($("#pembayaran").val() == "kredit"){
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

function dibayar() {
 const supplier_id = $("#supplier_id").val()
 if(supplier_id == 0){
  w2alert("Pilih Supplier terlebih dahulu!").ok(()=>{
    
  })
  return false;

 } 
 if($("#faktur").val() == ""){
  w2alert("Masukkan Faktur terlebih dahulu!").ok(()=>{
    
  })
  return false;

 }
  const terjual = dataProduct
  .map((item) => item.qty)
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
  keterangan: $("#keterangan").val(),
  grand_total: grandtotal,
  pengeluaran: grandtotal,
  dibayar: grandtotal,
  kembali: 0,
  supplier_id: $("#supplier_id").val(),
  idsupp: $("#idsupp").val(),
  date: $("#date").val(),
  tempo: $("#tempo").val(),
  disc: $("#disc").val(),
  diskon: numeral($("#diskon").val()).value(),
  faktur: $("#faktur").val(),
  mode: "pembelian",
  pembayaran: $("#pembayaran").val(),
  hutang : $("#pembayaran").val() == "Hutang" ?  grandtotal : 0,
  hutang_dibayar : $("#pembayaran").val() == "Hutang" ?  hutang_dibayar : 0,
  hutang_sisa : $("#pembayaran").val() == "Hutang" ? hutang_sisa : 0,
  user_id: user.user_id,
  terjual: terjual,
  total_hpp: 0,
  laba_rugi: 0,
};
$.post(
  server_url + "api/pembelian/insert",
  {
    data: dataProduct,
    insert: insert,
  },
  function (resp) {
    console.log(resp);
    if(resp.success){
      $("#subtotal2").val(0);
      $("#grandtotal").val(0);
      
      popupSelesai(
        numeral($("#kembali").val()).format('0,0'),
        $("#faktur").val(),
        "barang"
      );
    }else{
      w2alert("Transaksi gagal diproses")
    }


    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      var todayNew = new Date();
      var fakturTrxNew = "PB." + form_ymdHis(todayNew);
      // $("#faktur").val(fakturTrxNew);
      // $("#notrx").html(fakturTrxNew);
      $("#faktur").val("");
      $("#notrx").html("");
      $("#keterangan").val("");
      $("#supplier_id").val("");
      $("#nama_supplier").val("");
      $("#idsupp").val("");
      $("#faktur").val("");
      console
    }, 100);
  }
);
}
//[tbDtlPjlPOS] [tbHdrPjlPOS] [tbLogDtlPjlPOS]
