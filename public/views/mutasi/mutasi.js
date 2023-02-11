const config = require("./config");
const numeral = require("numeral");
var db = new localdb("db_weringin");
var api_url = "http://192.168.1.5:7038/api/";
const host = config.base_url + "views";

const tbTransaksi = "transaksi";
const sum = 0;
$("#subtotal").val(numeral(sum).format("0,0"));
var dataProduct = []; // create "null" object (same as before)
var today = new Date();

var db = new localdb("db_weringin");
if (!db.tableExists(tbTransaksi)) {
  db.createTable(tbTransaksi);
}

var isUserLogin = db.tableExists('user');
if(!isUserLogin){
  window.location.href = host + "/home/unauthorized";
}else{
  var user = db.findById('user', 1);
  console.log(user)
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

$("#date").val(date_now());
// db.insert('transaksi', {
//   'date': date_format(today),
//   'number': 1,
// });
// db.dropTable('transaksi');

function getNoTrx(id) {
  var gudang = id.split("G");
  var noMt = "MT" + gudang[1];
  return noMt;
}

$.get(config.server_url + "api/lokasi/gudang", function (resp) {
  $.each(resp.data, function (idx, value) {
    $("#lokasiAsal").append(
      $("<option>")
        .text(value.id.trim() + " - " + value.description.trim())
        .attr("value", value.id.trim() + "@" + value.description)
    );
    $("#lokasiTujuan").append(
      $("<option>")
      .text(value.id.trim() + " - " + value.description.trim())
      .attr("value", value.id.trim() + "@" + value.description)    );
  });
});

$.get(config.server_url + "api/user/admin/stok", function (resp) {
  $.each(resp.data, function (idx, value) {
    $("#pengirim").append(
      $("<option>")
        .text(value.username.trim())
        .attr("value", value.username.trim())
    );
    $("#penerima").append(
      $("<option>")
        .text(value.username.trim())
        .attr("value", value.username.trim())
    );
  });
});

$("#lokasiAsal").on("change", function () {
  var data = $(this).val().split("@");
  console.log(data);
  $("#lokasiAsalId").val(data[0]);
  $("#lokasiAsalText").val(data[1]);
  $("#kode_mutasi").val(getNoTrx(data[0]));
  console.log(getNoTrx(data[0]));
});
$("#lokasiTujuan").on("change", function () {
  var data = $(this).val().split("@");
  console.log(data);
  $("#lokasiTujuanId").val(data[0]);
  $("#lokasiTujuanText").val(data[1]);
});

console.log(noTrx);
console.log(db.exportData(tbTransaksi));
var date = "";

$("#kasir_header").html("ENTRY MUTASI ANTAR LOKASI");
$("#nama_toko").html(config.nama_toko);
$("#version").html(config.version);
$("#alamat_toko").html(config.alamat_toko);
$("#telp").html(config.telp);
$("#kota").html(config.kota);
$("#notrx").html(date);
setInterval(function () {
  $("#tanggal").html(tanggal("tanggal_kasir"));
}, 1000);

var base_url = config.base_url;
var api_url = config.api_url + "kasir/api/";
var barang_url = config.api_url + "barang/api/all/";

function loadData() {
  $("#cari").focus();
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
        field: "plu",
        text: '<span class="table-header">PLU</span>',
        size: "8%",
        sortable: true,
      },
      {
        field: "description",
        text: '<span class="table-header">NAMA BARANG</span>',
        size: "30%",
        sortable: true,
      },
      {
        field: "coli",
        text: '<span class="table-header">COLI</span>',
        size: "80px",
      },
      {
        field: "isi",
        text: '<span class="table-header">ISI</span>',
        size: "120px",
        style: "text-align:right",
      },
      {
        field: "satuan",
        text: '<span class="table-header">SATUAN</span>',
        size: "100px",
      },
      {
        field: "qty",
        text: '<span class="table-header">QTY</span>',
        size: "120px",
      },
    ],
    records: [
      {
        w2ui: { summary: true },
        recid: "S-1",
        plu: '<input class="w2ui-input" style="width:100%" id="plu">',
        description: '<input class="w2ui-input" style="width:100%" id="cari" onKeyup="cari()"><span id="description" style="display:none"></span><input type="hidden" value="" id="description2">',
        coli: '<input class="w2ui-input" style="width:100%" value="0" id="coli" onKeyup="setColi(this)">',
        isi: '<input class="w2ui-input" style="width:100%" value="0.00" id="isi"  onKeyup="setIsi(this)"><input type="hidden" value="" id="konversi"><input type="hidden" value="" id="ipack1">',
        satuan: '<select id="selectSatuan" style="display:none" onChange="selectSatuan()"><option value="">pilih</option></select><input readonly class="w2ui-input" style="width:100%" value="" id="satuan" onKeyup="setSatuan(this)"><input type="hidden" value="" id="satuan2">',
        qty: '<input readonly class="w2ui-input" style="width:100%" value="0.00" id="qty" onKeyup="setQty()">',
      },
    ],
    onKeydown: function (event) {
      // console.log("keyCode", event.originalEvent.keyCode);
      if (event.originalEvent.keyCode == 13) {
        alert();
      }
    },
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
  var barcode = $("#plu").serializeArray();
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
    return false;
  }
  $.get(
    config.server_url + "api/product/ritel/barcode/" + barcode,
    function (data) {
      //115000604000
      console.log(data);
      if (data.success) {
        addCart(data.data[0], qty);
      } else {
        toastr.info(data.message);
        openBarang();
      }
    }
  );
});

