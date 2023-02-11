const toastr = require("toastr");
const Store = require("electron-store");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
var base_url = store.get('base_url');
var load_url = store.get('base_url') + "views/kategori";
var api_url = server_url;
// var module = '<?=$module?>';
var header = "Daftar Kategori";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get    : api_url + "api/kategori/all",
      remove : api_url + "api/kategori/remove",
      save   : api_url + "api/kategori/save",
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
        field: "kategori",
        label: "Nama Kategori",
        type: "text",
      },
    ],
    columns: [
      {
        field: "kategori_id",
        text: "ID",
        size: "50px",
        sortable: true,
        attr: "align=center",
      },
      {
        field: "kategori",
        text: "Kategori",
        size: "40%",
        sortable: true,
      },
      {
        field: "delete",
        text: "Hapus",
        size: "80px",
        sortable: false,
        searchable: false,
        render(record, extra) {
          var html = '<a style="padding:2px" href="javascript:remove(\''+record.kategori_id+'\',\''+record.kategori+'\')" class="btn btn-xs btn-danger">Hapus</a>';

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

  // $.get(api_url+'api/kategori/getid',function(resp){
  //   $("input[name='cat']").val(resp.id)
  // })
  $("#modal").modal("show");
  $("input").val("")
  $("textarea").val("")
  $("input[type='submit']").val("Simpan")
  $("#data_title").text("Tambah Kategori")
  $("#insert").val(1)
  $("input[name='id']").attr("disabled",true)

}

function edit(data) {
  $("#modal").modal("show");
  $("input[name='id']").attr("disabled",false)
  $("input[name='id']").val(data.id)
  $("input[name='kategori']").val(data.kategori)
  $("#data_title").text("Edit Kategori")
  $("#insert").val(0)

}

$("#post").on('submit', (function(e) {
  e.preventDefault();
  $.ajax({
      url: api_url + 'api/kategori/insert',
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
            $(".w2ui-input").val("");
          }
      },
      error: function(data) {}
  });

}));
function remove(id,kategori)
{
  w2confirm('Anda ingin menghapus data ini? <br> '+kategori)
  .yes(() => { 
    $.post(api_url + 'api/kategori/remove',
    {
      id:id
    },function(data){
      toastr.success(data.message)
      w2ui[name].reload();
    })

   })
  .no(() => { console.log('NO'); });

}