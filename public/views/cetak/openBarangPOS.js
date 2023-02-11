function openBarang() {
  var kasir = [];
  const Store = require("electron-store");
  const toastr = require("toastr");
  const store = new Store();
  console.log(new Date());
  const server_url =  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
  const level = store.get("level")

  // const server_url = store.get("server_url");
  const token = "Bearer " + store.get("token");
  var keyword = $("#kode_barang").val();
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  var grid_r = "grid_barang";

  const config_barang = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        { type: 'top', size: 40, resizable: false, html: 
        '<div style="padding: 3px 10px;">' +
        '    <input placeholder="Cari nama barang" id="search_product" size="40" onkeyup="searchBarang(this)" ' +
        '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" />' +
        '</div>'
       },
        {
          type: "main",
          size: "100%",
          resizable: true,
          minSize: 300,
        },
      ],
    },
    grid_mode: {
      name: grid_r,
      style: "border: 1px solid #efefef",
      url: server_url+"api/barang/all",
      httpHeaders: { Authorization: token },
      tabIndex: 0,
      show: {
        toolbar: true,
        footer: true,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: false,
        searchAll: false,
        toolbarInput: false,
        toolbarAdd: false,
        toolbarEdit: false,
        toolbarDelete: false,
        lineNumbers: true,
        selectColumn: true,
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
          // {
          //   type: "html",
          //   id: "search_product",
          //   html: function (item) {
          //     var html =
          //       '<div style="padding: 3px 10px;">' +
          //       '    <input placeholder="Cari nama barang" id="search_product" size="40" onChange="searchBarang(this)" ' +
          //       '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" />' +
          //       "</div>";
          //     return html;
          //   },
          // },
          // { type: "spacer" },
          {
            type: "button",
            id: "pilih",
            text: "Pilih",
            icon: "w2ui-icon-plus",
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
               $("#kodeBarang").val(row.kode_barang)
               $("#hargaJual").val(row.harga_jual)
               w2popup.close()
            } else {
              w2alert("Silahkan pilih barang yang akan ditambahkan");
            }
          }
        },
      },
      searches: [
        {
          field: "namaBarang",
          label: "Nama Barang",
          type: "text",
        },
        {
          field: "kodeBarang",
          label: "Kode Barang",
          type: "text",
        },
      ],
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
          field: "id",
          text: "ID",
          size: "20%",
          sortable: false,
          searchable: true,
        },

        {
          field: "kode_barang",
          text: "KODE",
          size: "30%",
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
          field: "harga_jual",
          text: "Harga",
          size: "33%",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html =
              "<b>Rp." + numeral(record.harga_jual).format("0,0") + "</b>";

            return html;
          },
        },
      ],
      onChange: function (event) {
        console.log(event.target);
      },
      onSelect: function (event) {},
      onKeydown: function (event) {
        // console.log("keyCode", event.originalEvent.keyCode);
        if (event.originalEvent.keyCode == 13) {
          var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
          var row = selected[0];
          var faktur = $("#faktur").val();
          var g = w2ui[name].records.length;
          var barcode = $("#kode_barang").serializeArray();
          barcode = barcode[0].value.split("x");
          if (barcode.length > 1) {
            var qty = barcode[0];
          } else {
            var qty = 1;
          }
          row.jenis = 'barang'
          addCart(row, qty);
        }
      },
    },
  };

  $(function () {
    // initialization in memory
    $().w2layout(config_barang.layout_mode);
    $().w2grid(config_barang.grid_mode);
    // w2ui["grid_"].hideColumn('cost');
    w2ui["grid_barang"].url = server_url + "api/barang/all";
    w2ui["grid_barang"].reload();
  });

  // function searchBarang(el) {
  //   var grid = w2ui[grid_r];
  //   var text = el.value.toLowerCase();
  //   grid.search(text);
  // }

  w2popup.open({
    title: "Data Barang",
    width: 800,
    height: 600,
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

function searchBarang() {
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

  var grid = w2ui["grid_barang"];
  var text = keyword.toLowerCase();
  grid.url = server_url + "api/product/retail/search/?keyword=" + keyword;
  grid.reload();
  grid.search(text);
}
