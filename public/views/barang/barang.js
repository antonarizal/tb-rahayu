const Store = require("electron-store");
const toastr = require("toastr");
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";

const styleGrid = "border: 1px solid #ccc;font-size:14px!important;";
const styleGridRight = styleGrid + "text-align:right;";

const numeral = require("numeral");
const moment = require("moment");
const select2 = require("select2")();
var base_url = store.get("hostName");
var load_url = base_url + "views/barang";
var api_url = server_url;
var header = "Daftar Barang";
var rand = "";
var name = "grid_data";
var config_barang = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: api_url + "/api/barang/all",
    method: "GET",
    reorderRows: false,
    autoLoad: true,
    show: {
      header: true,
      toolbar: true,
      footer: true,
      toolbarReload: false,
      toolbarAdd: true,
      toolbarDelete: true,
      toolbarSave: false,
      toolbarEdit: true,
      lineNumbers: true,
      selectColumn: true,
    },
    limit: 20,
    multiSearch: false,
    toolbar: {
      items: [
        {
          type: "break",
        },
        {
          type: "button",
          id: "kategori",
          text: "Kategori",
          icon: "fa fa-th",
        },
        {
          type: "button",
          id: "satuan",
          text: "Satuan",
          icon: "fa fa-tag",
        },
        // {
        //   type: "break",
        // },
        // {
        //   type: "button",
        //   id: "import",
        //   text: "Import",
        //   icon: "fa fa-upload",
        // },
        // {
        //   type: "button",
        //   id: "export",
        //   text: "Export",
        //   icon: "fa fa-file-excel",
        // },
        // {
        //   type: "button",
        //   id: "empty",
        //   text: "Kosongkan",
        //   icon: "fa fa-ban",
        // },
      ],
      onLoad: function (event) {},

      onClick: function (event) {
        if (event.target == "kategori") {
          openPopup("kategori");
        }
        if (event.target == "satuan") {
          openPopup("satuan");
        }
        if (event.target == "import") {
          openImport();
        }
        if (event.target == "export") {
          // var grid = w2ui[name];
          // var Data = (grid.records);
          $.get(api_url + "/all_data/", function (data) {
            console.log(data);
            // var Data = JSON.parse(data);
            // console.log(Data);
            openExport(data, "xls", true);
          });
          // console.log(Data)
          // openExport(Data, "xls",true);
        }
        if (event.target == "empty") {
          empty();
        }
      },
    },

    searches: [
      {
        field: "nama_barang",
        label: "Nama Barang",
        type: "text",
      },
    ],
    columns: [
      {
        field: "id",
        text: '<span class="table-header">ID</span>',
        size: "50px",
        sortable: true,
        attr: "align=center",
        style : styleGrid,

      },
      {
        field: "kode_barang",
        text: '<span class="table-header">KODE</span>',
        size: "10%",
        sortable: true,
        style : styleGrid,

      },
      {
        field: "nama_barang",
        text: '<span class="table-header">NAMA BARANG</span>',
        size: "30%",
        sortable: true,
        style : styleGrid,

      },
      {
        field: "satuan",
        text: '<span class="table-header">SATUAN</span>',
        size: "10%",
        sortable: true,
        style : styleGrid,

      },
      {
        field: "kategori",
        text: '<span class="table-header">KATEGORI</span>',
        size: "10%",
        sortable: true,
        style : styleGrid,

      },
      {
        field: "harga_beli",
        text: '<span class="table-header">HARGA BELI</span>',
        size: "20%",
        sortable: true,
        render(record, extra) {
          var html = "Rp." + numeral(record.harga_beli).format("0,0");

          return html;
        },
        style : styleGrid,

      },
      {
        field: "harga_jual",
        text: '<span class="table-header">HARGA JUAL</span>',
        size: "20%",
        render(record, extra) {
          var html = "Rp." + numeral(record.harga_jual).format("0,0");

          return html;
        },
        style : styleGrid,

      },
      {
        field: "stok",
        text: '<span class="table-header">STOK</span>',
        size: "10%",
        render(record, extra) {
          var html = numeral(record.stok).format("0,0.00");

          return html;
        },
        style : styleGrid,

      },
      {
        field: "nama_supplier",
        text: '<span class="table-header">Supplier</span>',
        size: "20%",
        style : styleGrid,

      },
      {
        field: "expired",
        text: '<span class="table-header">EXPIRED</span>',
        size: "10%",
        render(record, extra) {
          var html = moment(record.expired).isValid() ? moment(record.expired).format("DD-MM-YYYY") : "";
          return html;
        },
        style : styleGrid,

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
    sortData: [{ field: "barang.id", direction: "desc" }],
    onAdd: function (event) {
      add();
    },
    onEdit: function (event) {
      var selected = w2ui[name].get(w2ui[name].getSelection());
      var row = selected[0];
      edit(row);
    },
    onDelete: function (event) {
      var id = w2ui[name].getSelection();
      console.log(id);
      loadData();
    },
    onSave: function (event) {
      w2alert("save");
    },
  },
};