function addcart(){
// Data barang bisa doble masuk ke cart

var today = new Date()
  var cart = {
    recid:  form_ymdHis(today),
    plu: $("#plu").val(),
    description: $("#description2").val(),
    coli: $("#coli").val(),
    isi: $("#isi").val(),
    satuan: $("#satuan").val(),
    qty: $("#qty").val(),
  };  
  
  var cart2 = {
    plu: $("#plu").val(),
    description: $("#description2").val(),
    coli: $("#coli").val(),
    isi: $("#isi").val(),
    satuan: $("#satuan").val(),
    totqty: $("#qty").val(),
    konversi: $("#konversi").val(),
  };
  w2ui[name].add(cart);
  dataProduct.push(cart2);
  console.log(dataProduct);
  $("#cari").show();
  $("#cari").focus();
  $("#description").hide();
}
function addColi(row, qty = 1) {
  var qty = parseInt(qty);
  var g = w2ui[name].records.length;
  var found = dataProduct.findIndex((el) => el.plu.trim() === row.plu.trim());

  // if (found === -1) {
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      $("#plu").val(row.plu);
      $("#cari").hide();
      $("#description").show();
      $("#description").html(row.description);
      $("#description2").val(row.description);
      $("#coli").focus();
      $("#coli").select();
      $("#isi").val(numeral(row.ipack1).format("0.00"));
      $("#konversi").val(numeral(row.ikeypack1).format("0.00"));
      $("#ipack1").val(row.ipack1);
      $("#satuan").val("PCS");
      $("#satuan2").val(row.keypack1);
      $("#qty").val("0.00");
    }, 100);


    // console.log(row);
  // } else {
  //   dataProduct.forEach((el) => {
  //     if (el.barcode == row.plu.trim()) {
  //       alert("Data dobel?")
  //     }
  //   });
  // }
  // console.log(found);
  // console.log(dataProduct);
  w2popup.close();
  w2ui[name].refresh();
  subtotal();
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
  $("#plu").focus();
  $("#plu").select();
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

$("#kredit").click(function () {
  $("#tempo").prop("disabled", false);
  $("#tempo").val("");
});
$("#tunai").click(function () {
  $("#tempo").prop("disabled", true);
  $("#tempo").val("");
});

function changeQty(id) {
  var qty = $("#qty_" + id).val();
  console.log("change:" + qty);
  w2ui[name].set(1, { fname: "Not Suart", lname: "Unknown" });
  w2ui[name].refresh();

  loadData();
}

$("#pay").on("submit", function (e) {
  var kembali = numeral($("#kembali").val()).value();
  var dibayar = numeral($("#bayar").val()).value();
  var pembayaran = $("input[name='pembayaran']:checked").val();

  if (pembayaran != "tunai") {
    if ($("#pelanggan_id").val() == 0) {
      w2alert("Data pelanggan harus diisi").ok(function () {});
      return false;
    }
  } else {
    if (kembali < 0) {
      w2alert("Uang yang dibayar kurang").ok(function () {
        $("#bayar").select();
      });
      return false;
    }
    if (dibayar == 0) {
      w2alert("Uang yang dibayar kurang").ok(function () {
        $("#bayar").select();
      });
      return false;
    }
  }

  e.preventDefault();
  $.ajax({
    url: api_url + "/pay/",
    type: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (resp) {
      console.log(resp);
      loadData();
      w2ui[name].reload();
      // $("#modal").modal("show");
      // $( ".modal-dialog" ).addClass( "modal-lg" );
      // $("#loadModal").load(load_url+"/print/?type="+$("#print").val()+"&faktur="+resp.faktur)
      popupSelesai(resp.kembali, resp.faktur, $("#print").val());
    },
    error: function (data) {},
  });
});

function kembalian(input) {
  $("#bayar_tunai").val(numeral($("#bayar").val()).value());
  var grandtotal = numeral($("#grandtotal").val()).value();
  var bayar_tunai = numeral($("#bayar_tunai").val()).value();
  kembali = bayar_tunai - grandtotal;
  kembali = numeral(kembali).format("0,0");
  $("#kembali").val(kembali);
  $("#bayar").val(numeral(input.value).format("0,0"));
}

function popupSelesai(kembali, faktur, type) {
  w2popup.open({
    title: "Kembalian",
    body:
      '<div class="w2ui-centered" ><span style="font-size:30px">Rp.' +
      kembali +
      "</span></div>",
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
      $("#plu").focus();
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
  $("#frame").attr(
    "src",
    load_url + "/print/?type=" + type + "&faktur=" + faktur
  );
  console.log(load_url + "/print/?type=" + type + "&faktur=" + faktur);
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
      $("#plu").focus();
    },
  });
}

