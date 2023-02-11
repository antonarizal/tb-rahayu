const numeral = require("numeral");
const toastr = require("toastr");
const moment = require("moment");
const Store = require("electron-store");
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
  const host = store.get("base_url") + "views";
  var db = new localdb("db_weringin");
  var isUserLogin = db.tableExists("user");
  if (!isUserLogin) {
    window.location.href = host + "/home/unauthorized";
  } else {
    var user = db.findById("user", 1);
    console.log(user);
  }
  const styleGrid = "border: 1px solid #ccc;font-size:14px!important;";
  const styleGridRight = styleGrid + "text-align:right;";
var base_url = store.get("base_url");
var load_url = store.get("base_url") + "views/supplier";
var api_url = server_url;
// var module = '<?=$module?>';
var header = "Transaksi Penjualan";
var rand = "";
var name = "grid_123";
var config_barang = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get : api_url + "api/penjualan/tb_rahayu",
      remove : api_url + "api/penjualan/remove",
    },
    msgDelete: 'Anda ingin menghapus data penjualan ini?',
    method: "GET",
    reorderRows: false,
    autoLoad: true,
    show: {
      header: true,
      toolbar: false,
      footer: true,
      toolbarSearch: false,
      toolbarReload: false,
      toolbarAdd: false,
      toolbarDelete: true,
      toolbarSave: false,
      toolbarEdit: false,
      lineNumbers: true,
      selectColumn: true,
    },
    limit: 20,
    multiSearch: false,
    toolbar: {
      items: [
        {
          type: "html",
          id: "tgl_mulai",
          html: function (item) {
            var html =
              ' <span style="padding-right:5px">Periode</span>     <input id="tgl_mulai" size="10" type="date" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>';
            return html;
          },
        },
        {
          type: "html",
          id: "tgl_selesai",
          html: function (item) {
            var html =
              ' <span style="padding-left:5px;padding-right:5px">s/d</span>   <input id="tgl_selesai" size="10" type="date" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>';
            return html;
          },
        },
        {
          type: "button",
          id: "tampilkan",
          text: "Tampilkan",
          icon: "fa fa-check",
        },
        {
          type: "spacer",
        },
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
        {
          type: "html",
          id: "terjual",
          html: function (item) {
            var html =
              '<div style="padding: 3px 10px;font-weight:bold;font-size:16px"><span id="terjual"></span></div>';
            return html;
          },
        },
        {
          type: "html",
          id: "pemasukan",
          html: function (item) {
            var html =
              '<div style="padding: 3px 10px;font-weight:bold;font-size:16px"><span id="pemasukan"></span></div>';
            return html;
          },
        },
        {
          type: "html",
          id: "spacerRight",
          html: function (item) {
            var html =
              '<div style="padding: 3px 10px;font-weight:bold;font-size:16px"><span id="spacerRight"></span></div>';
            return html;
          },
        },
      ],
      onLoad: function (event) {

        
      },

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
        if (event.target == "tampilkan") {
          var tgl_mulai = $("#tgl_mulai").val();
          var tgl_selesai = $("#tgl_selesai").val();
          loadPenjualan(tgl_mulai, tgl_selesai);

          if (tgl_mulai == "" || tgl_selesai == "") {
            w2alert("Silahkan tanggal periode");
          }
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

    columns: [
      {
        field: "idslshdr",
        text: '<span class="table-header">ID</span>',
        size: "10%",
        sortable: true,
        style : styleGrid,
      },
      {
        field: "custname",
        text: '<span class="table-header">Customer</span>',
        size: "20%",
        sortable: true,
        style : styleGrid,
      },
      {
        field: "sls_date",
        text: '<span class="table-header">Tanggal</span>',
        size: "30%",
        sortable: true,
        render(record, extra) {
          var html = moment(record.sls_date).isValid() ? moment(record.sls_date).format("DD-MM-YYYY") : "";
          return html;
        },
        style : styleGrid,
      },
      
      {
        field: "carabayar",
        text: '<span class="table-header">Status</span>',
        size: "10%",
        sortable: true,
        style : styleGrid,

      },
      {
        field: "salesPrice",
        text: '<span class="table-header">Total Jual</span>',
        size: "100px",
        sortable: true,
        render(record, extra) {
          var html = numeral(record.salesPrice).format("0,0");
          return html;
        },
        style : styleGridRight,
 
      },
      {
        field: "costPrice",
        text: '<span class="table-header">Total Beli</span>',
        size: "100px",
        sortable: true,
        render(record, extra) {
          var html = numeral(record.costPrice).format("0,0");
          return html;
        },
        style : styleGridRight,
        },
      {
        field: "margin",
        text: '<span class="table-header">Margin</span>',
        size: "100px",
        sortable: true,
        render(record, extra) {
          var html = numeral(record.margin).format("0,0");
          return html;
        },
        style : styleGridRight,
        },
        
        {
          field: 'action',
          text: 'Action',
          size: '100px',
          render(record, extra) {
          var html = '<a style="padding:5px" class="btn btn-xs btn-danger" href="javascript:deletePenjualan(\''+record.idslshdr+'\')"><i class="fa fa-trash"></i> Delete</a>';
          return html;
          }
        }
    //   {
    //     field: 'action',
    //     text: '<span class="table-header">Action</span>',
    //     size: '150px',
    //     render(record, extra) {
    //     var html = '<a style="padding:5px" class="btn btn-xs btn-default" href="javascript:detailPembelian(\''+record.id+'\')"><i class="fa fa-info-circle "></i> Detail</a> <a style="padding:5px" class="btn btn-xs btn-default" href="javascript:returPembelian(\''+record.id+'\')"><i class="fa fa-reply"></i> Retur</a>';
    //     return html;
    //     },
    //     style : styleGrid,
    // },
    ],
    onLoad: function (event) {
      var resp = event.xhr.responseJSON;
      console.log(resp)
      const totalPembelian = resp.records
      .map((item) =>numeral(item.costPrice).value()).reduce((prev, curr) => prev + curr, 0);
      const totalPenjualan = resp.records
      .map((item) =>numeral(item.salesPrice).value()).reduce((prev, curr) => prev + curr, 0);
      const margin = resp.records
      .map((item) =>numeral(item.margin).value()).reduce((prev, curr) => prev + curr, 0);
      console.log(totalPembelian)
      $("#totalPembelian").val(numeral(totalPembelian).format("0,0"))
      $("#totalPenjualan").val(numeral(totalPenjualan).format("0,0"))
      $("#margin").val(numeral(margin).format("0,0"))

    },
    sortData: [{ field: "id", direction: "desc" }],
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
function loadPenjualan(tgl_mulai, tgl_selesai) {
  var grid = w2ui[name];
  // var text = keyword.toLowerCase();
  grid.url =
    api_url +
    "api/penjualan/all?tgl_mulai=" +
    tgl_mulai +
    "&tgl_selesai=" +
    tgl_selesai;
  grid.reload();

  var timesRun = 0;
  var interval = setInterval(function () {
    timesRun += 1;
    if (timesRun === 2) {
      clearInterval(interval);
    }
    $("#tgl_mulai").val(tgl_mulai);
    $("#tgl_selesai").val(tgl_selesai);
  }, 100);
}
$("#tampilkan").on("click",function(){
  var grid = w2ui[name];
  // var text = keyword.toLowerCase();
  var tgl_mulai = $("#tgl_mulai").val()
  var tgl_selesai = $("#tgl_selesai").val()
  var idcustomer = $("#idcustomer").val()
  var pembayaran = $("#pembayaran").val()
  grid.url =
    api_url +
    "api/penjualan/tb_rahayu/?tgl_mulai=" +
    tgl_mulai +
    "&tgl_selesai=" +
    tgl_selesai+
    "&idcustomer=" +
    idcustomer+
    "&pembayaran=" +
    pembayaran
    ;
  grid.reload();
})
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


function detail(id) {
  // alert(id)
  $('#modal').modal('show');
  $.get(server_url+'api/penjualan/detail/'+id,function(resp){
    // $('#loadModal').html(JSON.stringify(resp))
    console.log(resp)
  })

}
function deletePenjualan(id) {
  w2confirm('Anda yakin menghapus data?')
  .yes(() => {

    $.get(server_url+'api/penjualan/tb_delete/'+id,function(resp){
      // $('#loadModal').html(JSON.stringify(resp))
      console.log(resp)
      if(resp.success){
        // w2alert("Sukses! Data berhasil dihapus")
        w2ui["grid_123"].reload()
      }else{
        w2alert("Data Gagal dihapus")
  
      }
    })
  
  })
  .no(() => {
      console.log('Yes')

  })
  // alert(id)
  $('#modal').modal('show');

}