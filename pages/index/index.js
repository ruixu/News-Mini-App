var moment = require('../../libs/moment.min.js');

const categoryMap = {
  'gn': '国内',
  'gj': '国际',
  'cj': '财经',
  'yl': '娱乐',
  'js': '军事',
  'ty': '体育',
  'other': '其他',
}

Page({
  data: {
    topNews:[],
    newsList: [],
    category: 'gn',
    categoryList: [
      { 'en': 'gn', 'cn': '国内' }
    ],
  },

  onLoad() {
    this.setCategory()
    this.getNews()
  },

  setCategory() {
    let categoryList = []
    for (var key in categoryMap) {
      categoryList.push({
        en: key,
        cn: categoryMap[key]
      })
    }
    this.setData({
      categoryList: categoryList
    })
  },

  getNews(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.category
      },
      success: res => {
        let result = res.data.result
        this.setNewsList(result)     
      },
      fail: res => {
        console.log(res)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setNewsList(result) {
    let topNews = []
    let newsList = []

    // get top News
    topNews.push({
      id: result[0].id,
      title: result[0].title.slice(0, 30),
      time: moment(result[0].date).fromNow(),
      source: result[0].source || '快读资讯',
      firstImage: result[0].firstImage || "/images/default-news-img.png",
    })

    // get following News
    for (let i = 1; i < result.length; i += 1) {
      newsList.push({
        id: result[i].id,
        title: result[i].title.slice(0, 30),
        time: moment(result[i].date).fromNow(),
        source: result[i].source || '快读资讯',
        firstImage: result[i].firstImage || "/images/default-news-img.png",
      })
    }
    this.setData({
      newsList: newsList,
      topNews: topNews
    })
  },

  onTapCategory(event) {
    this.setData({
      category: event.currentTarget.dataset.category
    })
    this.getNews()
  },

  onTapNews(event) {
    let newsID = event.currentTarget.dataset.newsid  
    wx.navigateTo({
      url: '/pages/news/news?id=' + newsID
    })
  },

  onPullDownRefresh() {   
    console.log('home page refresh!')
    this.getNews(() => {
      wx.stopPullDownRefresh()
    })
  },

})