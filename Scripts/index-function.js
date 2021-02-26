const validChars = /^[A-Z a-z 0-9]+$/
const validName = /^[A-Z a-z]+$/
const validEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

//api requests

function loginProcess(loginUser, loginPass, code) {
    $.ajax({
        type: "POST",
        url: './Api/index.php',
        data: jQuery.param({ loginMethod: "yes", user: loginUser, pass: loginPass, code: code }),
		processData: false
	})
	.done(responses => {
        noerror("login")
        if (responses == "Pass") {
            error("Incorrect Password!", "password", "login")
            console.log("Incorrect Password")
        }
        else if (responses == "User") {
            error("Username does not exist!", "username", "login")
            console.log("Username does not exist!")
        }
        else if(responses == "Error Sql 1") {
            error(responses)
            console.log("Error in Sql")
        }
        else {
            let data = responses.split("-")
            if(data[0] == "2021"){
                makeButton()
                error("An Email is sent to you.")
            	console.log("Email sent!")
            }
            else{
                let data = responses.split("/")

				localStorage.id = data[0]
				localStorage.firstname = data[1]
				localStorage.lastname = data[2]
                saveActivity(data[0], data[0]+"/Logged In")
               	console.log("Login Successful")
               	goLogin()
            }
        }
	})
	.fail(errorThrown => {
		console.log(errorThrown)
	})
}

function registerProcess(user, pass, first, mid, last, email) {
    $.ajax({
        type: "POST",
        url: './Api/index.php',
        data: jQuery.param({ registerMethod: "yes", user: user, pass: pass, first: first, mid: mid, last: last, email: email }),
		processData: false
	})
	.done(responses => {
        noerror("register")
        if(responses == "User" ) {
            error("Username Already Exist!", "regUser", "register")
            console.log("Username Already Exist!")
        }
        else if(responses == "Email") {
            error("Email Already Exist!", "regEmail", "register")
            console.log("Email Already Exist!")
        }
        else if(responses == "Go") {
            error("Registeration Complete!", "", "success")
            console.log("Registration Successful")
        }
        else {
            error(responses, "regUser", "register")
            console.log(responses)
        } 
	})
	.fail(errorThrown => {
		console.log(errorThrown)
	})
}

function saveActivity(id, data) {
    $.ajax({
        type: "POST",
        url: './Api/activities.php',
        data: jQuery.param({ addActivity: "yes", id: id, data: data }),
		processData: false
	})
	.done(responses => {
		console.log(responses)
    })
	.fail(errorThrown => {
		console.log(errorThrown)
	})
}

function verifyUserProcess(loginUser, code){
    const secureCode = localStorage.secureCode
    if(code == secureCode){
        $.ajax({
            type: "POST",
        	url: './Api/index.php',
            data: jQuery.param({ verify: "yes", user: loginUser}),
			processData: false
		})
		.done(responses => {
            if(responses == "Success"){
                deleteButton()
                noerror()
            }
            else{
                error(responses)
            }
	    })
		.fail(errorThrown => {
			console.log(errorThrown)
		})
	}
    else{
        error("Code didn't matched!")
    }
}

//Functions

function checkStatus() {
    if(localStorage.id){
    	return {
    		isIdSet: true
    	}
    }
    else{
    	return {
    		isIdSet: false
    	}
    }
}

