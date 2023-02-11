const config = require("./config");
const numeral = require("numeral");
var db = new localdb('db_weringin');
var api_url = 'http://192.168.1.5:7038/api/';

var dataProduct = [] ; // create "null" object (same as before)

var product = 
{
  "notrx": "string",
  "plu": "string",
  "barcode": "1234",
  "description": "string",
  "qty": 0,
  "cost": 0,
  "price": 0,
  "disc1": 0,
  "disc2": 0,
  "amount": 0,
  "clerk": "string"
};

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
if (!db.tableExists('kasir')) {
  db.createTable('kasir');
}
if (!db.tableExists('transaksi')) {
  db.createTable('transaksi');
}

var kasir = dataProduct;

var today = new Date();
var date = "03-" + date_format(today) + "-00001";

function date_format(date) {
  return (
    pad(date.getDate()) +
    pad(date.getMonth() + 1) +
    date.getFullYear().toString()
  );
}

function pad(number) {
  return ((number < 10 ? "0" : "") + number).toString();
}

$("#kasir_header").html(config.kasir_header);
$("#nama_toko").html(config.nama_toko);
$("#version").html(config.version);
$("#alamat_toko").html(config.alamat_toko);
$("#telp").html(config.telp);
$("#kota").html(config.kota);
$("#notrx").html(date);

var base_url = config.base_url;
var api_url = config.api_url + "kasir/api/";
// var load_url = '<?=base_url("index.php/".$module."/load//")?>';
var barang_url = config.api_url + "barang/api/all/";


function loadData() {
  $.get(api_url + "/data", function (resp) {
    $("#count").html("Total : " + resp.count);
    $("#kode_barang").focus();
    $("#subtotal").val(numeral(resp.total).format("0,0"));
    $("input[name='sub_total']").val(numeral(resp.total).format("0,0"));
    $("input[name='grand_total']").val(numeral(resp.total).format("0,0"));
    $("input[name='grandtotal']").val(resp.total);
    $("input[name='faktur']").val(resp.faktur);
    $("input[name='dibayar']").val(0);
    $("input[name='kembali']").val(0);
    $("input[name='disc']").val(0);
    $("input[name='diskon']").val(0);
  });
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
        field: "barcode",
        text: '<span class="table-header">BARCODE</span>',
        size: "10%",
        sortable: true,
      },
      {
        field: "nama_barang",
        text: '<span class="table-header">NAMA BARANG</span>',
        size: "30%",
        sortable: true,
      },
      {
        field: "qty",
        text: '<span class="table-header">QTY</span>',
        size: "80px",
        render(record, extra) {
            var html =
              '<input min=1 class="qty" id="qty_' +
              record.id +
              '" onChange="changeQty(' +
              record.id +
              ')" style="width:100%;text-align:center;padding:3px" type="number"  name="qty" value="' +
              record.qty +
              '">';
          return html;
        },
      },
      {
        field: "harga_jual",
        text: '<span class="table-header">HARGA JUAL</span>',
        size: "120px",
        style: "text-align:right",
        render(record, extra) {
          var html = numeral(record.harga_jual).format("0,0");
          return html;
        },
      },
      {
        field: "diskon",
        text: '<span class="table-header">DISC<br>(%)</span>',
        size: "80px",
      },
      {
        field: "diskon_rp",
        text: '<span class="table-header">DISC<br>(RP.)</span>',
        size: "80px",
      },
      {
        field: "total",
        text: '<span class="table-header">JUMLAH</span>',
        size: "120px",
        render(record, extra) {
          var html = "Rp." + numeral(record.total).format("0,0");

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
            record.id +
            ')" class="w2ui-btn text-sm text-center"><i class="fa fa-times"></i></a></span>';
          return html;
        },
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
  // $.ajax({
  //   // url: api_url + "/add_cart/",
  //   url: api_url + '/product/ritel/barcode/' + $("#barcode").val(),
  //   type: "GET",
  //   data: new FormData(this),
  //   contentType: false,
  //   cache: false,
  //   processData: false,
  //   success: function (resp) {
  //     console.log(resp);
  //     // res = jQuery.parseJSON(data);
  //     if (resp.success) {
  //       loadData();
  //       w2ui[name].reload();
  //       $("#kode_barang").val("");
  //       $("#kode_barang").focus();
  //     } else {
  //       if (resp.status == "limited") {
  //         w2alert(resp.message);
  //       } else {
  //         toastr.info(resp.message);
  //         openBarang();
  //       }
  //     }
  //   },
  //   error: function (data) {},
  // });
  var barcode =$('#kode_barang').serializeArray();
  $.get(api_url + 'product/ritel/barcode/' + barcode[0].value, function(data){
    console.log(data);
    if(data.success){
      var row = data.data[0];
      // var qty = $('#qty').val();
      // var discount = $('#discount').val();
      // var total = qty * data.harga_jual;
      // var diskon = (total * discount) / 100;
      // var subtotal = total - diskon;
      // var row = {
      //   id: data.id,
      //   kode_barang: data.kode_barang,
      //   nama_barang: data.nama_barang,
      //   qty: qty,
      //   harga_jual: data.harga_jual,
      //   diskon: discount,
      //   total: subtotal,
      // };
      // kasir.rows.push(row);
      var g = w2ui[name].records.length;
      w2ui[name].add({
        recid: g + 1,
        kode_barang: row.barcode,
        nama_barang: row.description,
        harga_jual: row.prices[0].price,
        qty: 1,
        diskon: row.disc1,
        diskon_rp: row.disc2,
        total: row.prices[0].price,
        hapus: "",
      });

      // w2ui[name].reload();
      $("#kode_barang").val("");
      $("#kode_barang").focus();
    }else{
      toastr.info(data.message);
      openBarang();
    }
  });


});

