// $(document).ready(()=>{
//     console.log("hellow")});
var label1 = $("#inbox");
var label2 = $("#notifi");

function okResponse(element){
  $.ajax({
    method:"DELETE",
    url: '/checkInbox/okResponse',
    data:{
      requestId:$(element).attr('id'),
      state:1
    },
    success:function(data){
      if(data){
        $('.notifi-center').find('#'+$(element).attr('id')).remove()
        let count= label2.html()-1
        if(count===0){
          label2.hide()
        }else{
        label2.html(count)
        }
      }
    },
    error:function(data){
      alert(data)
    }
  })
}

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
        let count= label1.html()-1
        if(count===0){
          label1.hide()
        }else{
        label1.html(count)
        }
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
        let count= label1.html()-1
        if(count===0){
          label1.hide()
        }else{
        label1.html(count)
        }
      }
    },
    error:function(data){
      alert(data)
    }
  })
}

function myPeriodicMethod() {
    $.ajax({
      url: "/checkInbox/request", 
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
              '<div id="'+requestId+'"class="dropdown-item d-flex align-items-center">'
                +'<div class="dropdown-list-image mr-3">'
                  +'<img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="">'
                  +'<div class="status-indicator bg-success"></div>'
                +'</div>'
                +'<div class="font-weight-bold">'
                  +'<div class="text-truncate"> '+ requestArray[i].description+' </div>'
                  +'<div class="small text-gray-500">'+(requestArray[i].month+1)+'/'+requestArray[i].day+'/'+requestArray[i].year+"\n"+requestArray[i].start_time+' to '+requestArray[i].end_time+'</div>'
                +'</div>'
                +'<div class="align-items-right form-col">'
                  +'<button id="'+requestId+'" class="btn btn-success" onclick="acceptRequest(this)" style="border-radius:30px;margin-bottom:10px">Accept</button>'
                  +'<button id="'+requestId+'" class="btn btn-danger" onclick="rejectRequest(this)" style="border-radius:30px;margin-bottom:10px">Reject</button>'
                +'</div>'

              +'</div>')
            }
          }
          $('.inbox-container').append(
            '<a class="dropdown-item text-center small text-gray-500" href="/request">Read More Messages</a>'
          )
        }
        if(count){
          label1.html(count)
        }else{
          label1.hide()
        }
      },
      complete: function() {
        // schedule the next request *only* when the current one is complete:
        setTimeout(myPeriodicMethod, 5*60000);
      }
    });

    //for checking response
    $.ajax({
      url: "/checkInbox/response", 
      success: function(data) {
        let requestArray = data.data
        let count = 0
        $('.notifi-container').html('')
        if(requestArray){
           for(let i=0;i<requestArray.length;i++){
            //if the state is 0 that means it's not read yet
            if(Number(requestArray[i].state)=== 1 || Number(requestArray[i].state)=== 2){
              count++;
            let requestId = requestArray[i]._id
            let state;
            if(Number(requestArray[i].state)=== 1 ){
              state="Approved"
            } else {
              state="Rejected"
            }
            $('.notifi-container').append(
              '<a id="'+requestId+'"class="dropdown-item d-flex align-items-center">'
                +'<div class="dropdown-list-image mr-3">'
                +'<img class="rounded-circle" src="https://source.unsplash.com/fn_BT9fwg_E/60x60" alt="">'
                  +'<div class="status-indicator bg-success"></div>'
                +'</div>'
                +'<div class="font-weight-bold">'
                  +'<div class="text-truncate"> '+"State: "+ state+' </div>'
                  +'<div class="small text-gray-500">'+ (requestArray[i].month+1)+'/'+requestArray[i].day+'/'+requestArray[i].year+"\n"+requestArray[i].start_time+' to '+requestArray[i].end_time+'</div>'
                +'</div>'
                +'<div class="align-items-right">'
                  +'<button id="'+requestId+'" class="btn btn-success" onclick="okResponse(this)" style="border-radius:30px;margin-bottom:10px">Ok</button>'
                +'</div>'

              +'</a>')
            }
          }
        }
        if(count){
          label2.html(count)
        }else{
          label2.hide()
        }
      },
      complete: function() {
        // schedule the next request *only* when the current one is complete:
        setTimeout(myPeriodicMethod, 20*60000);
      }
    });
  
  }
// schedule the first invocation:
setTimeout(myPeriodicMethod, 2000);


  