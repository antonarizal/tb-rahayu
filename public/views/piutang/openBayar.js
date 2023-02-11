function openBayar(id) {
  var todayNew = new Date();
  var fakturTrxNew = "BP." + form_ymdHis(todayNew);

    $.get(server_url + "api/piutang/detail/"+id,function(resp){
        $("#modal").modal("show");
        $("#id").val(id)
        $("#user_id").val(user.user_id)
        $("#tgl").html(moment(resp.faktur.date).format("DD-MM-YYYY"))
        $("#tempo").html(resp.faktur.tempo)
        $("input[name='date']").val(date_now())
        $("#nama_pelanggan").html(resp.faktur.nama_pelanggan)
        $("input[name='faktur_penjualan']").val(resp.faktur.faktur)
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
    var faktur_penjualan= $("input[name='faktur_penjualan']").val();
    e.preventDefault();
    $.ajax({
        url: api_url +'api/piutang/bayar/'+id,
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            if(data.success){
                $("#modal").modal("hide");
                w2ui[name].reload();
                popupSelesai(faktur,faktur_penjualan)
                
            }
        },
        error: function(data) {}
    });
}));



function popupSelesai(faktur,faktur_penjualan) {
  w2popup.open({
    title: 'Anda ingin mencetak pembayaran piutang?',
    body: '<div style="padding:5px">Cetak Pembayaran Piutang <br>Nota Pembayaran Piutang: '+faktur+'<br>Nota Penjualan: '+faktur_penjualan+'</div>',
    actions: ['Ok', 'Cancel'],
    width: 500,
    height: 200,
    modal: true,
    showClose: true,
    showMax: true,
    onMax(evt) {
        console.log('max', evt)
    },
    onMin(evt) {
        console.log('min', evt)
    },
    onKeydown(evt) {
        console.log('keydown', evt)
    }
})
.then((evt) => {
    console.log('popup ready')
})
.close(evt => {
    console.log('popup clsoed')
})
.ok((evt) => {
    console.log('ok', evt)
    cetakNota(faktur,faktur_penjualan)
})
.cancel((evt) => {
    console.log('cancel', evt)
    w2popup.close()
})


  // w2confirm("Data berhasil disimpan. Anda ingin mencetak nota pembayaran piutang?")
  // .yes(function(){
  //   cetakNota(faktur,faktur_penjualan)
  // })
  // .no(function(){
  // })
  }
function cetakNota(faktur, faktur_penjualan) {
  // $("#frame").attr(
  //   "src",
  //   server_url + "api/cetak/print/?type=58mm&faktur=" + faktur
  // );
  // console.log(server_url + "api/cetak/piutang/?type=58mm&faktur=" + faktur+"");
  $.get(
    server_url + "api/cetak/piutang/?type=58mm&faktur=" + faktur+"&fakturpj="+faktur_penjualan,
    function (resp) {
      console.log(resp);
      var style= `<style>
      @page {margin: 0;}
      pre{
        margin-left:${resp.printer.margin_left}px;
        margin-top:${resp.printer.margin_top}px;
        font-weight:${resp.printer.font_weight};
        font-size:${resp.printer.font_size}px;
        font-family: Consolas;
      }
      </style>`;

      try {
        var oIframe = document.getElementById("ifrmPrint");
        var oContent = resp.data;
        var oDoc = oIframe.contentWindow || oIframe.contentDocument;
        if (oDoc.document) oDoc = oDoc.document;
        oDoc.write(`<head><title>Cetak</title>${style}`);
        oDoc.write(
          '</head><body onload="this.focus(); this.print();">'
        );
        oDoc.write("<pre>" + oContent + "</pre></body>");
        oDoc.close();
        // w2popup.close();
      } catch (e) {
        self.print();
      }
    }
  );
}