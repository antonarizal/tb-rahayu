function returPembelian(id) {
  var id = id;
  console.log(id);
  const Store = require("electron-store");
  const store = new Store();
  const server_url =
    "http://" + store.get("hostName") + ":" + store.get("port") + "/";
  var api_url = server_url + "api/product/retail";

  var keyword = $("#kode_barang").val();
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const rdm2 = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  var grid_l = "grid_left";
  var grid_r = "grid_right";

  const config_barang = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        {
          type: "left",
          size: "45%",
          resizable: false,
          minSize: 300,
          title: "Data Pembelian",
        },
        {
          type: "right",
          size: "55%",
          resizable: false,
          minSize: 300,
          title: "Retur Pembelian",
        },
        {
          type: "bottom",
          size: 40,
          resizable: false,
          style: "float:right",
          html: `
          <div style="padding:5px">
          <div style="float:right">
          Faktur pembelian <input style="height:30px;width:150px;" readonly id="faktur_pembelian" class="w2ui-input">
          Faktur Retur <input style="height:30px;width:150px;" id="faktur_retur" class="w2ui-input">
          Tanggal <input style="height:30px;width:150px;" type="date" id="date" class="w2ui-input">
          <input style="height:30px;width:150px;" type="hidden" id="supplier_id" class="w2ui-input">
          <a class="btn btn-sm btn-default" onclick="selesai()">
          <i class="fas fa-check"></i> Simpan
          </a>
          </div>
          </div>
          `,
        },
      ],
    },
    grid_left: {
      name: grid_l,
      style: "border: 1px solid #efefef",
      //   url: server_url + "api/pembelian/detail/" + id,
      tabIndex: 0,
      show: {
        toolbar: true,
        footer: false,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: false,
        searchAll: false,
        toolbarInput: false,
        toolbarAdd: false,
        toolbarEdit: false,
        toolbarDelete: false,
        lineNumbers: true,
        selectColumn: false,
      },
      limit: 20,
      multiSearch: false,
      sortData: [
        {
          field: "id",
          direction: "desc",
        },
      ],
      toolbar: {
        items: [
          {
            type: "html",
            id: "date",
            html: function (item) {
              var html =
                '<div style="padding: 3px 10px;font-weight:normal;"><span id="tgl"></span></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "faktur",
            html: function (item) {
              var html =
                '<div style="padding: 3px 10px;font-weight:normal;"><span id="faktur"></span></div>';
              return html;
            },
          },
          //   { type: "spacer" },
          {
            type: "html",
            id: "supplier",
            html: function (item) {
              var html =
                '<div style="padding: 3px 10px;font-weight:normal;"><span id="supplier"></span></div>';
              return html;
            },
          },
        ],
        onClick: function (event) {
          if (event.target == "pilih") {
            console.log(data);
            var grid = w2ui[grid_r];
            var qty = $("#faktur").val();
            var sel = grid.getSelection();
            if (sel.length == 1) {
              var data = grid.get(sel[0]);
              var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
              var row = selected[0];
              var barcode = $("#kode_barang").serializeArray();
              barcode = barcode[0].value.split("x");
              if (barcode.length > 1) {
                var qty = barcode[0];
              } else {
                var qty = 1;
              }
              addCart(row, qty);
            } else {
              w2alert("Silahkan pilih barang yang akan ditambahkan");
            }
          }
        },
      },
      columns: [
        {
          field: "kode_barang",
          text: "KODE",
          size: "80px",
          sortable: false,
          searchable: true,
        },
        {
          field: "nama_barang",
          text: "Nama Barang",
          sortable: false,
          searchable: true,
        },
        {
          field: "harga",
          text: "Harga",
          sortable: false,
          searchable: false,
          style: "text-align:right",
          render(record, extra) {
            var html = "Rp." + numeral(record.harga).format("0,0");
            return html;
          },
        },
        {
          field: "qty",
          text: "Qty",
          size: "50px",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html = numeral(record.qty).format("0,0");

            return html;
          },
        },
        {
          field: "satuan",
          text: "Satuan",
          size: "80px",
          sortable: false,
          searchable: true,
        },
        {
          field: "total",
          text: "Total",
          sortable: false,
          searchable: false,
          style: "text-align:right",
          render(record, extra) {
            var html = "Rp." + numeral(record.total).format("0,0");

            return html;
          },
        },
      ],
      onClick: function (event) {
        var grid = this;
        event.onComplete = function () {
          var sel = grid.getSelection();
          if (sel.length == 1) {
            row = $.extend(true, {}, grid.get(sel[0]));
            console.log(row);
            $("#kode_barang").val(row.kode_barang);
            $("#nama_barang").val(row.nama_barang);
            $("#harga").val(row.harga);
            $("#qty").val(1);
            $("#qmax").val(row.qty);
            $("#satuan").val(row.satuan);
            $("#qty").focus();
          } else {
          }
        };
      },
      onLoad: function (event) {
        var faktur = event.xhr.responseJSON.faktur;
        console.log(faktur);
        var timesRun = 0;
        var interval = setInterval(function () {
          timesRun += 1;
          if (timesRun === 2) {
            clearInterval(interval);
          }
          var today = new Date();
          var fakturTrx = "RB." + form_ymdHis(today);

          $("#item_terjual").html("Terjual : " + faktur.terjual + " Item");
          $("#pembelian").html(
            "Total : Rp." + numeral(faktur.pemasukan).format("0,0")
          );
          $("#tgl").html("Tanggal : " + faktur.date);
          $("#faktur").html("Nota : " + faktur.faktur);
          $("#supplier").html("Supplier : " + faktur.nama_supplier);
          $("#faktur_pembelian").val(faktur.faktur);
          $("#faktur_retur").val(fakturTrx);
          $("#supplier_id").val(faktur.supplier_id);
          $("#date").val(date_now());
        }, 100);
      },
      onKeydown: function (event) {
        // console.log("keyCode", event.originalEvent.keyCode);
        if (event.originalEvent.keyCode == 13) {
        }
      },
    },
    grid_right: {
      name: grid_r,
      style: "border: 1px solid #efefef",
      //   url: server_url + "api/pembelian/detail/" + id,
      tabIndex: 0,
      show: {
        toolbar: true,
        footer: false,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: false,
        searchAll: false,
        toolbarInput: false,
        toolbarAdd: false,
        toolbarEdit: false,
        toolbarDelete: false,
        lineNumbers: true,
        selectColumn: false,
      },
      limit: 20,
      multiSearch: false,
      sortData: [
        {
          field: "id",
          direction: "desc",
        },
      ],
      toolbar: {
        items: [
          {
            type: "html",
            id: "kode_barang",
            html: function (item) {
              var html =
                '<div ><input placeholder="kode barang" style="height:25px;width:110px;" readonly id="kode_barang" class="w2ui-input"></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "nama_barang",
            html: function (item) {
              var html =
                '<div ><input placeholder="nama barang" style="height:25px;width:120px;" readonly id="nama_barang" class="w2ui-input"></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "harga",
            html: function (item) {
              var html =
                '<div ><input placeholder="harga" style="height:25px;width:93px;" readonly id="harga" class="w2ui-input"></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "qty",
            html: function (item) {
              var html =
                '<div ><input placeholder="qty"  style="height:25px;width:60px" min=1  id="qty" type="number" class="w2ui-input"><input type="hidden" id="qmax"></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "satuan",
            html: function (item) {
              var html =
                '<div ><input placeholder="satuan"  style="height:25px;width:80px" readonly id="satuan" class="w2ui-input"></div>';
              return html;
            },
          },
          {
            type: "html",
            id: "submit",
            html: function (item) {
              var html =
                '<div ><input type="submit" style="height:25px;width:60px;padding:3px"  onClick="addCart()" class="btn btn-xs btn-default" value="Tambah"></div>';
              return html;
            },
          },
        ],
      },
      columns: [
        {
          field: "kode_barang",
          text: "KODE",
          size: "90px",
          sortable: false,
          searchable: true,
        },
        {
          field: "nama_barang",
          text: "Nama Barang",
          sortable: false,
          searchable: true,
          size: "120px",

        },
        {
          field: "harga",
          text: "Harga",
          sortable: false,
          searchable: false,
          size: "100px",
          style: "text-align:right",
          render(record, extra) {
            var html = "Rp." + numeral(record.harga).format("0,0");
            return html;
          },
        },
        {
          field: "qty",
          text: "Qty",
          size: "80px",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html = numeral(record.qty).format("0,0");

            return html;
          },
        },
        {
          field: "satuan",
          text: "Satuan",
          size: "80px",
          sortable: false,
          searchable: true,
        },
        {
          field: "total",
          text: "Total",
          sortable: false,
          searchable: false,
          style: "text-align:right",
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
              record.recid +
              ')" class="w2ui-btn text-sm text-center"><i class="fa fa-times"></i></a></span>';
            return html;
            console.log(recid);
          },
        },
      ],
      onLoad: function (event) {
        var faktur = event.xhr.responseJSON.faktur;
        console.log(faktur);
      },
      onChange: function (event) {
        console.log(event.target);
      },
      onSelect: function (event) {},
      onKeydown: function (event) {
        // console.log("keyCode", event.originalEvent.keyCode);
        if (event.originalEvent.keyCode == 13) {
        }
      },
    },
  };

  $(function () {
    // initialization in memory
    $().w2layout(config_barang.layout_mode);
    $().w2grid(config_barang.grid_left);
    $().w2grid(config_barang.grid_right);

    w2ui[grid_l].url = server_url + "api/pembelian/detail/" + id;
    w2ui[grid_l].reload();
    w2ui["grid_right"].clear();
    w2ui["grid_right"].refresh();
    dataProduct = [];
  });

  w2popup.open({
    title: "Transaksi Retur pembelian",
    width: 1200,
    height: 500,
    showMax: false,
    body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
    onOpen: function (event) {
      event.onComplete = function () {
        $("#w2ui-popup #main").w2render(layout_r);
        w2ui[layout_r].html("left", w2ui[grid_l]);
        w2ui[layout_r].html("right", w2ui[grid_r]);
      };
    },
  });
}

