//jshint: version ES6
exports.getDate = () =>{
    let today = new Date();
    let options = {
        weekday :"long",
        day : "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US",options);

    return day;
}

exports.getDay = () => {
    let today = new Date();
    let options = {
        weekday :"long"
    };

    let day = today.toLocaleDateString("en-US",options);

    return day;
}