/*
*@author 上杉
*
*作成関数
*getProjectMembers()
*getProjectPeriodStart()
*getProjectPeriodFinish()
*getProjectMmeberSchedule()
*(データベースの宣言とgetParam関数は除く)
*
*/

async function getProjectMembers(){
    let ID;
    let buff;
    
    ID = getParam("project");
    buff = await db.collection("project").doc(ID).get()
    .then((querySnapshot) => {
         //console.log(querySnapshot);
         let temp = querySnapshot.data()["projectMemberName"];
         //console.log(temp);
        return temp;
    })
    .catch((error)=>{
        console.log("データの取得失敗");
    })
    console.log(buff);
    return buff; //MemberのMがfirebaseで小文字になってる
}

async function getProjectPeriodStart(){
    let ID;
    ID = getParam("project");
    var buff;
    buff = db.collection("project").doc(ID);
    var start = buff.get().then((querySnapshot) => {
         //console.log(querySnapshot.data()["projectPeiriod"]); 
         let start =new Date(querySnapshot.data()["projectPeriod"][0]/10000,(querySnapshot.data()["projectPeriod"][0]%10000)/100-1,(querySnapshot.data()["projectPeriod"][0]%100));
         //console.log(start);
         return start;
    })
    .catch((error)=>{
        console.log("データの取得失敗");
    })
    //console.log("取得S"+start);
    return start;
}

async function getProjectPeriodFinish(){
    let ID;
    ID = getParam("project");
    var buff;
    console.log(ID);
    buff = db.collection("project").doc(ID);
    var finish=await buff.get().then((querySnapshot) => {
         //console.log(querySnapshot.data()["projectPeriod"]); 
         let end =new Date(querySnapshot.data()["projectPeriod"][1]/10000,(querySnapshot.data()["projectPeriod"][1]%10000)/100-1,(querySnapshot.data()["projectPeriod"][1]%100));
         //console.log(end);
         return end;
    })
    .catch((error)=>{
        console.log("データの取得失敗");
    })   
    //console.log("取得F"+finish);
    return finish;
}

async function getProjectMemberSchedule(memberIndex){
    
    var ID=getParam("project");
    var data = [];
    var projectSchedule = [];
    console.log(memberIndex);
    console.log(ID);
    var temp = await db.collection("project").doc(ID).collection("projectMemberPeriod").where("memberIndex","==",memberIndex).get()
    .then(async(querySnapshot) =>{
        console.log("start");
        
        var buff = await querySnapshot.docs.map(doc=>{
            data = doc.data()["projectSchedule"];
            //console.log(data);
            return data;
        })
        //console.log(buff[0]);
        return buff;
        
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })
    //console.log(projectSchedule);
    if(temp.length==0){
        console.log("空");
        temp=[[null]];
    }
    console.log(temp);
    return temp[0];
}

async function getWeekSchedule(uid){

    var temp = await db.collection("account").doc(uid).get()
    .then((querySnapshot) => {
        var buff = querySnapshot.data()["week"];
        return buff;
    }).catch((error) => {
        console.log("データの取得失敗(${error})");
    })
    if(temp.length==0){
        console.log("空");
        temp=[null];
    }
    console.log(temp);
    return temp;
}

function setWeekSchedule(userId,weekSchedule){
    console.log(weekSchedule);
    db.collection("account").doc(userId).update({
        week:weekSchedule
    })
}

async function changeWeekSchedule(userId,weekAfterSchedule){
    let mySchedule=await db.collection("account").doc(userId).collection("myScheduleId").orderBy("date").get()
    .then(async(querySnapshot)=>{
        let temp=await querySnapshot.docs.map((doc)=>{
            return doc.data()["mySchedule"];
        })
        return temp;
    })
    let scheduleId=[];
    let i=0;
    db.collection("account").doc(userId).collection("myScheduleId").orderBy("date").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            //var data = doc.data();
            console.log(doc.id);
            scheduleId[i] = doc.id;
            i++;
        });

        let today=new Date();
        for(let j=0;j<60;j++){
            let day=today.getDay();
            console.log(j);
            console.log(weekAfterSchedule);
            console.log(mySchedule[j]);
            for(let k=0;k<144;k++){
                if(mySchedule[j][k]<=1){
                    mySchedule[j][k]=weekAfterSchedule[day*144+k];
                }
            }
            console.log(userId);
            console.log(scheduleId[j]);
            console.log(mySchedule[j]);
            db.collection("account").doc(userId).collection("myScheduleId").doc(scheduleId[j]).update({
                mySchedule:mySchedule[j]
            })

            today.setDate(today.getDate() + 1);     //日付を1日進める
        }

    })
}
