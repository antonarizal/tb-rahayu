const Store = require("electron-store");
const { data } = require("jquery");
const toastr = require("toastr");
const store = new Store();
const server_url = 'http://'+ store.get('hostName') + ":" + store.get('port') + '/';
var base_url = 'http://localhost:3344/';

$.get(server_url+"api/options/cetak",function(resp){
    $("#default_ukuran_kertas").val(resp.default_ukuran_kertas);
    $("input[name='printer_margin_top']").val(resp.printer_margin_top);
    $("input[name='printer_margin_left']").val(resp.printer_margin_left);
    $("input[name='printer_font_size']").val(resp.printer_font_size);
    $("input[name='printer_print']").val(resp.printer_print);
    $("input[name='printer_width']").val(resp.printer_width);
    $("#printer_font_family").val(resp.printer_font_family);
    $("#printer_font_weight").val(resp.printer_font_weight);
    $("textarea[name='printer_footer_text']").val(resp.printer_footer_text);
    loadNota()

})

$("#post").on('submit', (function(e) {
    e.preventDefault();
    $.ajax({
        url: server_url+'api/options/save',
        type: 'POST',
        data: new FormData(this),
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
            toastr.success(data.message)
            store.set("footerText",$("textarea[name='printer_footer_text']").val())

        },
        error: function(data) {
            toastr.error(data.message)
        }
    });

}));

function cetakNota(){
    $("#cetakPre").print()
}

function loadNota(){
    dataFaktur.footer = $("#printer_footer_text").val()
    var dataNota = getNota(dataFaktur)  
    const font_size = $("#printer_font_size").val()
    const font_weight = $("#printer_font_weight").val()
    const font_family = $("#printer_font_family").val()
    const margin_top = $("input[name='printer_margin_top']").val()
    const margin_left = $("input[name='printer_margin_left']").val()
    store.set("fontSizeNota",font_size);
    store.set("fontFamilyNota",font_family);
    store.set("marginTopNota",margin_top);
    store.set("marginLeftNota",margin_left);
    
    $("#cetak").html(`
    <style>
    #cetakPre {
        white-space: pre;
        font-size:${font_size}px !important;
        font-weight: ${font_weight};
        font-family: '${font_family}';
        margin-top: '${margin_top}';
        margin-left: '${margin_left}';
        line-height: 1;
     }
     </style>
    <text id='cetakPre'>`+dataNota+`</text>`)
    }