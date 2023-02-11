const config = require("./config");
const toastr = require("toastr");
const numeral = require("numeral");
const moment = require('moment');

$("input[type='text']").prop("disabled", true);
console.log(config);
var base_url = config.base_url;
var load_url = config.base_url + "views/kategori";
var api_url = config.api_url;
// var module = '<?=$module?>';
var header = "MASTER STOK";
var rand = "";
var name = "grid_data";
var config_user = {
  grid: {
    name: name,
    style: "border: 1px solid #ccc",
    header: header,
    url: {
      get    : api_url + "api/barang/stok",
    },
    method: "GET",
    reorderRows: false,
    autoLoad: true,
    show: {
      header: true,
      toolbar: true,
      footer: true,
      toolbarReload: true,
      toolbarAdd: false,
      toolbarDelete: false,
      toolbarSave: false,
      toolbarEdit: false,
      lineNumbers: false,
      selectColumn: false,
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
        { type: 'html',  id: 'online',
            html(item) {
                let html ='Online <input tabindex="-1" id="online" size="1" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>';
                return html;
            }
        },
        { type: 'html',  id: 'supid_hemat',
            html(item) {
                let html ='Supplier Hemat <input tabindex="-1" id="supid_hemat" size="5" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>';
                return html;
            }
        },
        { type: 'break', id: 'break1' },
        { type: 'html',  id: 'merk',
            html(item) {
                let html ='Merk <input tabindex="-1" id="merk" size="5" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>';
                return html;
            }
        },
        { type: 'html',  id: 'descriptionsup',
            html(item) {
                let html ='<input tabindex="-1" id="descriptionsup" size="30" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>';
                return html;
            }
        },
        { type: 'break', id: 'break2' },
        { type: 'button', id: 'tambah', text: 'Data Baru', icon: 'fa fa-plus' },
        { type: 'button', id: 'cetak', text: 'Cetak', icon: 'fa fa-print' },

      ],
      onLoad: function (event) {},
      onClick: function (event) {},
    },

    searches: [
      {
        field: "description",
        label: "Nama Produk",
        type: "text",
      },
    ],
    columns: [
      {
        field: "plu",
        text: "PLU",
        size: "90px",
        sortable: true,
        attr: "align=left",
      },
      {
        field: "barcode",
        text: "Barcode",
        size: "120px",
        sortable: true,
        attr: "align=left",
      },
      {
        field: "description",
        text: "Nama Barang",
        size: "40%",
        sortable: true,
      },
      {
        field: "price1",
        text: "H. Jual",
        size: "30%",
        sortable: true,
        attr: "align=right",
        render(record, extra) {
          var html = numeral(record.price1).format("0,0");
          return html;
        },
      },
      {
        field: "stock",
        text: "Stok",
        size: "30%",
        attr: "align=right",
        sortable: true,
        render(record, extra) {
          var html = numeral(record.stock).format("0");
          return html;
        },
      },
      {
        field: "dtjl1",
        text: "Jual Akhir",
        size: "30%",
        sortable: true,
        render(record, extra) {
          var html = moment(record.dtjl1).format("DD-MM-YYYY") !='Invalid date' ? moment(record.dtjl1).format("DD-MM-YYYY") : '';
          return html;
        }
      },
      {
        field: "rak1",
        text: "Rak",
        size: "30%",
        sortable: true,
        attr: "font-color=blue",

      },
      // {
      //   field: "delete",
      //   text: "Hapus",
      //   size: "80px",
      //   sortable: false,
      //   searchable: false,
      //   render(record, extra) {
      //     var html = '<a style="padding:2px" href="javascript:remove(\''+record.cusid+'\')" class="btn btn-xs btn-danger">Hapus</a>';
      //     return html;
      //   },
      // },
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
    onClick: function(event) {
      var grid = this;

      event.onComplete = function () {
      var sel = grid.getSelection();
      if (sel.length == 1) {
        row = $.extend(true, {}, grid.get(sel[0]));
        console.log(row.plu);
        getData(row.plu.trim());
      } else {
      }
    }
  }
  },
};

