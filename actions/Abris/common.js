import { store } from "../../src/app";

//#region функции для работы с GPS
export function gps_coord(dstXY, srcXY, srcGPS,magneticdeclination) {


	//dstXY - координаты точки на абрисе, для которой необходимо вычислить координаты GPS
	//srcXY - координаты точки на абрисе, для которой известны координаты GPS (srcGPS)

	let res = { x: 0, y: 0 } //x - Широта, y - Долгота

	//константы для расчетов:6371000 6372795 6378245 
	let GeoLen = 2 * Math.PI * 6371000/*6371000*/ / 360 //Длина угла сферы; 6378245 - (Размеры земного эллипсоида по Красовскому: Большая полуось (экваториальный радиус))
	let pi_to_rad = Math.PI / 180 //коэфф. из градусов в радиан
	let rad_to_pi = 180 / Math.PI //коэфф. из радиан в градусы

	let dir = vSub(dstXY, srcXY) //направление от одной точки на другую
	let len = vLength(dir) //расстояние между точками
	len = len / GeoLen //Растояние в градусах

	let azimuth = getAngleFromVector(dir) + magneticdeclination

	//перевод в радианы:
	let gpsX = srcGPS.x * pi_to_rad
	let gpsY = srcGPS.y * pi_to_rad
	len *= pi_to_rad
	azimuth *= pi_to_rad

	res.x = Math.sin(gpsX) * Math.cos(len) + Math.cos(gpsX) * Math.sin(len) * Math.cos(azimuth);
	res.x = Math.asin(res.x) * rad_to_pi; //в градусы

	res.y = Math.sin(len) * Math.sin(azimuth) / (Math.cos(gpsX) * Math.cos(len) - Math.sin(gpsX) * Math.sin(len) * Math.cos(azimuth));
	res.y = (gpsY + Math.atan(res.y)) * rad_to_pi;//в градусы

	res.x = roundingGps(res.x)
	res.y = roundingGps(res.y)

	return res
}

//dstGPS - gps-координаты НЕ известной точки экрана
//result - Координаты НЕ известной точки экрана (теперь известной)
export function coord_from_gps(dstGPS,gps_binding) {

	let result = {
		x:gps_binding.px,
		y:gps_binding.py
	}

	let srcGPS = {
		x:gps_binding.x,
		y:gps_binding.y
	}

	let azimutData = azimut_from_gps(dstGPS, srcGPS);

	if(azimutData.distance != 0){
		result.x += azimutData.distance/pixel_inch() * Math.sin(azimutData.azimuth / 180 * Math.PI)
		result.y -= azimutData.distance/pixel_inch() * Math.cos(azimutData.azimuth / 180 * Math.PI)
	}

	return result
	
}

export function azimut_from_gps(srcXY, dstXY) {

	//dstXY - GPS координаты первой точки
	//srcXY - GPS координаты второй точки

	let res = { azimut: 0, distance: 0 } //азимут и промер

	if ((dstXY.x == srcXY.x)
		&& (dstXY.y == srcXY.y)
	) {
		return res
	}
	

	let rad = 6371000 //радиус Земли 6371000 6372795 6378245
	let GeoLen = 2 * Math.PI * rad
	let pi_to_rad = Math.PI / 180
	let rad_to_pi = 180 / Math.PI

	//переводим в радианы:
	let lat1 = dstXY.x * pi_to_rad
	let lat2 = srcXY.x * pi_to_rad
	let long1 = dstXY.y * pi_to_rad
	let long2 = srcXY.y * pi_to_rad

	//косинусы и синусы широт и разницы долгот
	let cl1 = Math.cos(lat1)
	let cl2 = Math.cos(lat2)
	let sl1 = Math.sin(lat1)
	let sl2 = Math.sin(lat2)
	let delta = long2 - long1
	let cdelta = Math.cos(delta)
	let sdelta = Math.sin(delta)

	//вычисления длины большого круга
	let y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2))
	let x = sl1 * sl2 + cl1 * cl2 * cdelta
	let ad = Math.atan2(y, x)
	let dist = ad * rad

	// вычисление начального азимута
	x = (cl1 * sl2) - (sl1 * cl2 * cdelta)
	y = sdelta * cl2
	let z = Math.degrees(Math.atan(-y / x))

	if (x < 0) {
		z = z + 180
	}

	let z2 = (z + 180) % 360 - 180
	z2 = - Math.radians(z2)
	let anglerad2 = z2 - ((2 * Math.PI) * Math.floor((z2 / (2 * Math.PI))))
	let angledeg = (anglerad2 * 180) / Math.PI

	res = { azimuth: angledeg, distance: dist }

	return res
}

export function roundingGps(lengths) {
	let rounding_lengths = 100000000
	return Math.round(lengths * rounding_lengths) / rounding_lengths
}

//#endregion

//#region математические функции

export function cosx(x) {
	return round(Math.cos(x * Math.PI / 180), 10000);
}

export function sinx(x) {
	return round(Math.sin(x * Math.PI / 180), 10000);
}

