function debounce(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300; //间隔时间，如果interval不传值，默认为300ms
  return function() {
	var that = this;
	var backTime = new Date(); //第一次函数return即触发的时间
	if(backTime - enterTime > gapTime) {
	  fn.call(that, arguments);
	  enterTime = backTime; //赋值给第一次触发的时间 保存第二次触发时间
    }
  };
}

export default {
  debounce
};