const mongoose = require('mongoose');

/* 
    _id:
    matchId:
    contestName:
    totalSpots:
    isFull:
    entryFee:
    prizePool:
    totalEnrolled:
    totalWinners:,
    prizeBreakUp: [],

*/

// headTohead

/* 

    _id:
    contestName: "Head to head"
    totalSpots: 2
    isFull: false
    entryFee: 2$ - 1000$
    prizePool: 85%
    totalWinners: 1,
    prizeBreakUp: [],

*/

let headTohead = [
    // {
    //     contestName: "Head to head",
    //     type: 1,
    //     entryType:['S','G'],
    //     limit:1,
    //     totalSpots: 2,
    //     isFull: false,
    //     entryFee: 0.15, 
    //     prizePool:0.25,
    //     prize: [0.25],
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 0.25
    //     }],
    //     contestType: 1
    // },
    // {
    //     contestName: "Head to head",
 
    //     type: 1,
    //     entryType:['S','G'],
    //     limit:1,
    //     totalSpots: 2,
    //     isFull: false,
    //     entryFee: 0.59,// [1,2.5,5,10,25,100,500],
    //     prizePool:1,
    //     prize: [1],
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 1
    //     }],
    //     contestType: 1
    // },
    {
    contestName: "Head to head",
 
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 1.5,// [1,2.5,5,10,25,100,500],
    prizePool: 2.5,
    prize: [2.5],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 2.5
    }],
    contestType: 1
},
{
    contestName: "Head to head",
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 2.6,// [1,2.5,5,10,25,100,500],
    prizePool: 4.5,
    prize: [4.5],
    totalWinners: 1,
    prizeBreakUp: [
        {
            range: "1", prize: 4.5
        }
    ],
    contestType: 1
},
{
    contestName: "Head to head",
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 5.9,// [1,2.5,5,10,25,100,500],
    prizePool: 10,
    prize: [10],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 10
    }],
    contestType: 1
},
{
    contestName: "Head to head",
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 26,// [1,2.5,5,10,25,100,500],
    prizePool: 45,
    prize: [45],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 45
    }],
    contestType: 1
},
{
    contestName: "Head to head",
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 120,// [1,2.5,5,10,25,100,500],
    prizePool: 200,
    prize: [200],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 200
    }],
    contestType: 1
},
{
    contestName: "Head to head",
    type: 1,
    entryType:['S','G'],
    limit:1,
    totalSpots: 2,
    isFull: false,
    entryFee: 575,// [1,2.5,5,10,25,100,500],
    prizePool: 1025,
    prize: [1025],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 1025
    }],
    contestType: 1
}
]

/* 

    _id:
    contestName: "3 way"
    totalSpots: 3
    isFull: false
    entryFee: 2$ - 1000$
    prizePool: 85%
    totalWinners: 1,
    prizeBreakUp: [],

*/



let threeWay = [
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 0.17,// [1,2.5,5,10,25,100,500],
        prizePool: 404,
        prize: [404],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 404
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 305,// [1,2.5,5,10,25,100,500],
        prizePool: 0.90,
        prize: [0.90],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 0.90
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 0.77,// [1,2.5,5,10,25,100,500],
        prizePool: 2,
        prize: [2],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 2
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 2.3,// [1,2.5,5,10,25,100,500],
        prizePool: 6,
        prize: [6],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 6
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 3.87,// [1,2.5,5,10,25,100,500],
        prizePool:10,
        prize: [10],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize:10
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 7.77,// [1,2.5,5,10,25,100,500],
        prizePool:20,
        prize: [20],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize:20
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 15.50,// [1,2.5,5,10,25,100,500],
        prizePool:40,
        prize: [40],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize:40
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 38.50,// [1,2.5,5,10,25,100,500],
        prizePool:100,
        prize: [100],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize:100
        }],
    },
]

/* 

    _id:
    contestName: "4 way"
    totalSpots: 4
    isFull: false
    entryFee: 2$ - 1000$
    prizePool: 85%
    first:70
    second:30
    totalWinners: 2,
    prizeBreakUp: [],

*/

let fourWayType = [
    {
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 0.5,// [1,2.5,5,10,25,100,500],
    prizePool: 1.7,
    prize: [1.7],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:1.7
    }],
},
{
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 0.12,// [1,2.5,5,10,25,100,500],
    prizePool: 40,
    prize: [40],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:40
    }],
},
{
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 89,// [1,2.5,5,10,25,100,500],
    prizePool: 300,
    prize: [300],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:300
    }],
},
{
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 230,// [1,2.5,5,10,25,100,500],
    prizePool: 800,
    prize: [800],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:800
    }],
},
{
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 5.25,// [1,2.5,5,10,25,100,500],
    prizePool: 18,
    prize: [18],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:18
    }],
},
{
    contestName: "4 way",
    type: 3,
    entryType:['S','G'],
    limit:1,
    totalSpots: 4,
    isFull: false,
    entryFee: 3.6,// [1,2.5,5,10,25,100,500],
    prizePool: 12,
    prize: [12],
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize:12
    }],
}
]
/* 

    _id:
    contestName: "4 way"
    totalSpots: 4
    isFull: false
    entryFee: 2$ - 1000$
    prizePool: 85%
    first:70
    second:30
    totalWinners: 2,
    prizeBreakUp: [],

*/