// Расчет cos угла между двумя векторами:
export function cosAlpha(v0, v1) {
	var l = vLength(v0) * vLength(v1);
	if (l === 0) return 0;
	return (v0.x * v1.x + v0.y * v1.y) / l;
}

// перевод угла в минуты:
export function angleToMinutes(angle) {
	let whole = Math.trunc(angle)
	let fractional = angle - whole
	fractional = round(fractional * 100, 1)
	return (whole * 60) + fractional
}

// перевод минуты в угол:
export function minutesToAngles(minutes) {
	let degrees = Math.trunc(minutes / 60)
	let fractional = (minutes - (degrees * 60)) / 100
	return roundingAngle(degrees + fractional)
}

//#endregion

//#region функции округления

//округление числа
export function round(v, digit) {
	return Math.round(v * digit) / digit;
}

//округление площад согласно настройки
export function roundingSquare(square) {
	let rounding_square = store.getState().settings.data.abris.rounding.square;
	if (rounding_square) {
		return Math.round((Math.round(square) / 10000) * rounding_square) / rounding_square
	} else {
		return square
	}
}

//округление прпомеров согласно настройки
export function roundingLengths(lengths) {
	let rounding_lengths = store.getState().settings.data.abris.rounding.lengths;
	if (rounding_lengths) {
		return Math.round(lengths * rounding_lengths) / rounding_lengths
	} else {
		return lengths
	}
}

//округление углов согласно настройки
export function roundingAngle(angle) {
	let rounding_angle = store.getState().settings.data.abris.rounding.angle;
	let value = angle
	if (rounding_angle) {
		if (rounding_angle == 1) {
			value = Math.round(angle * 100) / 100
			let whole = Math.trunc(value)
			let fractional = value - whole
			fractional = Math.round(fractional * 100) / 100
			if (fractional > 0.59) {
				value = whole + 1;
			}
		}
		if (rounding_angle == 10) {
			value = Math.round(angle * 10) / 10
			let whole = Math.trunc(value)
			let fractional = value - whole
			fractional = Math.round(fractional * 10) / 10
			if (fractional >= 0.60) {
				value = whole + 1;
			}
		}
		if (rounding_angle == 30) {
			value = Math.round(angle * 10) / 10
			let whole = Math.trunc(value)
			let fractional = value - whole
			fractional = Math.round(fractional * 10) / 10
			if (fractional >= 0.45) {
				value = whole + 1;
			}
			if ((fractional >= 0.15) && (fractional < 0.45)) {
				value = whole + 0.30;
			}
			if ((fractional >= 0) && (fractional < 0.15)) {
				value = whole;
			}
		}
		if (rounding_angle == 60) {
			value = Math.round(angle)
		}
	}

	return value
}


//#endregion

//#region функции работы с векторами

export function vAdd(v0, v1) {
	return { x: (v0.x + v1.x), y: (v0.y + v1.y) };
}

export function vSub(v0, v1) {
	return { x: (v0.x - v1.x), y: (v0.y - v1.y) };
}

export function vLength(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y) * pixel_inch()
}

