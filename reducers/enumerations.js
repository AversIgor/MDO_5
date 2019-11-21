const initialState = {
    methodTaxation: [
      { id: 1, value: 'Сплошной перечет'},
      { id: 2, value: 'Ленточный перечет'}
    ],
    objectTaxation: [
      { id: 1, value: 'Лесосека в целом',  },
      { id: 2, value: 'Волока',  },
      { id: 3, value: 'Пасеки', },
      { id: 4, value: 'Погрузочные пункты',  },
      { id: 5, value: 'Ленты перечета',  },
      { id: 6, value: 'Прочие объекты',  }
    ],	
    property: [
      { id: 1, value: 'Хвойное', },
      { id: 2, value: 'Мягколиственное', },
      { id: 3, value: 'Твердолиственное' ,}
    ],
    purposeForests: [
      { id: 1, value: 'Эксплуатационные леса', },
      { id: 2, value: 'Защитные леса', },
      { id: 3, value: 'Резервные леса',}
    ],
    formCutting: [
        {id:1,value:'Сплошная рубка'},
        {id:2,value:'Выборочная рубка'}
    ],
    groupCutting: [
        {id:1,value:'Рубки в спелых насаждениях'},
        {id:2,value:'Рубки ухода за насаждениями'},
        {id:3,value:'Санитарные рубки'},
        {id:4,value:'Прочие рубки'}
    ],
    orderRoundingRates: [
      {id:1,value:'До целых рублей',text:'До целых рублей'},
      {id:2,value:'До десятков копеек',text:'До десятков копеек'},
      {id:3,value:'До копеек',text:'До копеек'},
    ],
    orderRoundingValues: [
      {id:1,value:'До целых куб.м.',text:'До целых куб.м.'},
      {id:2,value:'До десятых долей куб.м.',text:'До десятых долей куб.м.'},
      {id:3,value:'До сотых долей куб.м.',text:'До сотых долей куб.м.'}
    ],
    distributionhalfbusiness: [
      { id: 0, value: 'Остаток к деловым стволам', text: 'Остаток к деловым стволам' },
      { id: 1, value: 'Остаток к дровяным стволам' , text: 'Остаток к дровяным стволам'}
    ],
    rankTax: [
      { id: 1, value: '1' },
      { id: 2, value: '2' },
      { id: 3, value: '3' },
      { id: 4, value: '4' },
      { id: 5, value: '5' },
      { id: 6, value: '6' },
      { id: 7, value: '7' }
    ],
    typesCoefficients: [
      { id: 1, value: 'Коэффициент индексации ставок платы'},
      { id: 2, value: 'Коэффициент на форму рубки'},
      { id: 3, value: 'Коэффициент на ликвидный запас'},
      { id: 4, value: 'Коэффициент на степень поврежденности насаждения'},
      { id: 5, value: 'Произвольный коэффициент'}
    ],
    rangesLiquidation: [
      {id:1,value:'от 0 до 100 м.куб'},
      {id:2,value:'от 100.01 до 150 м.куб'},
      {id:3,value:'более 150 м.куб'}
    ],
    damage: [
      {id:1,value:'до 10 %'},
      {id:2,value:'до 20 %'},
      {id:3,value:'до 30 %'},
      {id:4,value:'до 40 %'},
      {id:5,value:'до 50 %'},
      {id:6,value:'до 60 %'},
      {id:7,value:'до 70 %'},
      {id:8,value:'до 80 %'},
      {id:9,value:'до 90 %'},
      {id:10,value:'до 100 %'}
    ],
    roundingSquar: [
      {"id":100,    "value":"До сотки"},
      {"id":10,   "value":"До 0,1 га"},
      {"id":1, "value":"До целого га"},
    ],
    roundingAngle: [
      {"id":60,    "value":"До градусов"},
      {"id":30,   "value":"До 30 минут"},
      {"id":10, "value":"До 10 минут"},
      {"id":1, "value":"До 1 минуты"},
    ],
    roundingLength: [
      {"id":1,    "value":"До метров"},
      {"id":10,   "value":"До 10 сантиметров"},
      {"id":100, "value":"До 1 сантиметра"},
    ],
    typesAngle: [
      "Румбы", 
      "Азимуты", 
      "Координаты"
    ],
    directs: [
      "СВ",
      "ЮВ",
      "ЮЗ",
      "СЗ"
    ],
    typesPrintForms: [
      {"id":1,   "value":"Для абриса"},
      {"id":2,   "value":"Для МДО"},
    ],
}


export default function enumerations (state = initialState, action) {
    switch(action.type) {        
        default:
            return state
    }    
}