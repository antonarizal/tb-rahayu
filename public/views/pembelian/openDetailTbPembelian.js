function detailTbPembelian(id) {
    var id = id;
    console.log(id);
    const Store = require("electron-store");
    const store = new Store();
    const server_url =
      "http://" + store.get("hostName") + ":" + store.get("port") + "/";
    var api_url = server_url + "api/product/retail";
  
    var keyword = $("#kode_barang").val();
    const rdm = (Math.random() + 1).toString(36).substring(7);
    const layout_r = "layout_" + rdm;
    var grid_r = "grid_" + rdm;
  
    const config_barang = {
      layout_mode: {
        name: layout_r,
        padding: 4,
        panels: [
          {
            type: "main",
            size: "100%",
            resizable: true,
            minSize: 300,
          },
          {
            type: "bottom",
            size: 40,
            resizable: false,
            style: "float:right",
            html: `
            <div style="padding:5px">
            <div style="float:right">
            <span style="margin-right:10px">Tanggal Bayar : <input style="height:30px;width:150px;" type="date" id="paid_date" class="w2ui-input">
            <a class="btn btn-sm btn-default" onclick="simpanPaid()">
            <i class="fas fa-check"></i> Bayar Lunas
            </a>
            </span>
            <input style="height:30px;width:150px;display:none" readonly id="idreceivehdr" class="w2ui-input">
            Faktur pembelian <input style="height:30px;width:200px;"  id="faktur_pembelian" class="w2ui-input">
            <a class="btn btn-sm btn-default" onclick="simpanFaktur()">
            <i class="fas fa-check"></i> Simpan
            </a>
            </div>
            </div>
            `,
          },
        ],
      },
      grid_mode: {
        name: grid_r,
        style: "border: 1px solid #efefef",
      //   url: server_url + "api/pembelian/detail/" + id,
        tabIndex: 0,
        show: {
          toolbar: false,
          footer: false,
          toolbarReload: false,
          toolbarColumns: false,
          toolbarSearch: false,
          searchAll: false,
          toolbarInput: false,
          toolbarAdd: false,
          toolbarEdit: false,
          toolbarDelete: false,
          lineNumbers: true,
          selectColumn: false,
        },
        limit: 20,
        multiSearch: false,
        sortData: [
          {
            field: "id",
            direction: "desc",
          },
        ],
        toolbar: {
          items: [
            {
              type: "html",
              id: "date",
              html: function (item) {
                var html =
                  '<div style="padding: 3px 10px;font-weight:normal;"><span id="date"></span></div>';
                return html;
              },
            },
            {
              type: "html",
              id: "faktur",
              html: function (item) {
                var html =
                  '<div style="padding: 3px 10px;font-weight:normal;"><span id="faktur"></span></div>';
                return html;
              },
            },
          //   { type: "spacer" },
            {
              type: "html",
              id: "supplier",
              html: function (item) {
                var html =
                  '<div style="padding: 3px 10px;font-weight:normal;"><span id="supplier"></span></div>';
                return html;
              },
            },
            { type: "spacer" },
            {
              type: "button",
              id: "print",
              text: "Cetak",
              icon: "fa fa-print",
            },
          ],
          onClick: function (event) {
            if (event.target == "pilih") {
              console.log(data);
              var grid = w2ui[grid_r];
              var qty = $("#faktur").val();
              var sel = grid.getSelection();
              if (sel.length == 1) {
                var data = grid.get(sel[0]);
                var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
                var row = selected[0];
                var barcode = $("#kode_barang").serializeArray();
                barcode = barcode[0].value.split("x");
                if (barcode.length > 1) {
                  var qty = barcode[0];
                } else {
                  var qty = 1;
                }
                addCart(row, qty);
              } else {
                w2alert("Silahkan pilih barang yang akan ditambahkan");
              }
            }
          },
        },
        // parser: function (responseText) {
        //   // var data = $.parseJSON(responseText);
        //   // do other things
        //   var array = responseText.data;
        //   array.forEach((el) => (el.recid = el.id));
        //   var data = {
        //     total: responseText.data.length,
        //     records: array,
        //   };
        //   return data;
        // },
        columns: [
          {
            field: "idreceivedtl",
            text: "ID",
            size: "100px",
            sortable: false,
            searchable: true,
          },
          {
            field: "product_idproduct",
            text: "KODE",
            size: "100px",
            sortable: false,
            searchable: true,
          },
          {
            field: "productname",
            text: "Nama Barang",
            sortable: false,
            searchable: true,
          },
          {
            field: "receive_price",
            text: "Harga",
            sortable: false,
            searchable: false,
            style: "text-align:right",
            render(record, extra) {
                var html = '<input type="text" style="width:100%;text-align:right;" class="form-control-sm form-cart" id="harga_' +
                record.idreceivedtl +
                '" onChange="changeHarga(\'' +
                record.idreceivedtl +
                '\',\'' +
                record.qty +
                '\')" value="' +
                numeral(record.receive_price).format('0,0') +
                '">';
                return html;
              },
          },
          {
            field: "qty",
            text: "Qty",
            size: "50px",
            sortable: false,
            searchable: false,
            render(record, extra) {
                var html = 
                '<input readonly type="number" style="width:60px" class="form-control-sm form-cart" id="qty_' +
                record.idreceivedtl +
                '"  value="' +
                record.qty +
                '">';
    
              return html;
            },
          },

          {
            field: "total",
            text: "Total",
            sortable: false,
            searchable: false,
            style: "text-align:right",
            render(record, extra) {
                var html = '<input type="text" style="width:100%;text-align:right;" class="form-control-sm form-cart" id="total_' +
                record.idreceivedtl +
                '"  value="' +
                numeral(record.qty * record.receive_price).format('0,0') +
                '">';
                return html;
            },
          },
        ],
        onLoad: function (event) {
          var faktur = event.xhr.responseJSON.faktur;
          console.log(faktur);
          var timesRun = 0;
          var interval = setInterval(function () {
            timesRun += 1;
            if (timesRun === 2) {
              clearInterval(interval);
            }
            $("#faktur_pembelian").val(faktur.faktur);
            $("#idreceivehdr").val(faktur.idreceivehdr);
            $("#paid_date").val(faktur.paid_date);
          }, 100);
        },
        onChange: function (event) {
          console.log(event.target);
        },
        onSelect: function (event) {},
        onKeydown: function (event) {
          // console.log("keyCode", event.originalEvent.keyCode);
          if (event.originalEvent.keyCode == 13) {
  
          }
        },
      },
    };
  
    $(function () {
      // initialization in memory
      $().w2layout(config_barang.layout_mode);
      $().w2grid(config_barang.grid_mode);
      // w2ui["grid_"].hideColumn('cost');
  
      var cart =
      {
            w2ui: { summary: true },
            recid: "S-1",
            kode_barang: '<input class="w2ui-input" style="width:100%" id="plu">',
            nama_barang: '<input class="w2ui-input" style="width:100%" id="cari" onKeyup="cari()"><span id="description" style="display:none"></span><input type="hidden" value="" id="description2">',
            harga: '<input class="w2ui-input" style="width:100%" value="0" id="coli" onKeyup="setColi(this)">',
            qty: '<input class="w2ui-input" style="width:100%" value="0.00" id="isi"  onKeyup="setIsi(this)"><input type="hidden" value="" id="konversi"><input type="hidden" value="" id="ipack1">',
            satuan: '<select id="selectSatuan" style="display:none" onChange="selectSatuan()"><option value="">pilih</option></select><input readonly class="w2ui-input" style="width:100%" value="" id="satuan" onKeyup="setSatuan(this)"><input type="hidden" value="" id="satuan2">',
            total: '<input readonly class="w2ui-input" style="width:100%" value="0.00" id="qty" onKeyup="setQty()">',
          };
      // w2ui[grid_r].add(cart);
      w2ui[grid_r].url = server_url + "api/pembelian/tb_detail/"+id;
      w2ui[grid_r].reload();
  
    });
  
    // function searchProduct(el) {
    //   var grid = w2ui[grid_r];
    //   var text = el.value.toLowerCase();
    //   grid.search(text);
    // }
  
    w2popup.open({
      title: "Detail pembelian",
      width: 900,
      height: 500,
      showMax: false,
      body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
      onOpen: function (event) {
        event.onComplete = function () {
          $("#w2ui-popup #main").w2render(layout_r);
          w2ui[layout_r].html("main", w2ui[grid_r]);
          $(".w2ui-search-all").focus();
        };
      },
    });
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      // $("#grid_" + grid_r + "_search_all").focus();
      // $("#grid_" + grid_r + "_search_all").hide();
      $("#search_product").focus();
    }, 500);
  }
  
  function searchProduct() {
    var keyword = $("#search_product").val();
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      // $("#grid_" + grid_r + "_search_all").focus();
      // $("#grid_" + grid_r + "_search_all").hide();
      // $("#search_product").focus();
      // $("#search_product").val(keyword);
    }, 500);
  
    var grid = w2ui["grid_"];
    var text = keyword.toLowerCase();
    grid.url = server_url + "api/product/retail/search/?keyword=" + keyword;
    grid.reload();
    grid.search(text);
  }
  
  function changeHarga(id, harga, qty) {
    var harga = numeral($("#harga_" + id).val()).value();
    var qty = $("#qty_" + id).val()
    var total = harga*qty

    $("#total_"+id).val(numeral(total).format("0,0"))
    $("#harga_"+id).val(numeral(harga).format("0,0"))

    w2confirm('Anda yakin mengubah harga?')
    .yes(() => {

        $.post(server_url + "api/pembelian/update_harga/"+id,
        {
            receive_price : harga,
            qty : qty,

        },function(data){

            if (data.success) {
                w2alert("Sukses! Harga berhasil disimpan!");
                w2ui["grid_123"].reload();

            } else {
                w2alert(data.message);
            }
        })
    })
    .no(() => {
        console.log('Yes')
        w2alert("Harga tidak disimpan");

    })
    

  }
  function simpanFaktur() {
    let id=$("#idreceivehdr").val()
    $.post(server_url + "api/pembelian/update_faktur/"+id,
    {
        faktur : $("#faktur_pembelian").val(),

    },function(data){

        if (data.success) {
            toastr.success(data.message);
            w2ui["grid_123"].reload();

          } else {
            toastr.error(data.message);
          }
    })

  }
  function simpanPaid() {
    let id=$("#idreceivehdr").val()
    $.post(server_url + "api/pembelian/update_paid/"+id,
    {
        paid_date : $("#paid_date").val(),

    },function(data){

        if (data.success) {
            toastr.success(data.message);
            w2ui["grid_123"].reload();

          } else {
            toastr.error(data.message);
          }
    })

  }