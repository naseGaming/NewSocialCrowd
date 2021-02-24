$(document).ready(function () {
	displayName(getInfo.fullName())
	getNotifCount()
	getPosts()
	hideDivs()

    $("#left-logout").click(function () {
    	logout()
	})

	$('#postText').keyup(function(){
		const postData = $("#postText").val()

		updateCharsLeft(postData)
	})

    $("#postBtn").click(function () {
		const postData = $("#postText").val()

    	const flag = verifyPostData(postData)
    	if(flag.status === true){
    		newPost(postData)
    	}
    	else{
    		disablePostBtn()
    	}
	})

	$("#search").keyup(function(){
		const data = $("#search").val()

    	if(data == ""){
    		hideSearchResult()
    	}
    	else{
    		searchData(data)
    	}
	})
})