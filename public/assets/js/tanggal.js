
function date_format(date) {
    return (
      pad(date.getDate()) +
      pad(date.getMonth() + 1) +
      date.getFullYear().toString()
    );
  }

function thnbln_format(date) {
    return (
      date.getFullYear().toString().substring(2)
      +pad(date.getMonth() + 1)
    );
  }
  
  function time_format(xDate) {
    return (
      xDate.getHours().toString(10).padStart(2,'0')
      + ':'+ xDate.getMinutes().toString(10).padStart(2,'0')  
      + ':'+ xDate.getSeconds().toString(10).padStart(2,'0')
    );
  }

  function form_ymdHis(xDate) {
    return  xDate.getDate().toString(10).padStart(2,'0')
        + (xDate.getMonth()+1).toString(10).padStart(2,'0') 
        + xDate.getFullYear().toString(10).substring(2)
        + '.'+xDate.getHours().toString(10).padStart(2,'0')
        + xDate.getMinutes().toString(10).padStart(2,'0')  
        + xDate.getSeconds().toString(10).padStart(2,'0')
  }

  function date_now() {
    var date = new Date()
    return (
      date.getFullYear().toString() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) 
    );
  }
  
  function year_now() {
    var date = new Date()
    return (
      date.getFullYear()
    );
  }
  
  function pad(number) {
    return ((number < 10 ? "0" : "") + number).toString();
  }


function tanggal(type) {
  var date = new Date();
  var tahun = date.getFullYear();
  var bulan = pad(date.getMonth() + 1);
  var tanggal = pad(date.getDate());
  var hari = date.getDay();
  var jam = pad(date.getHours());
  var menit = pad(date.getMinutes());
  var detik = pad(date.getSeconds());
  switch (hari) {
    case 0:
      hari = "Minggu";
      break;
    case 1:
      hari = "Senin";
      break;
    case 2:
      hari = "Selasa";
      break;
    case 3:
      hari = "Rabu";
      break;
    case 4:
      hari = "Kamis";
      break;
    case 5:
      hari = "Jum'at";
      break;
    case 6:
      hari = "Sabtu";
      break;
  }

  if(type == "tanggal_kasir"){
    return hari + ", " + tanggal + "-" + bulan + "-" + tahun + " " + jam + ":" + menit + ":" + detik;; 
  }
}
