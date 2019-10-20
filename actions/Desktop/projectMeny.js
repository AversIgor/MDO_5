//устаревшие функции
import * as APP from "../../src/app";
import * as MDO from "../../js/mdo";
import {BD} from "../../js/dao";
import {RECOUNTLAYOUT} from "../../js/recountlayout";


import FileSaver from "file-saver";
import JSZip from "jszip";
import base64_arraybuffer from "base64-arraybuffer";


import * as background from "../Abris/background";
import * as objects from "../Abris/objects";

export function newProject() {
    return (dispatch,getState) => {
        APP.confirmSave(function () {
            MDO.newMDO();
            MDO.objectMDO.startMDO();
            RECOUNTLAYOUT.whenOpening();
            dispatch(background.reset());
            dispatch(objects.reset());
        })
    }
};

export function openProject() {
    let self = this
    return (dispatch,getState) => {
        APP.confirmSave(function () {
            var input = $("<input/>", {
                style:"display:none",
                id:"inputFile",
                type:"file",
                accept:".json"
            }).appendTo("body");
            input.unbind('change');
            input.change(function(evt) {
                var file = this.files;
                if (file.length == 1){
                    var fileReader = window.FileReader ? new FileReader() : null;
                    fileReader.addEventListener("loadend", function(e){                        
                        var data = JSON.parse(e.target.result);
                        if(data.hasOwnProperty("format")){
                            readFileProject(data,dispatch)
                        }else{
                            //импорт данных из сериализованных данных - устарел
                            MDO.newMDO();
                            MDO.objectMDO.startMDO();
                            MDO.objectMDO.reloadMDO(data); 
                            MDO.objectMDO.filename = "";
                            RECOUNTLAYOUT.whenOpening();
                            dispatch(background.restoring(data.background));
                            dispatch(objects.restoring(data.polygons));
                        }
                    }, false);
                    fileReader.readAsText(file[0]);
                }
            });
            input.trigger('click');
        });
    }
};

export function saveProject() {
    return (dispatch,getState) => {
        MDO.objectMDO.background = getState().background;
        MDO.objectMDO.polygons = getState().polygons.objects;
        MDO.save();
        /*let objectFile = creatFileProject(MDO.objectMDO,common.getBackground(),common.getPolygons().objects)
        const asyncProcess = async () => {
            let blob = new Blob([objectFile], {type: "json;charset=utf-8"});
            let zip = new JSZip();            
            zip.file("Проект.json", blob, {base64: true});
            var img = zip.folder("images");
            let imgData = base64_arraybuffer.decode(common.getBackground().src);
            img.file(common.getBackground().name, imgData, {base64: true});
            let zipcontent = await zip.generateAsync({type:"blob"})
            FileSaver.saveAs(zipcontent, "Проект.zip");                    

        }
        asyncProcess()*/
    }
};

