function openBayar(id) {
  var todayNew = new Date();
  var fakturTrxNew = "BH." + form_ymdHis(todayNew);
    $.get(server_url + "api/hutang/detail/"+id,function(resp){
        $("#modal").modal("show");
        $("#id").val(id)
        $("#user_id").val(user.user_id)
        $("#tgl").html(resp.faktur.date)
        $("#tempo").html(resp.faktur.tempo)
        $("#nama_supplier").html(resp.faktur.nama_supplier)
        $("input[name='date']").val(date_now)
        $("input[name='faktur_pembelian']").val(resp.faktur.faktur)
        $("input[name='faktur']").val(fakturTrxNew)
        $("input[name='hutang']").val(numeral(resp.faktur.hutang).format('0,0'))
        $("input[name='hutang_dibayar']").val(numeral(resp.faktur.hutang_dibayar).format('0,0'))
        $("input[name='hutang_sisa']").val(numeral(resp.faktur.hutang_sisa).format('0,0'))
        $("input[name='dibayar']").val("");
        var timesRun = 0;
        var interval = setInterval(function () {
          timesRun += 1;
          if (timesRun === 2) {
            clearInterval(interval);
          }
          $("input[name='dibayar").focus()

        }, 500);

    })
}
  

function bayarTunai()
{
    var bayar = $("input[name='dibayar']").val();
        bayar = numeral(bayar).value();
    var sisa = $("input[name='hutang_sisa']").val();
        sisa =  numeral(sisa).value();
    var total = parseInt(sisa) - parseInt(bayar);
        total = numeral(total).format('0,0');
    $("input[name='sisa_sekarang']").val(total);
}
$("#post").on('submit', (function(e) {
    var id= $("#id").val();
    var faktur= $("input[name='faktur']").val();
    e.preventDefault();
    $.ajax({
        url: api_url +'api/hutang/bayar/'+id,
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            if(data.success){
                $("#modal").modal("hide");
                w2ui[name].reload();
                popupSelesai(faktur)
                
            }
        },
        error: function(data) {}
    });
}));



function popupSelesai(faktur) {
    w2confirm("Data berhasil disimpan")
    .yes(()=>{

    })
    .no(()=>{
      
    })
  }

  
function cetakNota(faktur, type) {
    // $("#frame").attr(
    //   "src",
    //   server_url + "api/cetak/print/?type=58mm&faktur=" + faktur
    // );
    console.log(server_url + "api/cetak/print/?type=58mm&faktur=" + faktur);
    $.get(server_url + "api/cetak/print/?type=58mm&faktur=" + faktur,function(resp){
      // var printWindow=window.open();
      // printWindow.document.open('text/plain')
      // printWindow.document.write(resp.data);
      // printWindow.document.close()
      // printWindow.focus()
      // printWindow.print()
      try{
        var oIframe = document.getElementById('ifrmPrint');
        var oContent = resp.data;
        var oDoc = (oIframe.contentWindow || oIframe.contentDocument);
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write('<head><title>title</title>');
        oDoc.write('</head><body onload="this.focus(); this.print();">');
        oDoc.write('<pre>'+oContent + '</pre></body>');
        oDoc.close();
          w2popup.close()
  
      } catch(e){
        self.print();
      }
  
    })
  }