const numeral = require("numeral");
const toastr = require("toastr");
const select2 = require("select2")();
const Store = require("electron-store");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';

var api_url = server_url;
// var module = '<?=$module?>';
var header = "Daftar supplier";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get    : api_url + "api/supplier/all",
      remove : api_url + "api/supplier/remove",
      save   : api_url + "api/supplier/save",
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
      'add' : {
          type : 'button',
          text : ('Tambah'),
          tooltip : ('Tambah data'),
          img  : 'icon-add'
      },
      'edit' : {
          type : 'button',
          text : ('Edit'),
          tooltip : ('Edit data'),
          img  : 'icon-edit',
          disabled: false
      },
      'delete' : {
          type : 'button',
          text : ('Hapus'),
          tooltip : ('Hapus data'),
          img  : 'icon-delete',
          disabled: true
      },
      'save' : {
          type : 'button',
          text : ('Simpan'),
          tooltip : ('Simpan perubahan'),
          img  : 'icon-save'
      }
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
        field: "nama_supplier",
        label: "Nama supplier",
        type: "text",
      },
    ],
    columns: [
      {
        field: "idsupp",
        text: "ID",
        size: "50px",
        sortable: true,
        attr: "align=center",
      },
      {
        field: "nama_supplier",
        text: "Nama supplier",
        size: "40%",
        sortable: true,
      },
      {
        field: "supptype",
        text: "Tipe",
        size: "40%",
        sortable: true,
      },
      {
        field: "alamat",
        text: "Alamat",
        size: "30%",
        sortable: true,
      },
      {
        field: "no_hp",
        text: "Telepon",
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
          var html = '<a style="padding:2px" href="javascript:remove(\''+record.supplier_id+'\',\''+record.nama_supplier+'\')" class="btn btn-xs btn-danger">Hapus</a>';

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
    sortData: [{ field: "supplier_id", direction: "desc" }],
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
  $("input").val("")
  $("textarea").val("")
  $("input[type='submit']").val("Simpan")
  $("#data_title").text("Tambah supplier")
  $("#insert").val(1)
  $("input[name='supplier_id']").attr('disabled',true)

}

function edit(data) {
  $("#modal").modal("show");
  $("input[name='supplier_id']").attr('disabled',false)
  $("input[name='supplier_id']").val(data.supplier_id)
  $("input[name='idsupp']").val(data.idsupp)
  $("input[name='nama_supplier']").val(data.nama_supplier)
  $("textarea[name='alamat']").val(data.alamat)
  $("textarea[name='kota']").val(data.kota)
  $("input[name='no_hp']").val(data.no_hp)

  $("#data_title").text("Edit supplier")
  $("#insert").val(0)


}

$("#post").on('submit', (function(e) {
  e.preventDefault();
  $.ajax({
      url: api_url + 'api/supplier/insert',
      type: 'POST',
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data) {
          // w2alert('<i class="fa  fa-check-circle"></i>&nbsp; '+data.message);
          toastr.success(data.message)
          w2ui[name].reload();
          if($("#insert").val()==1){
            $("#modal").modal("hide");
          }
      },
      error: function(data) {}
  });

}));
function remove(id,supplier)
{
  w2confirm('Anda ingin menghapus data ini? <br> '+supplier)
  .yes(() => { 
    $.post(api_url + 'api/supplier/remove',
    {
      id:id
    },function(data){
      toastr.success(data.message)
      w2ui[name].reload();
    })

   })
  .no(() => { console.log('NO'); });

}