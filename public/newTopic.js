window.addEventListener('DOMContentLoaded', function(){
	document.getElementById('submit').addEventListener("click",function(){
				
		var title = $("#title").val();
		var description  = $("#description").val()		
		//ENCODED FOR MAXIMUM SAFETY
		var encodedTitle = $('<div />').text(title).html();
		var encodedDescription  = $('<div />').text(description).html();

		$('#title').val(encodedTitle);
		$('#description').val(encodedDescription);
		
	    title = document.getElementById('title').value
			description = document.getElementById('description').value
			let category = document.getElementById('category').value;
			//console.log("new topic")
		if (title === '' || description === '' || category === ''){
			$('.error-message').removeClass('hidden');
			return;
		} else {
			$('.error-message').addClass('hidden');
		}
		
		document.getElementById('title').value = '';
		document.getElementById('description').value = '';
		document.getElementById('category').value = '';
		
		let postURL = "/topics/new";
		
		let postRequest = new XMLHttpRequest();
		postRequest.open('POST', postURL);
		postRequest.setRequestHeader('Content-Type', 'application/json');
		
		postRequest.addEventListener('load', function (event) {
			if (event.target.status !==200) {
				alert('Your post failed with an error code of' + event.target.status);
			}

			else {
				let res = JSON.parse(event.target.response);
				window.location = "/topics/" + res.topicId;
			}
		});
		let postBody = {
			title: title,
			description: description,
			category: category
		};
		
		postRequest.send(JSON.stringify(postBody));
	});
});