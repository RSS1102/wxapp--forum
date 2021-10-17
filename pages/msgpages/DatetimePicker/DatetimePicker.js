
let util = require('../../../utils/util');
Page({
  data: {
    show: false,
    minHour: 10,
    maxHour: 20,
    minDate: new Date().getTime(),
    maxDate: new Date(2099, 12, 12).getTime(),
    // currentDate: new Date().getTime(),
    showTimes:'',
  },
onLoad(){

},
  // popup
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  // datetime

  onInput(event) {
    this.data.showTimes = util.formatTime(new Date(event.detail)); 
    this.setData({
       showTimes: this.data.showTimes,
    });
    console.log("时间：",   this.data.showTimes)
    // 褚存时间值

  },
  onConfirm(){
    this.setData({ show: false });
  },
  onCancel(){
    console.log("取消")
    this.setData({ show: false });
  }


});