let fourWay = [
    {
    contestName: "4 way",
    type: 4,
    limit: 1,
    totalSpots: 4,
    isFull: false,
    entryFee: 12.5,
    prizePool: 40,
    prize:[24,16],
    totalWinners: 2,
    prizeBreakUp: [{
        range: "1", prize:24
    },
    {
        range: "2", prize:16
    }],
},
{
    contestName: "4 way",
    type: 4,
    limit: 1,
    totalSpots: 4,
    isFull: false,
    entryFee: 1.25,
    prizePool: 4,
    prize:[2.4,1.6],
    totalWinners: 2,
    prizeBreakUp: [{
        range: "1", prize:2.4
    },
    {
        range: "2", prize:1.6
    }],
},
{
    contestName: "4 way",
    type: 4,
    limit: 1,
    totalSpots: 4,
    isFull: false,
    entryFee: 33,
    prizePool: 100,
    prize:[60,40],
    totalWinners: 2,
    prizeBreakUp: [{
        range: "1", prize:60
    },
    {
        range: "2", prize:40
    }],
},
{
    contestName: "4 way",
    type: 4,
    limit: 1,
    totalSpots: 4,
    isFull: false,
    entryFee: 3.3,
    prizePool: 10,
    prize:[6,4],
    totalWinners: 2,
    prizeBreakUp: [{
        range: "1", prize:6
    },
    {
        range: "2", prize:4
    }],
},
]


let winnerTen = [
    {
        contestName: "10X",
        totalSpots: 12,
        type: 6,
        entryType:['M','G'],
        limit: 3,
        isFull: false,
        entryFee: 0.1,//[2.5,5,10,25,100],
        prizePool: 1,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 1
        }],
        prize: [5]
    },
    {
        contestName: "10X",
        totalSpots: 12,
        type: 6,
        entryType:['M','G'],
        limit: 3,
        isFull: false,
        entryFee: 0.5,//[2.5,5,10,25,100],
        prizePool: 5,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 5
        }],
        prize: [5]
    },
    {
        contestName: "10X",
        totalSpots: 12,
        type: 6,
        entryType:['M','G'],
        limit: 3,
        isFull: false,
        entryFee: 5,//[2.5,5,10,25,100],
        prizePool: 50,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 50
        }],
        prize: [50]
    },
    // {
    //     contestName: "10X",
    //     totalSpots: 12,
    //     type: 5,
    // entryType:['M','G'],
 
    //     isFull: false,
    //     entryFee: 10,//[2.5,5,10,25,100],
    //     prizePool: 100,
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 100
    //     }],
    //     prize: [100]
    // },
    {
        contestName: "20X",
        totalSpots: 24,
        type: 6,
        entryType:['M','G'],
        limit: 3,
        isFull: false,
        entryFee: 5,//[2.5,5,10,25,100],
        prizePool: 100,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 100
        }],
        prize: [100]
    },
    // {
    //     contestName: "20X",
    //     totalSpots: 24,
    //     type: 5,
    // entryType:['M','G'],
     
    //     isFull: false,
    //     entryFee: 10,//[2.5,5,10,25,100],
    //     prizePool: 200,
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 200
    //     }],
    //     prize: [200]
    // },
    // {
    //     contestName: "100X",
    //     totalSpots: 120,
    //     type: 5,
    // entryType:['M','G'],
  
    //     isFull: false,
    //     entryFee: 1,//[2.5,5,10,25,100],
    //     prizePool: 100,
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 100
    //     }],
    //     prize: [100]
    // },
    {
        contestName: "100X",
        totalSpots: 120,
        type: 7,
        limit: 50,
        isFull: false,
        entryFee: 0.5,//[2.5,5,10,25,100],
        prizePool: 50,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 50
        }],
        prize: [50]
    },
    {
        contestName: "1000X",
        totalSpots: 1200,
        type: 7,
        limit: 50,
        isFull: false,
        entryFee: 0.1,//[2.5,5,10,25,100],
        prizePool: 100,
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 100
        }],
        prize: [100]
    },
    // {
    //     contestName: "10000X",
    //     totalSpots: 12000,
    //     type: 5,
    // entryType:['M','G'],
    //     limit: 0,
    //     isFull: false,
    //     entryFee: 0.05,//[2.5,5,10,25,100],
    //     prizePool: 500,
    //     totalWinners: 1,
    //     prizeBreakUp: [{
    //         range: "1", prize: 500
    //     }],
    //     prize: [500]
    // },
]

