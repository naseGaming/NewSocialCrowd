//api requests

function saveActivity(id, data) {
    $.ajax({
        type: "POST",
        url: '/NewSocialCrowd/Api/activities.php',
        data: jQuery.param({ addActivity: "yes", id: id, data: data }),
		processData: false
	})
}

function getNotifCountProcess(id) {
    return $.ajax({
		type: "POST",
        url: '/NewSocialCrowd/Api/notifications.php',
		data: jQuery.param({ getNotifCount: "yes", id: id }),
		processData: false
	})
}

function getPostsProcess(id, data) {
    return $.ajax({
		type: "POST",
		url: '/NewSocialCrowd/Api/posts.php',
		data: jQuery.param({ getposts: "yes", id: id, data: data}),
		processData: false
	})
}

function newPostProcess(id, data){
    return $.ajax({
		type: "POST",
		url: '/NewSocialCrowd/Api/posts.php',
		data: jQuery.param({ newPost: "yes", id: id, data: data}),
		processData: false
	})
}

function logoutProcess(id) {
    return $.ajax({
		type: "POST",
		url: '/NewSocialCrowd/Api/activities.php',
		data: jQuery.param({ logout: "yes", id: id}),
		processData: false
	})
}

function deletePostProcess(id) {
    return $.ajax({
		type: "POST",
		url: '/NewSocialCrowd/Api/posts.php',
		data: jQuery.param({ deletePost: "yes", id: id }),
		processData: false
	})
}

function reactPostProcess(postId, id, reaction){
    return $.ajax({
		type: "POST",
		url: '/NewSocialCrowd/Api/posts.php',
		data: jQuery.param({  reactPost: "yes", postId: postId, id: id, reaction: reaction }),
		processData: false
	})
}

function notificationProcess(id, data, dataType){
    return $.ajax({
		type: "POST",
        url: '/NewSocialCrowd/Api/notifications.php',
		data: jQuery.param({ addNotif: "yes", id: id, data: data, dataType: dataType  }),
		processData: false
	})
}

function searchDataProcess(id, searchData){
    return $.ajax({
		type: "POST",
        url: '/NewSocialCrowd/Api/search.php',
		data: jQuery.param({ search: "yes", id: id, searchData: searchData }),
		processData: false
	})
}

function sendReplyProcess(id, postId, replyData){
    return $.ajax({
		type: "POST",
        url: '/NewSocialCrowd/Api/posts.php',
		data: jQuery.param({ sendReply: "yes", id: id, postId: postId, replyData: replyData }),
		processData: false
	})
}

//objects

const getInfo = {
	id: function() {
		if(localStorage.id) {
			return localStorage.id
		}
		else {
			goLogout
		}
	},
	firstname: localStorage.firstname,
	lastname: localStorage.lastname,
	fullName: function() {
		return this.firstname + " " + this.lastname
	}
}

//functions

function getNotifCount() {
	const id = getInfo.id()

	$.when(getNotifCountProcess(id)).done(result => {
		if(result == "Error Sql 1") {
			logError("Get Notif Count", result)
		}
		else {
			if(result === "0") {
				showNotifCount("<i class='fas fa-bell'></i> Notifications","inactives")
			}
			else {
				showNotifCount("<i class='fas fa-bell'></i> "+result+" Notifications","actives")
			}
		}
	})
}

function getPosts() {
	const id = getInfo.id()
	const data = "newsfeed"


	$.when(getPostsProcess(id, data)).done(result => {
		showPosts(result)
		hideReply("all")
	})
}

function logout() {
	const id = getInfo.id()

	$.when(logoutProcess(id)).done(result => {
		if(result == "Success") {
			goLogout()
		}
		else {
			logError("Logout", result)
		}
	})
}

function newPost(postData) {
	const id = getInfo.id()

	$.when(newPostProcess(id, postData)).done(result => {
		if(result == "Success") {
			clearNewPost()
			showSuccess("Posted Successfully <i class='fas fa-check-circle'></i>")
			getPosts()
		}
		else {
			logError("New Post", result)
		}
	})
	saveActivity(id, "Posted/"+postData)
}

function deletePost(app) {
	const postId = app.id
	const id = getInfo.id()
	$.when(deletePostProcess(postId)).done(result => {
		showSuccess("Deleted Successfully <i class='fas fa-check-circle'></i>")
		getPosts()
	})
	saveActivity(id, "Deleted the post/"+postId)
}

