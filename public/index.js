window.onload = function () {
    console.log("Hello world!");
    
    Handlebars.registerHelper("formatDate", function (date) {
        return moment(date).format("MMMM Do YYYY, h:mm a");
    });
};
