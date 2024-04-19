/* 登录表单校验
  email:null,//邮箱
  username:'',//昵称
  emailCode:null,//注册邮箱验证码
  password:null,//密码
  password1:null,//二次密码
  checkCode:null,//图形验证码
*/
export const regs = {
  regEamil: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  regUsername: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
  regPassword: /^[a-zA-Z0-9_-]{8,}$/,
}
const verify = (rule, value, reg, callback) => {
  if (value) {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error(rule.message))
    }
  } else {
    callback()
  }
}
const regsLogin = {
  email: (rule, value, callback) => {
    return verify(rule, value, regs.regEamil, callback)
  },
}


//表单校验
export const r={
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: regsLogin.email,
      message: '请输入正确格式的邮箱',
      trigger: 'blur',
    },
  ],
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    {
      pattern: regs.regUsername,
      message: '昵称为4-10字符组成',
      trigger: 'blur',
    },
  ],
  emailCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  checkCode: [
    { required: true, message: '请输入图形验证码', trigger: 'blur' }
  ],
}