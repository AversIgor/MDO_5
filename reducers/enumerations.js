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
    rankTax: [
		{ 'id': 1, 'text': '1' },
		{ 'id': 2, 'text': '2' },
		{ 'id': 3, 'text': '3' },
		{ 'id': 4, 'text': '4' },
		{ 'id': 5, 'text': '5' },
		{ 'id': 6, 'text': '6' },
		{ 'id': 7, 'text': '7' }
	],
}


export default function enumerations (state = initialState, action) {
    switch(action.type) {        
        default:
            return state
    }    
}