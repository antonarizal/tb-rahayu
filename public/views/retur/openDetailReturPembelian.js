function detailReturPembelian(id) {
  var id = id;
  console.log(id);
  const Store = require("electron-store");
  const store = new Store();
  const server_url =
    "http://" + store.get("hostName") + ":" + store.get("port") + "/";
  var api_url = server_url + "api/product/retail";

  var keyword = $("#kode_barang").val();
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  var grid_r = "grid_" + rdm;

  const config_barang = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        {
          type: "main",
          size: "100%",
          resizable: true,
          minSize: 300,
        },
        { type: 'bottom', size: 40, resizable: false, html: 
        '<div style="padding: 3px 10px;font-size:16px;font-weight:bold">' +
        '<span id="item_terjual"></span> <span style="float:right" id="penjualan"></span>' +
        '</div>'
       },
      ],
    },
    grid_mode: {
      name: grid_r,
      style: "border: 1px solid #efefef",
    //   url: server_url + "api/penjualan/detail/" + id,
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
                '<div style="padding: 3px 10px;font-weight:normal;"><span id="date"></span></div>';
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
            id: "pelanggan",
            html: function (item) {
              var html =
                '<div style="padding: 3px 10px;font-weight:normal;"><span id="pelanggan"></span></div>';
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
      // parser: function (responseText) {
      //   // var data = $.parseJSON(responseText);
      //   // do other things
      //   var array = responseText.data;
      //   array.forEach((el) => (el.recid = el.id));
      //   var data = {
      //     total: responseText.data.length,
      //     records: array,
      //   };
      //   return data;
      // },
      columns: [
        {
          field: "kode_barang",
          text: "KODE",
          size: "100px",
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
          field: "disc",
          text: "Disc (%)",
          sortable: false,
          searchable: false,
          size: "80px",
          style: "text-align:right",
        },
        {
          field: "diskon",
          text: "Disc (Rp)",
          sortable: false,
          searchable: false,
          style: "text-align:right",
          render(record, extra) {
            var html = "Rp." + numeral(record.diskon).format("0,0");
            return html;
          },
        },
        {
          field: "satuan",
          text: "Satuan",
          size: "100px",
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
      onLoad: function (event) {
        var faktur = event.xhr.responseJSON.faktur;
        console.log(faktur);
        var timesRun = 0;
        var interval = setInterval(function () {
          timesRun += 1;
          if (timesRun === 2) {
            clearInterval(interval);
          }
          $("#item_terjual").html('Terjual : '+faktur.terjual+' Item');
          $("#penjualan").html('Total : Rp.'+numeral(faktur.pemasukan).format('0,0'));
          $("#date").html("Tanggal : " + faktur.date);
          $("#faktur").html("Nota : " + faktur.faktur);
          $("#pelanggan").html("Pelanggan : " + faktur.nama_pelanggan);
        }, 100);
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
    $().w2grid(config_barang.grid_mode);
    // w2ui["grid_"].hideColumn('cost');

    var cart =
    {
          w2ui: { summary: true },
          recid: "S-1",
          kode_barang: '<input class="w2ui-input" style="width:100%" id="plu">',
          nama_barang: '<input class="w2ui-input" style="width:100%" id="cari" onKeyup="cari()"><span id="description" style="display:none"></span><input type="hidden" value="" id="description2">',
          harga: '<input class="w2ui-input" style="width:100%" value="0" id="coli" onKeyup="setColi(this)">',
          qty: '<input class="w2ui-input" style="width:100%" value="0.00" id="isi"  onKeyup="setIsi(this)"><input type="hidden" value="" id="konversi"><input type="hidden" value="" id="ipack1">',
          satuan: '<select id="selectSatuan" style="display:none" onChange="selectSatuan()"><option value="">pilih</option></select><input readonly class="w2ui-input" style="width:100%" value="" id="satuan" onKeyup="setSatuan(this)"><input type="hidden" value="" id="satuan2">',
          total: '<input readonly class="w2ui-input" style="width:100%" value="0.00" id="qty" onKeyup="setQty()">',
        };
    // w2ui[grid_r].add(cart);
    w2ui[grid_r].url = server_url + "api/penjualan/detail/"+id;
    w2ui[grid_r].reload();

  });

  // function searchProduct(el) {
  //   var grid = w2ui[grid_r];
  //   var text = el.value.toLowerCase();
  //   grid.search(text);
  // }

  w2popup.open({
    title: "Detail Retur Pembelian",
    width: 800,
    height: 500,
    showMax: false,
    body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
    onOpen: function (event) {
      event.onComplete = function () {
        $("#w2ui-popup #main").w2render(layout_r);
        w2ui[layout_r].html("main", w2ui[grid_r]);
        $(".w2ui-search-all").focus();
      };
    },
  });
  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    if (timesRun === 2) {
      clearInterval(interval);
    }
    // $("#grid_" + grid_r + "_search_all").focus();
    // $("#grid_" + grid_r + "_search_all").hide();
    $("#search_product").focus();
  }, 500);
}

function searchProduct() {
  var keyword = $("#search_product").val();
  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    if (timesRun === 2) {
      clearInterval(interval);
    }
    // $("#grid_" + grid_r + "_search_all").focus();
    // $("#grid_" + grid_r + "_search_all").hide();
    // $("#search_product").focus();
    // $("#search_product").val(keyword);
  }, 500);

  var grid = w2ui["grid_"];
  var text = keyword.toLowerCase();
  grid.url = server_url + "api/product/retail/search/?keyword=" + keyword;
  grid.reload();
  grid.search(text);
}
