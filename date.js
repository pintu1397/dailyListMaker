   //jshint esversion:6

//console.log(module);
exports.getDate = function (){
    const today = new Date();
    const currentDay = today.getDay();
    //var day="";

    const option = {
        weekday : "long",
        day : "numeric",
        month : "long",
    };
    return day = today.toLocaleDateString("en-us",option);
    
}

exports.getDay = function (){
    const today = new Date();

    let option = {
        weekday : "long",
       
    };
    return day = today.toLocaleDateString("en-us",option);
    
}