function agreePost(app) {
	const postId = app.name
	const id = getInfo.id()
	$.when(reactPostProcess(postId, id, "1")).done(result => {
		if(result == "Reacted") {
			saveActivity(id, "Agreed to the post/"+postId)
			addNotif(postId, id+"/reacted to your post", "Reaction")
			getPosts()
		}
		else if(result == "Deleted") {
			saveActivity(id, "Removed reaction to the post/"+postId)
			getPosts()
		}
		else if(result == "Edited") {
			saveActivity(id, "Changed reaction to agree the post/"+postId)
			getPosts()
		}
		else{
			logError("Agree", result)
		}
	});
}

function disAgreePost(app){
	const postId = app.name
	const id = getInfo.id()
	$.when(reactPostProcess(postId, id, "0")).done(result => {
		if(result == "Reacted") {
			saveActivity(id, "Agreed to the post/"+postId)
			addNotif(postId, id+"/reacted to your post", "Reaction")
			getPosts()
		}
		else if(result == "Deleted") {
			saveActivity(id, "Removed reaction to the post/"+postId)
			getPosts()
		}
		else if(result == "Edited") {
			saveActivity(id, "Changed reaction to disagree the post/"+postId)
			getPosts()
		}
		else{
			logError("Disagree", result)
		}
	});
}

function addNotif(searchId, data, dataType){
	const id = getInfo.id()

	$.when(notificationProcess(searchId, data, dataType)).done(result => {
		logError("Add Notif", result)
	})
}

function searchData(data) {
	const id = getInfo.id()

	$.when(searchDataProcess(id, data)).done(result => {
		if(result == "Error Sql 1") {
			logError("Search Result", result)
		}
		else if(result == "Error Sql 2") {
			logError("Search Result", result)
		}
		else { 
			showSearchResult(result)
		}
	})
}

function sendReply(app) {
	const id = getInfo.id()
	const postId = app.name
	const replyData = $("#replyText-"+postId).val()

	$.when(sendReplyProcess(id, postId, replyData)).done(result => {
		if(result == "Success") {
			saveActivity(id, "Replied to the/"+postId)
			clearNewReply(postId)
			showSuccess("Replied Successfully <i class='fas fa-check-circle'></i>")
		}
		else {
			logError("Send Reply", result)
		}
	})
}

function hideDivs() {
	hideSuccess()
	hideSearchResult()
}

function updateCharsLeft(postData) {
	const charResult = 255 - postData.length;

	if(charResult >= 0) {
		showRemainingNumber(charResult)
		enablePostBtn()
	}
	else {
		showRemainingNumber(charResult)
		disablePostBtn()
	}
}

function verifyPostData(postData) {
	if(postData.length > 255){
		return {
			status: false
		}
	}
	else {
		return {
			status: true
		}
	}
}

//Go to Functions and Hide/Show Functions

function displayName(name) {
	$("#userName").html(name)
}

function goLogout() {
    localStorage.removeItem("id")
    localStorage.removeItem("firstname")
    localStorage.removeItem("lastname")
	location.href = "/NewSocialCrowd/"
}

function logError(process, data) {
	console.log(process + ": " + data)
}

function showNotifCount(data, type) {
	$("#left-notifications").html(data)
	$("#left-notifications").removeClass().addClass(type)
}

function showPosts(data) {
	$("#newsfeed").html(data)
}

function hideSuccess() {
	$("#successPost").hide()
}

function hideSearchResult() {
	$("#search-result").slideUp()
}

function disablePostBtn() {
	$('#postBtn').attr('disabled','disabled')
	$("#postBtn").removeClass().addClass('disabled')
	$("#charactersLeft").removeClass().addClass('charactersLeftError')
}

function enablePostBtn() {
   	$('#postBtn').removeAttr('postBtn')
	$("#postBtn").removeClass().addClass('postBtn')
	$("#charactersLeft").removeClass().addClass('charactersLeft')
}

function showRemainingNumber(data){
	$("#charactersLeft").html(data)
}

function clearNewPost() {
	$("#postText").val("")
}

function showSuccess(data) {
	$("#successPost").html(data)

	$("#successPost").slideDown()
	setTimeout(function() { 
		$("#successPost").slideUp()
	}, 2000)
}

function hideSearchResult(){
	$("#search-result").slideUp()
}

function showSearchResult(data){
	$("#search-result").html(data)
	$("#search-result").slideDown()
}

function hideReply(data) {
	if(data == "all") {
		$(".reply").hide()
	}
	else{
		$("#reply-"+data).attr("data-id", "hide")
		$("#reply-"+data).slideUp()
	}
}

function showReply(app) {
	const id = app.name
	const value = $("#reply-"+id).attr("data-id")

	if(value == undefined) {
		$("#reply-"+id).attr("data-id", "hide")
	}
	else if(value == "hide") {
		$("#reply-"+id).attr("data-id", "show")
		$("#reply-"+id).slideDown()
	}
	else {
		hideReply(id)
	}
}

function clearNewReply(data) {
	$("#replyText-"+data).val("")
}
