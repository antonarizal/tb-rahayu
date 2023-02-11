const numeral = require("numeral");
const moment = require("moment");
const Store = require("electron-store");
const toastr = require("toastr");

const store = new Store();
const server_url =
  "http://" + store.get("hostName") + ":" + store.get("port") + "/";
const host = store.get("base_url") + "views";
var db = new localdb("db_weringin");
var isUserLogin = db.tableExists("user");
if (!isUserLogin) {
  window.location.href = host + "/home/unauthorized";
} else {
  var user = db.findById("user", 1);
  console.log(user);
}
$("#kodeBarang").focus()
$("#marginTop").val(store.get("marginTop"))
$("#marginLeft").val(store.get("marginLeft"))
$("#barcodeHeight").val(store.get("barcodeHeight"))
$("#fontSize").val(store.get("fontSize"))
$("#fontCode").val(store.get("fontCode"))
$("#fontCode").val(store.get("fontCode"))
$("#boxBorder").val(store.get("boxBorder"))
$("#boxHeight").val(store.get("boxHeight"))
$("#boxWidth").val(store.get("boxWidth"))
if(store.get("boxBorder")==1){
  $("#boxBorder").prop( "checked", true );

}else{
  $("#boxBorder").prop( "checked", false );

}

$('#changeUkuran').on('change', function() {
  window.location = "http://localhost:3344/views/cetak/"+( this.value );
});

function boxCheck(){
  
if( $('#boxBorder').is(':checked') ){
  $("#boxBorder").val(1)
  showLabel()
  
}
else{
  $("#boxBorder").val(0)
  showLabel()
}
}

$("#post").on("submit", function (e) {

  e.preventDefault();

  showLabel()

});
function printLaporan(){
  $("#cetak").print();
}

function showBarcode(id){
  $("#barcode_"+id).hide()
  $("#harga_"+id).hide()
}
function showLabel()
{
  $(".outBox").show()
  var marginTop = $("#marginTop").val()
  var marginLeft = $("#marginLeft").val()
  var barcodeHeight = $("#barcodeHeight").val()
  var textPosition = $("#textPosition").val()
  var fontSize = $("#fontSize").val()
  var fontCode = $("#fontCode").val()  
  var barcode = $("#kodeBarang").val()
  var jumlah = $("#jumlah").val()
  var boxBorder = $("#boxBorder").val()
  var boxHeight = $("#boxHeight").val()
  var boxWidth = $("#boxWidth").val()
  var space4Line = $("#space4Line").val()
  var hargaJual = "Rp."+numeral($("#hargaJual").val()).format("0,0")

  console.log(barcode);
  
  $("#table").html(`
  <table id="cetak" style="width:216mm;margin-left:${marginLeft}mm;margin-top:${marginTop}mm" class="table tbbarcode text-sm table-sm">
    <tbody>
    </tbody>
  </table>`)
  
  if(barcode ==""){
    w2alert("Silakan pilih barang terlebih dahulu");
    return false;
  }
  $("#cetak > tbody").html("")
  for (let j = 0; j < jumlah; j++) {
      let x = j;
      let y = 4;
      let z = x % y;

      var i = 3;
      // const top = 1.2+1.5*z;
      // const bottom = 1.2 +z;
      let top = 1.5;
      const bottom = 0.5 + 1.5 *z;
      const height = 1.25 + z/10;
    
      if(z == 0){
        top = space4Line;
      }
      var barcode1=`<center><div onclick="showBarcode('a${j}')" style="height:${boxHeight}mm;width:${boxWidth}mm;border:${boxBorder}px solid #ccc"><svg id="barcode_a${j}"></svg><pre id="harga_a${j}"style="font-size:${fontSize}px">${hargaJual}</pre></div></center>`
      var barcode2=`<center><div onclick="showBarcode('b${j}')" style="height:${boxHeight}mm;width:${boxWidth}mm;border:${boxBorder}px solid #ccc"><svg id="barcode_b${j}"></svg><pre id="harga_b${j}"style="font-size:${fontSize}px">${hargaJual}</pre></div></center>`
      var barcode3=`<center><div onclick="showBarcode('c${j}')" style="height:${boxHeight}mm;width:${boxWidth}mm;border:${boxBorder}px solid #ccc"><svg id="barcode_c${j}"></svg><pre id="harga_c${j}"style="font-size:${fontSize}px">${hargaJual}</pre></div></center>`
      $("#cetak > tbody").append(`
      <tr>
      <td style="width:61mm;height:${height}cm;;padding-left:1mm;padding-right:1mm;padding-top:${top}mm;padding-bottom:${bottom}mm">${barcode1}</td>
      <td style="width:61mm;height:${height}cm;padding-left:1mm;padding-right:1mm;padding-top:${top}mm;padding-bottom:${bottom}mm">${barcode2}</td>
      <td style="width:61mm;height:${height}cm;padding-left:1mm;padding-right:1mm;padding-top:${top}mm;padding-bottom:${bottom}mm">${barcode3}</td>
      </tr>
      `)
      JsBarcode("#barcode_a"+j, barcode, {
        height: barcodeHeight,fontSize: fontCode,textPosition: textPosition
      });
      JsBarcode("#barcode_b"+j, barcode, {
        height: barcodeHeight,fontSize: fontCode,textPosition: textPosition
      });
      JsBarcode("#barcode_c"+j, barcode, {
        height: barcodeHeight,fontSize: fontCode,textPosition: textPosition
      });

  }
}

function saveSetting(){
  var marginTop = $("#marginTop").val()
  var marginLeft = $("#marginLeft").val()
  var barcodeHeight = $("#barcodeHeight").val()
  var textPosition = $("#textPosition").val()
  var fontSize = $("#fontSize").val()
  var fontCode = $("#fontCode").val()  
  var boxBorder = $("#boxBorder").val()  
  var boxHeight = $("#boxHeight").val()  
  var boxWidth = $("#boxWidth").val()  
  var space4Line = $("#space4Line").val()  
  var barcode = $("#kodeBarang").val()
  var jumlah = $("#jumlah").val()
  var hargaJual = "Rp."+numeral($("#hargaJual").val()).format("0,0")

  store.set("marginTop",marginTop)
  store.set("marginLeft",marginLeft)
  store.set("barcodeHeight",barcodeHeight)
  store.set("textPosition",textPosition)
  store.set("fontSize",fontSize)
  store.set("fontCode",fontCode)
  store.set("boxBorder",boxBorder)
  store.set("boxWidth",boxWidth)
  store.set("boxHeight",boxHeight)
  toastr.success("Pengaturan berhasil disimpan")
}