//расчет до площади (алгоритм АФ):
export function calcAdditionalArea(p1, p2, p0) {
	return (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
}

// Получение угла наклона вектора относительно оси X (в прямоугольной системе координат):
export function getAngleFromVector(v, magneticdeclination = 0) {
	var result = 0;

	var cosx = cosAlpha({ x: 1, y: 0 }, v);
	var sinx = cosAlpha({ x: 0, y: -1 }, v); //ось Y в экранных координатах инвертирована

	//обработка исключительных случаев (ухода тангенса в - и + бесконечности):

	if (cosx === 0) {
		if (sinx > 0) {
			result = 0;
		} else {
			result = 180;
		}
	} else {
		result = Math.atan2(cosx, sinx);
		result = 180 * result / Math.PI; //из радиан в градусы
	}
	result = result - magneticdeclination

	if (result < 0) result += 360;

	result = roundingAngle(result)

	return result;
}

//Конвертация в радианы
export function degToRad(d) {
	return (d * (Math.PI / 180));
}

//функция смещения координаты в повернутой на определенный угол системе координат
export function shiftWithRotate(shiftX,shiftY,rotate) {

	let rotateToRad = degToRad(rotate);
	//vectorX и vectorY вектора до точки сдвига в новой система координат повернутой на угол rotate (в радианах)
	let vectorX = {
		x: shiftX * Math.sin(-rotateToRad),// "-" т.к. "y" смотрит вниз
		y: shiftX * Math.cos(-rotateToRad)
	}
	let vectorY = {
		x: shiftY * Math.cos(rotateToRad),
		y: shiftY * Math.sin(rotateToRad)
	}
	//сложение векторов в повернутой системе координат, для понимания положения точки в реальной системе координат
	let shiftWithRotate = {
		x:vectorX.y + vectorY.y,
		y:vectorX.x + vectorY.x
	}

	return shiftWithRotate
}

export function pixel_inch() {	
	return 2.64583
}

//#endregion

//#region функции работы с угловой и линейной невязкой

export function residualLinearCorrect(lengths, linearResidual) {
	let residual_linear = store.getState().settings.data.abris.residual.linear;
	let value = true
	if (residual_linear) {
		let koeff = residual_linear / 300
		if (linearResidual / lengths > koeff) {
			value = false
		}
	}
	return value
}

export function residualAngleCorrect(angleResidual) {
	let residual_angle = store.getState().settings.data.abris.residual.angle;
	let value = true
	if (residual_angle) {
		if (angleToMinutes(angleResidual) > residual_angle) {
			value = false
		}
	}
	return value
}

//#endregion

//#region функции работы с форматами

export function thumb_azimut_format(value, inSimvol = false) {

	if (value === '') {
		return value
	}

	var arr = value.toString().split('.');

	let grad = arr[0];
	if (grad == '') {
		grad = '00';
	}

	let str = '';
	if (inSimvol) {
		str = grad + String.fromCharCode(176);
	} else {
		str = grad + '&deg;'
	}


	if (arr.length == 2) {
		let min = arr[1];
		if (min.length < 2) {
			min = min + '0'
		}
		if (min.length > 2) {
			min = min.substring(0, 2)
		}
		if (inSimvol) {
			str = str + min + String.fromCharCode(8242);
		} else {
			str = str + min + '&prime;';
		}
	} else {
		if (inSimvol) {
			str = str + "00" + String.fromCharCode(8242);
		} else {
			str = str + "00" + '&prime;';
		}
	}
	return str
}
//#endregion

//#region функции работы с азумутом и румбом

export function azimut_rhumb(typeangle, azimut, rhumb, direct) {

	//пересчет азимутов
	if ((typeangle == "Румбы")
		&& (window.webix.rules.isNumber(rhumb))
		&& (direct != '')
	) {
		if (direct == 'СВ') {
			azimut = rhumb
		}
		if (direct == 'ЮВ') {
			azimut = minutesToAngles((angleToMinutes(180)) - (angleToMinutes(rhumb)))
		}
		if (direct == 'ЮЗ') {
			azimut = minutesToAngles((angleToMinutes(180)) + (angleToMinutes(rhumb)))
		}
		if (direct == 'СЗ') {
			azimut = minutesToAngles((angleToMinutes(360)) - (angleToMinutes(rhumb)))
		}
	}

	//пересчет румбов
	if ((typeangle == "Азимуты")
		&& (window.webix.rules.isNumber(azimut))
	) {
		if (azimut <= 90) {
			rhumb = azimut
			direct = 'СВ'
		}
		if ((azimut > 90) && (azimut <= 180)) {
			rhumb = minutesToAngles((angleToMinutes(180)) - (angleToMinutes(azimut)))
			direct = 'ЮВ'
		}
		if ((azimut > 180) && (azimut <= 270)) {
			rhumb = minutesToAngles((angleToMinutes(azimut)) - (angleToMinutes(180)))
			direct = 'ЮЗ'
		}
		if ((azimut > 270) && (azimut <= 360)) {
			rhumb = minutesToAngles((angleToMinutes(360)) - (angleToMinutes(azimut)))
			direct = 'СЗ'
		}
	}

	return {
		rhumb: rhumb,
		direct: direct,
		azimut: azimut,
	}
}

export function getEndVector(curentRow,magneticdeclination) {
	// по текущей координате определим координату конца текущего промера
	let curentVector = {
		x: sinx(curentRow.azimut + magneticdeclination) * curentRow.distance / pixel_inch(),
		y: -cosx(curentRow.azimut + magneticdeclination) * curentRow.distance / pixel_inch()
	}
	let result = vAdd(
		{
			x: curentRow.x,
			y: curentRow.y
		}
		, curentVector)
	curentRow.xc = result.x
	curentRow.yc = result.y
}

//#endregion

//#region функции работы с текущим состоянием приложения (getState):
//масштаб, зум, сдвиг, поворот и магнитное склонение

export function getBackground() {
	return store.getState().background
}

//состояние приложения:
//0 - редактор полигона;
//1 - редактор подложки;
//2 - калибровка
//3 - геопривязка
export function getPolygons() {
	return store.getState().polygons
}


//#endregion

//#region функции работы с точками на рабочей области экрана

//получение координаты точки относительно центра области
//с учетом масштаба, зума и сдвига области относительно центра экрана
export function getPoint(target, event,scale,zoom,shift) {

	let pointX = (event.x - target.x) / (10000/scale) / zoom
	let pointY = (event.y - target.y) / (10000/scale) / zoom
	let point = {
		x: pointX - (shift.x/(10000/scale)),
		y: pointY - (shift.y/(10000/scale))
	}
	return point
}

//расстояние между точками с учетом округления
export function distanceBetweenPoints(points) {

    let distance = 0
    for (let i = 0; i < points.length; i++) {
        if(i == points.length-1) break
        let dV = vSub({x:points[i].x,y:points[i].y}, {x:points[i+1].x,y:points[i+1].y});
        if(dV != undefined){
            distance      = distance+vLength(dV);
        }
    }
    return roundingLengths(distance);
}

//#endregion
