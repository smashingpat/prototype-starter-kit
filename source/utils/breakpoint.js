const defaultParams = {
  element: document.body
}

const Breakpoint = function(params = defaultParams) {
  this.element = params.element
  this.afterElement = window.getComputedStyle(this.element, ':after')
  this.currentBreakpoint = ''
  this.lastBreakpoint = ''
  this.functions = {};
  this.init()
}

Breakpoint.prototype = {
  init() {
    window.addEventListener('resize', this._resizeHandler.bind(this), false)
  },
  on(breakPointName, callback) {
    let functionArray = this.functions[breakPointName] || [];

    this.functions[breakPointName] = functionArray.concat(callback)

    return this
  },
  call() {
    this._resizeHandler()
    return this
  },
  _resizeHandler() {
    // check current breakpoint
    this.currentBreakpoint = this.afterElement
      .getPropertyValue('content')
      .replace(/^['"]|['"]$/g, '')

    if (this.currentBreakpoint !== this.lastBreakpoint) {
      this.lastBreakpoint = this.currentBreakpoint // set last breakpoint to current

      this._callFunctions()
    }
  },
  _callFunctions() {
    let functionsList = this.functions[this.currentBreakpoint] || []

    if (functionsList.length > 0) {
      functionsList.map(fn => fn())
    }
  }
}


export default Breakpoint
