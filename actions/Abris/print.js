import {
    ABRIS_BACKGROUND_LOADIMAGE,
} from '../../constants/abris'

import htmlToImage from 'html-to-image';
import * as FileSaver from "file-saver";




export function saveAsImage(node) {

    return (dispatch,getState) => {
        let rotate     = getState().background.rotate;

        function trimImage(img,x,y,width,height,rotate)
        {
            var canvas = document.createElement('canvas');
            canvas.width = img.parentNode.clientWidth;
            canvas.height = img.parentNode.clientHeight;
            var context = canvas.getContext('2d');
            context.translate(canvas.width/2, canvas.height/2); // set canvas context to center
            context.rotate(rotate*Math.PI/180);
            context.translate (-canvas.width / 2, -canvas.height / 2);
            context.drawImage(img,x,y,width,height);
            context.restore()
            img.parentNode.replaceChild(canvas, img);
        }

        let cloneNode = node.cloneNode(true)

        //Превращаем картинку в canvas
        var img = node.querySelector('#background')
        trimImage(img,
            img.offsetLeft,
            img.offsetTop,
            img.width,
            img.height,
            rotate
        )

        node.querySelectorAll(".aim").forEach(
            e => e.parentNode.removeChild(e)
        )

        htmlToImage.toBlob(node)
        .then(function (blob)  {
            FileSaver.saveAs(blob, 'image.png');
            node.parentNode.replaceChild(cloneNode,node);
        });
    }

}
