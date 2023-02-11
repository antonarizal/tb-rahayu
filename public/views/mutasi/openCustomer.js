function openCustomer() {
    var kasir = [];
    var api_url = config.server_url + "api/customers/index";
    var keyword = $("#kode_barang").val();
    const rdm = (Math.random() + 1).toString(36).substring(7);
    const layout_r = "layout_cus_" + rdm;
    var grid_r = "grid_customer_";
  
    const config_customer = {
      layout_mode: {
        name: layout_r,
        padding: 4,
        panels: [
          {
            type: "left",
            size: "100%",
            resizable: true,
            minSize: 300,
          },
        ],
      },
      grid_mode: {
        name: grid_r,
        style: "border: 1px solid #efefef",
        // url: api_url,
        tabIndex: 0,
        show: {
          toolbar: true,
          footer: true,
          toolbarReload: false,
          toolbarColumns: false,
          toolbarSearch: false,
          searchAll: false,
          toolbarInput: false,
          toolbarAdd: false,
          toolbarEdit: false,
          toolbarDelete: false,
          lineNumbers: true,
          selectColumn: true,
        },
        limit: 20,
        multiSearch: false,
        sortData: [
          {
            field: "plu",
            direction: "desc",
          },
        ],
        toolbar: {
          items: [
            {
              type: "html",
              id: "search_customer",
              html: function (item) {
                var html =
                  '<div style="padding: 3px 10px;">' +
                  '    <input placeholder="Cari nama customer" id="search_customer" size="40" onChange="searchCustomer(this)" ' +
                  '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" />' +
                  "</div>";
                return html;
              },
            },
            { type: "spacer" },
            {
              type: "button",
              id: "pilih",
              text: "Pilih Customer",
              icon: "w2ui-icon-plus",
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
                console.log(row)
                $("#cusid").val(row.cusid);
                $("#customer").val(row.customer);
                w2popup.close();
              } else {
                w2alert("Silahkan pilih nama yang akan ditambahkan");
              }
            }
          },
        },
        parser: function (responseText) {
          // var data = $.parseJSON(responseText);
          // do other things
          var array = responseText.data;
          array.forEach((el) => (el.recid = el.cusid.trim()));
          var data = {
            total: responseText.data.length,
            records: array,
          };
          return data;
        },
        columns: [
          {
            field: "cusid",
            text: "CUSID",
            size: "80px",
            sortable: true,
            searchable: true,
          },
          {
            field: "customer",
            text: "NAMA CUSTOMER",
            sortable: true,
            searchable: true,
          },
          {
            field: "address",
            text: "ALAMAT",
            sortable: true,
            searchable: true,
          },
          {
            field: "subcity",
            text: "KECAMATAN",
            sortable: true,
            searchable: true,
          },
          {
            field: "city",
            text: "KABUPATEN",
            sortable: true,
            searchable: true,
          },
        ],
        onChange: function (event) {
          console.log(event.target);
        },
        onSelect: function (event) {},
        onKeydown: function (event) {
          // console.log("keyCode", event.originalEvent.keyCode);
          if (event.originalEvent.keyCode == 13) {
            var selected = w2ui[grid_r].get(w2ui[grid_r].getSelection());
            var row = selected[0];
            console.log(row)
            $("#cusid").val(row.cusid);
            $("#customer").val(row.customer);
            w2popup.close();

          }
        },
      },
    };
  
    $(function () {
      // initialization in memory
      $().w2layout(config_customer.layout_mode);
      $().w2grid(config_customer.grid_mode);
      // w2ui["grid_"].hideColumn('cost');
      w2ui[grid_r].url = config.server_url + "api/customers/index";
      w2ui[grid_r].reload();
    });
  
    // function searchCustomer(el) {
    //   var grid = w2ui[grid_r];
    //   var text = el.value.toLowerCase();
    //   grid.search(text);
    // }
  
    w2popup.open({
      title: "Data Customer",
      width: 900,
      height: 600,
      showMax: false,
      body: '<div id="main" style="position: absolute; left: 2px; right: 2px; top: 0px; bottom: 3px;"></div>',
      onOpen: function (event) {
        event.onComplete = function () {
          $("#w2ui-popup #main").w2render(layout_r);
          w2ui[layout_r].html("left", w2ui[grid_r]);
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
      $("#search_customer").focus();
    }, 500);
  }
  
  function searchCustomer() {
    var keyword = $("#search_customer").val();
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      // $("#grid_" + grid_r + "_search_all").focus();
      // $("#grid_" + grid_r + "_search_all").hide();
      $("#search_customer").focus();
      $("#search_customer").val(keyword);
    }, 500);
  
    var grid = w2ui['grid_customer_'];
    // var text = keyword.toLowerCase();
    grid.url = config.server_url + "api/customers/search/?keyword=" + keyword;
    grid.reload();
    grid.search(keyword);
  }
  