//создание "нормального "файла проекта
function creatFileProject(objectMDO,background,polygons) {

    let objectData = {};

    //описание формата
    let format = {
        version      : "5.2.0",                         //версия формата
        developer    : "ООО 'Аверс информ'",            //разработчик формата
    }
    objectData.format = format;

    //источник данных
    let target = {
        name      : "АВЕРС: МДО#5",              //программа
        version   : BD.curentVersion,            //Версия программы
    }
    objectData.target = target;   

    //описание делянки
    let plot = {}
    objectData.plot = plot;

    //местоположение делянки
    let location = {}
    plot.location = location;
   
    //Лесничество
    location.forestry = {}
    if (Object.keys(objectMDO.forestry).length != 0) {
        location.forestry = {
            name : objectMDO.forestry.text,
            cod : objectMDO.forestry.cod,
            id : objectMDO.forestry.id,
        }
    }

    //Участковое лесничество
    location.subforestry = {}
    if (Object.keys(objectMDO.subforestry).length != 0) {
        location.subforestry = {
            name : objectMDO.subforestry.text,
            cod : objectMDO.subforestry.cod,
            id : objectMDO.subforestry.id,
        }
    }    

    //Урочище
    location.tract = {}
    if (Object.keys(objectMDO.tract).length != 0) {
        location.tract = {
            name : objectMDO.tract.text,
            cod : objectMDO.tract.cod,
            id : objectMDO.tract.id,
        }
    }

    location.quarter        = objectMDO.quarter           //квартал
    location.isolated       = objectMDO.isolated          //выдела
    location.cuttingarea    = objectMDO.cuttingarea       //номер делянки
    
    
    //Параметры делянки
    let parameters = {}
    plot.parameters = parameters;
    
    //Целевое назначение лесов
    parameters.purposeForests = {}
    if (Object.keys(objectMDO.purposeForests).length != 0) {
        parameters.purposeForests = {
            name : objectMDO.purposeForests.text,
            id : objectMDO.purposeForests.id,
        }
    }

    //Хозяйство
    parameters.property = {}
    if (Object.keys(objectMDO.property).length != 0) {
        parameters.property = {
            name : objectMDO.property.text,
            id : objectMDO.property.id,
        }
    }
    parameters.undergrowth    = objectMDO.undergrowth       //Описание подроста
    parameters.seedtrees      = objectMDO.seedtrees         //Описание семенников

    //Описание рубки
    let felling = {}
    plot.felling = felling;
   
    felling.areacutting     = objectMDO.areacutting       //Площадь рубки
    //форма рубки
    felling.formCutting = {}
    if (Object.keys(objectMDO.formCutting).length != 0) {
        felling.formCutting = {
            name : objectMDO.formCutting.text,
            id : objectMDO.formCutting.id,
        }
    }
    //группа рубки
    felling.groupCutting = {}
    if (Object.keys(objectMDO.groupCutting).length != 0) {
        felling.groupCutting = {
            name : objectMDO.groupCutting.text,
            id : objectMDO.groupCutting.id,
        }
    }
    //способ рубки
    felling.cuttingmethods = {}
    if (Object.keys(objectMDO.cuttingmethods).length != 0) {
        felling.cuttingmethods = {
            name : objectMDO.cuttingmethods.text,
            cod : objectMDO.cuttingmethods.cod,
            id : objectMDO.cuttingmethods.id,
        }
    }
    //способ очистки
    felling.methodscleaning = {}
    if (Object.keys(objectMDO.methodscleaning).length != 0) {
        felling.methodscleaning = {
            name : objectMDO.methodscleaning.text,
            id : objectMDO.methodscleaning.id,
        }
    }

    //Описание параметров таксации
    let taxation = {}
    plot.taxation = taxation;

    taxation.arearecount     = objectMDO.arearecount       //Площадь таксации
    taxation.coefficient     = objectMDO.coefficient       //коэффициент ленточного перечета или круговых площадок
    taxation.releasedate     = objectMDO.releasedate       //Дата отвода
    taxation.valuationdate   = objectMDO.valuationdate     //Дата оценки
    taxation.estimator       = objectMDO.estimator         //оценщик (таксатор)
    
    //метод таксации
    taxation.methodTaxation = {}
    if (Object.keys(objectMDO.methodTaxation).length != 0) {
        taxation.methodTaxation = {
            name : objectMDO.methodTaxation.text,
            id : objectMDO.methodTaxation.id,
        }
    }
    //вид ставки
    taxation.typesrates = {}
    if ((objectMDO.typesrates) && (Object.keys(objectMDO.typesrates).length != 0)) {
        taxation.typesrates = {
            name : objectMDO.typesrates.text,
            id : objectMDO.typesrates.id,
        }
    }
    //разряд такс
    taxation.rankTax = {}
    if (Object.keys(objectMDO.rankTax).length != 0) {
        taxation.rankTax = {
            name : objectMDO.rankTax.text,
            id : objectMDO.rankTax.id,
        }
    }

    //Коэффициенты на ставки платы
    let coefficients = []
    plot.coefficients = coefficients;
    for(let i = 0; i < objectMDO.coefficients.length; i++){
        let coefficient = {
            id : objectMDO.coefficients[i].name,
            name : objectMDO.coefficients[i].text,
            value : objectMDO.coefficients[i].value,
            predefined : objectMDO.coefficients[i].predefined,
        }
        coefficients.push(coefficient)
    } 
    
    //Описание объектов таксации
    let arrayObjectsTaxation = []
    plot.arrayObjectsTaxation = arrayObjectsTaxation;
    for(let i = 0; i < objectMDO.arrayObjectsTaxation.length; i++){
        let elementObjectsTaxation = objectMDO.arrayObjectsTaxation[i];
       /* let typeObjectTaxation = ENUMERATIONS.objectTaxation.find(x => x.id === elementObjectsTaxation.id);
        let objectTaxation = {
            id : elementObjectsTaxation.uid,
            name : elementObjectsTaxation.name,            
            type : typeObjectTaxation.id,
            areacutting : elementObjectsTaxation.areacutting,
        }
        arrayObjectsTaxation.push(objectTaxation)*/
        //описание таксируемых пород в объекте таксации
        let arrayBreed = []
        objectTaxation.arrayBreed = arrayBreed;
        for(let j = 0; j < elementObjectsTaxation.arrayBreedTaxation.length; j++){
            let elementBreedTaxation = elementObjectsTaxation.arrayBreedTaxation[j];
            let breedTaxation = {
                id : elementBreedTaxation.uid,         
                breed : {
                    id      : elementBreedTaxation.id,
                    name    : elementBreedTaxation.name, 
                    cod     : elementBreedTaxation.kodGulf,  //код по ГУЛФ 
                },
                tables_id :  elementBreedTaxation.tables_id,
                rank : elementBreedTaxation.rank,
            }
            arrayBreed.push(breedTaxation)
            //перечетная ведомость по породе
            let arrayStep = []
            breedTaxation.arrayStep = arrayStep;
            for(let k = 0; k < elementBreedTaxation.arrayStep.length; k++){
                let elementStep = elementBreedTaxation.arrayStep[k];               

                let stepTaxation = {
                    id          : elementStep.uid,         
                    step        : elementStep.step, 
                    business    : elementStep.business,  
                    halfbusiness: elementStep.halfbusiness,
                    firewood    : elementStep.firewood,
                }
                arrayStep.push(stepTaxation)
            }
            
            //итоги таксации по породе
            let valueBreed = {}
            breedTaxation.valueBreed = valueBreed;

            valueBreed.numberstems = elementBreedTaxation.totalStep.business+elementBreedTaxation.totalStep.halfbusiness+elementBreedTaxation.totalStep.firewood;            
            valueBreed.large = elementBreedTaxation.totalValue.large;
            valueBreed.average = elementBreedTaxation.totalValue.average;
            valueBreed.small = elementBreedTaxation.totalValue.small;            
            valueBreed.liquidity = elementBreedTaxation.totalValue.liquidity+elementBreedTaxation.totalValue.totalfirewood_f;
            valueBreed.business = elementBreedTaxation.totalValue.totalbusiness_b;
            valueBreed.firewood = elementBreedTaxation.totalValue.totalfirewood_b+elementBreedTaxation.totalValue.totalfirewood_f; 
            valueBreed.waste = elementBreedTaxation.totalValue.waste_b+elementBreedTaxation.totalValue.waste_f; 
            valueBreed.total = elementBreedTaxation.totalValue.total_b+elementBreedTaxation.totalValue.total_f;         
            
            valueBreed.totalsumm = elementBreedTaxation.totalSumm.liquidity+elementBreedTaxation.totalSumm.totalfirewood_f;

        }
    } 

    //Общие итоги таксации по делянке
    let results = {}
    plot.results = results;
    for(let i = 0; i < objectMDO.arrayOptionsplots.length; i++){
        let elementOptionsPlot = objectMDO.arrayOptionsplots[i];       
        if(elementOptionsPlot.nameobjectTaxation != "Всего") continue

        results.total               = elementOptionsPlot.total        //Общий запас
        results.liquidity           = elementOptionsPlot.liquidity   //Ликвидный запас
        results.business            = elementOptionsPlot.business   //Деловой
        results.firewood            = elementOptionsPlot.firewood   //дрова
        results.numberstems         = elementOptionsPlot.numberstems   //Количество хлыстов
        results.averagevolumestems  = elementOptionsPlot.averagevolumestems   //средний объем хлыста
        results.totalsumm           = elementOptionsPlot.totalsumm   //Общая стоимость
    }    
    
    
    //описание абриса
    let abris = {
        background  : {},            //подложка
        polygons    : {},            //полигоны
    }
    objectData.abris = abris;

    //реквизиты  подложки
    abris.background.dpi = background.dpi
    abris.background.scale = background.scale
    abris.background.shift = background.shift
    abris.background.rotate = background.rotate
    abris.background.zoom = background.zoom
    abris.background.opacity = background.opacity
    abris.background.coefficientcalibrate = background.coefficientcalibrate
    abris.background.gps = background.gps
    abris.background.magneticdeclination = background.magneticdeclination


    //реквизиты объектов

    abris.polygons = polygons


    var objectFile = JSON.stringify(objectData, null, '\t');

    return objectFile;    
  
}

