export const aticle = {
  state: {
    /* //存储文章列表
    articleListInfo: undefined,
    //文章附件
    attachment: undefined, */
    // 存储文章id
    articleId: undefined,
  },
  mutations: {
    ArticleListInfo(state, value) {
      state.articleId = value
      // state.attachment = value.attachment
    },
  },
}
