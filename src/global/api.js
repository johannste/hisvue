const config = require('../../config');

let url = {
  staticPath: process.env.NODE_ENV !== 'development' ? config.build.staticPath : config.dev.staticPath
};
export const api = {
  'login': url.staticPath + 'static/userLogin.json',
  'home': url.staticPath + 'static/home.json',
  'patientList': url.staticPath + 'static/patientList.json',
  'complaintPatient': url.staticPath + 'static/doctor/complaintPatient.json',
  'shiftList': url.staticPath + 'static/doctor/shiftList.json',
  'staffFlow': url.staticPath + 'static/doctor/staffFlow.json',
  'storage': url.staticPath + 'static/storage.json',
  'putInStorage': url.staticPath + 'static/putInStorage.json',
  'stockRemoval': url.staticPath + 'static/stockRemoval.json',
  'complaints': url.staticPath + 'static/complaints.json',
  'patientCount': url.staticPath + 'static/patientCount.json',
  'staffIntroduction': url.staticPath + 'static/staffIntroduction.json',
  'complainInfo': url.staticPath + 'static/complainInfo.json',
  'hasNurse': url.staticPath + 'static/hasNurse.json',
  'table_shift': url.staticPath + 'static/table_shift.json',
  'turnOver': url.staticPath + 'static/turnOver.json',
  'drugs': url.staticPath + 'static/drugs.json',
  'registered': url.staticPath + 'static/doctor/registered.json',
  'trashy': url.staticPath + 'static/trashy.json',
  'provinces': url.staticPath + 'static/provinces.json',
  'patientList1': url.staticPath + 'static/patientList1.json'
};
