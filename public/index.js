window.onload = function () {
    console.log("Hello world!");

    document.querySelectorAll(".close-modal").forEach(function (e) {
        e.addEventListener("click", function () {
            document.querySelector(".modal active").classList.remove("active");
        });
    });

    Handlebars.registerHelper("formatDate", function (date) {
        return moment(date).format("MMMM Do YYYY, h:mm a");
    });
};