/* 

    _id:
    contestName:  "50% winner"
    totalSpots: 10
    type: 5,
    entryType:['M','G'],
    limit: 50,
    isFull: false
    entryFee: 2$ - 1000$
    prizePool: 85%
    totalWinners: 5,
    prizeBreakUp: [],

*/

let winnerFifty = [
    {
    contestName: "Play safe",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 3,
    isFull: false,
    entryFee: 0.5,//[2.5,5,10,25,100],
    prizePool: 5,
    totalWinners: 5,
    prizeBreakUp: [{
        range: "1", prize: 1},{
        range: "1", prize: 1},{
        range: "1", prize: 1},{
        range: "1", prize: 1},{
        range: "1", prize: 1
    }],
    prize: [1, 1, 1, 1, 1]
    },
{
    contestName: "Play safe",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 3,
    isFull: false,
    entryFee: 5,//[2.5,5,10,25,100],
    prizePool: 50,
    totalWinners: 5,
    prizeBreakUp: [{
        range: "1", prize: 10},{
        range: "1", prize: 10},{
        range: "1", prize: 10},{
        range: "1", prize: 10},{
        range: "1", prize: 10
    }],
    prize: [10, 10, 10, 10, 10]
},
{
    contestName: "Play safe",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 3,
    isFull: false,
    entryFee: 10,//[2.5,5,10,25,100],
    prizePool: 100,
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1", prize: 20},{
        range: "1", prize: 20},{
        range: "1", prize: 20},{
        range: "1", prize: 20},{
        range: "1", prize: 20
    }],
    prize: [20, 20, 20, 20, 20]
},
]

/* 

    contestName: "More contest",
    totalSpots: 25,
    isFull: false,
    entryFee: [5,10,50,100,200],
    prizePool: 85,
    totalWinners: 10,
    prizeBreakUp: [],

*/

let unlimitedContest = [
    {
        contestName: "Mega Contest",
        totalSpots: 500,
        type: 5,
        entryType:['M','G'],
        limit: 50,
        isFull: false,
        entryFee: 11.5,//[2.5,5,10,25,100],
        prizePool: 3000,
        totalWinners: 300,
        prizeBreakUp: [{// 1*22.5-1*15-1*10-2*5-5*2.5-15*1.5-25*1-50*0.75-200*0.5-300*0.15
            range: "1", prize: 1000},{
            range: "2", prize: 100},{
            range: "3", prize: 75},{
            range: "4-5", prize: 50},{
            range: "6-10", prize: 30},{
            range: "11-15", prize: 25},{
            range: "16-100", prize: 20},{
            range: "101-150", prize: 15},{
            range: "151-200", prize: 10},{
            range: "201-300", prize: 5} ],
        prize: [
            1000,
            100,
            75,
            50, 50,
            30, 30, 30, 30, 30,
            25, 25, 25, 25, 25,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            15, 15, 15, 15, 15,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            10, 10, 10, 10, 10,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5,
            5, 5, 5, 5, 5
       ]
    },
    // {
    //     contestName: "Mega Contest",
    //     totalSpots: 2000,
    //     type: 5,
    //     entryType:['M','G'],
    //     limit: 100,
    //     isFull: false,
    //     entryFee: 50, 
    //     prizePool: 80000,
    //     totalWinners: 1000,
    //     prizeBreakUp: [{ 
    //         range: "1", prize: 12000},{
    //         range: "2", prize: 5000},{
    //         range: "3", prize: 4000},{
    //         range: "4-5", prize: 1000},{
    //         range: "6-10", prize: 500},{
    //         range: "11-20", prize: 200},{
    //         range: "26-50", prize: 100},{
    //         range: "51-700", prize: 50},{
    //         range: "701-900", prize: 40},{
    //         range: "901-1000", prize: 30} ],
    //     prize: [
    //         12000, 
    //         5000, 
    //         4000,
    //         1000, 1000,
    //         500, 500, 500, 500, 500,
    //         200, 200, 200, 200, 200,
    //         200, 200, 200, 200, 200,
    //         ...[100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    //         ...[50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
    //         ...[40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
    //         ...[30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]            
    //     ]
    // },
    {
        contestName: "Mega Contest",
        totalSpots: 2000,
        type: 5,
        entryType:['M','G'],
        limit: 50,
        isFull: false,
        entryFee: 5,//[2.5,5,10,25,100],
        prizePool: 8000,
        totalWinners: 1000,
        prizeBreakUp: [{// 1*22.5-1*15-1*10-2*5-5*2.5-15*1.5-25*1-50*0.75-200*0.5-300*0.15
            range: "1", prize: 1200},{
            range: "2", prize: 500},{
            range: "3", prize: 400},{
            range: "4-5", prize: 100},{
            range: "6-10", prize: 50},{
            range: "11-20", prize: 20},{
            range: "26-50", prize: 10},{
            range: "51-700", prize: 5},{
            range: "701-900", prize: 4},{
            range: "901-1000", prize: 3}],
        prize: [
            1200, 
            500, 
            400,
            100, 100,
            50, 50, 50, 50, 50,
            20, 20, 20, 20, 20,
            20, 20, 20, 20, 20,
            ...[10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            ...[5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            ...[4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            ...[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]            
       ]
    },
]



let singleType1 = [
    {
        contestName: "Head to head",
        type: 1,
        entryType:['S','G'],
        limit:1,
        totalSpots: 2,
        isFull: false,
        entryFee: 5.9,// [1,2.5,5,10,25,100,500],
        prizePool: 10,
        prize: [10],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 10
        }],
        contestType: 1
    },
    {
        contestName: "Head to head",
        type: 1,
        entryType:['S','G'],
        limit:1,
        totalSpots: 2,
        isFull: false,
        entryFee: 30,// [1,2.5,5,10,25,100,500],
        prizePool: 50,
        prize: [50],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 50
        }],
        contestType: 1
    },
    {
        contestName: "Head to head",
        type: 1,
        entryType:['S','G'],
        limit:1,
        totalSpots: 2,
        isFull: false,
        entryFee: 59,// [1,2.5,5,10,25,100,500],
        prizePool: 100,
        prize: [100],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 100
        }],
        contestType: 1
    },
    {
        contestName: "Head to head",
        type: 1,
        entryType:['S','G'],
        limit:1,
        totalSpots: 2,
        isFull: false,
        entryFee: 117,// [1,2.5,5,10,25,100,500],
        prizePool: 200,
        prize: [200],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 200
        }],
        contestType: 1
    },
]

