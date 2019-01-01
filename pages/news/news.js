var moment = require('../../libs/moment.min.js');

Page({
  data: {
    id: '',
    newsInfo: {}
  },

  onLoad(opt) {
    this.setData({
      id: opt.id,    
    })
    this.getDetail()
  },

  // get details of the news
  getDetail(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      success: res => {
        let newsInfo = res.data.result 
        newsInfo.time = moment(newsInfo.date).format('MMMM Do YYYY, h:mm:ss'),                       
        newsInfo.source = newsInfo.source || '快读资讯',     
        this.setData({
          newsInfo: newsInfo,
        })

        let fields = this.getNewsContent(res.data.result.content)
        this.setData({
          newsContent: fields
        })
      },
      fail: res => {
        console.log(res)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  // get contents of the news
  getNewsContent(content) {
    let fields = []
    for (let i = 0; i < content.length; i += 1) {
      if (content[i].type === 'image') {
        fields.push([{
          name: 'img',
          attrs: {
            class: 'article-img',
            src: content[i].src
          }
        }])
      }
      else {
        fields.push([{
          name: content[i].type,
          attrs: {
            class: 'article-text'
          },
          children: [{
            type: 'text',
            text: content[i].text
          }]
        }
        ])
      }
    }
    return fields;
  },

  onPullDownRefresh() {  
    console.log('news content page refresh!')
    this.getDetail(() => {
      wx.stopPullDownRefresh()
    })
  },

})