$(function () {
  $("#grid").w2grid(config_user.grid);
  // loadData()
});

function getData(plu)
{
  $.get(api_url + "api/barang/getdata/?plu=" + plu, function(resp, status){
    console.log(resp);
    if (resp.success) {
      var profit = (resp.data.price1 - resp.data.cost) / resp.data.cost * 100;
      $("#online").val(resp.data.online);
      $("#supid_hemat").val(resp.data.supid_hemat);
      $("#merk").val(resp.merk);
      $("#note").val(resp.data.note);
      $("#descriptionsup").val(resp.data.descriptionsup);
      $("#supid1").val(resp.data.supid1);
      $("#supid2").val(resp.data.supid2);
      $("#catid").val(resp.data.catid);
      $("#supplier1").val(resp.supplier1);
      $("#supplier2").val(resp.supplier2);
      $("#category").val(resp.category);
      $("#stock").val(numeral(resp.data.stock).format('0'));
      $("#stock1").val(numeral(resp.data.stock1).format('0'));
      $("#stock2").val(numeral(resp.data.stock2).format('0'));
      $("#stock3").val(numeral(resp.data.stock3).format('0'));
      $("#stock4").val(numeral(resp.data.stock4).format('0'));
      $("#stock5").val(numeral(resp.data.stock5).format('0'));
      $("#stock6").val(numeral(resp.data.stock6).format('0'));
      $("#stock7").val(numeral(resp.data.stock7).format('0'));
      $("#stock8").val(numeral(resp.data.stock8).format('0'));
      $("#stock9").val(numeral(resp.data.stock9).format('0'));
      $("#stock10").val(numeral(resp.data.stock10).format('0'));
      $("#stock11").val(numeral(resp.data.stock11).format('0'));
      $("#stock12").val(numeral(resp.data.stock12).format('0'));
      $("#stock13").val(numeral(resp.data.stock13).format('0'));
      $("#stock14").val(numeral(resp.data.stock14).format('0'));
      $("#cost").val(numeral(resp.data.cost).format('0,0.00'));
      $("#profit").val(numeral(profit).format('0,0.00'));
      $("#purch1").val(numeral(resp.data.purch1).format('0,0.00'));
      $("#purch2").val(numeral(resp.data.purch2).format('0,0.00'));
      $("#qmin").val(numeral(resp.data.qmin).format('0'));
      $("#qmax").val(numeral(resp.data.qmax).format('0'));
      $("#keypack1").val(resp.data.keypack1);
      $("#ikeypack1").val(resp.data.ikeypack1);
      $("#ipack1").val(resp.data.ipack1);
      $("#pack1").val(resp.data.pack1);
      $("#qty1").val(resp.data.qty1);
      $("#qty2").val(resp.data.qty2);
      $("#qty3").val(resp.data.qty3);
      $("#qty4").val(resp.data.qty4);
      $("#qtyg1").val(resp.data.qtyg1);
      $("#qtyg2").val(resp.data.qtyg2);
      $("#qtyg3").val(resp.data.qtyg3);
      $("#qtyg4").val(resp.data.qtyg4);
      $("#price1").val(numeral(resp.data.price1).format('0,0'));
      $("#price2").val(numeral(resp.data.price2).format('0,0'));
      $("#price3").val(numeral(resp.data.price3).format('0,0'));
      $("#price4").val(numeral(resp.data.price4).format('0,0'));
      $("#priceg1").val(numeral(resp.data.priceg1).format('0,0'));
      $("#priceg2").val(numeral(resp.data.priceg2).format('0,0'));
      $("#priceg3").val(numeral(resp.data.priceg3).format('0,0'));
      $("#priceg4").val(numeral(resp.data.priceg4).format('0,0'));


    
    }
  });

}