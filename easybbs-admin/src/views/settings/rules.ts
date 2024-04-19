const verify = (_rule: any, value: number, callback: Function) => {
  if (value && value < 0) {
    callback(new Error('不可小于0'))
  } else {
    callback()
  }
}

const func = {
  Show: (rule: any, value: number, callback: Function) => {
    return verify(rule, value, callback)
  },
}

export const rules = {
  registerWelcomInfo: [{ required: true, message: '请输入注册欢迎语' }],
  emailTitle: [{ required: true, message: '请输入邮件标题' }],
  emailContent: [{ required: true, message: '请输入邮件内容' }],
  postAudit: [{ required: true, message: '请选择是否需要审核' }],
  commentAudit: [{ required: true, message: '请选择是否需要审核' }],
  postIntegral: [
    { required: true, message: '请输入发帖可获得积分' },
    { validator: func.Show, message: '不可小于0' },
  ],
  postDayCountThreshold: [
    { required: true, message: '请输入每天可发帖数量' },
    { validator: func.Show, message: '不可小于0' },
  ],
  dayImageUploadCount: [
    { required: true, message: '请输入每天可上传图片数量' },
    { validator: func.Show, message: '不可小于0' },
  ],
  attachmentSize: [
    { required: true, message: '请输入允许上传附件大小' },
    { validator: func.Show, message: '不可小于0' },
  ],
  commentOpen: [{ required: true, message: '请选择是否开启评论' }],
  commentIntegral: [
    { required: true, message: '请输入评论可获得积分' },
    { validator: func.Show, message: '不可小于0' },
  ],
  commentDayCountThreshold: [
    { required: true, message: '请输入每天可发评论数量' },
    { validator: func.Show, message: '不可小于0' },
  ],
  likeDayCountThreshold: [
    { required: true, message: '请输入每天可点赞数量' },
    { validator: func.Show, message: '不可小于0' },
  ],
}