var dataProduct = [];

function addCart() {
  let qty = numeral($("#qty").val()).value()
  let qmax = numeral($("#qmax").val()).value()
  if ( qty > qmax) {
    w2alert("Jumlah maksimal " + $("#qmax").val()).ok(function () {
      $("#qty").val($("#qmax").val());
    });
    return false;
  }
  var g = w2ui["grid_right"].records.length;
  var found = dataProduct.findIndex(
    (el) => el.kode_barang.trim() === row.kode_barang
  );
  if (found === -1) {
    var cart = {
      recid: g + 1,
      id_barang: row.id,
      kode_barang: $("#kode_barang").val(),
      nama_barang: $("#nama_barang").val(),
      harga: $("#harga").val(),
      qty: $("#qty").val(),
      satuan: $("#satuan").val(),
      total: $("#qty").val() * $("#harga").val(),
      faktur: $("#faktur_retur").val(),
      date: $("#date").val(),
      status: 1,
      user_id: user.user_id,
    };
    w2ui["grid_right"].add(cart);
    dataProduct.push(cart);
    console.log(dataProduct);
    var i = 1;
    dataProduct.forEach((el) => {
      el.recid = i;
      i++;
    });
  } else {
    // dataProduct.forEach((el) => {
    //   if (el.kode_barang == row.kode_barang.trim()) {
    //     el.qty = el.qty + qty;
    //     el.amount = el.qty * row.harga_jual;
    //     el.total_hpp = el.qty * row.harga_beli;
    //   }
    // });
  }
  console.log(found);
  console.log(dataProduct);
  // w2popup.close();
  w2ui["grid_right"].refresh();
  // subtotal();
  // loadData();
}

