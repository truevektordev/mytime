var IS_OPEN_AIR = location.href.match(/openair/) ? true : false;

/*
EX: {
    'task': {
        'M' (day) : {
            time: 1.5,
            notes: 'Hello World'
        }
    }
}
 */
var myTimeData = null;
var myTimeRow = null; //Needed for Open Air
var ORDER_OF_DAYS = ['S', 'U', 'M', 'T', 'W', 'R', 'F'];

(function() {
var mainDiv = document.createElement('div');
mainDiv.setAttribute("style", "position: fixed; top: 0px; right: 2px; border: 1px solid red; background-color: silver;");

mainDiv.innerHTML =
'<textarea onkeyup="parseText(this)" cols="12" rows="1"></textarea><div id="myTimeButtons"><button onclick="myTimeFill()">Clear Row</button></div>'
document.body.appendChild(mainDiv);

if (IS_OPEN_AIR) {
    //Needed for Open Air
    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var match = inputs[i].name.match(/^_c\d+_r(\d+)$/);
        if (match) {
            inputs[i].setAttribute("onfocus", "myTimeRow=" + match[1]);
        }
    }
}

})();


/**
 * Parse data from text area and create buttons.
 */
function parseText(textarea) {
	var text = textarea.value;

	var rawData = text.split('\n');
	for (var i in rawData) {
		rawData[i] = rawData[i].split('\t');
	}
    var rowCount = rawData.length;
	
	myTimeData = {};
    var COL_DAY = 0, COL_TIME = 1, COL_TASK = 4, COL_NOTES = 5;

    var currentDayId = null;
    for (var row = 0; row < rowCount; row++) {
        var rowCells = rawData[row];
        currentDayId = rowCells[COL_DAY] || currentDayId;

        var entry = getOrCreateEntry(rowCells[COL_TASK], currentDayId);

        var time = Number(rowCells[COL_TIME]);
        entry.time += time;

        var notes = rowCells[COL_NOTES];
        if (notes) {
            if (!entry.notes)
                entry.notes = [];
            entry.notes.push({time: time, text: notes.trim()});
        }
    }

    _postProcessNotes();

    console.log(myTimeData);
	makeButtons(myTimeData);
}

/**
 * Before this, each entry's notes is an array of { time, text } objects. Flatten these into strings
 * for the notes field.
 */
function _postProcessNotes() {
    for (task in myTimeData) {
        for (day in myTimeData[task]) {
            var entry = myTimeData[task][day];
            if (entry.notes) {
                entry.notes = _postProcessANote(entry.notes);
            }
        }
    }
}

/**
 * Take an array of { time, text } objects. Flatten these into a single string for the notes field
 * @param notes
 * @return {String}
 * @private
 */
function _postProcessANote(notes) {
    _mergeNotesWithSameText(notes);

    if (notes.length == 1) {
        return notes[0].text;
    } else {
        var str = '';
        for (var i = 0; i < notes.length; i++) {
            str += '(' + _formatTime(notes[i].time) + 'h) ' + notes[i].text;
            if (i < notes.length - 1) {
                str += ';\n';
            }
        }
        return str;
    }
}

function _formatTime(number) {
    return number.toFixed(2);
}

function _mergeNotesWithSameText(notes) {
    for (var i = 0; i < notes.length; i++) {
        for (var j = 0; j < i; j++) {
            if (notes[i].text == notes[j].text) {
                notes[j].time += notes[i].time;

                notes.splice(i, 1); //remove item that had same text
                i--;
                break;
            }
        }
    }
}

function getOrCreateEntry(task, dayId) {
    var taskData = myTimeData[task];
    if (!taskData) {
        taskData = myTimeData[task] = {};
    }
    var entry = taskData[dayId];
    if (!entry) {
        entry = taskData[dayId] = { time: 0, notes: ''};
    }
    return entry;
}

function makeButtons(data) {
    var buttonHTML = '';
    for (var task in data) {
        buttonHTML += '<button onclick="myTimeFill(\'' + task + '\')">' + task + '</button></br>';
    }
    buttonHTML += '<button onclick="myTimeFill()">Clear Row</button>';

    document.getElementById("myTimeButtons").innerHTML = buttonHTML;
}

/**
 * Apply pre-parsed data to a row in the timesheet.
 */
function myTimeFill(task) {
    var selectedRowName = getSelectedRowName();
	if (!selectedRowName)
		return;
	
	if (task) {
		var taskData = myTimeData[task];
        for (var columnIndex = 1; columnIndex <= 7; columnIndex++) {
            var dayId = ORDER_OF_DAYS[columnIndex - 1];
            var entry = taskData[dayId];
            if (entry) {
                setCell(selectedRowName, columnIndex, entry.time, entry.notes);
            } else {
                clearCell(selectedRowName, columnIndex);
            }
        }
	} else {
		for (var columnIndex = 1; columnIndex <= 7; columnIndex++) {
			clearCell(selectedRowName, columnIndex);
		}
	}
}

function getSelectedRowName() {
    var rows = document.getElementById('tblGrid').rows;
    var selectedRowName;
    for (var i = 0; i < rows.length; i++) {
        var styleAttr = rows[i].cells[0].getAttribute('style');
        if (styleAttr && styleAttr.match(/images\/shade\.gif/)) {
            selectedRowName = rows[i].id.substr(3);
            break;
        }
    }
    return selectedRowName;
}

function clearCell(selectedRowName, columnIndex) {
    setCell(selectedRowName, columnIndex, '', null);
}

function setCell(selectedRowName, columnIndex, time, notes) {
    var notesNode = document.getElementsByName('Notes')[0];

    var name = 'TSRowList.' + selectedRowName + '.' + columnIndex + '.Hours_IN';
    var timeNode = document.getElementsByName(name)[0];

    // clear notes
    timeNode.focus();
    notesNode.focus();
    notesNode.value = '';
    // set time
    timeNode.focus();
    timeNode.value = time;
    timeNode.onchange();
    if (notes) {
        notesNode.focus();
        notesNode.value = notes;
        timeNode.focus();
    }
}

