//author:takuma
//kumanomiM2

/*url取得部分*/
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//書き込み	set
//更新	update
//読み取り	onおよびonce
//削除	removeか、nullを書き込む

//データベースに関する
//let db = firebase.firestore();

/*あるプロジェクトの期間のあるユーザーのマイスケジュールを返す*/
async function getUserSchedule(uid){
    /*あるプロジェクトIDのプロジェクトの開始日、終了日を取得する*/
    var projectId = getParam("project");
    var period = [];
    period = await db.collection("project").doc(projectId).get()
    .then((querySnapshot)=>{
        return querySnapshot.data()["projectPeriod"];
    })
    /*あるユーザーIDをもつユーザーのプロジェクトの期間のマイスケジュールを取得する*/
    var projectPeriodMySchedule = [];
    projectPeriodMySchedule = await db.collection("account").doc(uid).collection("myScheduleId")
    .where("date", ">=", period[0]).where("date", "<=", period[1]).orderBy("date").get()
    .then(async (querySnapshot)=>{
        let kari = [];
            kari = await querySnapshot.docs.map((doc) => {
                data = doc.data()["mySchedule"];
                let temp = [];
                console.log("でーた取得中");
                //値渡しで日程をコピー
                for (var k = 0; k < 144; k++) {
                    temp[k] = data[k];
                }
                return temp;
            });

            let returnSchedule = [];

            for(let i = 0;i < kari.length;i++){
                for(let k = 0;k < kari[i].length;k++){
                    returnSchedule[i*144 + k] = kari[i][k];
                }
            }
            return returnSchedule;
    })

    return projectPeriodMySchedule;
}

function setJoinMenber(memberName,newSchedule){
    var projectId = getParam("project");

    db.collection("project").doc(projectId).set({
        projectMemberName:memberName
    })
    .then(function() {
        console.log("memberName successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(memberName): ", error);
    });

    db.collection("project").doc(projectId).collection(projectMemberPeriod).set({
        projectSchedule:newSchedule
    })
    .then(function() {
        console.log("newSchedule successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document(newScedule): ", error);
    });

    return null;
}
/*わかりやすくするために仮引数memberIndexを改めmemIndexと名付けた*/
function setLoginMember(memIndex,schedule){
    var projectId = getParam("project");

    db.collection("project").doc(projectId).collection(projectMemberPeriod).set({
        memberIndex:memIndex,
        projectSchedule:schedule
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });

    return null;
}