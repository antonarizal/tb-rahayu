function openPelanggan() {
  var mode = "pelanggan";
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
        { type: "left", resizable: true, minSize: 400 },
        { type: "main", size: "55%", minSize: 500 },
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
      //   toolbar: {
      //   items: [{
      //           type: 'break'
      //       },
      //       {
      //           type: 'button',
      //           id: 'pilih',
      //           text: 'Pilih',
      //           icon: 'fa fa-check'
      //       },
      //   ],
      // },

      // onDblClick: function(event) {
      //     var grid = this;
      //     event.onComplete = function() {
      //         var sel = grid.getSelection();
      //         var get_sel = grid.get(sel[0]);
      //         console.log(grid.get(sel[0]))
      //         //alert(get_sel.nama_pelanggan)
      //         $("#pelanggan").val(get_sel.nama_pelanggan);
      //         $("#id_pelanggan").val(get_sel.recid);
      //         w2popup.close()
      //     }
      //     var id = w2ui['grid2'].getSelection();
      // },
      // },
      searches: [
        {
          field: "nama_" + mode,
          label: "Nama " + mode,
          type: "text",
        },
      ],
      columns: [
        {
          field: "id",
          text: "ID",
          size: "50px",
          sortable: true,
          searchable: true,
        },
        {
          field: "nama_" + mode,
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
            if (mode == "pelanggan") {
              var html =
                '<button style="padding:5px" class="btn btn-xs btn-default" onclick="pilih(' +
                record.recid +
                ",'" +
                record.nama_pelanggan +
                '\')" ><i class="fa fa-plus"></i> pilih</button>';
            } else {
              var html =
                '<a style="padding:5px" class="btn btn-xs btn-default" href="javascript:pilih(' +
                record.recid +
                ",'" +
                record.nama_sales +
                '\')"><i class="fa fa-plus"></i> pilih</a>';
            }

            return html;
          },
        },
      ],
      sortData: [{ field: "id", direction: "asc" }],
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
        w2ui[layout_r].html("left", w2ui[form_r]);
      };
    },
  });
}

function pilih(id, nama) {
  //alert(id)
  $("#nama_pelanggan").val(nama);
  $("#pelanggan_id").val(id);
  w2popup.close();
}