function readFileProject(data,dispatch) {

    MDO.newMDO();
    MDO.objectMDO.startMDO();    

    let location = data.plot.location  



    if (Object.keys(location.forestry).length != 0) {
        MDO.objectMDO.forestry = {
            "id": location.forestry.id,
            "text": location.forestry.name,
            "cod": location.forestry.cod,
        } 
    }
    if (Object.keys(location.subforestry).length != 0) {
        MDO.objectMDO.subforestry = {
            "id": location.subforestry.id,
            "text": location.subforestry.name,
            "cod": location.subforestry.cod,
        }
    }
    if (Object.keys(location.tract).length != 0) {
        MDO.objectMDO.tract = {
            "id": location.tract.id,
            "text": location.tract.name,
            "cod": location.tract.cod,
        }
    }

    MDO.objectMDO.quarter = location.quarter;
    MDO.objectMDO.isolated = location.isolated;
    MDO.objectMDO.cuttingarea = location.cuttingarea;

    let parameters = data.plot.parameters

    if (Object.keys(parameters.purposeForests).length != 0) {
        MDO.objectMDO.purposeForests = {
            "id": parameters.purposeForests.id,
            "text": parameters.purposeForests.name,
          }
    }

    if (Object.keys(parameters.property).length != 0) {
        MDO.objectMDO.property = {
            "id": parameters.property.id,
            "text": parameters.property.name,
          }
    }

    MDO.objectMDO.undergrowth = parameters.undergrowth;
    MDO.objectMDO.seedtrees = parameters.seedtrees;

    let felling = data.plot.felling

    MDO.objectMDO.areacutting = felling.areacutting;

    if (Object.keys(felling.formCutting).length != 0) {
        MDO.objectMDO.formCutting = {
            "id": felling.formCutting.id,
            "text": felling.formCutting.name,
          }
    }

    if (Object.keys(felling.groupCutting).length != 0) {
        MDO.objectMDO.groupCutting = {
            "id": felling.groupCutting.id,
            "text": felling.groupCutting.name,
          }
    }

    if (Object.keys(felling.cuttingmethods).length != 0) {
        MDO.objectMDO.cuttingmethods = {
            "id": felling.cuttingmethods.id,
            "text": felling.cuttingmethods.name,
            "cod": felling.cuttingmethods.cod,
          }
    }

    let taxation = data.plot.taxation

    MDO.objectMDO.arearecount = taxation.arearecount;
    MDO.objectMDO.coefficient = taxation.coefficient;
    MDO.objectMDO.releasedate = taxation.releasedate;
    MDO.objectMDO.valuationdate = taxation.valuationdate;
    MDO.objectMDO.estimator = taxation.estimator;

    if (Object.keys(taxation.methodTaxation).length != 0) {
        MDO.objectMDO.methodTaxation = {
            "id": taxation.methodTaxation.id,
            "text": taxation.methodTaxation.name,
          }
    }

    if (Object.keys(taxation.typesrates).length != 0) {
        MDO.objectMDO.typesrates = {
            "id": taxation.typesrates.id,
            "text": taxation.typesrates.name,
          }
    }

    if (Object.keys(taxation.rankTax).length != 0) {
        MDO.objectMDO.rankTax = {
            "id": taxation.rankTax.id,
            "text": taxation.rankTax.name,
          }
    }

    let coefficients = data.plot.coefficients
    for(let i = 0; i < coefficients.length; i++){
        let coefficient = {
            recid : i+1,
            name : coefficients[i].id,
            text : coefficients[i].name,
            value : coefficients[i].value,
            predefined : coefficients[i].predefined,
        }
        MDO.objectMDO.coefficients.push(coefficient)
    } 

    let arrayObjectsTaxation = data.plot.arrayObjectsTaxation

    for(let i = 0; i < arrayObjectsTaxation.length; i++){
        let elemTaxation = {
            uid : arrayObjectsTaxation[i].id,
            name : arrayObjectsTaxation[i].name,            
            id : arrayObjectsTaxation[i].type,
            areacutting : arrayObjectsTaxation[i].areacutting,
        }
        let objTaxation = new MDO.ClassObjectTaxation(elemTaxation);
        MDO.objectMDO.addObjectsTaxation(objTaxation);
        
        let arrayBreed = arrayObjectsTaxation[i].arrayBreed
        for (let j = 0; j < arrayBreed.length; j++) {
            let elemBreed = {
                uid : arrayBreed[j].id,
                name : arrayBreed[j].breed.name,            
                id : arrayBreed[j].breed.id,
                tables_id : arrayBreed[j].tables_id,
                rank : arrayBreed[j].rank,
            }
            let objBreed = new MDO.ClassObjectBreed(elemBreed);
            objTaxation.addObjectBreed(objBreed);

            let arrayStep = arrayBreed[j].arrayStep
            for (let k = 0; k < arrayStep.length; k++) {
                let elementStep = {
                    uid : arrayStep[k].id,
                    step : arrayStep[k].step,            
                    business : arrayStep[k].business,
                    halfbusiness : arrayStep[k].halfbusiness,
                    firewood : arrayStep[k].firewood,
                }
                let objStep = new MDO.ClassObjecStep(elementStep);
                objBreed.addObjectStep(objStep);
            }
        }

    }
    RECOUNTLAYOUT.whenOpening();


    //подложка
    let data_background = data.abris.background
    dispatch(background.restoring(data_background));  


}
