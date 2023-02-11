function openBarang() {
  const config = require("./config");
  var keyword = $("#kode_barang").val();
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  const grid_r = "grid_" + rdm;
  const barang_url = config.api_url + "/barang/api/all";
  console.log(rdm);
  const config_barang = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        {
          type: "left",
          size: "100%",
          resizable: true,
          minSize: 300,
        },
      ],
    },
    grid_mode: {
      name: grid_r,
      style: "border: 1px solid #efefef",
      url: barang_url,
      tabIndex: 2,
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
      sortData: [{ field: "id", direction: "desc" }],
      toolbar: {
        items: [
          {
            type: "button",
            id: "pilih",
            text: "Pilih Barang",
            icon: "w2ui-icon-plus",
          },
        ],
        onLoad: function (event) {},

        onClick: function (event) {
          if (event.target == "pilih") {
            var grid = w2ui[grid_r];
            var faktur = $("#faktur").val();
            var sel = grid.getSelection();
            if (sel.length == 1) {
              var data = grid.get(sel[0]);
              addCart(data.kode_barang, faktur);
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
        {
          field: "kode_barang",
          label: "Kode Barang",
          type: "text",
        },
      ],
      searchData: [
        {
          field: "nama_barang",
          value: keyword,
          operator: "contains",
          type: "text",
        },
      ],
      onSelect: function (event) {
        console.log(event);
      },
      onKeydown: function (event) {
        console.log("keyCode", event.originalEvent.keyCode);
        if (event.originalEvent.keyCode == 13) {
          var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
          var kode_barang = selected[0].kode_barang;
          var faktur = $("#faktur").val();
          var row = selected[0];
          var faktur = $("#faktur").val();
          var g = w2ui[name].records.length;
          var product = {
            recid: row.kode_barang.trim(),
            barcode: row.kode_barang.trim(),
            nama_barang: row.nama_barang.trim(),
            harga_jual: row.harga_jual,
            qty: 1,
            diskon: 0,
            diskon_rp: 0,
            total: row.harga_jual,
          };

          w2ui[name].add(product);
          w2popup.close();
          w2ui[name].refresh();
          dataProduct.push(product);
          console.log(dataProduct)
        //   addCart(kode_barang,faktur);

        }
      },
      columns: [
        {
          field: "kode_barang",
          text: "Kode Barang",
          size: "30%",
          sortable: true,
          searchable: true,
        },
        {
          field: "nama_barang",
          text: "Nama Barang",
          sortable: true,
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

        {
          field: "stok",
          text: "Stok",
          size: "33%",
          sortable: false,
          searchable: false,
        },
        // {
        //     field: 'pilih',
        //     text: 'Pilih',
        //     size: '70px',
        //     sortable: true,
        //     searchable: true,
        //     render(record, extra) {
        //         var html = '<span style="padding:5px" class="btn btn-xs btn-default" href="javascript:addCart('+record.kode_barang+',\''+$("#faktur").val()+'\')"><i class="fa fa-check"></i> pilih</span>';
        //         return html;
        //     }
        // },
      ],
    },
  };

  $("#search_barang").keyup(function () {
    var text = this.value.toLowerCase();
    console.log(text);
    w2grid(config_barang.grid_mode).search([
      { field: "nama_barang", value: text, operator: "contains" },
    ]);
  });

  $(function () {
    // initialization in memory
    $().w2layout(config_barang.layout_mode);
    $().w2grid(config_barang.grid_mode);
  });

  w2popup.open({
    title: "Data Barang",
    width: 800,
    height: 600,
    showMax: false,
    body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
    onOpen: function (event) {
      event.onComplete = function () {
        $("#w2ui-popup #main").w2render(layout_r);
        w2ui[layout_r].html("left", w2ui[grid_r]);
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
    $("#grid_" + grid_r + "_search_all").focus();
    $("#grid_" + grid_r + "_search_all").val(keyword);
  }, 500);
}
