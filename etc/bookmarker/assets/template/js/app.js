//Site Name INPUT
var siteName = document.getElementById("siteName");
var siteNameRegex = /^[a-z0-9 ]{3,25}$/i;
siteName.addEventListener("focusout", function () {
    validate(siteName, siteNameRegex);
})

//Site URL INPUT
var siteURL = document.getElementById("siteURL");
//I wrote this regex (it might have some mistakes)
var siteURLRegex = /^(https:\/\/|http:\/\/)([a-z0-9]{1,255}[.])?[a-z0-9]{1,253}[.][a-z]{2,63}(((\/)?[a-z0-9\-.]{1,255}?){1,10}(\/)?([.][a-z0-9]{1,15})?((#)[a-z0-9]{1,20})?((\?)[a-z0-9]{1,20})?(((=)[a-z0-9]{1,20})?((&)[a-z0-9]{1,20})?){1,30}?)?$/i;
siteURL.addEventListener("focusout", function () {
    validate(siteURL, siteURLRegex);
})


//X-Valid trigger
function validate(input, regex) {
    if (regex.test(input.value)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        input.classList.remove("shakeIt");
        return true;
    } else {
        input.classList.add("shakeIt");
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        return false;
    }
}

//Submit Button
var addButton = document.getElementById("addButton");
addButton.addEventListener("click", bookmarkAdd);

//Bookmark functions
var localstorageVAR = "bookmarks";
var bookmarkList = JSON.parse(localStorage.getItem(localstorageVAR)) ? JSON.parse(localStorage.getItem(localstorageVAR)) : [];

//Add bookmark
function bookmarkAdd(e) {
    e.preventDefault();

    if (!validate(siteName, siteNameRegex) || !validate(siteURL, siteURLRegex)) {
        return;
    }

    var bookmarkData = {
        name: siteName.value,
        url: siteURL.value
    };

    e.target.focus();
    siteName.value = "";
    siteURL.value = "";
    siteName.classList.remove("is-valid");
    siteURL.classList.remove("is-valid");
    bookmarkList.push(bookmarkData);
    updateLocalStorage();
}

//Delete bookmark
function bookmarkDelete(n) {
    if (!confirm("Are you sure you want to delete this bookmark?")) {
        return;
    }
    bookmarkList.splice(n, 1);
    updateLocalStorage();
}

//Update localstorage
function updateLocalStorage(refresh = 1) {
    localStorage.setItem(localstorageVAR, JSON.stringify(bookmarkList));
    if (refresh == 1) {
        bookmarkDisplay();
    }
}

//Display bookmarks
var bookmarkTable = document.getElementById("bookmarkTable");
function bookmarkDisplay() {
    var tableContent = "";
    for (var i = 0; i < bookmarkList.length; i++) {
        tableContent += `
            <tr>
                <td class="d-none d-md-table-cell"><div class="my-2">`+ (i+1) + `</div></td>
                <td><input type="text" id="bmName`+ i + `" class="form-control stealthInput my-1" value="` + bookmarkList[i]["name"] + `" readonly><div class="invalid-feedback">Site Name must be in English characters (A-Z and can contain Spaces and Numbers only) max 25 characters</div></td>
                <td><input type="text" id="bmURL`+ i + `" class="form-control stealthInput my-1" value="` + bookmarkList[i]["url"] + `" readonly><div class="invalid-feedback">Site URL is not valid<br>Example (http://google.com)</div></td>
                <td><a class="btn btn-outline-success my-1" href="` + bookmarkList[i]["url"] + `" target="_blank"><i class="fa-solid fa-eye"></i> Open</a></td>
                <td><button class="btn btn-primary" onclick="bookmarkEdit(`+ i + `,this)"><i class="fa-solid fa-edit"></i> Edit</button> <button class="btn btn-danger my-1" onclick="bookmarkDelete(` + i + `)"><i class="fa-solid fa-trash-alt"></i> Delete</button></td>
            </tr>
        `
    }
    bookmarkTable.innerHTML = tableContent;
}
bookmarkDisplay();


//Edit bookmarks
function bookmarkEdit(n, editBtn) {
    var siteNameEdit = document.getElementById("bmName" + n);
    var siteURLEdit = document.getElementById("bmURL" + n);

    if (editBtn.innerHTML.indexOf("Save") !== -1) {

        if (!validate(siteNameEdit, siteNameRegex) || !validate(siteURLEdit, siteURLRegex)) {
            return;
        }

        siteNameEdit.readOnly = true;
        siteURLEdit.readOnly = true;
        editBtn.classList.replace("btn-success", "btn-primary");
        editBtn.innerHTML = `<i class="fa-solid fa-edit"></i> Edit`;

        var newData = {
            name: siteNameEdit.value,
            url: siteURLEdit.value
        }

        siteNameEdit.classList.remove("is-valid");
        siteURLEdit.classList.remove("is-valid");
        bookmarkList.splice(n, 1, newData);
        updateLocalStorage(0);
    } else {
        siteNameEdit.readOnly = false;
        siteURLEdit.readOnly = false;
        editBtn.classList.replace("btn-primary", "btn-success");
        editBtn.innerHTML = `<i class="fa-solid fa-save"></i> Save`;
    }

    siteNameEdit.classList.toggle("stealthInput");
    siteURLEdit.classList.toggle("stealthInput");
}

//Export bookmarks
var ExportBtn = document.getElementById("exportBtn");
ExportBtn.addEventListener("click", function () {
    var bookmarksData = JSON.stringify(bookmarkList);
    var file = new Blob([bookmarksData], { type: "text/plain" });
    var url = URL.createObjectURL(file);

    var anchorDL = document.createElement("a");
    anchorDL.href = url;
    anchorDL.download = "Bookmarks_" + new Date().toISOString().split("T")[0] + ".txt";
    anchorDL.click();
});

//Import bookmarks
var ImportFile = document.getElementById("importFile");
ImportFile.addEventListener("change", function (e) {
    var ImportData = e.target.files[0];
    var ImportStream = new FileReader()
    ImportStream.readAsText(ImportData, "UTF-8")
    ImportStream.onload = function (e) {
        var parsedData = JSON.parse(e.target.result);
        var filteredData = [];
        for (i = 0; i < parsedData.length; i++) {
            if ((siteNameRegex.test(parsedData[i]["name"])) && (siteURLRegex.test(parsedData[i]["url"]))) {
                filteredData.push(parsedData[i]);
            }
        }
        bookmarkList = filteredData.length != 0 ? filteredData : bookmarkList;
        updateLocalStorage();
    }
});

var ImportBtn = document.getElementById("importBtn");
ImportBtn.addEventListener("click", function () { ImportFile.click(); })