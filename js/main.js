const dropAreaContent = document.querySelector("#dropAreaContent");
const dropAreaSubmit = document.querySelector("#dropAreaSubmit");
const dropAreaPath = document.querySelector("#dropAreaPath");

const contentDirectory = document.querySelector("#contentDirectory");
const extensionsIcons = {
    ".pdf": "fa-file-pdf",
    ".xlsx": "fa-file-excel",
    ".docx": "fa-file-word",
    "default": "fa-file"
}

let files;
let currentLocation = ""

function processFiles() {
    dropAreaContent.innerHTML = "";
    dropAreaContent.classList.remove("d-none")
    for (const file of files) {

        let contentFile = document.createElement("div")
        contentFile.classList.add("content__file")

        let contentFileIcon = document.createElement("i")
        let fileExtension = file.name.slice(file.name.lastIndexOf("."))
        contentFileIcon.classList.add("content__file__icon","fa-solid", extensionsIcons[fileExtension] ? extensionsIcons[fileExtension] : extensionsIcons["default"])
        contentFile.appendChild(contentFileIcon)

        let contentFileName = document.createElement("p")
        contentFileName.classList.add("content__file__name")
        contentFileName.textContent = file.name
        contentFile.appendChild(contentFileName)

        dropAreaContent.appendChild(contentFile)
    }
}

function changeInputFiles(e) {
    files = e.currentTarget.files;
    processFiles();
}
dropAreaInput.addEventListener("change", (e) => changeInputFiles(e))

async function getElements() {
    let response = await getElementsAsync()
    if (response.status != "success") {
        alertify.error("Error while retreiving data")
        return
    }

    renderElementReturn()
    renderElements(response.data.files, "file")
    renderElements(response.data.folders, "folder")
}
dropAreaPath.addEventListener("blur", () => {
    currentLocation = dropAreaPath.value;
    getElements()
})

dropAreaPath.addEventListener("keyup", (e)=> console.log(e))

async function uploadFiles(e) {
    e.preventDefault()
    if (typeof files != "object"){
        alertify.error(`Something is wrong`)
        return
    }
    
    for (const file of files) {
        let response = await uploadFileAsync(file)
        if (response.status != "success")
            alertify.error(`Error uploading file ${file.name}`)
        else
            alertify.success(`File ${file.name} uploaded successfully`)
    }

    dropAreaContent.classList.add("d-none")
    dropAreaInput.value = ""
    dropAreaContent.innerHTML = ""
    files = []
    await getElements()
}
dropAreaSubmit.addEventListener("click", (e) => uploadFiles(e))

async function deleteFile(path) {
    let response = await deleteFileAsync(path)
    if (response.status == "success")
        alertify.success("File deleted successfully")
    await getElements()
}

async function deleteFolder(path) {
    let response = await deleteFolderAsync(path)
    if (response.status == "success")
        alertify.success("Folder deleted successfully")
    await getElements()
}

async function createFolder(path, name) {
    let response = await createFolderAsync(path)
    if (response.status == "success")
        alertify.success(`${name} created successfully`)
    else {
        alertify.error(response.message)
        return
    }
    await getElements()
}

function renderElements(elements, type) {
    elements.forEach((element, index) => {

        let id = type + index
        let text = element.slice(element.lastIndexOf("\\") + 1, element.length)

        let directoryElement = document.createElement("div")
        directoryElement.classList.add("content__directory__element")
        directoryElement.id = id
        directoryElement.innerHTML = `<i class="fa-solid fa-${type} element__icon"></i>`

        let directoryElementOpen = document.createElement("a")
        directoryElementOpen.href = type == "file" ? element : "javascript:void(0)"
        directoryElementOpen.classList.add("element__name")
        directoryElementOpen.id = `${id}Open`
        directoryElementOpen.textContent = text

        let directoryElementDelete = document.createElement("i")
        directoryElementDelete.id = `${id}Delete`
        directoryElementDelete.role = "button"
        directoryElementDelete.classList.add("fa-solid", "fa-trash", "element__bin")

        directoryElement.appendChild(directoryElementOpen);
        directoryElement.appendChild(directoryElementDelete);
        contentDirectory.appendChild(directoryElement)

        if (type == "folder") {
            directoryElementOpen.addEventListener("click", () => {
                currentLocation += `/${text}`
                dropAreaPath.value = currentLocation.startsWith("/") ? currentLocation.slice(1) : currentLocation
                getElements()
            })
            directoryElementDelete.addEventListener("click", () => {
                alertify.confirm(
                    `Are you sure you wanna delete '${text}'?`,
                    async () => await deleteFolder(element)).setHeader("<b> Delete folder </b>")
            })
        } else {
            directoryElementDelete.addEventListener("click", () => {
                alertify.confirm(
                    `Are you sure you wanna delete '${text}'?`,
                    async () => await deleteFile(element)).setHeader("<b> Delete file </b>")
            })
        }
    })
}

function renderElementReturn() {
    contentDirectory.innerHTML = ""

    let elementReturn = document.createElement("div")
    elementReturn.classList.add("content__directory__element")
    elementReturn.id = "elementReturn"
    elementReturn.innerHTML = `
    <i class="fa-solid fa-turn-up element__icon"></i>
    <p class="element__name"> Up directory.. </p>
    `

    let elementNewFolder = document.createElement("div")
    elementNewFolder.classList.add("content__directory__element")
    elementNewFolder.id = "elementNewFolder"
    elementNewFolder.innerHTML = `
    <i class="fa-solid fa-folder-plus element__icon"></i>
    <p class="element__name"> New folder.. </p>
    `

    contentDirectory.appendChild(elementReturn);
    contentDirectory.appendChild(elementNewFolder);

    elementReturn.addEventListener("click", () => {
        let oldLocation = currentLocation
        currentLocation = currentLocation.slice(0, currentLocation.lastIndexOf("/"))
        if (oldLocation != currentLocation) {
            dropAreaPath.value = currentLocation.startsWith("/") ? currentLocation.slice(1) : currentLocation
            getElements()
        }
    })


    elementNewFolder.addEventListener("click", () => {
        alertify.prompt("Write name for the new folder", "",
            (evt, value) => {
                if (value.includes("/")) {
                    alertify.error("Folder name cannot include /")
                    return false
                }
                let path = currentLocation.endsWith("/") ? `${currentLocation}${value}` : `${currentLocation}/${value}`
                createFolder(path, value)
            }).setHeader("<b> Create new folder </b>")
            ;
    })
}

window.onload = async () => {
    await getElements()
}

// DISABLE DEFAULT BEHAVIOR

document.addEventListener("dragover", function (event) {
    event.preventDefault();
});

// ALERTIFY

alertify.defaults.transition = "slide";
alertify.defaults.theme.ok = "button";
alertify.defaults.theme.cancel = "button button--cancel";
alertify.defaults.theme.input = "form__group__input";
alertify.defaults.movable = false;

alertify.defaults.notifier.position = "top-right"
