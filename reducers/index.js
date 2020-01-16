import { combineReducers } from 'redux'
import typeORM from './TypeORM'

//Рабочий стол
import toolbar from './desktop/toolbar'
import leftMenu from './desktop/leftMenu'
import curentproject from './desktop/curentproject'

//Подсистемы
import background from './abris/background'
import polygons from './abris/polygons'
import plot from './plot/index'

//справочники
import methodscleanings from './reference/methodscleanings'
import styles from './reference/styles'
import forestry from './reference/forestry'
import subforestry from './reference/subforestry'
import tract from './reference/tract'
import cuttingmethods from './reference/cuttingmethods'
import publications from './reference/publications'
import tables from './reference/tables'
import breed from './reference/breed'
import printforms from './reference/printforms'
import typesrates from './reference/typesrates'

//настройки
import settings from './settings/index'

//лицензирование
import license from './license'

//обновление
import update from './update'
import enumerations from './enumerations'

export default combineReducers({
    enumerations:enumerations,
    typeORM:typeORM,
    update:update,
    toolbar:toolbar,
    leftMenu:leftMenu,
    curentproject:curentproject,
    polygons:polygons,
    background:background,
    plot:plot,
    methodscleanings:methodscleanings,
    forestry:forestry,
    subforestry:subforestry,
    tract:tract,
    styles:styles,
    cuttingmethods:cuttingmethods,
    publications:publications,
    tables:tables,
    breed:breed,
    typesrates:typesrates,
    settings:settings,
    license:license,
    printforms:printforms,
})