function batal() {
  w2ui[name].clear();
  w2ui[name].refresh();
  dataProduct = [];
  $("#subtotal").val(0);
  $("#plu").focus();
}

function subtotal() {
  const subtotal = dataProduct
    .map((item) => item.total)
    .reduce((prev, curr) => prev + curr, 0);
  $("#subtotal").val(numeral(subtotal).format("0,0"));
  $("#plu").val("");
  $("#plu").focus();
  return subtotal;
}

function selesai() {
  $("#modal-bayar").modal("show");
}

function setColi(number) {
  var ipack1 = $("#ipack1").val()
  var num = number.value;
  var satuan2 = $("#satuan2").val();
  var konversi = $("#konversi").val();
  var isi = ipack1 / konversi
  var qty = ipack1 / konversi * num
  console.log(konversi);
  if (num == '0') {

  }else{
    $('#satuan').attr('readonly', true);
    $('#isi').attr('readonly', true);

  }
  if (event.key === "Enter") {
    if(num < 1){
      $("#isi").focus()
      $("#isi").select()
      return false;
    }else{
      addcart()
    }

  } else {
    $("#qty").val(numeral(qty).format("0.00"));
    if(number.value=='0'){
      $("#satuan").val("PCS")
      $('#satuan').attr('readonly', false);
    }else{
      $("#satuan").val(satuan2)
      $('#satuan').attr('readonly', false);
      $("#isi").val(numeral(isi).format("0.00"));
    }
  }
}
function setIsi(number) {
  var num = number.value;
  console.log(num);
  if (num == 0) {
    num = 1;
  }
  var qty = num * $("#coli").val();
  if (event.key === "Enter") {
    $("#satuan").hide()
    $("#selectSatuan").show()
    $("#selectSatuan").focus()
    // $("#satuan").select()
    $.get(config.server_url + "api/konversi/satuan", function (resp) {
      $.each(resp.data, function (idx, value) {
        $("#selectSatuan").append(
          $("<option>")
            .text(value.sat)
            .attr("value", value.sat + '@'+value.konversi)
        );
      });
    });
    $("#qty").val(numeral(num).format("0.00"));

  } else {
    $("#qty").val(numeral(num).format("0.00"));

  }
}

function selectSatuan() {
  var data = $('#selectSatuan').val().split("@");
  $("#satuan").val(data[0]);
  $("#konversi").val(data[1]);
  console.log(data[1]);
  $("#qty").focus()
  $("#qty").select()
}

// satuan bisa memilih saat coli nilainya 0
function setSatuan(){
  if (event.key === "Enter") {
    addcart()

  } else {
    

  }
}
function setQty(){
  if (event.key === "Enter") {
    addcart()

  } else {
    

  }
}

function cari(){
  if (event.key === "Enter") {
   openBarang()

  } else {
    

  }
}


function noTrxAuto()
{
  var today = new Date();
  var rand =  Math.floor((Math.random()*9999) + 1)
  var date = thnbln_format(today)
  $("#no_mutasi").val( date + '' +rand)

}



function popupValidasi() {
  w2popup.open({
    title: "KONFIRMASI",
    body:
      '<div class="w2ui-centered" >Data akan divalidasi?</div>',
    buttons:
      '<button class="w2ui-btn" onclick="validasi()">Ya</button> ' +
      '<button class="w2ui-btn" onclick="w2popup.close();">Tidak</button>',
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

function cetak()
{

}
function validasi()
{
  if($("#cusid").val() == ""){
    alert("Data customer belum diisi")
    return false
  }
  var date = new Date;
  var noMutasi = $("#kode_mutasi").val() + $("#no_mutasi").val()
    dataProduct.forEach(x => x.date = $("#date").val());
    dataProduct.forEach(x => x.time = time_format(date));
    dataProduct.forEach(x => x.lok1 = $("#lokasiAsalId").val());
    dataProduct.forEach(x => x.lok2 = $("#lokasiTujuanId").val());
    dataProduct.forEach(x => x.pengirim = $("#pengirim").val());
    dataProduct.forEach(x => x.penerima = $("#penerima").val());
    dataProduct.forEach(x => x.cusid = $("#cusid").val());
    dataProduct.forEach(x => x.nomutasi = noMutasi);
    dataProduct.forEach(x => x.f = 1);
    dataProduct.forEach(x => x.no = 1);
    dataProduct.forEach(x => x.status = 1);
    dataProduct.forEach(x => x.clerk = user.username);
    dataProduct.forEach(x => x.keterangan = $("#keterangan").val());
    // alert($("#keterangan").val());

  $.post(config.server_url+"api/mutasi/input",
  {
    data:dataProduct

  },function(resp){
    console.log(resp);
    if(resp.success){
      w2popup.close();
      location.reload();
    }else{
      alert("Data gagal diproses")
    }
  
  })



}

