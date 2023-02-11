
$("#inputCart").on("submit", function (e) {
    e.preventDefault();
    //javascript split
    var barcode = $("#kode_barang").serializeArray();
    barcode = barcode[0].value.split("x");
    console.log(barcode);
    if (barcode.length > 1) {
      var qty = barcode[0];
      var barcode = barcode[1];
    } else {
      var qty = 1;
      var barcode = barcode[0];
    }
    if (barcode == "") {
      selesai();
      return false;
    }
    $.get(server_url + "api/product/barcode/" + barcode, function (data) {
      //115000604000
      //0222010006
      console.log(data);
      if (data.success) {
        addCart(data.data, qty);
      } else {
        // toastr.info(data.message);
        openBarang();
      }
    });
  });
  
  function addCart(row, qty = 1) {
    var qty = parseInt(qty);
    var g = w2ui[name].records.length;
    var found = dataProduct.findIndex(
      (el) => el.kode_barang.trim() === row.kode_barang.trim()
    );
    if (found === -1) {
      var cart = {
        recid: g + 1,
        id_barang: row.id,
        kode_barang: row.kode_barang,
        nama_barang: row.nama_barang,
        harga_jual: row.harga_jual,
        harga: row.harga_jual,
        qty: qty,
        disc1: 0,
        disc2: 0,
        disc: 0,
        diskon: 0,
        status: 0,
        hpp: row.harga_beli,
        total_hpp: qty * row.harga_beli,
        amount: qty * row.harga_jual,
        total: qty * row.harga_jual,
        satuan: row.satuan,
        jenis: row.jenis,
        faktur: $("#faktur").val(),
        date: $("#date").val(),
        user_id: $("#user_id").val(),
      };
      w2ui[name].add(cart);
      dataProduct.push(cart);
      console.log(dataProduct);
      var i = 1;
      dataProduct.forEach((el) => {
        el.recid = i;
        i++;
      });
    } else {
      dataProduct.forEach((el) => {
        if (el.kode_barang == row.kode_barang.trim()) {
          el.disc = 0;
          el.diskon = 0;
          el.qty = el.qty + qty;
          el.amount = el.qty * row.harga_jual;
          el.total_hpp = el.qty * row.harga_beli;
        }
      });
    }
    console.log(found);
    console.log(dataProduct);
    w2popup.close();
    w2ui[name].refresh();
    subtotal();
    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 2) {
        clearInterval(interval);
      }
      loadData();
    }, 100);
  
  
  }
  
  function pendingCart() {
    // url: api_url+ '/add_cart/',
    $.post(api_url + "/pending_cart/", function (resp) {
      if (resp.success) {
        loadData();
        w2ui[name].reload();
        w2alert("Transaksi telah dipending dan masuk ke antrian");
      } else {
        w2alert("Gagal");
      }
    });
  }
  
function deleteCart(id) {
    w2ui[name].reload();
    dataProduct.forEach((el) => {
      if (el.recid == id) {
        dataProduct.splice(dataProduct.indexOf(el), 1);
      }
    });
    console.log(dataProduct);
    w2ui[name].remove(id);
    w2ui[name].refresh();
    loadData();
    subtotal();
  }
  
  function discPercent(id) {
    var disc = numeral($("#disc_" + id).val()).value();
    dataProduct.forEach((el) => {
      if (el.recid == id) {
        // dataProduct.splice(dataProduct.indexOf(el), 1);
        var diskon = (disc / 100) * el.harga;
        el.disc = disc;
        el.diskon = numeral(diskon).value();
        el.total = el.qty * el.harga - el.qty * diskon;
        el.amount = el.qty * el.harga - el.qty * diskon;
        console.log(diskon);
      }
    });
    console.log(dataProduct);
    w2ui[name].refresh();
    w2ui[name].reload();
    loadData();
    subtotal();
    // $("#diskon_"+id).focus()
  }
  function discRp(id) {
    var diskon = numeral($("#diskon_" + id).val()).value();
    dataProduct.forEach((el) => {
      if (el.recid == id) {
        // dataProduct.splice(dataProduct.indexOf(el), 1);
        el.diskon = diskon;
        el.disc = 0;
        el.total = el.qty * el.harga - el.qty * diskon;
        el.amount = el.qty * el.harga - el.qty * diskon;
      }
    });
    console.log(id);
    console.log($("#diskon_" + id).val());
    console.log(dataProduct);
    w2ui[name].refresh();
    w2ui[name].reload();
    subtotal();
    loadData();
    $("#disc_" + id).val(0);
  }
function changeQty(id) {
    var qty = numeral($("#qty_" + id).val()).value();
    dataProduct.forEach((el) => {
      if (el.recid == id) {
        // dataProduct.splice(dataProduct.indexOf(el), 1);
        el.disc = 0;
        el.diskon = 0;
        el.qty = qty;
        el.total = qty * el.harga;
        el.amount = qty * el.harga;
      }
    });
    console.log(id);
    console.log($("#diskon_" + id).val());
    console.log(dataProduct);
    w2ui[name].refresh();
    w2ui[name].reload();
    subtotal();
    loadData();
    $("#disc_" + id).val(0);
    $("#diskon_" + id).val(0);
  }
  
  function changeHarga(id) {
    var harga = numeral($("#harga_" + id).val()).value();
    dataProduct.forEach((el) => {
      if (el.recid == id) {
        // dataProduct.splice(dataProduct.indexOf(el), 1);
        el.harga = harga;
        el.harga_jual = harga;
        el.amount = harga;
        el.total = harga;
      }
    });
    $("#harga_" + id).val(numeral(harga).format('0,0'))
    w2ui[name].refresh();
    w2ui[name].reload();
    subtotal();
    loadData();
  }

  
  function loadCart() {
    var rec = dataProduct;
    $.each(rec, function (i, val) {
      w2ui[name].add(val);
    });
  }
  