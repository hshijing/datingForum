/* 节流 */
export function _throttle(func, delay) {
  let timerId
  let lastExecTime = 0
  return function (...args) {
    const context = this
    const currentTimestamp = Date.now()
    if (currentTimestamp - lastExecTime > delay) {
      func.apply(context, args)
      lastExecTime = currentTimestamp
    } else {
      clearTimeout(timerId)
      timerId = setTimeout(function () {
        func.apply(context, args)
        lastExecTime = currentTimestamp
      }, delay)
    }
  }
}
