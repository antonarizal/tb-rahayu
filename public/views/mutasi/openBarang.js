function openBarang() {
  var kasir = [];
  var api_url = config.server_url + "api/product/grosir";
  var keyword = $("#search_product").val();
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  var grid_r = "grid_barang";
  var bgcolor = "background:yellow";
  const config_barang = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        { type: 'top', size: 40, resizable: false, html: 
        '<div style="padding: 3px 10px;">' +
        '    <input placeholder="Cari nama barang" id="search_product" size="40" onkeyup="searchProduct(this)" ' +
        '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" />' +
        '</div>'
       },
        {
          type: "main",
          size: "100%",
          resizable: false,
          minSize: 300,
        },
      ],
    },
    grid_mode: {
      name: grid_r,
      style: "border: 1px solid #efefef",
      url: api_url,
      tabIndex: 0,
      show: {
        toolbar: false,
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
          field: "plu",
          direction: "desc",
        },
      ],
      toolbar: {
        items: [
          {
            type: "html",
            id: "search_product",
            html: function (item) {
              var html =
                '<div style="padding: 3px 10px;">' +
                '    <input placeholder="Cari nama barang" id="search_product" size="40" onChange="searchProduct(this)" ' +
                '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" />' +
                '</div>';
              return html;
            },
          },
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
            var grid = w2ui[grid_r];
            var qty = $("#faktur").val();
            var sel = grid.getSelection();
            if (sel.length == 1) {
              var data = grid.get(sel[0]);
              var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
              var row = selected[0];
             
              addColi(row, 1);
            } else {
              w2alert("Silahkan pilih barang yang akan ditambahkan");
            }
          }
        },
      },
      searches: [
        {
          field: "description",
          label: "Nama Barang",
          type: "text",
        },
      ],
      searchData: [
        {
          field: "description",
          value: keyword,
          operator: "contains",
          type: "text",
        },
      ],
      parser: function (responseText) {
        // var data = $.parseJSON(responseText);
        // do other things
        //  TT PLATIK TAPAN
        var array = responseText.data;
        array.forEach((el) => (el.recid = el.plu.trim()));
        var data = {
          total: responseText.data.length,
          records: array,
        };
        return data;
      },
      columns: [
        {
          field: "plu",
          text: "PLU",
          size: "70px",
          sortable: true,
          searchable: true,
        },
        {
          field: "description",
          text: "Nama Barang",
          size: "200px",
          sortable: true,
          searchable: true,
        },
        {
          field: "price",
          text: "Harga Jual",
          size: "85px",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var html =
              numeral(record.price1).format("0,0") 

            return html;
          },
        },
        {
          field: "stock",
          text: "Stok<br>TOKO",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var color = $("#lokasiAsalId").val() =='G00' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(record.stock).format("0") + '</span>';            return html;
          },
        },
        {
          field: "stock1",
          text: "Stok<br>ECER01",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var color = $("#lokasiAsalId").val() =='G01' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(record.stock1).format("0") + '</span>';            return html;
          },
        },
        {
          field: "stock2",
          text: "Stok<br>ECER02",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var color = $("#lokasiAsalId").val() =='G02' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(record.stock2).format("0") + '</span>';            return html;
          },
        },
        {
          field: "stock3",
          text: "Stok<br>SENDOK",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var color = $("#lokasiAsalId").val() =='G03' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(record.stock3).format("0") + '</span>';            return html;
          },
        },
        {
          field: "stock4",
          text: "Stok<br>TT",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var coli = record.stock4 / record.ikeypack1;
            var color = $("#lokasiAsalId").val() =='G04' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(coli).format("0.00") + '</span>';
            return html;
          },
        },
        {
          field: "stock5",
          text: "Stok<br>PLASTIK",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var coli = record.stock5 / record.ikeypack1;
            var color = $("#lokasiAsalId").val() =='G05' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(coli).format("0.00") + '</span>';
            return html;
          },
        },
        {
          field: "stock6",
          text: "Stok<br>MAKRO",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var color = $("#lokasiAsalId").val() =='G06' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(record.stock6).format("0") + '</span>';            return html;
          },
        },
        {
          field: "stock7",
          text: "Stok<br>TAPAN",
          sortable: false,
          searchable: false,
          render(record, extra) {
            var coli = record.stock7 / record.ikeypack1;
            var color = $("#lokasiAsalId").val() =='G07' ? 'red' : 'black';
            var html = '<span style="color:'+color+'">'+numeral(coli).format("0.00") + '</span>';
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
             
          addColi(row, 1);
        }
      },
    },
  };

  $(function () {
    // initialization in memory
    $().w2layout(config_barang.layout_mode);
    $().w2grid(config_barang.grid_mode);
    var gudang = $("#lokasiAsalId").val();

    // w2ui[grid_r].hideColumn('cost');
    if($("#cari").val() ==""){
      url = config.server_url + "api/product/grosir";
      w2ui[grid_r].url = url;
      w2ui[grid_r].reload();
    }else{
      url = config.server_url + "api/product/grosir/search?keyword="+$("#cari").val();
      w2ui[grid_r].url = url;
      w2ui[grid_r].reload();
      w2ui[grid_r].search(keyword);
    }


  });

  // function searchProduct(el) {
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
    var keyword = $("#cari").val();
    $("#search_product").focus();
    $("#search_product").val(keyword);
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
  var grid = w2ui['grid_barang'];
  // var text = keyword.toLowerCase();
  grid.url = config.server_url + "api/product/grosir/search/?keyword=" + keyword;
  grid.reload();
  grid.search('description',keyword);
  grid.search([{ field: 'description', value: keyword, operator: 'between'}], 'OR');
}
