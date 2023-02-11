const Store = require("electron-store");
const numeral = require("numeral");
const toastr = require("toastr");
const store = new Store();
const level = store.get("level")
const host = store.get("base_url") + "views";

$("#server_url").val(store.get("server_url"))
$("#post").on('submit', (function(e) {
  e.preventDefault()
   store.set("server_url",$("#server_url").val())
   toastr.success("Data berhasil disimpan")

}));