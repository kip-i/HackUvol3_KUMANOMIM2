//author:takuma
//kumanomiM2


function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//データベースに関する機能の取得
let db = firebase.firestore();

/*あるプロジェクトの期間のあるユーザーのマイスケジュールを返す*/
function getUserSchedule(uid){
    /*あるプロジェクトIDのプロジェクトの開始日、終了日を取得する*/
    var projectId = getParam("project");
    var period = [];
    period = db.collection(projectId).doc("projectID").doc("projectPeriod").get();
    /*あるユーザーIDをもつユーザーのプロジェクトの期間のマイスケジュールを取得する*/
    var projectPeriodMySchedule = [];
    projectPeriodMySchedule = db.collection("account").doc(uid).collection("myScheduleId").where("date", ">=", period[0])
                                                                                          .where("date", "<=", period[1]).get();
    return projectPeriodMySchedule;
}
/*String,int*/
function setJoinMenber(memberName,newSchedule){

    return null;
}
/*int,int[]*/
function setLoginMember(memberIndex,schedule){

    return null;
}