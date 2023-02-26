const dropArea = document.querySelector("#dropArea");
const dropAreaText = document.querySelector("#dropAreaText");
const dropAreaInput = document.querySelector("#dropAreaInput");
const dropAreaLabel = document.querySelector("#dropAreaLabel");

function dragOver() {
    dropArea.classList.add("active");
    dropAreaText.innerHTML = "DROP";
    dropAreaLabel.classList.add("d-none")
    
}
dropArea.addEventListener("dragover", dragOver)

function dragLeave() {
    dropArea.classList.remove("active");
    dropAreaText.innerHTML = "DROP FILES HERE </br> OR";
    dropAreaLabel.classList.remove("d-none")
}
dropArea.addEventListener("dragleave", dragLeave)

function dragEnd(e) {
    e.preventDefault();
    files = e.dataTransfer.files;
    dropAreaInput.files = files;
    dropArea.classList.remove("active");
    dropAreaText.innerHTML = "DROP FILES HERE </br> OR";
    dropAreaLabel.classList.remove("d-none")

    processFiles();
}
dropArea.addEventListener("drop", (e) => dragEnd(e))