function deleteCart(id) {
  w2ui["grid_right"].reload();
  dataProduct.forEach((el) => {
    if (el.recid == id) {
      dataProduct.splice(dataProduct.indexOf(el), 1);
    }
  });
  console.log(dataProduct);
  w2ui["grid_right"].remove(id);
  w2ui["grid_right"].refresh();
}

function selesai() {
  var grandtotal = dataProduct
    .map((item) => item.total)
    .reduce((prev, curr) => prev + curr, 0);  
  var terjual = dataProduct
    .map((item) => item.terjual)
    .reduce((prev, curr) => prev + curr, 0);
  var insert = {
    total: grandtotal,
    grand_total: grandtotal,
    pemasukan: 0,
    pengeluaran: grandtotal,
    supplier_id: $("#supplier_id").val(),
    date: $("#date").val(),
    faktur: $("#faktur_retur").val(),
    mode: "retur_pembelian",
    pembayaran: "tunai",
    user_id: user.user_id,
    terjual: terjual,
    total_hpp: 0,
    laba_rugi: 0,
    keterangan: "Retur pembelian " + $("#faktur_pembelian").val(),
  };
  $.post(
    server_url + "api/retur/pembelian/insert",
    {
      data: dataProduct,
      insert: insert,
    },
    function (resp) {
      console.log(resp);
      w2alert("Retur berhasil disimpan").ok(function(){
        w2popup.close()
      })

      var timesRun = 0;
      var interval = setInterval(function () {
        timesRun += 1;
        if (timesRun === 2) {
          clearInterval(interval);
        }
        var todayNew = new Date();
        var fakturTrxNew = "PJ." + form_ymdHis(todayNew);
        $("#faktur").val(fakturTrxNew);
        $("#notrx").html(fakturTrxNew);
        console;
      }, 100);
    }
  );
}
