// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud1-1gwuqx9124efb084"
});

const db = cloud.database();
const _ = db.command;
const $ = _.aggregate;
const sendMessage_t = db.collection("water-talk");

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID;
    let len=event.len
  return await sendMessage_t.aggregate()
  //聚合函数， 集合sendmessage的_id，集合pagezan的page_id，聚合查询一个新表pageList
    .lookup({
      from: 'pagezan',
      localField: '_id',
      foreignField: 'page_id',
      as: 'pageList',
    }).addFields({
     //聚合阶段。添加新字段到输出的记录。
      isZan: $.cond({     // cond计算布尔表达式 true/false
        if: $.gt([$.size($.filter({
          input: '$pageList',
          as: 'item',
          //cond计算布尔表达式 true/false  
          //用于表示逻辑 "与" 的关系
          //eq表示字段等于某个值。 
          cond: $.and([$.eq(['$$item._openid', openid]), $.eq(['$$item.zanboolean', true])])
        })), 0]),then:true,else:false
      })
    })
    //project把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段
    // 0舍弃某字段
    .project({
      pageList:0,
      _openid:0
    })
    //倒序-1，正序1
    .sort({
      time: -1
  })
    //分页
    .skip(len)
    .limit(10)
  
    .end();
}
