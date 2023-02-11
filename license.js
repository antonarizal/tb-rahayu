
const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function addDays(date, days) {
    // menambah hari ke dalam tanggal
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days)
    return copy
  }

function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function getLicenseStatus(store){

    const date = new Date();
    const newDate = addDays(date, 30);
    //Jika license_date belum ada maka diset license_date = dateNow + 30 hari
    store.get("license_date") || store.set("license_date", newDate);
    store.get("license_status") || store.set("license_status", "TRIAL");
    
    const locale = "id-ID";
    const now = new Date();
    const license_date = new Date(store.get("license_date")).toLocaleString(locale, {timeZone: "Asia/Jakarta"});
    const date_lic = new Date(store.get("license_date"));
    const cal_trial = (dateDiffInDays(new Date(), new Date(store.get("license_date"))));
    
    
    // Jika tanggal sekarang (now) <= license_date -> license_status = trial
    // Jika tanggal sekarang (now) > license_date -> license_status = unregistered
    var license_status ;
    if(now <= date_lic){
        if(store.get("license_status") =='active'){
            license_status = ''
        }else{
            license_status = 'TRIAL'
    
        }
    }else{
        if(store.get("license_status") =='active'){
            license_status = ''
        }else{
            license_status = 'unregistered'
    
        }
    }
    const license = {
        status : license_status,
        date : date_lic
    }
    return license;
    
}

module.exports = {
    getLicenseStatus,
  };