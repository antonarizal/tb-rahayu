function openBarang() {
  var kasir = [];
  const Store = require("electron-store");
  const store = new Store();
  const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
  var api_url = server_url + "api/product/retail";
  const styleGrid = "border: 1px solid #ccc;font-size:16px!important;";
  const styleGridRight = styleGrid + "text-align:right;";

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
      url: server_url,
      tabIndex: 0,
      show: {
        toolbar: true,
        footer: true,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: true,
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
          { type: "spacer" },
          {
            type: "button",
            id: "pilih",
            text: "Pilih Barang",
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
              var barcode = $("#kode_barang").serializeArray();
              barcode = barcode[0].value.split("x");
              if (barcode.length > 1) {
                var qty = barcode[0];
              } else {
                var qty = 1;
              }
              row.jenis = 'barang'
              addCart(row, qty);
            } else {
              w2alert("Silahkan pilih barang yang akan ditambahkan");
            }
          }
        },
      },
      searches: [
        {
          field: "nama_barang",
          label: "Nama Barang",
          type: "text",
        },
        // {
        //   field: "kode_barang",
        //   label: "Kode Barang",
        //   type: "text",
        // },
      ],
      // searchData: [
      //   {
      //     field: "nama_barang",
      //     value: keyword,
      //     operator: "contains",
      //     type: "text",
      //   },
      // ],
      parser: function (responseText) {
        // var data = $.parseJSON(responseText);
        // do other things
        var array = responseText.data;
        array.forEach((el) => (el.recid = el.id));
        var data = {
          total: responseText.data.length,
          records: array,
        };
        return data;
      },
      columns: [
        {
          field: "id",
          text: '<span class="table-header">ID</span>',
          size: "20%",
          sortable: false,
          searchable: true,
          style : styleGrid
        },
        {
          field: "kode_barang",
          text: '<span class="table-header">KODE</span>',
          size: "30%",
          sortable: false,
          searchable: true,
          style : styleGrid

        },
        {
          field: "nama_barang",
          text: '<span class="table-header">NAMA BARANG</span>',
          sortable: false,
          searchable: true,
          style : styleGrid

        },
        {
          field: "harga_jual",
          text: '<span class="table-header">HARGA</span>',
          size: "33%",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html =
              "<b>Rp." + numeral(record.harga_jual).format("0,0") + "</b>";

            return html;
          },
          style : styleGridRight

        },
        {
          field: "stok",
          text: '<span class="table-header">STOK</span>',
          size: "33%",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html = numeral(record.stok).format("0,0.00");

            return html;
          },
          style : styleGridRight

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
    w2ui["grid_barang"].url = server_url + "api/product/all";
    w2ui["grid_barang"].reload();
  });

  // function searchBarang(el) {
  //   var grid = w2ui[grid_r];
  //   var text = el.value.toLowerCase();
  //   grid.search(text);
  // }

  w2popup.open({
    title: "Data Barang",
    width: 900,
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
  var grid = w2ui['grid_barang'];
  var keyword = $("#search_product").val();

  if (event.keyCode === 40) {
    grid.select(1);
    grid.focus(1);
  } else {
    // var keyword = $("#search_product").val();
    // let url = "http://localhost:3344/barang/mutasi?where=description&keyword=" + $("#search_product").val();
    // grid.url = (url);
    // grid.search('description', keyword);
    // grid.textSearch = 'contains';
    // grid.reload();
    // grid.selectAll;
    var text = keyword.toLowerCase();
    grid.url = server_url + "api/product/retail/search?keyword=" + keyword;
    grid.reload();
    grid.search(text);


  }


}
