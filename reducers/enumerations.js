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
		{'id':1,'value':'До целых рублей'},
		{'id':2,'value':'До десятков копеек'},
		{'id':3,'value':'До копеек'},
	],
}


export default function enumerations (state = initialState, action) {
    switch(action.type) {        
        default:
            return state
    }    
}