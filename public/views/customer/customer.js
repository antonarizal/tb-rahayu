const config = require("./config");
const numeral = require("numeral");
const toastr = require("toastr");
const select2 = require("select2")();

console.log(config);
var base_url = config.base_url;
var load_url = config.base_url + "views/customer";
var api_url = config.api_url;
// var module = '<?=$module?>';
var header = "Daftar Customer";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get    : api_url + "api/customers/all",
      remove : api_url + "api/customers/remove",
      save   : api_url + "api/customers/save",
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
        field: "customer",
        label: "Nama Customer",
        type: "text",
      },
    ],
    columns: [
      {
        field: "cusid",
        text: "ID",
        size: "50px",
        sortable: true,
        attr: "align=center",
      },
      {
        field: "customer",
        text: "Customer",
        size: "40%",
        sortable: true,
      },
      {
        field: "village",
        text: "Kelurahan",
        size: "30%",
        sortable: true,
      },
      {
        field: "subcity",
        text: "Kecamatan",
        size: "30%",
        sortable: true,
      },
      {
        field: "city",
        text: "Kota",
        size: "30%",
        sortable: true,
      },
      {
        field: "phone",
        text: "Telephone",
        size: "30%",
        sortable: true,
      },
      {
        field: "handphone1",
        text: "HP 1",
        size: "30%",
        sortable: true,
      },
      {
        field: "handphone2",
        text: "HP 2",
        size: "30%",
        sortable: true,
      },
      {
        field: "email",
        text: "Email",
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
          var html = '<a style="padding:2px" href="javascript:remove(\''+record.cusid+'\',\''+record.customer+'\')" class="btn btn-xs btn-danger">Hapus</a>';

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

  $.get(api_url+'api/customers/getid',function(resp){
    $("input[name='cusid']").val(resp.id)
  })
  $("#modal").modal("show");
  $("input").val("")
  $("textarea").val("")
  $("input[type='submit']").val("Simpan")
  $("#data_title").text("Tambah Customer")
  $("#insert").val(1)

}

function edit(data) {
  $("#modal").modal("show");
  $("input[name='cusid']").val(data.cusid.trim())
  $("input[name='customer']").val(data.customer.trim())
  $("textarea[name='address']").val(data.address.trim())
  $("input[name='village']").val(data.village.trim())
  $("input[name='subcity']").val(data.subcity.trim())
  $("input[name='city']").val(data.city.trim())
  $("input[name='phone']").val(data.phone.trim())
  $("input[name='handphone1']").val(data.handphone1.trim())
  $("input[name='handphone2']").val(data.handphone2.trim())
  $("input[name='email']").val(data.email.trim())
  $("input[name='status']").val(data.status.trim())
  $("input[name='kelompok']").val(data.kelompok.trim())

  $("#data_title").text("Edit Customer")
  $("#insert").val(0)


}

$("#post").on('submit', (function(e) {
  e.preventDefault();
  $.ajax({
      url: api_url + 'api/customers/insert',
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
function remove(cusid,customer)
{
  w2confirm('Anda ingin menghapus data ini? <br> '+customer)
  .yes(() => { 
    $.post(api_url + 'api/customers/remove',
    {
      cusid:cusid
    },function(data){
      toastr.success(data.message)
      w2ui[name].reload();
    })

   })
  .no(() => { console.log('NO'); });

}