$(function () {
  $("#grid").w2grid(config_barang.grid);
  // loadData()
});

function loadData() {
  // $.get(api_url + "/data", function (resp) {
  //   $("#count").html("Total : " + resp.count);
  // });
}
function openImport() {
  $("#modal").modal("show");
  $("#loadModal").load(load_url + "/import/");
}
function openExport(Data, type, showFields) {
  // Data       : {}. Can be any data you want to export (records, columns, custom, etc...).
  // type       : string. Extension of file name 'xls' or 'csv' are possible. By default 'excel' format is done on array
  // showFields : boolean (optional). Insert field names on top of the file data. By default 'false'
  var arrData = typeof Data != "object" ? JSON.parse(Data) : Data;
  fileName = header + "." + type;
  var Data = "";
  // show fields on first row ?
  if (showFields) {
    var row = "";
    for (var index in arrData[0]) {
      if (row != "" && type == "csv") row += ",";
      row += index + "\t";
    }
    row = row.slice(0, -1);
    Data += row + "\r\n";
  }
  // Prepare array data format
  for (var i = 0; i < arrData.length; i++) {
    var row = "";
    for (var index in arrData[i]) {
      if (row != "" && type == "csv") row += ",";
      row +=
        type == "xls"
          ? '"' + arrData[i][index] + '"\t'
          : arrData[i][index] + "\t";
    }
    row.slice(0, row.length - 1);
    Data += row + "\r\n";
  }
  // No data?
  if (Data == "") {
    w2alert("No Data Found");
    return;
  }
  var link = document.createElement("a");
  // browser with HTML5 support download attribute
  if (link.download !== undefined) {
    var uri = "data:application/vnd.ms-excel," + escape(Data);
    link.setAttribute("href", uri);
    link.setAttribute("style", "visibility:hidden");
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // IE 10,11+
  else if (navigator.msSaveBlob) {
    var blob = new Blob([Data], {
      type: "text/csv;charset=utf8;",
    });
    navigator.msSaveBlob(blob, fileName);
  }
  // old IE 9-  remove this part ?? deprecated browsers ??
  var ua = window.navigator.userAgent;
  var ie = ua.indexOf("MSIE ");
  if (ie > -1) {
    if (document.execCommand) {
      var oWin = window.open("about:blank", "_blank");
      oWin.document.write(Data);
      oWin.document.close();
      var success = oWin.document.execCommand("SaveAs", true, fileName);
      oWin.close();
    }
  }
}
function add() {
  $("#modal").modal("show");
  $("input").val("");
  $("textarea").val("");
  $("input[type='submit']").val("Simpan Data");
  $("input[name='stok']").val(0);
  $("input[name='stok_minimal']").val(0);
  $("#kategori").html("");
  $("#satuan").html("");
  loadKategori();
  loadSatuan();
  loadSupplier();
}

function edit(row) {
  $("#modal").modal("show");
  console.log(row);
  $("input[name='id']").val(row.id);
  $("input[name='kode_barang']").val(row.kode_barang);
  $("textarea[name='nama_barang']").val(row.nama_barang);
  $("input[name='harga_beli']").val(numeral(row.harga_beli).format("0,0"));
  $("input[name='harga_jual']").val(numeral(row.harga_jual).format("0,0"));
  $("input[name='stok']").val(row.stok);
  $("input[name='expired']").val(row.expired);
  $("input[name='stok_minimal']").val(row.stok_minimal);
  $("input[name='idloc']").val(row.idloc);
  $("#kategori").html("");
  $("#satuan").html("");
  loadKategori(row.idcat);
  loadSatuan(row.satuan_id);
  loadSupplier(row.idsupp);
}
function loadKategori(kategori = "") {
  $.get(server_url + "api/kategori/index", function (resp) {
    $.each(resp, function (idx, val) {
      $("#kategori").append(
        $("<option>").text(val.kategori).attr("value", val.idcat)
      );
    });
    if (kategori != "") {
      $("#kategori").val(kategori);
    }
  });
}
function loadSupplier(idsupp = "") {
  $.get(server_url + "api/supplier/index", function (resp) {
    $.each(resp, function (idx, val) {
      $("#supplier").append(
        $("<option>").text(val.nama_supplier).attr("value", val.idsupp)
      );
    });
    if (supplier != "") {
      $("#supplier").val(idsupp);
    }
  });
}
function loadSatuan(satuan = "") {
  $.get(server_url + "api/satuan/index", function (resp) {
    $.each(resp, function (idx, val) {
      $("#satuan").append(
        $("<option>").text(val.satuan).attr("value", val.satuan_id)
      );
    });
    if (satuan != "") {
      $("#satuan").val(satuan);
    }
  });
}

function tambahKategori() {
  w2prompt({
    label: "Tambah Kategori",
    value: "",
    attrs: 'style="width: 300px"',
    title: w2utils.lang("Kategori"),
    ok_text: w2utils.lang("Simpan"),
    ok_class: "ok-class",
    cancel_text: w2utils.lang("Batal"),
    cancel_class: "cancel-class",
    width: 300,
    height: 180,
  })
    .change((event) => {
      // console.log('change', event)
    })
    .ok((value) => {
      $("#kategori").html("<option></option>");
      $.post(
        api_url + "api/kategori/insert/",
        {
          kategori: value,
          insert: true,
        },
        function (data, status) {
          loadKategori(data.id);
        }
      );
    })
    .cancel(() => {
      console.log("batal");
    });
}
function tambahSatuan() {
  w2prompt({
    label: "Tambah Satuan",
    value: "",
    attrs: 'style="width: 200px"',
    title: w2utils.lang("Satuan"),
    ok_text: w2utils.lang("Simpan"),
    ok_class: "ok-class",
    cancel_text: w2utils.lang("Batal"),
    cancel_class: "cancel-class",
    width: 300,
    height: 180,
  })
    .change((event) => {
      // console.log('change', event)
    })
    .ok((value) => {
      $.post(
        api_url + "/api/satuan/insert/",
        {
          satuan: value,
          insert: true,
        },
        function (data, status) {
          $("#satuan").html("<option></option>");
          loadSatuan(data.id);
        }
      );
    })
    .cancel(() => {
      console.log("batal");
    });
}

function openPopup(mode) {
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  const grid_r = "grid_" + rdm;
  console.log(rdm);
  const config_kategori = {
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
      url: api_url + "/api/" + mode + "/" + mode,
      show: {
        toolbar: true,
        footer: true,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: false,
        searchAll: false,
        toolbarInput: false,
        toolbarAdd: true,
        toolbarEdit: false,
        toolbarDelete: true,
      },
      columns: [
        {
          field: mode+"_id",
          text: "ID",
          size: "50px",
          sortable: true,
          searchable: true,
        },
        {
          field: mode,
          text: mode,
          size: "33%",
          sortable: true,
          searchable: true,
        },
      ],
      sortData: [{ field: mode+"_id", direction: "desc" }],
      onAdd: function (event) {
        w2prompt({
          label: "Tambah : ",
          value: "",
          attrs: 'style="width: 200px"',
          title: w2utils.lang("Notification"),
          ok_text: w2utils.lang("Save"),
          cancel_text: w2utils.lang("Cancel"),
          width: 400,
          height: 150,
        })
          .change(function (event) {
            console.log("change", event);
          })
          .ok(function (event) {
            console.log(event);
            if (mode == "kategori") {
              $.post(
                api_url + "/api/" + mode + "/insert/",
                {
                  kategori: event,
                  insert: true,
                },
                function (data, status) {
                  w2ui[grid_r].reload();
                }
              );
            } else {
              $.post(
                api_url + "/api/" + mode + "/insert/",
                {
                  satuan: event,
                },
                function (data, status) {
                  w2ui[grid_r].reload();
                }
              );
            }
          });
      },
    },
  };

  $(function () {
    // initialization in memory
    $().w2layout(config_kategori.layout_mode);
    $().w2grid(config_kategori.grid_mode);
  });

  w2popup.open({
    title: mode,
    width: 500,
    height: 600,
    showMax: false,
    body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
    onOpen: function (event) {
      event.onComplete = function () {
        $("#w2ui-popup #main").w2render(layout_r);
        w2ui[layout_r].html("left", w2ui[grid_r]);
      };
    },
  });
}

function inputNum(number) {
  var angka = numeral(number.value).format("0,0");
  $(number).val(angka);
}

$("#post").on("submit", function (e) {
  if ($("input[name='kode_barang']").val() == "") {
    w2alert("Kode barang masih kosong").ok(() => {
      $("input[name='kode_barang']").focus();
    });
    $("input[name='kode_barang']").focus();
    return false;
  }
  var insert_url;
  var isEdit;
  if ($("input[name='id']").val() == "") {
    insert_url = api_url + "api/barang/create";
    isEdit = false;
  } else {
    insert_url = api_url + "api/barang/update/" + $("#id").val();
    isEdit = true;
  }
  e.preventDefault();
  $.ajax({
    url: insert_url,
    type: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      // w2alert('<i class="fa  fa-check-circle"></i>&nbsp; '+data.message);
      if (data.success) {
        toastr.success(data.message);
        w2ui[name].reload();
        loadData();
        if (!isEdit) {
          $("#modal").modal("hide");
        }
      } else {
        toastr.error(data.message);
      }
    },
    error: function (data) {},
  });
});

function auto() {
  const num = Math.floor(Math.random() * 999999999 + 1);
  $("#kode_barang").val(num);
  console.log(num);
}
