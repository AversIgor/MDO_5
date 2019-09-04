
const TiffTags = {
    0x0100 : "ImageWidth",
    0x0101 : "ImageHeight",
    0x8769 : "ExifIFDPointer",
    0x8825 : "GPSInfoIFDPointer",
    0xA005 : "InteroperabilityIFDPointer",
    0x0102 : "BitsPerSample",
    0x0103 : "Compression",
    0x0106 : "PhotometricInterpretation",
    0x0112 : "Orientation",
    0x0115 : "SamplesPerPixel",
    0x011C : "PlanarConfiguration",
    0x0212 : "YCbCrSubSampling",
    0x0213 : "YCbCrPositioning",
    0x011A : "XResolution",
    0x011B : "YResolution",
    0x0128 : "ResolutionUnit",
    0x0111 : "StripOffsets",
    0x0116 : "RowsPerStrip",
    0x0117 : "StripByteCounts",
    0x0201 : "JPEGInterchangeFormat",
    0x0202 : "JPEGInterchangeFormatLength",
    0x012D : "TransferFunction",
    0x013E : "WhitePoint",
    0x013F : "PrimaryChromaticities",
    0x0211 : "YCbCrCoefficients",
    0x0214 : "ReferenceBlackWhite",
    0x0132 : "DateTime",
    0x010E : "ImageDescription",
    0x010F : "Make",
    0x0110 : "Model",
    0x0131 : "Software",
    0x013B : "Artist",
    0x8298 : "Copyright"
}

export function findEXIFinJPEG(dataView, dataLength) {

    if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) return false; // not a valid jpeg

    var offset = 2,
        length = (dataLength > 500 ? 500 : dataLength),
        marker;

    while (offset < length) {
        if (dataView.getUint8(offset) != 0xFF) return false; // not a valid marker, something is wrong

        marker = dataView.getUint8(offset + 1);

        // looking for 0xFFE1 for EXIF data

        if (marker == 225) {
            return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);
        } else {
            offset += 2 + dataView.getUint16(offset+2);
        }

    }

}

function getStringFromDB(buffer, start, length) {
    var outstr = "";
    for (var n = start; n < start+length; n++) {
        outstr += String.fromCharCode(buffer.getUint8(n));
    }
    return outstr;
}

function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
    var type = file.getUint16(entryOffset+2, !bigEnd),
        numValues = file.getUint32(entryOffset+4, !bigEnd),
        valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
        offset,
        vals, val, n,
        numerator, denominator;

    switch (type) {
        case 1: // byte, 8-bit unsigned int
        case 7: // undefined, 8-bit byte, value depending on field
            if (numValues == 1) {
                return file.getUint8(entryOffset + 8, !bigEnd);
            } else {
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                vals = [];
                for (n=0;n<numValues;n++) {
                    vals[n] = file.getUint8(offset + n);
                }
                return vals;
            }

        case 2: // ascii, 8-bit byte
            offset = numValues > 4 ? valueOffset : (entryOffset + 8);
            return getStringFromDB(file, offset, numValues-1);

        case 3: // short, 16 bit int
            if (numValues == 1) {
                return file.getUint16(entryOffset + 8, !bigEnd);
            } else {
                offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                vals = [];
                for (n=0;n<numValues;n++) {
                    vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                }
                return vals;
            }

        case 4: // long, 32 bit int
            if (numValues == 1) {
                return file.getUint32(entryOffset + 8, !bigEnd);
            } else {
                vals = [];
                for (n=0;n<numValues;n++) {
                    vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                }
                return vals;
            }

        case 5:    // rational = two long values, first is numerator, second is denominator
            if (numValues == 1) {
                numerator = file.getUint32(valueOffset, !bigEnd);
                denominator = file.getUint32(valueOffset+4, !bigEnd);
                val = new Number(numerator / denominator);
                val.numerator = numerator;
                val.denominator = denominator;
                return val;
            } else {
                vals = [];
                for (n=0;n<numValues;n++) {
                    numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                    denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                    vals[n] = new Number(numerator / denominator);
                    vals[n].numerator = numerator;
                    vals[n].denominator = denominator;
                }
                return vals;
            }

        case 9: // slong, 32 bit signed int
            if (numValues == 1) {
                return file.getInt32(entryOffset + 8, !bigEnd);
            } else {
                vals = [];
                for (n=0;n<numValues;n++) {
                    vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                }
                return vals;
            }

        case 10: // signed rational, two slongs, first is numerator, second is denominator
            if (numValues == 1) {
                return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
            } else {
                vals = [];
                for (n=0;n<numValues;n++) {
                    vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                }
                return vals;
            }
    }
}

function readTags(file, tiffStart, dirStart, strings, bigEnd) {
    var entries = file.getUint16(dirStart, !bigEnd),
        tags = {},
        entryOffset, tag,
        i, tagvalue;

    for (i=0;i<entries;i++) {
        entryOffset = dirStart + i*12 + 2;
        tag = strings[file.getUint16(entryOffset, !bigEnd)];
        tagvalue = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        if(tag == undefined) continue;
        tags[tag] = tagvalue;
    }
    return tags;
}

function readEXIFData(file, start) {
    
    if (getStringFromDB(file, start, 4) != "Exif") {
        return false;
    }

    var bigEnd,
        tags, tag,
        exifData, gpsData,
        tiffOffset = start + 6;

    // test for TIFF validity and endianness
    if (file.getUint16(tiffOffset) == 0x4949) {
        bigEnd = false;
    } else if (file.getUint16(tiffOffset) == 0x4D4D) {
        bigEnd = true;
    } else {
        return false;
    }

    if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
        return false;
    }

    var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

    if (firstIFDOffset < 0x00000008) {
        return false;
    }

    return readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);
}

