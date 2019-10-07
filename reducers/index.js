import { combineReducers } from 'redux'
import typeORM from './TypeORM'

//Рабочий стол
import toolbar from './desktop/toolbar'
import leftMenu from './desktop/leftMenu'

//Подсистемы
import background from './abris/background'
import polygons from './abris/polygons'

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
import abrisprintforms from './reference/abrisprintforms'
import typesrates from './reference/typesrates'

//Настройки МДО
import feedrates from './reference/feedrates'

//настройки
import abris_settings from './settings/abris_settings'
import contactinformation from './settings/contactinformation'

//обновление
import update from './update'
import enumerations from './enumerations'

export default combineReducers({
    enumerations:enumerations,
    typeORM:typeORM,
    update:update,
    toolbar:toolbar,
    leftMenu:leftMenu,
    polygons:polygons,
    background:background,
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
    abris_settings:abris_settings,
    abrisprintforms:abrisprintforms,
    contactinformation:contactinformation,
    feedrates:feedrates,
})





