const cloud = require("wx-server-sdk");

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
   var contenttit = event.contenttit;
   var contentpag=event.contentpag;
  try {
    const result = await cloud.openapi.security.msgSecCheck({
      content: contenttit,
      content:contentpag,
    });

    if (result.errCode === 87014) {
      return {
        texttit: contenttit,
        textpag: contenttit,
        code: 500,
        msg: "内容含有违法违规内容",
        data: result,
      };
    } else {
      return {
        texttit: contenttit,
        textpag: contenttit,
        code: 200,
        msg: "内容ok",
        data: result,
      };
    }
  } catch (err) {
    // 错误处理
    if (err.errCode === 87014) {
      return {
        texttit: contenttit,
        textpag: contenttit,
        code: 500,
        msg: "内容含有违法违规内容",
        data: err,
      };
    }
    return {
      texttit: contenttit,
      textpag: contenttit,
      code: 502,
      msg: "调用msgSecCheck接口异常",
      data: err,
    };
  }
};