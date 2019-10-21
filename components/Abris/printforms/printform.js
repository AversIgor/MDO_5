

import React, { Component, PropTypes } from "react";


export default class Printform extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let self = this;
        let node        = document.getElementById('paint')

        this.modalbox = {
            view:"window",
            id:'printform_window',
            height:node.clientHeight,
            width:900,
            position:"center",
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {
                        view:"label",
                        id: "printform_label"
                    },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "times",
                        click: "$$('printform_window').hide()"
                    }
                ]
            },
            body:{
                cols:[
                    { view:"tinymce-editor", name:'printform', id: "printform", config:
                        {
                            theme:"modern",
                            language: 'ru',
                            width : 900,
                            content_style: "body {width: 700px;}",
                            menu: {
                                file: {title: 'File', items: 'print | save'},
                                edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
                                insert: {title: 'Insert', items: 'image pagebreak'},
                                format: {title: ' Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
                                table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
                            },
                            'toolbar': 'bullist numlist | bold italic alignleft | aligncenter alignright alignjustify | outdent indent | fontselect | fontsizeselect | forecolor backcolor | pagebreak',
                            'plugins': 'lists image textcolor table print pagebreak',
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
                            setup: function(editor) {
                                editor.addMenuItem('save', {
                                    text: 'Сохранить',
                                    icon: 'save',
                                    onclick: function() {
                                        self.props.saveContent(editor.getDoc(),self.props.data.name)
                                       }
                                });
                            },
                        },

                    },                    
                ]
            },
            on:{
                onHide:function(){
                    self.props.handlerClose();
                }
            }
        };

        this.ui = window.webix.ui(this.modalbox);
        this.ui.show();

        $$("printform").getEditor(true).then(function(editor){
            $$("printform").setValue(self.props.data.printform);            
            editor.on('SetContent', function (e) {
                self.props.updateStates(editor);
            });
        });

        $$("printform_label").define('label',this.props.data.name);
        $$("printform_label").refresh()
        
    }


    componentWillUnmount(){
        if(this.ui){
            this.ui.destructor();
            this.ui = null;
        }
    }

    render() {
        return null
    }
}