function codeGenerator() {
    let result = ""
    const charactersLength = characters.length
    for ( var i = 0; i < 5; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return {
    	code : result
    }
}

function checkLogin(logUser, logPass) {
    noerror("login")
    if(ifEmpty(logUser).status === true){
        return {
        	status: false
        }
    }
    else if(ifEmpty(logPass).status === true){
        error("Password cannot be empty!", "password", "login")
        return {
        	status: false
        }
    }
    else{
        return {
        	status: true
        }
    }
}

function ifEmpty(data) {
    if(data === ""){
        return {
        	status: true
        }
    }
    else{
        return {
        	status: false
        }
    }
}

function checkInput(regUser, regPass, regConf, regFirst, regMid, regLast, regEmail) {
    let flag = false
    noerror("register")
    if(ifEmpty(regUser).status === true) {
        flag = false
        error("Username should not be empty!", "regUser", "register")
    }
    else if(ifEmpty(regPass).status === true) {
        flag = false
        error("Password should not be empty!", "regPass", "register")
    }
    else if(ifEmpty(regFirst).status === true) {
        flag = false
        error("First Name should not be empty!", "regFirst", "register")
    }
    else if(ifEmpty(regLast).status === true) {
        flag = false
        error("Last Name should not be empty!", "regLast", "register")
    }
    else if(ifEmpty(regEmail).status === true) {
        flag = false
        error("Email should not be empty!", "regEmail", "register")
    }
    else{
        if(!regUser.match(validChars)) {
            flag = false
            error("Username should not contain symbols!", "regUser", "register")
        }
        else if(!regPass.match(validChars)) {
            flag = false
            error("Password should not contain symbols!", "regPass", "register")
        }
        else if(!regFirst.match(validName)) {
            flag = false
            error("Name should not contain symbols and numbers!", "regFirst", "register")
        }
        else if(!regMid.match(validName)) {
            flag = false
            error("Name should not contain symbols and numbers!", "regMid", "register")
        }
        else if(!regLast.match(validName)) {
            flag = false
            error("Name should not contain symbols and numbers!", "regLast", "register")
        }
        else if(!regEmail.match(validEmail)) {
            flag = false
            error("Invalid Email!", "regEmail", "register")
        }
        else{
            if(!regPass.match(regConf)) {
                flag = false
                error("Password does not match!", "regConf", "register")
            }
            else{
                noerror()
                flag = true
            }
        }
    }
    return {
    	status : flag
    }
}

//Go to Functions and Hide/Show Functions

function goLogin() {
    $("#username").val("")
    $("#password").val("")
    $("#username").removeClass().addClass('inputs')
    $("#password").removeClass().addClass('inputs')
    location.href = "./Pages/home"
}

function makeButton() {
	$("#userCode").slideDown();
	$("#verify").slideDown();
}

function deleteButton(data = "hide") {
	if(data === "hide") {
		$("#userCode").slideUp()
		$("#verify").slideUp()
	}
	else {
		$("#userCode").hide()
		$("#verify").hide()
	}
}

function error(data, field = "unknown", page = "login") {
	if(page === "login") {
		$("#err").html(data)
  		$("#err").slideDown()
	}
	else{
		$("#errR").html(data)
  		$("#errR").slideDown()
	}

	if(ifElementExist(field).status === true) {
		$("#"+field).html("")
	    $("#"+field).removeClass().addClass('inputsWrong')
	}
}

function noerror(page) {
	if(page === "login") {
	    $("#username").removeClass().addClass('inputs')
	    $("#password").removeClass().addClass('inputs')
		$("#err").html("")
  		$("#err").slideUp()
	}
	else
	{
	    $("#regUser").removeClass().addClass('inputs')
	    $("#regPass").removeClass().addClass('inputs')
	    $("#regConf").removeClass().addClass('inputs')
	    $("#regFirst").removeClass().addClass('inputs')
	    $("#regMid").removeClass().addClass('inputs')
	    $("#regLast").removeClass().addClass('inputs')
	    $("#regEmail").removeClass().addClass('inputs')
		$("#errR").html("")
  		$("#err").slideUp()
	}
}

function ifElementExist(data) {
	let flag = false

	if($("#"+data).length) {
		flag = true
	}

	return {
		status: flag
	}
}

function changeTagline() {
	$("#tagLine").fadeOut()

	setTimeout(function() { 
		setTagline()
		$("#tagLine").slideDown()
	}, 500)
}

function setTagline() {
	let data = $("#tagLine").html()

	if(data == "Start a discussion") {
		data = "Socialize with peers"
	}
	else if(data == "Socialize with peers") {
		data = "Connect with your love one"
	}
	else{
		data = "Start a discussion"
	}

	$("#tagLine").html(data)

}