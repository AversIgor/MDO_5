
export var GRIDFORM = {};

GRIDFORM.confirmAdd = function (nameSpase, struct) {
	
    w2ui[nameSpase.nameTables].add(struct[0]);
	
}

GRIDFORM.confirmEdit = function (nameSpase) {

    w2ui[nameSpase.nameTables].save();
	
}

GRIDFORM.confirmDelete = function (arrayRecid) {

    w2ui[this.nameTables].select(arrayRecid);
    w2ui[this.nameTables].delete(true);

}

GRIDFORM.showGrid = function (nameTag,grid,dataSet) {

	if (w2ui.hasOwnProperty(grid.name)){
		w2ui[grid.name].destroy();
	} 
	
	$(nameTag).w2grid(grid);
	
	w2ui[grid.name].add(dataSet);		
	
}

GRIDFORM.setSelection = function (nameSpase, nameMenuSelection, fieldSelection, currentTypesrates) {

    var MenuSelection = w2ui[nameSpase.nameTables].toolbar.get(nameMenuSelection);
    MenuSelection.count     = currentTypesrates.text;
    MenuSelection.curentID  = currentTypesrates.id;
    w2ui[nameSpase.nameTables].search(fieldSelection, currentTypesrates.id);

}

GRIDFORM.filterList = function (record, filterSearch, nameSpase, list) {

    var filter = null;
    var changesRows = w2ui[nameSpase.nameTables].getChanges();
    for (var i = 0; i < changesRows.length; i++) {
        if (changesRows[i].recid == record.recid) {
            if (filterSearch in changesRows[i]) {
                filter = changesRows[i][filterSearch];
            }
        }
    }

    if (filter == null) {
        filter = record[filterSearch];
    }
	
    var newList = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i][filterSearch] == filter) {
            newList.push(list[i]);
        }
    }
	
    return newList;
}