let singleType2 = [
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 27,// [1,2.5,5,10,25,100,500],
        prizePool: 70,
        prize: [70],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 70
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 35,// [1,2.5,5,10,25,100,500],
        prizePool: 90,
        prize: [90],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 90
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 117,// [1,2.5,5,10,25,100,500],
        prizePool: 300,
        prize: [300],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 300
        }],
    },
    {
        contestName: "3 way",
        type: 2,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 3,
        isFull: false,
        entryFee: 195,// [1,2.5,5,10,25,100,500],
        prizePool: 500,
        prize: [500],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 500
        }],
    },
]

let singleType3 = [
    {
        contestName: "4 way",
        type: 3,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 4,
        isFull: false,
        entryFee: 17.9,// [1,2.5,5,10,25,100,500],
        prizePool: 60,
        prize: [60],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 60
        }],
    },
    {
        contestName: "4 way",
        type: 3,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 4,
        isFull: false,
        entryFee: 30,// [1,2.5,5,10,25,100,500],
        prizePool: 100,
        prize: [100],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 100
        }],
    },
    {
        contestName: "4 way",
        type: 3,
        entryType: ['S','G'],
        limit:1,
        totalSpots: 4,
        isFull: false,
        entryFee: 89,// [1,2.5,5,10,25,100,500],
        prizePool: 300,
        prize: [300],
        totalWinners: 1,
        prizeBreakUp: [{
            range: "1", prize: 300
        }],
    },
]

let singleType4 = [
    {
    contestName: "2X Pay",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 2,
    isFull: false,
    entryFee: 50,//[2.5,5,10,25,100],
    prizePool: 500,
    totalWinners: 5,
    prizeBreakUp: [{
        range: "1-5", prize: 100}],
    prize: [100, 100, 100, 100, 100]
    },
{
    contestName: "2X Pay",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 3,
    isFull: false,
    entryFee: 25,//[2.5,5,10,25,100],
    prizePool: 250,
    totalWinners: 5,
    prizeBreakUp: [{
        range: "1-5", prize: 50}],
    prize: [50, 50, 50, 50, 50]
},
{
    contestName: "2X Pay",
    totalSpots: 12,
    type: 6,
    entryType:['M','G'],
    limit: 3,
    isFull: false,
    entryFee: 100,//[2.5,5,10,25,100],
    prizePool: 1000,
    totalWinners: 1,
    prizeBreakUp: [{
        range: "1-5", prize: 200}],
    prize: [200, 200, 200, 200, 200]
},
]

module.exports = {
    singleType1,
    singleType2,
    singleType3,
    singleType4,
    unlimitedContest
}