function addCart(kode_barang, faktur, row = "") {
  // console.log(row);
  // url: api_url+ '/add_cart/',
  $.post(
    api_url + "/add_cart/",
    {
      kode_barang: kode_barang,
      faktur: faktur,
    },
    function (resp) {
      if (resp.success) {
        loadData();
        // w2ui[name].reload();
        $("#kode_barang").val("");
        $("#kode_barang").focus();
        w2popup.close();
        var g = w2ui[name].records.length;
        db.insert('kasir', {
          kode_barang: row.kode_barang,
          nama_barang: row.nama_barang,
          harga_jual: row.harga_jual,
          qty: 1,
          diskon: 0,
          total: row.harga_jual,
      });
      console.log(kasir);
      
        w2ui[name].add({
          recid: g + 1,
          kode_barang: row.kode_barang,
          nama_barang: row.nama_barang,
          harga_jual: row.harga_jual,
          qty: 1,
          diskon: 0,
          total: row.harga_jual,
          hapus: "",
        });
      } else {
        //w2alert(resp.message)
      }
    }
  );
}

// function addJasa(id_jasa, nama_jasa, harga) {
//     var faktur = $("#faktur").val();
//     $.post(api_url + '/add_jasa/', {
//         id: id_jasa,
//         nama_jasa: nama_jasa,
//         harga: harga,
//         faktur: faktur
//     }, function (resp) {
//         if (resp.success) {
//             loadData();
//             w2ui[name].reload();
//             w2popup.close();
//         } else {
//             w2alert(resp.message)
//         }
//     });

// }

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

