window.addEventListener('DOMContentLoaded', function(){
	var socket = io();

	socket.on("updateComments", function (data) {
		var comments = data.comments;
		var topic = data.topic;

		var $commentsContainer = document.querySelector(".comments-container");

		while ($commentsContainer.hasChildNodes()) {
			$commentsContainer.removeChild($commentsContainer.lastChild);
		}

		var $topic = document.querySelector(".topic-container");
		$topic.innerHTML = Handlebars.templates.topicQuestion(topic);

		for (var property in comments) {
			if (comments.hasOwnProperty(property)) {
				var topicCommentHtml = Handlebars.templates.topicComment(comments[property]);
				$commentsContainer.insertAdjacentHTML("beforeend", topicCommentHtml);
			}
		}
	});

	document.getElementById('submit').addEventListener("click",function(){
		var comment = document.getElementById('comment').value,
			id = document.getElementById('hidden').innerHTML;

		if (comment == ''){
			document.getElementById("errorModal").classList.add("active");
			return;
		}
		
		document.getElementById('comment').value = '';
		
		var postURL = "/comments/new";
		
		var postRequest = new XMLHttpRequest();
		postRequest.open('POST', postURL);
		postRequest.setRequestHeader('Content-Type', 'application/json');
		
		postRequest.addEventListener('load', function (event) {
			if (event.target.status !==200) {
				alert('Your post failed with an error code of' + event.target.status);
			}

			else {
				socket.emit("updatedComment", { topicId: id });
			}
		});
		
		// this send data to handlebar templete 
		// topicId helps to update views
		var postBody = {
			topicId: id,
			content: comment
		};
		
		postRequest.send(JSON.stringify(postBody));
	});
});