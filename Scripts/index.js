$(document).ready(function () {
  const status = checkStatus()
  const secureCode = codeGenerator()
  localStorage.secureCode = secureCode.code

  if(status.isIdSet === true) {
    //goLogin()
  }

  $("#frmRegister").hide()
  $("#err").hide()
  $("#errR").hide()
  deleteButton("start")
  setInterval(changeTagline, 5000);

  $("#forget").click(function () {
    $("#frmRegister").hide()
    $("#frmLogin").hide()
  })

  $("#create").click(function () {
    $("#frmLogin").slideUp()
    $("#frmRegister").slideDown()
    console.log("Register Page")
  })

  $("#log").click(function () {
    $("#frmRegister").slideUp()
    $("#frmLogin").slideDown()
    console.log("Login Page")
  })

  $("#login").click(function () {
    const logUser = $("#username").val()
    const logPass = $("#password").val()
    const code = localStorage.secureCode

    if(checkLogin(logUser, logPass).status === true){
      loginProcess(logUser ,logPass, code)
    }
  })

  $("#register").click(function () {
    const regUser = $("#regUser").val()
    const regPass = $("#regPass").val()
    const regConf = $("#regConf").val()
    const regFirst = $("#regFirst").val()
    const regMid = $("#regMid").val()
    const regLast = $("#regLast").val()
    const regEmail = $("#regEmail").val()

    if(checkInput(regUser, regPass, regConf, regFirst, regMid, regLast, regEmail).status === true){
      registerProcess(regUser, regPass, regFirst, regMid, regLast, regEmail)
    }    
  })

  $("#verify").click(function () {
    const logUser = $("#username").val()
    const code = $("#userCode").val()
    
    verifyUserProcess(logUser, code)
  })

})