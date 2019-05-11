window.addEventListener('DOMContentLoaded', function(){
	document.getElementById('submit').addEventListener("click",function(){
		
		let title = document.getElementById('title').value,
			description = document.getElementById('description').value,
			category = document.getElementById('category').value;
			
		if (title == '' || description == '' || category == ''){
			document.getElementById("errorModal").classList.add(" active");
			console.log(document.getElementById("errorModal").classList)
			return;
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