function openSupplier() {
  var mode = "supplier";
  const Store = require("electron-store");
  const store = new Store();
  const server_url =
    "http://" + store.get("hostName") + ":" + store.get("port") + "/";
  const rdm = (Math.random() + 1).toString(36).substring(7);
  const layout_r = "layout_" + rdm;
  const grid_r = "grid_" + rdm;
  const form_r = "form_" + rdm;
  console.log(rdm);
  const config_kategori = {
    layout_mode: {
      name: layout_r,
      padding: 4,
      panels: [
        { type: "main", size: "100%", minSize: 500 },
      ],
    },
    grid_mode: {
      name: grid_r,
      style: "border: 1px solid #efefef",
      url: server_url + "api/" + mode + "/all",
      show: {
        toolbar: true,
        footer: true,
        toolbarReload: false,
        toolbarColumns: false,
        toolbarSearch: true,
        searchAll: false,
        toolbarInput: false,
        toolbarAdd: false,
        toolbarEdit: false,
        toolbarDelete: false,
      },
      multiSearch: false,
      toolbar: {
        items: [
          // {
          //   type: "html",
          //   id: "tgl_mulai",
          //   html: function (item) {
          //     var html =
          //       ' <span style="padding-right:5px">Periode</span>     <input id="tgl_mulai" size="10" type="date" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>';
          //     return html;
          //   },
          // },
          // {
          //   type: "html",
          //   id: "tgl_selesai",
          //   html: function (item) {
          //     var html =
          //       ' <span style="padding-left:5px;padding-right:5px">s/d</span>   <input id="tgl_selesai" size="10" type="date" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>';
          //     return html;
          //   },
          // },
          // {
          //   type: "button",
          //   id: "tampilkan",
          //   text: "Tampilkan",
          //   icon: "fa fa-check",
          // },
          {
            type: "spacer",
          },
          {
            type: "button",
            id: "clearData",
            text: "Kosongkan",
            icon: "fa fa-circle",
          },
          // {
          //   type: "button",
          //   id: "empty",
          //   text: "Kosongkan",
          //   icon: "fa fa-ban",
          // },
          
        ],
        onLoad: function (event) {},
  
        onClick: function (event) {
          if (event.target == "clearData") {
            clearData();
          }
        },
      },
      searches: [
        {
          field: "nama_supplier",
          label: "Nama " + mode,
          type: "text",
        },
      ],
      columns: [
        {
          field: "idsupp",
          text: "ID",
          size: "100px",
          sortable: true,
          searchable: true,
        },
        {
          field: "nama_supplier",
          text: "Nama " + mode,
          size: "33%",
          sortable: true,
          searchable: true,
        },
        {
          field: "alamat",
          text: "Alamat",
          size: "43%",
          sortable: true,
          searchable: true,
        },
        {
          field: "pilih",
          text: "Pilih",
          size: "70px",
          sortable: true,
          searchable: true,
          render(record, extra) {
            if (mode == "supplier") {
              var html =
                '<button style="padding:5px" class="btn btn-xs btn-default" onclick="pilih(\''+
                record.nama_supplier +
                '\',\''+record.idsupp+'\',\''+record.supplier_id+'\')" ><i class="fa fa-check"></i> pilih</button>';
            } else {
              var html =
                '<a style="padding:5px" class="btn btn-xs btn-default" href="javascript:pilih(' +
                record.recid +
                ",'" +
                record.nama_sales +
                '\')"><i class="fa fa-check"></i> pilih</a>';
            }

            return html;
          },
        },
      ],
      sortData: [{ field: "idsupp", direction: "desc" }],
    },
    form_mode: {
      header: "Tambah Data",
      name: form_r,
      url: server_url + "api/" + mode + "/create/",
      style: "border: 1px solid #efefef",
      fields: [
        {
          field: "nama_" + mode,
          type: "text",
          required: true,
          html: { label: "Nama", attr: 'size="30" maxlength="40"' },
        },
        {
          field: "alamat",
          type: "textarea",
          required: false,
          html: {
            label: "Alamat",
            attr: 'style="width: 220px; height: 60px"',
          },
        },
        {
          field: "no_hp",
          type: "text",
          html: { label: "No HP", attr: 'size="30"' },
        },
        {
          field: "email",
          type: "email",
          html: { label: "Email", attr: 'size="30"' },
        },
      ],
      actions: {
        Reset: function () {
          this.clear();
        },
        Save: function (event) {
          var errors = this.validate();
          if (errors.length > 0) return;
          this.save();
        },
      },
      onSave: function (event) {
        w2ui[grid_r].reload();
        this.clear();
      },
    },
  };

  $(function () {
    // initialization in memory
    $().w2layout(config_kategori.layout_mode);
    $().w2grid(config_kategori.grid_mode);
    $().w2form(config_kategori.form_mode);
  });

  w2popup.open({
    title: "Data " + mode,
    width: 950,
    height: 600,
    showMax: false,
    body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
    onOpen: function (event) {
      event.onComplete = function () {
        $("#w2ui-popup #main").w2render(layout_r);
        w2ui[layout_r].html("main", w2ui[grid_r]);
      };
    },
  });
}

function pilih(nama,idsupp,supplier_id) {
  //alert(id)
  $("#nama_supplier").val(nama);
  $("#supplier_id").val(supplier_id);
  $("#idsupp").val(idsupp);
  w2popup.close();
}
function clearData(){
  $("#nama_supplier").val("");
  $("#idsupp").val("0");
  w2popup.close();
}