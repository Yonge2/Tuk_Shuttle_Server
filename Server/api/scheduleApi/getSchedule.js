const {getMySQL} = require('../../db/conMysql');
const getOptionOBJ = require('./taskScheduler');
const {TUK_Schedule, GTEC_Schedule} = require('../../util/getScheduleTask');

const dayjs = require('dayjs');


const getScheduleData = async(req, res, univNAME, direction)=>{
    if(getOptionOBJ.holiday_CODE){ //not holiday

        if(getOptionOBJ.operation_CODE){ //operating time

            const Bus_schedule = await schClassification(univNAME, direction);
            res.status(200).json({success: true, Bus_schedule: Bus_schedule,
                 Subway_schedule: getOptionOBJ.sub_INFO});
        }
        else{  //end of operating
            res.status(200).json({success:true, Bus_schedule:[], 
                Subway_schedule:getOptionOBJ.sub_INFO, message:'운행종료'});
        }
    }
    else{  //holiday
        res.status(200).json({success:true, Bus_schedule:[], 
            Subway_schedule:getOptionOBJ.sub_INFO, message:'공휴일'});
    }
}


const getAllOfScheduleData = async(req, res) =>{
    const query = allOfScheduleQuery(req);
    const data = await getMySQL(query).catch((e)=>{
        console.log('allOfSchedule get err: ',e);
        res.status(200).json({success: false, message: '쿼리오류'});
    });
    res.status(200).json({
        success:true, Bus_schedule: data
    })
}


module.exports = {getScheduleData, getAllOfScheduleData};


const schClassification = (univNAME, direction) =>{
    return new Promise(async(resolve, reject)=>{
        const now = new dayjs();
        const sch = (univNAME==="TUK")? await TUK_Schedule(now) : await GTEC_Schedule(now);
        const destination = 
        (univNAME==="GTEC"&&direction==="Station") ? "GTEC_Station" : direction;
        switch(destination){
            case 'TUK':
                resolve(sch.toTUK);
                break;
            case 'Station':
                resolve(sch.toStation);
                break;
            case 'GTEC_Station':
                resolve(sch.toStation);
                break;
            case 'GTEC':
                resolve(sch.toGTEC);
                break;
        }
    })
}


const allOfScheduleQuery = (req)=>{
    const query =(table)=>{
        return `SELECT * FROM ${table} ORDER BY destination, hour, min;`;
    }
    if(req.query.univNAME==="TUK") return query('TUK1_Sch_Weekday');
    else if(req.query.univNAME==="GTEC") return query('GTEC_Sch');
    else if(req.query.univNAME==="TUKweekend") return query('TUK1_Sch_Weekend');
}