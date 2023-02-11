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

var api_url = server_url;
// var module = '<?=$module?>';
var header = "Retur Pembelian";
var rand = "";
var name = "grid_123";
var config_barang = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get : api_url + "api/retur/pembelian/all",
      remove : api_url + "api/retur/pembelian/remove",
    },
    method: "GET",
    reorderRows: false,
    msgDelete: 'Anda ingin menghapus data ini?',
    autoLoad: true,
    show: {
      header: true,
      toolbar: true,
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
          id: "grand_total",
          html: function (item) {
            var html =
              '<div style="padding: 3px 10px;font-weight:bold;font-size:16px"><span id="grand_total"></span></div>';
            return html;
          },
        },
      ],
      onLoad: function (event) {},

      onClick: function (event) {
        if (event.target == "tampilkan") {
          var tgl_mulai = $("#tgl_mulai").val();
          var tgl_selesai = $("#tgl_selesai").val();
          loadpembelian(tgl_mulai, tgl_selesai);

          if (tgl_mulai == "" || tgl_selesai == "") {
            w2alert("Silahkan tanggal periode");
          }
        }
        if (event.target == "empty") {
          empty();
        }
      },
    },

    columns: [
      {
        field: "faktur",
        text: "Faktur",
        size: "20%",
        sortable: true,
      },
      {
        field: "date",
        text: "Tanggal",
        size: "30%",
        sortable: true,
        render(record, extra) {
          var html = moment(record.date).isValid() ? moment(record.date).format("DD-MM-YYYY") : "";
          return html;
        },
      },
      {
        field: "terjual",
        text: "Jumlah Item",
        size: "100px",
        sortable: true,
      },
      {
        field: "pelanggan",
        text: "Pelanggan",
        size: "100px",
        sortable: true,
      },
      {
        field: "grand_total",
        text: "Total",
        size: "10%",
        sortable: true,
        style:"text-align:right",
        render(record, extra) {
          var html = "Rp." + numeral(record.grand_total).format("0,0");

          return html;
        },
      },
      {
        field: 'action',
        text: 'Action',
        size: '100px',
        render(record, extra) {
        var html = '<a style="padding:5px" class="btn btn-xs btn-default" href="javascript:detailpembelian(\''+record.id+'\')"><i class="fa fa-info-circle "></i> Detail</a> ';
        return html;
        }
    },
    ],
    onLoad: function (event) {
      var total = event.xhr.responseJSON.data;
      var timesRun = 0;
      var interval = setInterval(function () {
        timesRun += 1;
        if (timesRun === 2) {
          clearInterval(interval);
        }
        $("#grand_total").html("Total Retur : Rp."+numeral(total.grand_total).format("0,0"))
        $("#terjual").html('Item : '+numeral(total.terjual).format("0,0") + ' item')

      }, 100);

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
  $.get(api_url + "/data", function (resp) {
    $("#count").html("Total : " + resp.count);
  });
}
function loadpembelian(tgl_mulai, tgl_selesai) {
  var grid = w2ui[name];
  // var text = keyword.toLowerCase();
  grid.url =
    api_url +
    "api/retur/pembelian/all/?tgl_mulai=" +
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
function detail(id) {
  // alert(id)
  $('#modal').modal('show');
  $.get(server_url+'api/pembelian/detail/'+id,function(resp){
    // $('#loadModal').html(JSON.stringify(resp))
    console.log(resp)
  })

}