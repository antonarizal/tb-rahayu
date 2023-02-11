const numeral = require("numeral");
const toastr = require("toastr");
const select2 = require("select2")();
const Store = require("electron-store");
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";

var api_url = server_url;
// var module = '<?=$module?>';
var header = "Daftar jasa";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get: api_url + "api/jasa/all",
      remove: api_url + "api/jasa/remove",
      save: api_url + "api/jasa/save",
    },
    method: "GET",
    reorderRows: false,
    autoLoad: true,
    show: {
      header: true,
      toolbar: true,
      footer: true,
      toolbarReload: true,
      toolbarAdd: true,
      toolbarDelete: false,
      toolbarSave: false,
      toolbarEdit: true,
      lineNumbers: true,
      selectColumn: true,
    },
    buttons: {
      add: {
        type: "button",
        text: "Tambah",
        tooltip: "Tambah data",
        img: "icon-add",
      },
      edit: {
        type: "button",
        text: "Edit",
        tooltip: "Edit data",
        img: "icon-edit",
        disabled: false,
      },
      delete: {
        type: "button",
        text: "Hapus",
        tooltip: "Hapus data",
        img: "icon-delete",
        disabled: true,
      },
      save: {
        type: "button",
        text: "Simpan",
        tooltip: "Simpan perubahan",
        img: "icon-save",
      },
    },
    limit: 20,
    multiSearch: false,
    toolbar: {
      items: [
        {
          type: "button",
          id: "empty",
          text: "Kosongkan",
          icon: "fa fa-ban",
        },
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
        field: "jasa",
        label: "Nama jasa",
        type: "text",
      },
    ],
    columns: [
      {
        field: "id",
        text: "ID",
        size: "50px",
        sortable: true,
        attr: "align=center",
      },
      {
        field: "kode_jasa",
        text: "Kode Jasa",
        size: "30%",
        sortable: true,
      },
      {
        field: "nama_jasa",
        text: "Nama jasa",
        size: "40%",
        sortable: true,
      },
      {
        field: "harga",
        text: "Harga",
        size: "30%",
        sortable: true,
      },
      {
        field: "delete",
        text: "Hapus",
        size: "80px",
        sortable: false,
        searchable: false,
        render(record, extra) {
          var html =
            '<a style="padding:2px" href="javascript:remove(\'' +
            record.id +
            "','" +
            record.nama_jasa +
            '\')" class="btn btn-xs btn-danger">Hapus</a>';

          return html;
        },
      },
    ],
    // parser: function (responseText) {
    //   var array = responseText.data;
    //   array.forEach((el) => (el.recid = el.id));
    //   var data = {
    //     total: responseText.data.length,
    //     records: array,
    //   };
    //   return data;
    // },
    sortData: [{ field: "id", direction: "desc" }],
    onAdd: function (event) {
      add();
    },
    onEdit: function (event) {
      var grid = w2ui[name];
      var sel = grid.getSelection();
      if (sel.length == 1) {
        var selected = w2ui[name].get(w2ui[name].getSelection());
        var row = selected[0];
        edit(row);
      } else {
        w2alert("Silahkan pilih barang yang akan ditambahkan");
      }
    },
    onDelete: function (event) {
      var id = w2ui[name].getSelection();
      console.log(id);
    },
    onSave: function (event) {
      w2alert("save");
    },
  },
};

$(function () {
  $("#grid").w2grid(config_user.grid);
  // loadData()
});

function add() {
  $("#modal").modal("show");
  $("input").val("");
  $("textarea").val("");
  $("input[type='submit']").val("Simpan");
  $("#data_title").text("Tambah jasa");
  $("#insert").val(1);
  $("input[name='id']").attr("disabled", true);
}

function edit(data) {
  $("#modal").modal("show");
  $("input[name='id']").attr("disabled", false);
  $("input[name='id']").val(data.id);
  $("input[name='nama_jasa']").val(data.nama_jasa);
  $("input[name='kode_jasa']").val(data.kode_jasa);
  $("input[name='harga']").val(data.harga);

  $("#data_title").text("Edit jasa");
  $("#insert").val(0);
}

$("#post").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: api_url + "api/jasa/insert",
    type: "POST",
    data: new FormData(this),
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      // w2alert('<i class="fa  fa-check-circle"></i>&nbsp; '+data.message);
      toastr.success(data.message);
      w2ui[name].reload();
      if ($("#insert").val() == 1) {
        $("#modal").modal("hide");
      }
    },
    error: function (data) {},
  });
});
function remove(id, jasa) {
  w2confirm("Anda ingin menghapus data ini? <br> " + jasa)
    .yes(() => {
      $.post(
        api_url + "api/jasa/remove",
        {
          id: id,
        },
        function (data) {
          toastr.success(data.message);
          w2ui[name].reload();
        }
      );
    })
    .no(() => {
      console.log("NO");
    });
}
function inputNum(number) {
  var angka = numeral(number.value).format("0,0");
  $(number).val(angka);
}
