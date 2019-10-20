const initialState = {
    formCutting: [
        {id:1,value:'Сплошная рубка',text:'Сплошная рубка'},
        {id:2,value:'Выборочная рубка',text:'Выборочная рубка'}
    ],
    groupCutting: [
        {id:1,value:'Рубки в спелых насаждениях',text:'Рубки в спелых насаждениях'},
        {id:2,value:'Рубки ухода за насаждениями',text:'Рубки ухода за насаждениями'},
        {id:3,value:'Санитарные рубки',text:'Санитарные рубки'},
        {id:4,value:'Прочие рубки',text:'Прочие рубки'}
    ],
    orderRoundingRates: [
      {id:1,value:'До целых рублей',text:'До целых рублей'},
      {id:2,value:'До десятков копеек',text:'До десятков копеек'},
      {id:3,value:'До копеек',text:'До копеек'},
    ],
    rankTax: [
      { id: 1, value: '1' , text: '1'},
      { id: 2, value: '2' , text: '2'},
      { id: 3, value: '3' , text: '3'},
      { id: 4, value: '4' , text: '4'},
      { id: 5, value: '5' , text: '5'},
      { id: 6, value: '6' , text: '6'},
      { id: 7, value: '7' , text: '7'}
    ],
    typesCoefficients: [
      { id: 1, value: 'Коэффициент индексации ставок платы' , text: 'Коэффициент индексации ставок платы'},
      { id: 2, value: 'Коэффициент на форму рубки' , text: 'Коэффициент на форму рубки'},
      { id: 3, value: 'Коэффициент на ликвидный запас' , text: 'Коэффициент на ликвидный запас'},
      { id: 4, value: 'Коэффициент на степень поврежденности насаждения' , text: 'Коэффициент на степень поврежденности насаждения'}
    ],
    rangesLiquidation: [
      {id:1,value:'от 0 до 100 м.куб',text:'от 0 до 100 м.куб'},
      {id:2,value:'от 100.01 до 150 м.куб',text:'от 100.01 до 150 м.куб'},
      {id:3,value:'более 150 м.куб',text:'более 150 м.куб'}
    ],
    damage: [
      {id:1,value:'до 10 %',text:'до 10 %'},
      {id:2,value:'до 20 %',text:'до 20 %'},
      {id:3,value:'до 30 %',text:'до 30 %'},
      {id:4,value:'до 40 %',text:'до 40 %'},
      {id:5,value:'до 50 %',text:'до 40 %'},
      {id:6,value:'до 60 %',text:'до 60 %'},
      {id:7,value:'до 70 %',text:'до 70 %'},
      {id:8,value:'до 80 %',text:'до 80 %'},
      {id:9,value:'до 90 %',text:'до 90 %'},
      {id:10,value:'до 100 %',text:'до 100 %'}
    ],
}


export default function enumerations (state = initialState, action) {
    switch(action.type) {        
        default:
            return state
    }    
}