function loadCart()
{
  var rec = (dataProduct);
  $.each(rec, function (i, val) {
    w2ui[name].add(val);
  })
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
shortcut.add("f7", function () {
  simpanTrx();
});

shortcut.add("f12", function () {
  $("#bayar").focus();
});

function deleteCart(id) {
  // alert("hapus:"+id);
  $.post(api_url + "/delete/" + id, function () {
    w2ui[name].reload();
  });
  loadData();
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
  w2ui[name].set(1, { fname: 'Not Suart', lname: 'Unknown' });
  w2ui[name].refresh();

  loadData();
}

function changeDiscount(id) {
  var discount = $("#discount_" + id).val();
  console.log("change:" + discount);
  $.post(
    api_url + "/change_discount/" + id,
    {
      diskon: discount,
    },
    function (resp) {
      if (resp.success) {
        w2ui[name].reload();
        $("#discount_" + id).select();
      } else {
        w2alert(resp.message);
        $("#discount_" + id).val(1);
      }
    }
  );
  loadData();
}



function pilih(id, nama) {
  //alert(id)
  $("#nama_pelanggan").val(nama);
  $("#pelanggan_id").val(id);
  w2popup.close();
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


function cari_barang(el) {
  // console.log(el.value)
  w2grid(config_barang.grid_mode).search([
    {
      field: "nama_barang",
      value: el.value,
      operator: "contains",
    },
  ]);
}

function kembalian(input) {
  $("#bayar_tunai").val(numeral($("#bayar").val()).value());
  var grandtotal = numeral($("#grandtotal").val()).value();
  var bayar_tunai = numeral($("#bayar_tunai").val()).value();
  kembali = bayar_tunai - grandtotal;
  kembali = numeral(kembali).format("0,0");
  $("#kembali").val(kembali);
  $("#bayar").val(numeral(input.value).format("0,0"));
}

function setDiscountPercent(input) {
  var subtotal = numeral($("#subtotal").val()).value();
  var diskon = (input.value * subtotal) / 100;
  var grand_total = subtotal - diskon;
  $("#diskon").val(numeral(diskon).format("0,0"));
  $("#grand_total").val(numeral(grand_total).format("0,0"));
  $("#grandtotal").val(grand_total);
}

function setDiscount(input) {
  var subtotal = numeral($("#subtotal").val()).value();
  // var diskon = input.value*subtotal/100;
  var diskon = (input.value * 100) / subtotal;
  var grand_total = subtotal - input.value;
  $("#disc").val(numeral(diskon).format("0,0"));
  $("#grand_total").val(numeral(grand_total).format("0,0"));
  $("#grandtotal").val(grand_total);
}

$("#ppn").change(function () {
  var ppn = $("#ppn").val();
  var subtotal = numeral($("#subtotal").val()).value();
  var pajak = (ppn / 100) * subtotal;
  var pajak = numeral(pajak).value();
  var grand_total = subtotal + pajak;

  if (this.checked) {
    $("#pjk").val(ppn);
    $("#pajak").val(pajak);
    $("#grand_total").val(numeral(grand_total).format("0,0"));
    $("#grandtotal").val(grand_total);
  } else {
    $("#pjk").val(0);
    $("#pajak").val(0);
    $("#grand_total").val(numeral(subtotal).format("0,0"));
    $("#grandtotal").val(subtotal);
  }
});

function openPrinterSetting() {
  // $( ".modal-dialog" ).removeClass( "modal-lg" );
  $("#modal").modal("show");
  $("#loadModal").load(load_url + "/printer_setting/");
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
  $("#frame").attr(
    "src",
    load_url + "/print/?type=" + type + "&faktur=" + faktur
  );
  console.log(load_url + "/print/?type=" + type + "&faktur=" + faktur);
}

$(document).ready(function () {
  var cariBarang = $("#cari_barang").tautocomplete({
    width: "600px",
    delay: 200,
    columns: ["Kode", "Nama Barang", "H.Jual", "Stok"],
    kolom: ["harga_jual", "kode_barang", "nama_barang", "harga_beli"],
    ajax: {
      url: api_url + "/cari_barang",
      type: "GET",
      data: function () {
        return [
          {
            key: cariBarang.searchdata(),
          },
        ];
      },
      success: function (data) {
        var filterData = [];

        var searchData = eval("/" + cariBarang.searchdata() + "/gi");

        $.each(data, function (i, v) {
          if (v.nama_barang.search(new RegExp(searchData)) != -1) {
            filterData.push(v);
          }
        });
        return filterData;
      },
    },
    onchange: function () {
      // $("#ta-txt").html(text2.text());
      // $("#ta-id").html(text2.id());
      var kode_barang = cariBarang.text();
      var faktur = $("#faktur").val();
      addCart(cariBarang.text(), faktur, cariBarang.response());
      // console.log(cariBarang.response())
    },
  });
});
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

function batal()
{
  db.dropTable('kasir');
  w2ui[name].clear();
  w2ui[name].refresh();
}