//author:takuma
//kumanomiM2


//書き込み	set
//更新	update
//読み取り	onおよびonce
//削除	removeか、nullを書き込む

//データベースに関する
let db = firebase.firestore();

/*あるプロジェクトの期間のあるユーザーのマイスケジュールを返す*/
function getUserSchedule(uid){
    /*あるプロジェクトIDのプロジェクトの開始日、終了日を取得する*/
    var period = [];
    period = db.collection("projct").doc("projectID").doc("projectPeriod").get();
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