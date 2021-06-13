const db = require("../database");

module.exports = {
  addData : (req, res) => {
    for(let i = 0; i<req.body.length; i++){
      db.query(`insert into data (interviewee, category_id, social_media) values('${req.query.interviewee}', ${req.body[i].id}, ${req.body[i].value})`, (err) => {
        try {
          if(err) throw err
        } catch (err) {
          res.send(err)
        }
      })
    }
    res.send('Your answer has been recorded')
  },
  countCategory: (req, res) => {
    db.query(`select social_media from data where category_id=${req.query.id}`, (err, dataResult) => {
      try {
        if(err) throw err
        let centroid = [1,2,3,4]
        let clusterResult = []
        let continueIteration = true
        let minimumCluster = []
        let average = []
        let record = []

        for(let i=0;i<dataResult.length;i++){
          record.push(dataResult[i].social_media)
        }

        do{
          minimumCluster = []
          average = []
          for(let j=0;j<dataResult.length;j++){
            let tempResult = []
            for(let k=0;k<centroid.length;k++){
              tempResult.push(Math.sqrt(Math.pow(Math.abs(dataResult[j].social_media-centroid[k]), 2)))
            }
            clusterResult.push(tempResult)
            minimumCluster.push(tempResult.indexOf(Math.min.apply(null, tempResult))+1)
          }

          for(let j=0;j<4;j++){
            let tempAvg = 0
            let count = 0
            for(let k=0;k<dataResult.length;k++){
              if(minimumCluster[k] == j+1){
                tempAvg += dataResult[k].social_media
                count+=1
              }
            }
            if(tempAvg == 0 || count == 0){
              average.push(0)
            }else{
              average.push(tempAvg/count)
            }
          }      
    
          for(let j=0; j<centroid.length; j++){
            if(centroid[j] !== average[j]){
              centroid = average
              continueIteration = true
              break;
            }else{
              continueIteration = false
            }
          }
        }while(continueIteration)
        res.send({record, clusterResult, minimumCluster, average})
        
      } catch (err) {
        res.send(err)
      }
    })
  },
  countAll : (req, res) => {
    db.query('select * from data', (err, result) => {
      try {
        if(err) throw err
        db.query('select id from category', (err, category) => {
          try {
            if(err) throw err
            // Variables declaration
            let centroid = [[],[],[],[]]
            let newData = []
            let newResult = []
            let minimumCluster = []
            let continueIteration = false

            // Variables to send to frontend
            let resultArrays = []
            let minimumClusterArrays = []
            let centroidArrays = []
            
            // Rearrange centroid arrays
            for(let i=0;i<4;i++){
              for(let j=0;j<category.length;j++){
                centroid[i].push(i+1)
              }
            }
            
            // Rearrange data arrays
            let tempData = []
            for(let i=0;i<result.length;i++){
              tempData.push(result[i].social_media)
              if(tempData.length == category.length){
                newData.push(tempData)
                tempData = []
              }
            }

            // Do-while looping for the Iteration
            var x = 0
            do{
              x++

              // Get the result
              newResult = []
              for(let i=0;i<newData.length;i++){
                var tempResult = []
                for(let j=0;j<4;j++){
                  var temp = 0
                  for(let k=0;k<category.length;k++){
                    temp += Math.pow(Math.abs(newData[i][k]-centroid[j][k]), 2)
                  }
                  tempResult.push(Math.sqrt(temp))
                }
                newResult.push(tempResult)
              }
  
              // Find the minimum cluster
              minimumCluster = []
              for(let i=0;i<newResult.length;i++){
                minimumCluster.push(newResult[i].indexOf(Math.min(...newResult[i])))
              }
  
              // Count the average of the minimum cluster
              let tempAvg = [[],[],[],[]]
              for(let i=0;i<category.length;i++){
                let tempAvg1 = 0
                let tempAvg2= 0
                let tempAvg3 = 0
                let tempAvg4 = 0
                let index1 = 0
                let index2 = 0
                let index3 = 0
                let index4 = 0
                for(let j=0;j<newData.length;j++){
                  if(minimumCluster[j] == 0){
                    tempAvg1 += newData[j][i]
                    index1++
                  }else if(minimumCluster[j] == 1){
                    tempAvg2 += newData[j][i]
                    index2++
                  }else if(minimumCluster[j] == 2){
                    tempAvg3 += newData[j][i]
                    index3++
                  }else if(minimumCluster[j] == 3){
                    tempAvg4 += newData[j][i]
                    index4++
                  }
                }
                tempAvg[0].push(tempAvg1/index1)
                tempAvg[1].push(tempAvg2/index2)
                tempAvg[2].push(tempAvg3/index3)
                tempAvg[3].push(tempAvg4/index4)
              }
  
              // Check if the Centroid is equals to the new Centroid
              continueIteration = false
              let checkCentroid = () => {
                for (var i = 0; i < centroid.length; i++) {
                  for(let j = 0; j < centroid[i].length; j++){
                    if (centroid[i][j] !== tempAvg[i][j]){
                      // console.log(x,'tidak sama')
                      centroid = tempAvg
                      return continueIteration = true
                    }else{
                      // console.log(x,'sama')
                    }
                  }
                }
              }
  
              checkCentroid()
              
              resultArrays.push(newResult)
              minimumClusterArrays.push(minimumCluster)
              centroidArrays.push(centroid)

            }while(continueIteration)

            res.send({data: newData, resultArrays, minimumClusterArrays, centroidArrays})            
          } catch (err) {
            console.log(err)
          }
        })
      } catch (err) {
        console.log(err)
      }
    })
  }
}