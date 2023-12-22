
var companies = {
    "1101": "台　泥",
    "1216": "統　一",
    "1301": "台　塑",
    "1303": "南　亞",
    "1326": "台　化",
    "1590": "亞德客-KY",
    "2002": "中　鋼",
    "2207": "和泰車",
    "2301": "光寶科",
    "2303": "聯　電",
    "2308": "台達電",
    "2317": "鴻　海",
    "2327": "國　巨",
    "2330": "台積電",
    "2345": "智　邦",
    "2352": "佳世達",
    "2357": "華　碩",
    "2379": "瑞　昱",
    "2382": "廣　達",
    "2395": "研　華",
    "2408": "南亞科",
    "2412": "中華電",
    "2454": "聯發科",
    "2603": "長　榮",
    "2610": "華　航",
    "2801": "彰　銀",
    "2880": "華南金",
    "2881": "富邦金",
    "2882": "國泰金",
    "2883": "開發金",
    "2884": "玉山金",
    "2885": "元大金",
    "2886": "兆豐金",
    "2887": "台新金",
    "2890": "永豐金",
    "2891": "中信金",
    "2892": "第一金",
    "2912": "統一超",
    "3008": "大立光",
    "3034": "聯　詠",
    "3037": "欣　興",
    "3045": "台灣大",
    "3231": "緯　創",
    "3711": "日月光投控",
    "4904": "遠　傳",
    "4938": "和　碩",
    "5871": "中租-KY",
    "5876": "上海商銀",
    "5880": "合庫金",
    "6505": "台塑化",
    "6669": "緯　穎",
    "9910": "豐　泰"
};

function draw_chart(){
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById("hist_futu"));

    // 指定图表的配置项和数据
     var option = {
        title: {
             text: companies[stock_code] + "(" + stock_code + ")" + "過去20天歷史數據以及未來10天預測數據",
                textStyle:{
        　　　　  fontSize:15
                }
            },
        tooltip : {
                    trigger: 'item'
                },
        legend: {
                x : 'center',
            data: ['過去20天', '未來10天','過去的預測']
            },
        //工具框，可以选择
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            axisLabel: {
                rotate: 30,
                interval: 0
            },
            type: 'category',
            //boundaryGap: false,
            data: [] // x轴名称
        },
        yAxis: {
                type: 'value',
                axisLabel : {
                    formatter: '{value} 元'
                },
            }
        ,
        series: [
            {
            name:'過去20天',
            type: 'line',
            color:['#FF0000'],
            data: [],   // x坐标对应y值
            itemStyle : { normal: {label : {show: true}}},
            label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
            },
            {
            name:'未來10天',
            data: [],   // x坐标对应y值
            itemStyle : { normal: {label : {show: true}}},
            type: 'line',
            label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
            color:['#0000FF'],
            },
            {
                name: '過去的預測',
                data: [],   // x坐标对应y值
                itemStyle: { normal: { label: { show: true } } },
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                color: ['#000022'],
            },
        ]
    };

    var min,max;
    for(var k=0; k <= 2; k++){
        if(k == 0){
            m_data = recent_data;
        }else if(k==1){
            m_data = predict_data;
        }else {
            m_data = predict_data_2;
        }
        for(var i = 0 ; i < m_data.length; i++){
            var one_day = m_data[i];
            option['xAxis']['data'].push(one_day[0])
            if(k==0){
                option['series'][1]['data'].push(null);
            }
            option['series'][k]['data'].push(one_day[1].toFixed(2)) // toFixed(2)：保留两位小数（四舍五入）

            if(i == 0 && k == 0){
                min = max = one_day[1];
            }else{
                if(one_day[1] < min){
                    min = one_day[1];
                }
                if(one_day[1] > max){
                    max = one_day[1];
                }
            }
        }
    }

    option['yAxis']['min'] = parseInt(min);
    option['yAxis']['max'] = parseInt(max)+1;

    myChart.setOption(option);
}


//绘制雷达图
function draw_radar(){
    var radar = echarts.init(document.getElementById('radar'));
    var option = {
        title : {
            text: '近3個交易日綜合評分',
            subtext:'綜合評分' + (indexs[0]['zong_he']/11.0*100).toFixed(1),
            subtextStyle : {
            color :'red',
            fontStyle :'normal',
            fontWeight :'bold',
            fontFamily :'sans-serif',
            fontSize :'16'
            },
            itemGap:20,
            padding:[0,15,15,15]
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            x : 'center',
            data:[indexs[0]['ri_qi'],indexs[1]['ri_qi'],indexs[2]['ri_qi']]  //此处为legend名字，须与series的data每个name相同
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        polar : [
            {
                indicator : [
                    {text : '資金', max  : 11},
                    {text : '強度', max  : 11},
                    {text : '風險', max  : 11},
                    {text : '轉強', max  : 11},
                    {text : '長項', max  : 11},
                    {text : '近資', max  : 11}
                ],
                radius : 130
            }
        ],
        series : [
            {
                name: '各交易日數據對比',   //数据视图显示的标题
                type: 'radar',
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data : [
                    {
                        value : [9, 4, 8, 9, 9, 8],
                        name : '12-09',
                         //在拐点处显示数值
                        label: {
                            normal: {
                            show: true,
                            formatter: function(params){
                                return params.value
                               },
                            },
                        }
                    },
                    {
                        value : [9, 3, 7, 9, 8, 9],
                        name : '12-11',
                         label: {
                            normal: {
                            show: true,
                            formatter: function(params){
                                return params.value
                               },
                            },
                        }
                    },
                    {
                        value : [9, 3, 7, 9, 8, 9],
                        name : '12-12',
                         label: {
                            normal: {
                            show: true,
                            formatter: function(params){
                                return params.value
                               },
                            },
                        }
                    }
                ]
            }
        ]
    };

    for(var i = 0 ; i < 3;i++){
        option['series'][0]['data'][i]['value'] = [];
        option['series'][0]['data'][i]['value'].push(indexs[i]['zi_jin']);
        option['series'][0]['data'][i]['value'].push(indexs[i]['qiang_du']);
        option['series'][0]['data'][i]['value'].push(indexs[i]['feng_xian']);
        option['series'][0]['data'][i]['value'].push(indexs[i]['zhuan_qiang']);
        option['series'][0]['data'][i]['value'].push(indexs[i]['chang_yu']);
        option['series'][0]['data'][i]['value'].push(indexs[i]['jin_zi']);
        option['series'][0]['data'][i]['name'] = indexs[i]['ri_qi'];
    }
    radar.setOption(option);
}


if(recent_data != null && predict_data != null){
    draw_chart();
}

var ops = document.getElementById(stock_code);
ops.selected = true;

if(indexs != null){
    draw_radar();
}
