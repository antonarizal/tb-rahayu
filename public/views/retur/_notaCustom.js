
function getNota( fakturObj){
    const Store = require("electron-store");
    const store = new Store();
    const numeral = require("numeral");
    var db = new localdb("db_weringin");
    const getFaktur = fakturObj
    var date = new Date();
    var spacer ="-"
    var data = ""
    const custom = 10;
    const lebar = 50;
    const fText = limitText(store.get("footerText"),lebar)
    const footerText =  fText.split("\n")
    
    data += setText(store.get("namaToko"),lebar,"c") + "\n";
    data += setText(store.get("alamat"),lebar,"c") + "\n";
    data += setText(store.get("telp"),lebar,"c") + "\n";
    data += setText(" ========= RETUR PENJUALAN ========= ",lebar,"c") + "\n";
    data += "\n"
    
    data += setText("NOTA RETUR",10,"l");
    data += ": "+getFaktur.meta.faktur + "\n";
    data += setText("NOTA PJL",10,"l");
    data += ": "+getFaktur.meta.keterangan + "\n";
    data += setText("TGL",10,"l");
    data += ": "+getFaktur.meta.date +  "  "+ time_format(date)   + "\n";
    data += setText("PELANGGAN",10,"l");
    data += ": "+getFaktur.pelanggan + "\n" ;
    data += setText("KASIR",10,"l");
    data += ": "+store.get("username") + "\n";
    
    data += "\n" +spacer.repeat(lebar) +"\n"
    data += setText("NO",5,"l");
    data += setText("NAMA BARANG",45,"l")+"\n";
    data += setText("QTY",10,"r");
    data += setText("HARGA",25,"r");
    data += setText("TOTAL",15,"r");
    data += "\n" +spacer.repeat(lebar) +"\n"
    console.log(getFaktur.listBarang)
    var i =1;
    $.each( getFaktur.listBarang , function( idx, val ) {
        var diskon = val.diskon != 0 ? "-"+val.diskon : 0;
      if(val.jenis == "barang"){
        // BARANG
        data += setText(i+".",5,"r");
        data += setText(val.nama_barang,45,"l") +"\n";
        data += setText(val.qty +" x ",10,"r");
        data += setText(numeral(val.harga).format("0,0"),25,"r");
        data += setText(numeral(val.total).format("0,0"),15,"r");
      }else{
        // JASA
        // data += setText(i+".",5,"r");
        // data += "+"+setText(val.nama_barang,30,"l");
        // data += setText(numeral(val.total).format("0,0"),15,"r");
        data += setText(i+".",5,"r");
        data += setText(val.nama_barang,45,"l") +"\n";
        data += setText(val.qty +" x ",10,"r");
        data += setText(numeral(val.harga).format("0,0"),25,"r");
        data += setText(numeral(val.total).format("0,0"),15,"r");
      }
      data += "\n" ;
    i++;
    
    });
    const total_qty = getFaktur.listBarang
    .map((item) => item.satuan!="JASA" ? numeral(item.qty).value() : 0)
    .reduce((prev, curr) => prev + curr, 0);

    var totalDiskon = getFaktur.meta.diskon != 0 ? "-"+ getFaktur.meta.diskon : 0;
    data += spacer.repeat(lebar) +"\n"
    // data += setText(" ",5,"l");
    data += setText("TOTAL ITEM : "+total_qty,20,"l");
    data += setText("TOTAL :",15,"r");
    data += setText(numeral(getFaktur.meta.total).format("0,0"),15,"r");
    data +="\n"
    data += spacer.repeat(lebar) +"\n"
    $.each( footerText , function( id, txt ) {
      data += setText(txt,lebar,"c")+"\n";
    })
    data +="\n"

    return data;
    }
    // data += setText("BARANG YANG SUDAH DIBELI TIDAK DAPAT DITUKAR/DIKEMBALIKAN",40,"c");

    function limitText(text,charlimit){
      var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].length <= charlimit) continue;
            var j = 0; space = charlimit;
            while (j++ <= charlimit) {
                if (lines[i].charAt(j) === ' ') space = j;
            }
            lines[i + 1] = lines[i].substring(space + 1) + (lines[i + 1] || "");
            lines[i] = lines[i].substring(0, space);
        }
        text = lines.slice(0, 10).join('\n');
      return text;
    }
    
    function setText(text,lebar,position="l"){
      let space=" ";
      let lText=text.length;
      let sisa = lebar-lText;
      let tulis;
      if(lText > lebar){
        text = limitText(text,lebar)
      }
      if(position == "l"){
        tulis = text + "" + space.repeat(sisa)
      }
      else
      if(position == "r"){
        tulis = space.repeat(sisa) + text
      }
      else
      if(position == "c"){
        if(sisa>0){
          sisa = sisa/2
          tulis = space.repeat(sisa) + text + space.repeat(sisa)
        }else{
          tulis = text
    
        }
    
      }
      return tulis;
    
    }
    // 10,000,000 = 15
    // x1000 = 10
    // x1000 = 155
    
    