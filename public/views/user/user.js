const Store = require("electron-store");
const toastr = require("toastr")
const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
var api_url = server_url + "api/product/retail";
var api_url = server_url;
// var module = '<?=$module?>';
var header = "Daftar User";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get    : api_url + "api/user/all",
      remove : api_url + "api/user/remove",
      save   : api_url + "api/user/save",
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
      items: [],
      onLoad: function (event) {},
      onClick: function (event) {},
    },

    searches: [
      {
        field: "username",
        label: "Username",
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
        field: "username",
        text: "Username",
        size: "30%",
        sortable: true,
      },
      {
        field: "password",
        text: "Password",
        size: "30%",
        sortable: true,
        render: function (record) {
          return "******";
        }
        
      },
      // {
      //   field: "grp",
      //   text: "Group",
      //   size: "30%",
      //   sortable: true,
      // },
      {
        field: "level",
        text: "Level",
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
          var html = '<a style="padding:2px" href="javascript:remove(\''+record.username+'\')" class="btn btn-xs btn-danger">Hapus</a>';

          return html;
        },
      },
    ],
    parser: function (responseText) {
      var array = responseText.data;
      array.forEach((el) => (el.recid = el.id));
      var data = {
        total: responseText.data.length,
        records: array,
      };
      return data;
    },
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
  $("input").val("")
  $("input[type='submit']").val("Simpan")
  $("#data_title").text("Tambah User")
  $("#insert").val(1)
  $("input[name='username']").prop("readonly",false)

}

function edit(data) {
  $("#modal").modal("show");
  $("input[name='username']").prop("readonly",true)
  $("input[name='username']").val(data.username)
  $("select[name='level']").val(data.level)
  $("#data_title").text("Edit User")
  $("#insert").val(0)


}

$("#post").on('submit', (function(e) {
  e.preventDefault();
  $.ajax({
      url: api_url + 'api/user/insert',
      type: 'POST',
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData: false,
      success: function(data) {
          // w2alert('<i class="fa  fa-check-circle"></i>&nbsp; '+data.message);
         if(data.success){
            w2ui[name].reload();
            toastr.success(data.message)
          }
          if($("#insert").val()==1){
            $("#modal").modal("hide");
          }
      },
      error: function(data) {}
  });

}));
function remove(username)
{
  w2confirm('Anda ingin menghapus data ini? <br> '+username)
  .yes(() => { 
    $.post(api_url + 'api/user/remove',
    {
      username:username
    },function(data){
      toastr.success(data.message)
      w2ui[name].reload();
    })

   })
  .no(() => { console.log('NO'); });

}