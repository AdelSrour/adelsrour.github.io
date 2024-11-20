//Site Name INPUT
var siteName = document.getElementById("siteName");
var siteNameRegex = /^[A-Za-z0-9 ]{3,25}$/;
siteName.addEventListener("focusout", function () {
    validate(siteName, siteNameRegex);
})

//Site URL INPUT
var siteURL = document.getElementById("siteURL");
//I wrote this regex (it might have some mistakes)
var siteURLRegex = /^(https:\/\/|http:\/\/)([A-Za-z0-9]{1,255}[.])?[A-Za-z0-9]{1,253}[.][A-Za-z]{2,63}(((\/)?[A-Za-z0-9\-.]{1,255}?){1,10}(\/)?([.][A-Za-z0-9]{1,15})?((#)[A-Za-z0-9]{1,20})?((\?)[A-Za-z0-9]{1,20})?(((=)[A-Za-z0-9]{1,20})?((&)[A-Za-z0-9]{1,20})?){1,30}?)?$/;
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

    bookmarkData = {
        name: siteName.value,
        url: siteURL.value
    };

    bookmarkList.unshift(bookmarkData);
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
function updateLocalStorage() {
    localStorage.setItem(localstorageVAR, JSON.stringify(bookmarkList));
    bookmarkDisplay();
}

//Display bookmarks
var bookmarkTable = document.getElementById("bookmarkTable");
function bookmarkDisplay() {
    var tableContent = "";
    for (var i = 0; i < bookmarkList.length; i++) {
        tableContent += `
            <tr>
                <td>`+ i + `</td>
                <td><input type="text" id="bmName`+ i + `" class="form-control stealthInput" value="` + bookmarkList[i]["name"] + `" readonly><div class="invalid-feedback">Site Name must be in English characters (A-Z and can contain Spaces and Numbers only) max 25 characters</div></td>
                <td><input type="text" id="bmURL`+ i + `" class="form-control stealthInput" value="` + bookmarkList[i]["url"] + `" readonly><div class="invalid-feedback">Site URL is not valid, examples (https://google.com or http://google.com/page1/page.html)</div></td>
                <td><a class="btn btn-outline-success" href="` + bookmarkList[i]["url"] + `" target="_blank"><i class="fa-solid fa-eye"></i> Open</a></td>
                <td><button class="btn btn-primary" onclick="bookmarkEdit(`+ i + `,this)"><i class="fa-solid fa-edit"></i> Edit</button> <button class="btn btn-danger" onclick="bookmarkDelete(` + i + `)"><i class="fa-solid fa-trash-alt"></i> Delete</button></td>
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

        bookmarkList.splice(n, 1, newData);
        updateLocalStorage();
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