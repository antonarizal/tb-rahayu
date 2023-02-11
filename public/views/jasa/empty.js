
function empty() {
  w2popup.open({
    title: "Hapus Data",
    body: '<div class="w2ui-centered" ><span style="font-size:16px"><i class="fa fa-warning"></i> Semua data barang akan dihapus.<br><br> Anda yakin akan mengosongkan data?</span></div>',
    buttons:
      '<button class="w2ui-btn" onclick="w2popup.close();">Batal</button>' +
      '<button class="w2ui-btn w2ui-btn-red" onclick="truncate()">Ya, Kosongkan</button>',
    width: 500,
    height: 200,
    overflow: "hidden",
    color: "#000",
    opacity: "0.8",
    modal: true,
    showClose: true,
    showMax: false,
    onOpen(event) {
      console.log("open");
    },
    onClose(event) {
      console.log("close");
    },
  });
}

function truncate() {
  $.post(api_url + "api/action/truncate/jasa", function (resp) {
    if (resp.status == "success") {
      w2popup.close();
      w2alert("Data berhasil dikosongkan").ok(function(){
        w2ui["grid_data"].reload();
      })
      
    } else {
      w2alert("Data gagal dikosongkan");
    }
  });
}