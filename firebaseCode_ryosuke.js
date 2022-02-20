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
         //console.log(querySnapshot.data()["projectmenberName"]);
         let temp = querySnapshot.data()["projectmenberName"];
         console.log(temp);
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
         let start =new Date(querySnapshot.data()["projectPeiriod"][0]/10000,(querySnapshot.data()["projectPeiriod"][0]%10000)/100,(querySnapshot.data()["projectPeiriod"][0]%100));
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
    buff = db.collection("project").doc(ID);
    var finish=await buff.get().then((querySnapshot) => {
         //console.log(querySnapshot.data()["projectPeiriod"]); 
         let end =new Date(querySnapshot.data()["projectPeiriod"][1]/10000,(querySnapshot.data()["projectPeiriod"][1]%10000)/100,(querySnapshot.data()["projectPeiriod"][1]%100));
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
            return data;
        })
        console.log(buff);
        return buff;
        
    }).catch((error) => {
        console.log("データの取得に失敗しました(${error})");
    })
    //console.log(projectSchedule);
    console.log(temp)
    return temp;
}