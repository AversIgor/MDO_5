import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentPrintformsForm extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let self = this;
        let form = {
            view:"form",
            id:"Printforms_form",
            scroll:false,
            autoheight:true,
            elements:[
                {cols:[
                    { view:"text", name:"name", label:"Наименование:",labelWidth:130},
                    { view:"select", name:"type", label:"Назначение", labelWidth:80,width:200,options:this.props.typesPrintForms},                
                ]},
                { view:"tinymce-editor", name:'printform', id: "printform", config:
                    {
                        theme:"modern",
                        language: 'ru',
                        width : 700,                        
                        content_style: "body {width: 700px;}",
                        menu: {
                            edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
                            insert: {title: 'Insert', items: 'image'},
                            format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                            table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
                            tools: {title: 'Tools', items: 'spellchecker code'},
                        },
                        'toolbar': 'bullist numlist | bold italic alignleft | aligncenter alignright alignjustify | outdent indent | fontselect | fontsizeselect | forecolor backcolor | variablesselect | imagesselect',
                        'plugins': 'lists image textcolor code table',
                        // enable title field in the Image dialog
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: 'image',
                        images_dataimg_filter: function(img) {
                            return img.hasAttribute('internal-blob');
                        },
                        file_picker_callback: function(cb, value, meta) {
                            var input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');
                            input.onchange = function() {
                                var file = this.files[0];
                                var reader = new FileReader();
                                reader.onload = function () {
                                    var id = 'blobid' + (new Date()).getTime();
                                    var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                                    var base64 = reader.result.split(',')[1];
                                    var blobInfo = blobCache.create(id, file, base64);
                                    blobCache.add(blobInfo);
                                    // call the callback and populate the Title field with the file name
                                    cb(blobInfo.blobUri(), { title: file.name });
                                };
                                reader.readAsDataURL(file);
                            };
                            input.click();
                        },
                        setup: function (editor) {
                            editor.addButton('variablesselect', {
                                type: 'listbox',
                                text: 'Переменные',
                                icon: false,
                                onselect: function (e) {
                                    editor.insertContent(this.value());
                                },
                                values: self.props.getVariables(),
                            });
                            editor.addButton('imagesselect', {
                                type: 'listbox',
                                text: 'Картинки',
                                icon: false,
                                onselect: function (e) {
                                    editor.insertContent(this.value());
                                },
                                values: self.props.getImages(),
                            });
                        },
                    }
                }
            ]
        };

        let head = {
            view:"toolbar",
                width:24,
            cols:[
                {
                    view:"button",
                    value:"Сохранить",
                    width:100,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let value = {
                                name:$$("Printforms_form").getValues().name,
                                type:$$("Printforms_form").getValues().type,
                                printform: $$("printform").getValue()
                            }
                            if(self.props.editObject.predefined){
                                let text = "Текущий элемент предопределенный, все изменения исчезнут после обновления программы. Продолжить сохранение?"
                                window.webix.confirm({
                                    text:text, ok:"Да", cancel:"Нет",
                                    callback:(res) => {
                                        if(res){
                                            self.props.handlerEdit(self.props.editObject,value);
                                        }else{
                                            self.props.handlerClose();
                                        }
                                    }
                                });
                            }else{
                                self.props.handlerEdit(self.props.editObject,value);
                            }
                        }
                    }
                },
                {},
                {
                    view:"icon",
                    tooltip:"Закрыть",
                    icon: "times",
                    click: function(e){
                        self.props.handlerClose();
                    },
                }
            ]
        }

        var conteiner = {
            view:"window",
            id:"Printforms_window",
            container:ReactDOM.findDOMNode(this.refs.root),
            zIndex:100,
            width: 1000,
            height: 700,
            move:true,
            resize: true,
            head:head,
            position:"center",
            body: form,
        };

        this.ui = window.webix.ui(conteiner);

    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.editObject){
            this.ui.show();
            $$("Printforms_form").setValues({
                name: nextProps.editObject.name,
                type: nextProps.editObject.type,
            });
            $$("printform").setValue(nextProps.editObject.printform);
        }else{
            this.ui.hide();
        }
    }

    componentWillUnmount(){        
        this.ui.destructor();
        this.ui = null;
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root"></div>)
    }

}