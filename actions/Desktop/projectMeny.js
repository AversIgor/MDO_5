//устаревшие функции
import * as APP from "../../src/app";
//import * as MDO from "../../js/mdo";

import FileSaver from "file-saver";
import JSZip from "jszip";
import base64_arraybuffer from "base64-arraybuffer";


import * as background from "../Abris/background";
import * as objects from "../Abris/objects";

export function openProject() {
    let self = this
    return (dispatch,getState) => {
        //APP.confirmSave(function () {
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
                            dispatch(background.restoring(data.background));
                            dispatch(objects.restoring(data.polygons));
                        }
                    }, false);
                    fileReader.readAsText(file[0]);
                }
            });
            input.trigger('click');
        //});
    }
};

export function saveProject() {
    return (dispatch,getState) => {

        let sharingFile = new SharingFile(getState())
        sharingFile.creatFile()
        console.log(sharingFile.data)
        /*const asyncProcess = async () => {
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

class SharingFile {

    constructor(state) {
        this.data           = {}
        this.plot           = state.plot.plotObject
        this.recount        = state.plot.recount
        this.typeORM        = state.typeORM
        this.references     = {
            forestry: state.forestry.data,  
            subforestry: state.subforestry.data, 
            tract: state.tract.data, 
            methodscleanings:state.methodscleanings.data,
            breed:state.breed.data,
            enumerations: state.enumerations, 
            cuttingmethods: state.cuttingmethods.data,  
            typesrates: state.typesrates.data,
        }
    }           
    creatFile() {
        this.writeFormat()
        this.writeTarget()
        //экспорт лесосеки
        if(this.plot){
            this.writePlot()             
        }
        //экспорт результата расчета
        //возможно принудительный перечет вызвать?
        if(this.recount.length != 0){
            this.writeRecountResult()             
        }
        //экспорт полигонов
    }

    //описание формата
    writeFormat () {
        let format = {
            version      : "5.2.0",                //версия формата
            developer    : "ООО 'Аверс информ'",   //разработчик формата
        }
        this.data.format = format;
    }

    //Описание программы
    writeTarget () {
        let target = {
            name      : "АВЕРС: МДО#5",            //программа
            version   : this.typeORM.curentVersion //Версия программы
        }
        this.data.target = target;   
    }

    //описание лесосеки
    writePlot () {
        let plot = {}
        this.data.plot = plot; 
        this.writeLocation();
        this.writeParameters();
        this.writeFelling();
        this.writeTaxation();
        this.writeСoefficients()
        this.writeRecount()        
    }

    //описание местоположения
    writeLocation () {
        let location = {}
        this.data.plot.location = location;        
        location.forestry       = getRef(this.plot.property.location.forestry,this.references.forestry)//Лесничество
        location.subforestry    = getRef(this.plot.property.location.subforestry,this.references.subforestry)//Участковое лесничество
        location.tract          = getRef(this.plot.property.location.tract,this.references.tract)//Урочище        
        location.quarter        = this.plot.property.location.quarter           //квартал
        location.isolated       = this.plot.property.location.isolated          //выдела
        location.cuttingarea    = this.plot.property.location.cuttingarea       //номер делянки
    }

    //описание лесосеки
    writeParameters () {
        let parameters = {}
        this.data.plot.parameters = parameters;        
        parameters.purposeForests = getRef(this.plot.property.parameters.purposeForests,this.references.enumerations.purposeForests)//Целевое назначение лесов
        parameters.property       = getRef(this.plot.property.parameters.property,this.references.enumerations.property)//хозяйство
        parameters.methodscleaning= getRef(this.plot.property.parameters.methodscleaning,this.references.methodscleanings)//способ очистки
        parameters.undergrowth    = this.plot.property.parameters.undergrowth          //подрост
        parameters.seedtrees      = this.plot.property.parameters.seedtrees       //семенники
    }

    //описание рубки
    writeFelling () {
        let felling = {}
        this.data.plot.felling = felling;        
        felling.areacutting = this.plot.property.felling.areacutting          //Площадь рубки
        felling.formCutting = getRef(this.plot.property.felling.formCutting,this.references.enumerations.formCutting)//форма рубки
        felling.groupCutting = getRef(this.plot.property.felling.groupCutting,this.references.enumerations.groupCutting)//форма рубки
        felling.cuttingmethods = getRef(this.plot.property.felling.cuttingmethods,this.references.cuttingmethods)//способ рубки
    }

    //описание таксации
    writeTaxation () {
        let taxation = {}
        this.data.plot.taxation = taxation;        
        taxation.arearecount = this.plot.property.taxation.arearecount          //Площадь перечета
        taxation.coefficient = this.plot.property.taxation.coefficient          //коэффициент перечета для лент
        taxation.releasedate = this.plot.property.taxation.releasedate          //дата отвода
        taxation.valuationdate = this.plot.property.taxation.valuationdate      //дата оценки
        taxation.estimator = this.plot.property.taxation.valuationdate      //исполнитель
        taxation.methodTaxation = getRef(this.plot.property.taxation.methodTaxation,this.references.enumerations.methodTaxation)//метод таксации
        taxation.typesrates = getRef(this.plot.property.taxation.typesrates,this.references.typesrates)//вид ставки
        taxation.rankTax = getRef(this.plot.property.taxation.rankTax,this.references.enumerations.rankTax)//разряд такс       
    }

    //описание коэфициентов на ставки платы
    writeСoefficients () {
        let coefficients = {
            main:{},
            random:[]
        }
        this.data.plot.coefficients = coefficients; 
        //основные коэффициенты   
        coefficients.main.coefficientsindexing          = this.plot.coefficients.main.coefficientsindexing
        coefficients.main.formCutting                   = getRef(this.plot.coefficients.main.formCutting,this.references.enumerations.formCutting)
        coefficients.main.coefficientsformcutting       = this.plot.coefficients.main.coefficientsformcutting
        coefficients.main.rangesLiquidation             = getRef(this.plot.coefficients.main.rangesLiquidation,this.references.enumerations.rangesLiquidation)
        coefficients.main.coefficientsrangesliquidation = this.plot.coefficients.main.coefficientsrangesliquidation
        coefficients.main.damage                        = getRef(this.plot.coefficients.main.damage,this.references.enumerations.damage)
        coefficients.main.coefficientsdamage            = this.plot.coefficients.main.coefficientsdamage
        
        //пользовательские коэффициенты
        for(let i = 0; i < this.plot.coefficients.random.length; i++){
            let random = this.plot.coefficients.random[i]
            coefficients.random.push(random)
        } 
    }

    //описание данных перечета
    writeRecount () {
        let recount = []
        this.data.plot.recount = recount;
        //объекты таксации
        for(let i = 0; i < this.plot.recount.length; i++){
            let recountRow = this.plot.recount[i]
            let objectsBreed = []
            let objectTaxation = {
                id              :recountRow.id,
                areacutting     :recountRow.areacutting,
                objectTaxation  :getRef(recountRow.objectTaxation,this.references.enumerations.objectTaxation),
                objectsBreed    :objectsBreed,
            }
            recount.push(objectTaxation)
            //породы и перечет по ним
            for(let j = 0; j < recountRow.objectsBreed.length; j++){
                let objectsBreedRow = recountRow.objectsBreed[j]
                let objectBreed = {
                    id              :objectsBreedRow.id,
                    parent          :objectsBreedRow.parent,
                    breed           :getRef(objectsBreedRow.breed,this.references.breed),
                    rank            :objectsBreedRow.rank,
                    rank            :objectsBreedRow.rank,
                    objectsStep     :objectsBreedRow.objectsStep,
                    steps           :objectsBreedRow.steps,
                }
                objectsBreed.push(objectBreed)
            }
        } 
    }

    //описание данных МДО по данным перечета (для внешних систем)
    writeRecountResult () {
        let recountResult = []
        this.data.plot.recountResult = recountResult;
        for(let i = 0; i < this.recount.optionsPlots.optionsBreeds.length; i++){
            let recountRow = this.recount.optionsPlots.optionsBreeds[i]
            let result = {
                breed           :getRef(recountRow.id,this.references.breed),
                areacutting     :recountRow.areacutting,
                numberstems     :recountRow.numberstems,
                total           :recountRow.total,
                large           :recountRow.large,
                average         :recountRow.average,
                small           :recountRow.small,
                firewood        :recountRow.firewood,
                liquidity       :recountRow.liquidity,
                totalsumm       :recountRow.totalsumm,
            }
            recountResult.push(result)
        }
    }    

}

function getRef(id,reference) {
    let result = {
        id      : id,
        name    : '',
        cod     : '',
    }
    let item = reference.find(item => item.id == id);
    if(item){
        if(item.name)  result.name   = item.name;
        if(item.value) result.name   = item.value;
        if(item.cod) result.cod     = item.cod;
    }
    return result
}
