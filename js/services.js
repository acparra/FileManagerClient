const baseUrl = "https://localhost:7189/api";

async function uploadFileAsync(file) {

    let data = new FormData();
    let path = dropAreaPath.value
    data.append("Path", path);
    data.append("File", file);

    let request = await fetch(`${baseUrl}/file/upload`, {
        method: "POST",
        body: data
    })

    let response = await request.json()

    return response
}

async function getExtensionsAsync () {
    let request = await fetch(`${baseUrl}/file/extensions`)
    let response = await request.json();
    return response
}

async function getElementsAsync() {
    let request = await fetch(`${baseUrl}/folder?path=${currentLocation}`)
    let response = await request.json();
    return response
}

async function deleteFileAsync(file) {
    let request = await fetch(`${baseUrl}/file?path=${file}`, {
        method: "DELETE"
    })
    let response = await request.json()

    return response
}

async function deleteFolderAsync(folder) {
    let request = await fetch(`${baseUrl}/folder?path=${folder}`, {
        method: "DELETE"
    })
    let response = await request.json()

    return response
}

async function createFolderAsync(path) {
    let data = new FormData();
    data.append("path", path)
    let request = await fetch(`${baseUrl}/folder`, {
        method: "POST",
        body: data
    })
    let response = await request.json()
    return response
}
