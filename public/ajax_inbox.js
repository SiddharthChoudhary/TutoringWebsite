// $(document).ready(()=>{
//     console.log("hellow")});
var label = $("#inbox");

function acceptRequest(element){
  $.ajax({
    method:"PUT",
    url: '/checkInbox/acceptRequest',
    data:{
      requestId:$(element).attr('id'),
      state:1
    },
    success:function(data){
      if(data){
        $('.messageCenter').find('#'+$(element).attr('id')).remove()
      }
    },
    error:function(data){
      alert(data)
    }
  })
}
function rejectRequest(element){
  $.ajax({
    method:"PUT",
    url: '/checkInbox/rejectRequest',
    data:{
      requestId:$(element).attr('id'),
      state:2
    },
    success:function(data){
      if(data){
        $('.messageCenter').find('#'+$(element).attr('id')).remove()
      }
    },
    error:function(data){
      alert(data)
    }
  })
}

function myPeriodicMethod() {
    $.ajax({
      url: "/checkInbox", 
      success: function(data) {
        let requestArray = data.data
        let count = 0
        $('.inbox-container').html('')
        if(requestArray){
           for(let i=0;i<requestArray.length;i++){
            //if the state is 0 that means it's not read yet
            if(Number(requestArray[i].state)=== 0){
              count++;
            let requestId = requestArray[i]._id
            $('.inbox-container').append(
              '<a id="'+requestId+'"class="dropdown-item d-flex align-items-center" href="#">'
                +'<div class="dropdown-list-image mr-3">'
                  +'<img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="">'
                  +'<div class="status-indicator bg-success"></div>'
                +'</div>'
                +'<div class="font-weight-bold">'
                  +'<div class="text-truncate"> '+ requestArray[i].description+' </div>'
                  +'<div class="small text-gray-500">'+(requestArray[i].month+1)+'/'+requestArray[i].day+'/'+requestArray[i].year+'-'+requestArray[i].start_time+' to '+requestArray[i].end_time+'</div>'
                +'</div>'
                +'<div class="align-items-right">'
                  +'<button id="'+requestId+'" class="btn btn-success" onclick="acceptRequest(this)" style="border-radius:30px;margin-bottom:10px">Accept</button>'
                  +'<button id="'+requestId+'" class="btn btn-danger" onclick="rejectRequest(this)" style="border-radius:30px;margin-bottom:10px">Reject</button>'
                +'</div>'

              +'</a>')
            }
          }
          $('.inbox-container').append(
            '<a class="dropdown-item text-center small text-gray-500" href="#">Read More Messages</a>'
          )
        }
        if(count){
          label.html(count)
        }else{
          label.hide()
        }
      },
      complete: function() {
        // schedule the next request *only* when the current one is complete:
        setTimeout(myPeriodicMethod, 1000);
      }
    });
  }
//   // schedule the first invocation:
setTimeout(myPeriodicMethod, 6000);

// (function($) {
    // Let's start writing AJAX calls!
    // var myNewTaskForm = $("#new-item-form"),
    //   newNameInput = $("#new-task-name"),
    //   newDecriptionArea = $("#new-task-description"),
    //   todoArea = $("#todo-area");
  
    // function bindEventsToTodoItem(todoItem) {
    //   todoItem.find(".finishItem").on("click", function(event) {
    //     event.preventDefault();
    //     var currentLink = $(this);
    //     var currentId = currentLink.data("id");
  
        // var requestConfig = {
        //   method: "POST",
        //   url: "/users/inbox"
        // };
  
        // $.ajax(requestConfig).then(function(responseMessage) {
        //   var newElement = $(responseMessage);
        //   bindEventsToTodoItem(newElement);
        //   todoItem.replaceWith(newElement);
        // });
    //   });
    // }
  
    // todoArea.children().each(function(index, element) {
    //   bindEventsToTodoItem($(element));
    // });
  
    // myNewTaskForm.submit(function(event) {
    //   event.preventDefault();
  
    //   var newName = newNameInput.val();
    //   var newDescription = newDecriptionArea.val();
    //   var newContent = $("#new-content");
  
    //   if (newName && newDescription) {
    //     var useJson = true;
    //     if (useJson) {
    //       var requestConfig = {
    //         method: "POST",
    //         url: "/api/todo",
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //           name: newName,
    //           description: newDescription
    //         })
    //       };
  
    //       $.ajax(requestConfig).then(function(responseMessage) {
    //         console.log(responseMessage);
    //         newContent.html(responseMessage.message);
    //         //                alert("Data Saved: " + msg);
    //       });
    //     } else {
    //       var requestConfig = {
    //         method: "POST",
    //         url: "/api/todo.html",
    //         contentType: "application/json",
    //         data: JSON.stringify({
    //           name: newName,
    //           description: newDescription
    //         })
    //       };
  
    //       $.ajax(requestConfig).then(function(responseMessage) {
    //         console.log(responseMessage);
    //         var newElement = $(responseMessage);
    //         bindEventsToTodoItem(newElement);
  
    //         todoArea.append(newElement);
    //       });
    //     }
    //   }
    // });
//   })(window.jQuery);
  